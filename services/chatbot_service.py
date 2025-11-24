import os
from dotenv import load_dotenv
import json
import requests
import unicodedata
from flask import Flask
from groq import Groq
from fastapi import HTTPException
from services.mongo_service import init_app, get_collection
from utins.semi_filter import semi_filter  # importe sua função semi_filter
from utins.pdf_report import gerar_pdf_relatorio

# ====== CONFIGURAÇÕES ======

load_dotenv()

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

client = Groq()
app = Flask(__name__)
init_app(app)


# ====== SERVIÇO DO CHATBOT ======

class ChatbotService:
    """
    Serviço responsável por se comunicar com o modelo Groq,
    consultar sua API de dados, aplicar semi filtro e gerar resposta.
    """

    def __init__(self, model_name: str = "llama-3.1-8b-instant",
                 api_base: str = "http://localhost:5000/api/violencias"):
        self.model_name = model_name
        self.api_base = api_base
        self.collection = get_collection()

    # === 1️⃣ Função auxiliar: normalizar textos ===
    def _normalize_text(self, text: str) -> str:
        """Remove acentos e converte para minúsculas para comparação segura."""
        if not text:
            return ""
        return ''.join(
            c for c in unicodedata.normalize('NFD', text.lower())
            if unicodedata.category(c) != 'Mn'
        )

    # === 2️⃣ Extrai todos os valores únicos do Mongo ===
    def _get_unique_values(self):
        campos = [
            "ano", "ocorrencia", "tipo_de_violencia", "raca",
            "faixa_etaria", "arma", "estado", "sexo"
        ]
        valores = {}
        for campo in campos:
            try:
                vals = self.collection.distinct(campo)
                valores[campo] = [str(v) for v in vals if v is not None]
            except Exception:
                valores[campo] = []
        return valores

    # === 3️⃣ Extrai filtros dinamicamente da pergunta ===
    def _extract_filters(self, question: str):
        q_norm = self._normalize_text(question)
        unique_vals = self._get_unique_values()
        params = {}

        for campo, lista_valores in unique_vals.items():
            for valor in lista_valores:
                if not valor:
                    continue
                val_norm = self._normalize_text(str(valor))
                # compara sem acentos e sem diferenciação de maiúsculas
                if val_norm in q_norm:
                    params[campo] = valor  # mantém o valor original da base
                    break

        return params

    # === 4️⃣ Chama a API de filtro existente ===
    def _query_filter_api(self, params):
        try:
            response = requests.get(f"{self.api_base}/filter", params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao consultar API /filter: {e}")

    # === 5️⃣ Gera resposta integrada com semi filtro ===
    def generate_response(self, message: str, context: list | None = None):
        try:
            # 🔹 Extrai os filtros automaticamente da pergunta
            filtros = self._extract_filters(message)
            print("Filtros detectados:", filtros)

            # 🔹 Busca os dados filtrados
            dados = self._query_filter_api(filtros)

            # 🔹 Aplica o semi filtro para resumir os dados
            resumo = semi_filter(dados, message)
            # Testando valores
            print("\n=== DEBUG 2 — RESULTADO DO SEMI FILTER ===")
            print(json.dumps(resumo, indent=2, ensure_ascii=False))

             # DETECTAR RELATÓRIO
            if self._is_report_request(message):
                print("⚠ Pedido de relatório detectado. Gerando PDF...")
                caminho_pdf = gerar_pdf_relatorio(resumo)
                return {
                    "tipo": "relatorio_pdf",
                    "arquivo": caminho_pdf,
                    "mensagem": "Seu relatório foi gerado com sucesso."
                }

            # 🔹 Monta prompt final para o modelo
            user_message = f"""
            Você é um assistente especialista em análise de dados de violência contra a mulher.
            
            IMPORTANTE:
            - "Soma de Quantidade_de_Casos" representa o TOTAL de casos encontrados após os filtros.
            - As listas como "Ocorrencias", "Tipos_de_Violencia", "Faixas_Etarias", etc., representam as CATEGORIAS presentes nos dados, NÃO a quantidade de vezes.
            - Não confunda o número de itens na lista com o número de casos. 
            - Sempre se baseie no valor numérico da soma para responder perguntas de quantidade.

            Aqui está o resumo dos dados encontrado já filtrado:

            {json.dumps(resumo, ensure_ascii=False, indent=2)}

            Pergunta do usuário:
            {message}
            """

            messages = [
                            {
                                "role": "system",
                                "content": """
                        Você é um assistente especialista em análise de dados de violência contra a mulher.
                        IMPORTANTE:
                        - "Soma de Quantidade_de_Casos" representa o TOTAL real
                        - Nunca inferir quantidades a partir de listas
                        """
                            },
                            {
                                "role": "assistant",
                                "content": json.dumps(resumo, ensure_ascii=False)
                            },
                            {
                                "role": "user",
                                "content": message
                            }
                        ]
            if context:
                messages.extend(self._sanitize_history(context))


            # 🔹 Chama o modelo Groq
            completion = client.chat.completions.create(
                model=self.model_name,
                messages=messages
            )

            return completion.choices[0].message.content

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro no ChatbotService: {e}")

    # Teste para a geração de relatorios. se der erros deletar tudo apartir daqui
    # === Detecta se o usuário pediu um relatório ===
    def _is_report_request(self, question: str) -> bool:
        q = self._normalize_text(question)

        gatilhos = [
            "relatorio",
            "gerar relatorio",
            "faca um relatorio",
            "crie um relatorio",
            "quero um relatorio",
            "gere um relatorio",
            "pdf",
            "exportar pdf",
            "gerar pdf"
        ]

        return any(g in q for g in gatilhos)

    def _sanitize_history(self, history):
        msgs = []
        for m in history:
            c = m.get("content")

            # se content NÃO for string nem lista → converter em string
            if not isinstance(c, (str, list)):
                c = str(c)

            msgs.append({
                "role": m.get("role", "user"),
                "content": c
            })

        return msgs
