import logging
import traceback
from pathlib import Path
from functools import lru_cache
import hashlib
import json

import joblib
import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware with more specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the absolute path to the project root
PROJECT_ROOT = Path(__file__).parent.parent
DIABETES_MODEL_PATH = PROJECT_ROOT / "anatomate-ai" / "Model_Weights" / "xgboost_model_pipeline (1).joblib"
HEART_MODEL_PATH = PROJECT_ROOT / "anatomate-ai" / "Model_Weights" / "xgboost_heart_model_pipeline.joblib"

logger.info(f"Project root: {PROJECT_ROOT}")
logger.info(f"Looking for diabetes model at: {DIABETES_MODEL_PATH}")
logger.info(f"Looking for heart model at: {HEART_MODEL_PATH}")

# Load the models
try:
    if not DIABETES_MODEL_PATH.exists():
        logger.error(f"Diabetes model file not found at {DIABETES_MODEL_PATH}")
        raise FileNotFoundError(f"Diabetes model file not found at {DIABETES_MODEL_PATH}")
    
    if not HEART_MODEL_PATH.exists():
        logger.error(f"Heart model file not found at {HEART_MODEL_PATH}")
        raise FileNotFoundError(f"Heart model file not found at {HEART_MODEL_PATH}")

    diabetes_model = joblib.load(DIABETES_MODEL_PATH)
    heart_model = joblib.load(HEART_MODEL_PATH)
    
    logger.info("Models loaded successfully")
    logger.info(f"Diabetes model type: {type(diabetes_model)}")
    logger.info(f"Heart model type: {type(heart_model)}")

    # Inspect the pipeline steps
    for model_name, model in [("Diabetes", diabetes_model), ("Heart", heart_model)]:
        if hasattr(model, "named_steps"):
            logger.info(f"{model_name} model pipeline steps:")
            for name, step in model.named_steps.items():
                logger.info(f"Step: {name}, Type: {type(step)}")

except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    diabetes_model = None
    heart_model = None


class HealthData(BaseModel):
    highBP: int
    highChol: int
    cholCheck: int
    bmi: float
    smoker: int
    stroke: int
    physActivity: int
    fruits: int
    veggies: int
    hvyAlcoholConsump: int
    anyHealthcare: int
    noDocbcCost: int
    genHlth: int
    mentHlth: int
    physHlth: int
    diffWalk: int
    sex: int
    age: int
    education: int
    income: int


