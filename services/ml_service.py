import os
import requests
import joblib

MODEL_PATH = "modelo_random_forest.pkl"
MODEL_URL = "https://drive.google.com/uc?export=download&id=1czUVne031ty3QWX3FWTnd6M_o63Bn16b"

def load_model():
    if not os.path.exists(MODEL_PATH):
        print("⬇️  Baixando modelo do Google Drive...")
        response = requests.get(MODEL_URL)
        with open(MODEL_PATH, "wb") as f:
            f.write(response.content)
        print("✅ Modelo baixado com sucesso!")

    print("🔁 Carregando modelo...")
    model = joblib.load(MODEL_PATH)
    print("✅ Modelo carregado!")
    return model
