from motor.motor_asyncio import AsyncIOMotorClient

from db.config import MONGODB_URL, MONGODB_DBNAME
from utils import singleton

@singleton
class MongoDB:
    def __init__(self):
        print("MongoDB init!")
        self.client = None

    def connect(self):
        self.client = AsyncIOMotorClient(MONGODB_URL)
        self.database = self.client[MONGODB_DBNAME]

    def close(self):
        self.client.close()