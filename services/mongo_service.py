from flask_pymongo import PyMongo
from config import Config

mongo = PyMongo()

def init_app(app):
    app.config["MONGO_URI"] = Config.MONGO_URI
    mongo.init_app(app)
    return mongo

def get_collection():
    db = mongo.cx[Config.DATABASE_NAME]  # acessa o DB pelo nome
    return db[Config.COLLECTION_NAME]
