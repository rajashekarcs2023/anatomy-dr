import joblib
from pathlib import Path
import logging
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the absolute path to the model
PROJECT_ROOT = Path(__file__).parent.parent
MODEL_PATH = PROJECT_ROOT / "public" / "models" / "xgboost_model_pipeline.joblib"

logger.info(f"Testing model at: {MODEL_PATH.absolute()}")

try:
    # Load the model
    model = joblib.load(MODEL_PATH)
    logger.info("Model loaded successfully!")
    
    # Print model information
    logger.info(f"Model type: {type(model)}")
    
    # Inspect pipeline steps
    if hasattr(model, 'named_steps'):
        logger.info("\nPipeline steps:")
        for name, step in model.named_steps.items():
            logger.info(f"\nStep: {name}")
            logger.info(f"Type: {type(step)}")
            
            # Get feature names if available
            if hasattr(step, 'feature_names_in_'):
                logger.info(f"Expected input features: {step.feature_names_in_}")
                logger.info(f"Number of expected features: {len(step.feature_names_in_)}")
            
            if hasattr(step, 'get_feature_names_out'):
                logger.info(f"Output features: {step.get_feature_names_out()}")
                logger.info(f"Number of output features: {len(step.get_feature_names_out())}")
            
            # If it's a ColumnTransformer, inspect its transformers
            if hasattr(step, 'transformers'):
                logger.info("\nColumnTransformer transformers:")
                for name, transformer, columns in step.transformers:
                    logger.info(f"\nTransformer: {name}")
                    logger.info(f"Type: {type(transformer)}")
                    logger.info(f"Columns: {columns}")
    
except Exception as e:
    logger.error(f"Error: {str(e)}") 