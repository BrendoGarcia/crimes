from flask_pymongo import PyMongo
from config import Config

mongo = PyMongo()

def init_app(app):
    app.config["MONGO_URI"] = Config.MONGO_URI
    mongo.init_app(app)
    print("Conexçaõ feita com sucesso")
    return mongo

# cria índice de texto em TODOS os campos (só precisa rodar uma vez)
def ensure_text_index():
    try:
        get_collection().create_index([("$**", "text")])
        print("✅ Índice de texto criado (ou já existia).")
    except Exception as e:
        print("⚠️ Erro ao criar índice de texto:", e)    

def get_collection():
    db = mongo.cx[Config.DATABASE_NAME]  # acessa o DB pelo nome
    return db[Config.COLLECTION_NAME]
