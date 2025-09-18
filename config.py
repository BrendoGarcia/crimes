import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "sua_string_de_conexao_mongodb_atlas")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "teste")
    COLLECTION_NAME = os.getenv("COLLECTION_NAME", "teste")
