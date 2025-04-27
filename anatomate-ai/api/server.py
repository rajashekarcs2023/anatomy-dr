from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from pathlib import Path
import logging
import os
import traceback
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the absolute path to the project root
PROJECT_ROOT = Path(__file__).parent.parent
MODEL_PATH = PROJECT_ROOT / "public" / "models" / "xgboost_model_pipeline.joblib"

logger.info(f"Project root: {PROJECT_ROOT}")
logger.info(f"Looking for model at: {MODEL_PATH.absolute()}")

# Load the model
try:
    if not MODEL_PATH.exists():
        logger.error(f"Model file not found at {MODEL_PATH.absolute()}")
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    
    model = joblib.load(MODEL_PATH)
    logger.info("Model loaded successfully")
    logger.info(f"Model type: {type(model)}")
    
    # Inspect the pipeline steps
    if hasattr(model, 'named_steps'):
        logger.info("Pipeline steps:")
        for name, step in model.named_steps.items():
            logger.info(f"Step: {name}, Type: {type(step)}")
            if hasattr(step, 'feature_names_in_'):
                logger.info(f"Expected features: {step.feature_names_in_}")
            if hasattr(step, 'get_feature_names_out'):
                logger.info(f"Output features: {step.get_feature_names_out()}")
    
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    model = None

class HealthData(BaseModel):
    highBP: int
    highChol: int
    cholCheck: int
    bmi: float
    smoker: int
    stroke: int
    heartDiseaseorAttack: int
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
        if hasattr(model, 'predict_proba'):
            logger.info("Attempting to use predict_proba")
            proba = model.predict_proba(input_data)
            logger.info(f"predict_proba result: {proba}")
            if proba is not None and len(proba) > 0 and len(proba[0]) > 1:
                return float(proba[0][1])
        
        # Fallback to decision_function if available
        if hasattr(model, 'decision_function'):
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

@app.post("/predict")
async def predict(data: HealthData):
    if model is None:
        logger.error("Model is not loaded")
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Log incoming data
        logger.info(f"Received prediction request with data: {data.model_dump()}")
        
        # Convert input data to numpy array with correct feature names
        input_features = {
            'HighBP': data.highBP,
            'HighChol': data.highChol,
            'CholCheck': data.cholCheck,
            'BMI': data.bmi,
            'Smoker': data.smoker,
            'Stroke': data.stroke,
            'HeartDiseaseorAttack': data.heartDiseaseorAttack,
            'PhysActivity': data.physActivity,
            'Fruits': data.fruits,
            'Veggies': data.veggies,
            'HvyAlcoholConsump': data.hvyAlcoholConsump,
            'AnyHealthcare': data.anyHealthcare,
            'NoDocbcCost': data.noDocbcCost,
            'GenHlth': data.genHlth,
            'MentHlth': data.mentHlth,
            'PhysHlth': data.physHlth,
            'DiffWalk': data.diffWalk,
            'Sex': data.sex,
            'Age': data.age,
            'Education': data.education,
            'Income': data.income
        }
        
        # Convert to numpy array in the correct order
        feature_names = model.named_steps['preprocessor'].feature_names_in_
        input_array = np.array([[input_features[feature] for feature in feature_names]])
        
        logger.info(f"Input array shape: {input_array.shape}")
        
        # Make prediction using the full pipeline
        try:
            prediction = model.predict(input_array)
            probability = model.predict_proba(input_array)[:, 1][0]
            
            logger.info(f"Prediction result: {prediction}")
            logger.info(f"Probability: {probability}")
                
        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
        
        # Prepare response
        result = {
            "prediction": int(prediction[0]),
            "message": "High risk of diabetes" if prediction[0] == 1 else "Low risk of diabetes",
            "probability": float(probability)
        }
        
        logger.info(f"Returning result: {result}")
        return result
        
    except Exception as e:
        logger.error(f"Unexpected error in prediction endpoint: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception handler caught: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 