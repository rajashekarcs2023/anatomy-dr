import joblib
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the absolute path to the model
PROJECT_ROOT = Path(__file__).parent.parent
MODEL_PATH = PROJECT_ROOT / "public" / "models" / "xgboost_model_pipeline.joblib"

logger.info(f"Testing model at: {MODEL_PATH.absolute()}")

try:
    # Try to load the model
    model = joblib.load(MODEL_PATH)
    logger.info("Model loaded successfully!")
    
    # Print model information
    logger.info(f"Model type: {type(model)}")
    logger.info(f"Model attributes: {dir(model)}")
    
except Exception as e:
    logger.error(f"Error loading model: {str(e)}") 