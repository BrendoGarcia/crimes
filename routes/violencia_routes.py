from flask import Blueprint, request, jsonify
from bson import ObjectId
from models.violencia_model import Violencia
from services.mongo_service import get_collection

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
