import logging
import os
from typing import Optional

from dotenv import load_dotenv
from pymongo.database import Database
from pymongo.errors import ConnectionFailure
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

logger = logging.getLogger(__name__)

load_dotenv()

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "anatomy_dr")


class MongoDB:
    client: Optional[MongoClient] = None
    db: Optional[Database] = None

    @classmethod
    def connect_to_database(cls):
        try:
            if cls.client is None:
                cls.client = MongoClient(MONGODB_URL, server_api=ServerApi("1"))
                cls.client.admin.command("ping")
                logger.info("Successfully connected to MongoDB")
        except ConnectionFailure as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            raise

    @classmethod
    def close_database_connection(cls):
        if cls.client is not None:
            cls.client.close()
            cls.client = None
            cls.db = None
            logger.info("MongoDB connection closed")
