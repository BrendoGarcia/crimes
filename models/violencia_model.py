from bson import ObjectId

class Violencia:
    def __init__(self, data):
        self.id = str(data.get("_id", ""))
        self.pais = data.get("pais")
        self.tipo_base_de_dados = data.get("tipo_base_de_dados")
        self.ano = data.get("ano")
        self.cod_estado = data.get("cod_estado")
        self.estado = data.get("estado")
        self.ocorrencia = data.get("ocorrencia")
        self.tipo_de_violencia = data.get("tipo_de_violencia")
        self.sexo = data.get("sexo")
        self.faixa_etaria = data.get("faixa_etaria")
        self.raca = data.get("raca")
        self.arma = data.get("arma")
        self.quantidade = data.get("Suma de Quantidade_de_Casos")

    def to_dict(self):
        return {
            "_id": self.id,
            "pais": self.pais,
            "tipo_base_de_dados": self.tipo_base_de_dados,
            "ano": self.ano,
            "cod_estado": self.cod_estado,
            "estado": self.estado,
            "ocorrencia": self.ocorrencia,
            "tipo_de_violencia": self.tipo_de_violencia,
            "sexo": self.sexo,
            "faixa_etaria": self.faixa_etaria,
            "raca": self.raca,
            "arma": self.arma,
            "Suma de Quantidade_de_Casos": self.quantidade
        }
