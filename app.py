from flask import Flask
from flask_cors import CORS
from routes.violencia_routes import violencia_bp
from services.mongo_service import init_app
import os
import requests
import joblib

def create_app():
    app = Flask(__name__)
    CORS(app)
    init_app(app)

    # === 🔹 Download e carregamento do modelo ===
    MODEL_PATH = "random_forest_model.pkl"
    MODEL_URL = "https://drive.google.com/uc?export=download&id=1czUVne031ty3QWX3FWTnd6M_o63Bn16b"

    if not os.path.exists(MODEL_PATH):
        print("⬇️  Baixando modelo do Google Drive...")
        response = requests.get(MODEL_URL)
        with open(MODEL_PATH, "wb") as f:
            f.write(response.content)
        print("✅ Modelo baixado com sucesso!")

    print("🔁 Carregando modelo...")
    model = joblib.load(MODEL_PATH)
    print("✅ Modelo carregado!")

    # Torna o modelo acessível globalmente (ex: dentro de rotas)
    app.config["MODEL"] = model

    # === 🔹 Blueprints ===
    app.register_blueprint(violencia_bp, url_prefix="/api/violencias")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000, host="0.0.0.0")
