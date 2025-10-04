from flask import Flask
from flask_cors import CORS
from routes.violencia_routes import violencia_bp
from services.mongo_service import init_app
import os
import requests
import joblib
from services.ml_service import load_model

def create_app():
    app = Flask(__name__)
    CORS(app)
    init_app(app)

    # Carregar modelo
    app.config["MODEL"] = load_model() 

    # === 🔹 Blueprints ===
    app.register_blueprint(violencia_bp, url_prefix="/api/violencias")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000, host="0.0.0.0")
