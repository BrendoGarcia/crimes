📌 API de Violências em Pernambuco

Base: MongoDB Atlas (violencias)
Framework: Flask + Blueprint

URL base do endpoint:

```bash
/api/violencias
```
1️⃣ Listar todos os dados

Endpoint: /
Método: GET
Descrição: Retorna todos os documentos da coleção.

Exemplo de requisição:
```bash
GET http://localhost:5000/api/violencias/
```

Exemplo de resposta:
```json
[
  {
    "_id": "68cc3962d4756c3d705829f1",
    "pais": "Brasil",
    "tipo_base_de_dados": "Segurança",
    "ano": 2019,
    "cod_estado": 26,
    "estado": "Pernambuco",
    "ocorrencia": "Ameaça",
    "tipo_de_violencia": "Violência Psicológica",
    "sexo": "Mulher",
    "faixa_etaria": "0-14",
    "raca": "Amarela",
    "arma": "Não Especificado",
    "Suma de Quantidade_de_Casos": 2
  },
  {
    "_id": "68cc3962d4756c3d705829f2",
    "pais": "Brasil",
    "tipo_base_de_dados": "Segurança",
    "ano": 2019,
    "cod_estado": 26,
    "estado": "Pernambuco",
    "ocorrencia": "Ameaça",
    "tipo_de_violencia": "Violência Psicológica",
    "sexo": "Mulher",
    "faixa_etaria": "0-14",
    "raca": "Branca",
    "arma": "Não Especificado",
    "Suma de Quantidade_de_Casos": 133
  }
]
```
2️⃣ Consultar um documento por ID

Endpoint: /api/violencias/68cc3962d4756c3d705829f1
Método: GET
Descrição: Retorna um documento específico pelo seu _id.

Parâmetros:

doc_id (string) → ID do documento no MongoDB

Exemplo de requisição:
```bash
GET http://localhost:5000/api/violencias/68cc3962d4756c3d705829f1
```

Exemplo de resposta:
```json
{
  "_id": "68cc3962d4756c3d705829f1",
  "pais": "Brasil",
  "tipo_base_de_dados": "Segurança",
  "ano": 2019,
  "cod_estado": 26,
  "estado": "Pernambuco",
  "ocorrencia": "Ameaça",
  "tipo_de_violencia": "Violência Psicológica",
  "sexo": "Mulher",
  "faixa_etaria": "0-14",
  "raca": "Amarela",
  "arma": "Não Especificado",
  "Suma de Quantidade_de_Casos": 2
}
```

Erro caso o documento não exista:
```json
{
  "error": "Documento não encontrado"
}
```
3️⃣ Filtros dinâmicos

Endpoint: /filter
Método: GET
Descrição: Permite filtrar documentos usando qualquer combinação de campos da coleção (ano, tipo_de_violencia, raca, faixa_etaria, etc).

Como funciona:

Todos os parâmetros são passados via query string

Campos numéricos (ano, cod_estado, Suma de Quantidade_de_Casos) são convertidos automaticamente

Exemplos de requisição:

Filtrar por ano:
```bash
GET http://localhost:5000/api/violencias/filter?ano=2019
```

Filtrar por tipo de violência:
```bash
GET http://localhost:5000/api/violencias/filter?tipo_de_violencia=Violência Psicológica
```

Filtrar por ano + raça:
```bash
GET http://localhost:5000/api/violencias/filter?ano=2019&raca=Parda
```

Filtrar por ano + tipo de violência + faixa etária:
```bash
GET http://localhost:5000/api/violencias/filter?ano=2019&tipo_de_violencia=Violência Psicológica&faixa_etaria=0-14
```

Exemplo de resposta:
```json
[
  {
    "_id": "68cc3962d4756c3d705829f4",
    "pais": "Brasil",
    "tipo_base_de_dados": "Segurança",
    "ano": 2019,
    "cod_estado": 26,
    "estado": "Pernambuco",
    "ocorrencia": "Ameaça",
    "tipo_de_violencia": "Violência Psicológica",
    "sexo": "Mulher",
    "faixa_etaria": "0-14",
    "raca": "Parda",
    "arma": "Não Especificado",
    "Suma de Quantidade_de_Casos": 300
  }
]
```
4️⃣ Inserir um novo documento

Endpoint: /
Método: POST
Descrição: Insere um novo documento na coleção.

Corpo da requisição (JSON):
```json
{
  "pais": "Brasil", 
  "tipo_base_de_dados": "Segurança",
  "ano": 2020,
  "cod_estado": 26,
  "estado": "Pernambuco",
  "ocorrencia": "Ameaça",
  "tipo_de_violencia": "Violência Física",
  "sexo": "Mulher",
  "faixa_etaria": "15-29",
  "raca": "Branca",
  "arma": "Não Especificado",
  "Suma de Quantidade_de_Casos": 10
}
```

Exemplo de requisição:
```bash
POST http://localhost:5000/api/violencias/
Content-Type: application/json
{
  "pais": "Brasil",
  "tipo_base_de_dados": "Segurança",
  "ano": 2020,
  "cod_estado": 26,
  "estado": "Pernambuco",
  "ocorrencia": "Ameaça",
  "tipo_de_violencia": "Violência Física",
  "sexo": "Mulher",
  "faixa_etaria": "15-29",
  "raca": "Branca",
  "arma": "Não Especificado",
  "Suma de Quantidade_de_Casos": 10
}
```

Exemplo de resposta (201 Created):
```json
{
  "_id": "68cc4a2fd4756c3d70582a01",
  "pais": "Brasil",
  "tipo_base_de_dados": "Segurança",
  "ano": 2020,
  "cod_estado": 26,
  "estado": "Pernambuco",
  "ocorrencia": "Ameaça",
  "tipo_de_violencia": "Violência Física",
  "sexo": "Mulher",
  "faixa_etaria": "15-29",
  "raca": "Branca",
  "arma": "Não Especificado",
  "Suma de Quantidade_de_Casos": 10
}
```
Instruções para Rodar o Back-End.

1 Primeiro Faça o Git clone do repositório e da branche certa.
2 Faça a instalação das dependêcias do sistema.
```bash
pip install -r requirements.txt
```
3 Configure as variavens de anbiente
```bash
MONGO_URI="Url do banco Mongo atlas"
DATABASE_NAME="Nome do Seu Banco no mongo altas"
COLLECTION_NAME="Nome da Coleção do seu Mongo atlas"
```
Obs: Remova as aspas 

4 Execulte o app python do backend.
```bash
python app.py
```

🔹 Observações importantes

Todos os endpoints retornam JSON.

A base de dados contém apenas dados de Mulheres (sexo="Mulher").

Para filtros dinâmicos, qualquer combinação de parâmetros funciona.

Campos numéricos (ano, cod_estado, Suma de Quantidade_de_Casos) devem ser passados como números ou serão convertidos automaticamente pelo endpoint /filter.