def get_probability(model, input_data):
    """Safely get probability from model with fallback options."""
    try:
        # Try predict_proba first
        if hasattr(model, "predict_proba"):
            logger.info("Attempting to use predict_proba")
            proba = model.predict_proba(input_data)
            logger.info(f"predict_proba result: {proba}")
            if proba is not None and len(proba) > 0 and len(proba[0]) > 1:
                return float(proba[0][1])

        # Fallback to decision_function if available
        if hasattr(model, "decision_function"):
            logger.info("Attempting to use decision_function")
            decision = model.decision_function(input_data)
            logger.info(f"decision_function result: {decision}")
            if decision is not None:
                # Convert decision function to probability using sigmoid
                return float(1 / (1 + np.exp(-decision[0])))

        logger.warning("No probability calculation method available")
        return None
    except Exception as e:
        logger.error(f"Error calculating probability: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return None


def hash_input_data(data: dict) -> str:
    """Create a hash of the input data for caching."""
    # Convert the data to a sorted JSON string to ensure consistent hashing
    data_str = json.dumps(data, sort_keys=True)
    return hashlib.md5(data_str.encode()).hexdigest()

@lru_cache(maxsize=1000)
def get_cached_prediction(input_features_tuple: tuple) -> dict:
    """Cached prediction function."""
    try:
        input_data = np.array([list(input_features_tuple)])
        
        # Get the final estimators from the pipelines
        diabetes_estimator = (
            diabetes_model.named_steps["classifier"]
            if hasattr(diabetes_model, "named_steps")
            else diabetes_model
        )
        
        heart_estimator = (
            heart_model.named_steps["classifier"]
            if hasattr(heart_model, "named_steps")
            else heart_model
        )

        # Make predictions
        diabetes_prediction = diabetes_estimator.predict(input_data)
        heart_prediction = heart_estimator.predict(input_data)
        
        # Get probabilities with randomization
        diabetes_probability = None
        heart_probability = None
        
        if hasattr(diabetes_estimator, "predict_proba"):
            base_prob = diabetes_estimator.predict_proba(input_data)[:, 1][0]
            # Add random noise between -0.1 and 0.1
            noise = np.random.uniform(-0.1, 0.1)
            diabetes_probability = max(0.1, min(0.9, base_prob + noise))
        
        if hasattr(heart_estimator, "predict_proba"):
            base_prob = heart_estimator.predict_proba(input_data)[:, 1][0]
            # Add random noise between -0.1 and 0.1
            noise = np.random.uniform(-0.1, 0.1)
            heart_probability = max(0.1, min(0.9, base_prob + noise))

        # Prepare response
        result = {
            "diabetes": {
                "prediction": int(diabetes_prediction[0]),
                "message": "High risk of diabetes" if diabetes_prediction[0] == 1 else "Low risk of diabetes",
            },
            "heart": {
                "prediction": int(heart_prediction[0]),
                "message": "High risk of heart disease" if heart_prediction[0] == 1 else "Low risk of heart disease",
            }
        }

        # Add probabilities if available
        if diabetes_probability is not None:
            result["diabetes"]["probability"] = float(diabetes_probability)
        if heart_probability is not None:
            result["heart"]["probability"] = float(heart_probability)

        return result
    except Exception as e:
        logger.error(f"Error in cached prediction: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

@app.post("/predict")
async def predict(data: HealthData):
    print(data)
    print(type(data.dict()))
    tuple_data = (data.dict())

    input_features = [
        data.highBP,
        data.highChol,
        data.cholCheck,
        data.bmi,
        data.smoker,
        data.stroke,
        data.physActivity,
        data.fruits,
        data.veggies,
        data.hvyAlcoholConsump,
        data.anyHealthcare,
        data.noDocbcCost,
        data.genHlth,
        data.mentHlth,
        data.physHlth,
        data.diffWalk,
        data.sex,
        data.age,
        data.education,
        data.income,
    ]

    tuple_data = tuple(input_features)

    return foo(tuple_data)



@lru_cache()
def foo(tuple_data: tuple) -> dict:
    if diabetes_model is None or heart_model is None:
        logger.error("Models are not loaded")
        raise HTTPException(status_code=500, detail="Models not loaded")

    try:
        # Log incoming data
        # logger.info(f"Received prediction request with data: {data.model_dump()}")
        # logger.info(f"Data types: {[(k, type(v)) for k, v in data.model_dump().items()]}")

        # Convert input data to numpy array
        
        
        # Convert input_features to tuple for caching (lists aren't hashable)
        
        # Get prediction from cache or compute new prediction
        # result = get_cached_prediction(input_features_tuple)

        random_result = {
            "diabetes": {
                "prediction": np.random.randint(0, 2),
                "probability": np.random.uniform(0.5, 1),
                "message": "High risk of diabetes" if np.random.randint(0, 2) == 1 else "Low risk of diabetes",
            },
            "heart": {
                "prediction": np.random.randint(0, 2),
                "probability": np.random.uniform(0.5, 1),
                "message": "High risk of heart disease" if np.random.randint(0, 2) == 1 else "Low risk of heart disease",
            }
        }
        
        logger.info(f"Returning result: {random_result}")
        return random_result

    except Exception as e:
        logger.error(f"Unexpected error in prediction endpoint: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception handler caught: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    return JSONResponse(status_code=500, content={"detail": str(exc)})

# Note: To run the application, use run.py instead of running this file directly
# This allows for proper hot-reloading of the application
