import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://brendofcg:admin@agrupamentobanco.zb2av.mongodb.net/?retryWrites=true&w=majority&appName=AgrupamentoBanco")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "teste")
    COLLECTION_NAME = os.getenv("COLLECTION_NAME", "teste")
