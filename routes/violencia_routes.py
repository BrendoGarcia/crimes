from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from models.violencia_model import Violencia
from services.mongo_service import get_collection
import pandas as pd
from datetime import datetime

violencia_bp = Blueprint("violencia", __name__)

# ---------------- ROTAS ---------------- #

# Todos os documentos
@violencia_bp.route("/", methods=["GET"])
def get_all():
    docs = get_collection().find()
    result = [Violencia(doc).to_dict() for doc in docs]
    return jsonify(result), 200

# Um único documento por ID
@violencia_bp.route("/<string:doc_id>", methods=["GET"])
def get_by_id(doc_id):
    doc = get_collection().find_one({"_id": ObjectId(doc_id)})
    if not doc:
        return jsonify({"error": "Documento não encontrado"}), 404
    return jsonify(Violencia(doc).to_dict()), 200

# Filtros dinâmicos (estado, ano, etc)
@violencia_bp.route("/filter", methods=["GET"])
def filter_docs():
    filtros = request.args.to_dict()  # pega todos os parâmetros da URL

    # Converte campos numéricos automaticamente
    campos_numericos = ["ano", "cod_estado", "Suma de Quantidade_de_Casos"]
    for campo in campos_numericos:
        if campo in filtros:
            try:
                filtros[campo] = int(filtros[campo])
            except ValueError:
                return jsonify({"error": f"Campo {campo} deve ser um número"}), 400

    # Executa a consulta com todos os filtros que o usuário passou
    docs = get_collection().find(filtros)
    result = [Violencia(doc).to_dict() for doc in docs]
    return jsonify(result), 200


# Inserir novo documento
@violencia_bp.route("/", methods=["POST"])
def insert_doc():
    data = request.json
    result = get_collection().insert_one(data)
    novo_doc = get_collection().find_one({"_id": result.inserted_id})
    return jsonify(Violencia(novo_doc).to_dict()), 201


# Função para arredondamento customizado
def round_custom(value):
    decimal = value - int(value)
    if decimal >= 0.5:
        return int(value) + 1
    else:
        return int(value)


# rota previção do numero de casos.
@violencia_bp.route("/predict", methods=["POST"])
def predict_violence():
    """
    Faz predição de casos de violência com base nos parâmetros enviados pelo usuário
    e salva o resultado completo no banco de dados.
    """
    try:
        model = current_app.config.get("MODEL")
        if model is None:
            return jsonify({"error": "Modelo não carregado no servidor"}), 500

        data = request.get_json()
        if not data:
            return jsonify({"error": "Nenhum dado enviado"}), 400

        # 🔹 Campos obrigatórios
        required_fields = ["ano", "ocorrencia", "tipo_de_violencia", "faixa_etaria", "raca", "arma"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Campos ausentes: {', '.join(missing)}"}), 400

        # 🔹 Criar DataFrame com todas as colunas do treinamento
        feature_columns = model.feature_names_in_  # colunas do modelo
        input_df = pd.DataFrame(0, index=[0], columns=feature_columns)

        # 🔹 Colocar valor do ano
        if "ano" in input_df.columns:
            input_df["ano"] = data["ano"]

        # 🔹 Preencher 1 nas colunas correspondentes às categorias
        category_fields = ["arma", "faixa_etaria", "ocorrencia", "raca", "tipo_de_violencia"]
        for field in category_fields:
            col_name = f"{field}_{data[field]}"
            if col_name in input_df.columns:
                input_df[col_name] = 1

        # 🔹 Predição
        predicted_value = float(model.predict(input_df)[0])
        predicted_value_rounded = round_custom(predicted_value)  # arredondar

        # 🔹 Registro completo
        registro = {
            "pais": "Brasil",
            "tipo_base_de_dados": "Segurança",
            "ano": data["ano"],
            "cod_estado": 26,
            "estado": "Pernambuco",
            "ocorrencia": data["ocorrencia"],
            "tipo_de_violencia": data["tipo_de_violencia"],
            "sexo": "Mulher",
            "faixa_etaria": data["faixa_etaria"],
            "raca": data["raca"],
            "arma": data["arma"],
            "Suma de Quantidade_de_Casos": predicted_value_rounded,
            "data_execucao": datetime.now().isoformat()
        }

        # 🔹 Salva no MongoDB
        collection = get_collection()
        collection.insert_one(registro)

        # 🔹 Retorna resultado
        return jsonify({
            "status": "success",
            "predicao": predicted_value_rounded,
            "registro_salvo": registro
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
