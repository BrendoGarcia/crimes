# Análise Preditiva de Feminicídio na Região Metropolitana do Recife: Documentação das Bases de Dados e Objetivos

## Integrantes do Grupo
- João Guilherme de Lima Martins
- Edson Nascimento Silva
- Brendo Garcia da Silva
- Gian Vitor Melo de Lira
- Josivaldo Braga Junior
- Ruan Ribeiro de Oliveira
- Leandro Marques da Silva

## 1. Descrição das Bases de Dados Pesquisadas

### 1.1 Base Principal: Secretaria de Defesa Social de Pernambuco (SDS-PE)

**Fonte:** Secretaria de Defesa Social do Estado de Pernambuco - Estatísticas de Violência Doméstica e Familiar contra a Mulher

**URL:** https://www.sds.pe.gov.br/estatisticas/40-estatisticas/178-violencia-domestica-e-familiar-contra-a-mulher

**Número de registros:** 16.282 casos de violência doméstica (Janeiro-Julho 2025)

**Número de variáveis e descrição:**
- **Município:** 19 municípios da Região Metropolitana do Recife
- **Período temporal:** Dados mensais de janeiro a julho de 2025
- **Tipo de crime:** Violência doméstica e familiar contra a mulher (Lei Maria da Penha)
- **Distribuição geográfica:** Casos por município da RMR
- **Evolução temporal:** Série histórica mensal permitindo análise de tendências

**Escopo temporal:** Janeiro a julho de 2025 (dados mais recentes disponíveis)

**Escopo geográfico:** Região Metropolitana do Recife, incluindo os municípios de: Recife, Jaboatão dos Guararapes, Olinda, Paulista, Camaragibe, Cabo de Santo Agostinho, São Lourenço da Mata, Igarassu, Abreu e Lima, Ipojuca, Moreno, Araçoiaba, Itapissuma, Itamaracá, Goiana, Tracunhaém, Pauldalho, Itapetim.

### 1.2 Base Complementar: Atlas da Violência 2025 (IPEA)

**Fonte:** Instituto de Pesquisa Econômica Aplicada (IPEA) - Atlas da Violência 2025

**Arquivo:** atlas-violencia-2025.pdf 

**Número de registros:** Dados nacionais e estaduais de feminicídio e homicídios de mulheres

**Número de variáveis e descrição:**
- **Taxa de feminicídio por 100 mil mulheres:** Indicador padronizado para comparação
- **Número absoluto de feminicídios:** Casos registrados por ano
- **Distribuição por faixa etária:** Perfil etário das vítimas
- **Distribuição por raça/cor:** Perfil racial das vítimas
- **Meio empregado:** Arma de fogo, arma branca, outros
- **Local do crime:** Residência, via pública, outros
- **Relação com o agressor:** Cônjuge, ex-cônjuge, namorado, outros

**Escopo temporal:** 2012-2023 infelizmente não foi encontrada dados mais recente dos anos de 2024 e 2025

**Escopo geográfico:** Nacional, com detalhamento por Unidades Federativas, incluindo Pernambuco

### 1.3 Base de Apoio: Fórum Brasileiro de Segurança Pública

**Fonte:** Fórum Brasileiro de Segurança Pública - Relatório "Visível e Invisível" 2025

**URL:** https://publicacoes.forumseguranca.org.br/items/7c9f57aa-e7d6-4d96-8f11-768fe85a2084

**Número de registros:** Dados nacionais de violência contra a mulher

**Número de variáveis e descrição:**
- **Feminicídios registrados:** Casos oficiais por ano
- **Tentativas de feminicídio:** Casos não consumados
- **Violência doméstica:** Registros da Lei Maria da Penha
- **Medidas protetivas:** Quantidade concedida por estado
- **Perfil das vítimas:** Idade, raça, escolaridade
- **Perfil dos agressores:** Relação com a vítima, antecedentes

**Escopo temporal:** 2019-2024 infelizmente não foi encontrada dados mais recente do ano de 2025

**Escopo geográfico:** Nacional, com detalhamento por estados

### 1.4 Bases de Dados Socioeconômicas Complementares

#### 1.4.1 Instituto Brasileiro de Geografia e Estatística (IBGE)

**Fonte:** IBGE - Estatísticas de Gênero e Censo 2022

**URL:** https://www.ibge.gov.br/estatisticas/multidominio/genero/

**Variáveis relevantes:**
- **População feminina por município:** Base populacional para cálculo de taxas
- **Renda média domiciliar:** Indicador socioeconômico
- **Escolaridade feminina:** Nível educacional das mulheres
- **Situação no mercado de trabalho:** Taxa de ocupação feminina
- **Arranjos familiares:** Composição dos domicílios

#### 1.4.2 Ministério da Saúde (DATASUS)

**Fonte:** Sistema de Informação sobre Mortalidade (SIM)

**URL:** https://datasus.saude.gov.br/

**Variáveis relevantes:**
- **Óbitos por causas externas:** Homicídios de mulheres
- **Classificação CID-10:** Códigos específicos para violência
- **Local de ocorrência:** Onde aconteceu o óbito
- **Assistência médica:** Se houve atendimento antes do óbito

### 1.5 Limitações das Bases de Dados Identificadas

Durante a pesquisa, foram identificadas importantes limitações:

1. **Ausência de dados granulares por bairro:** As bases oficiais disponibilizam dados apenas no nível municipal, não permitindo análise por bairros da RMR.

2. **Dados históricos limitados:** Para Pernambuco especificamente, os dados estruturados disponíveis cobrem principalmente o período 2019-2025, limitando a profundidade da análise temporal.

3. **Subnotificação:** Reconhecida pelos próprios órgãos oficiais, especialmente em casos de violência doméstica.

4. **Inconsistência entre bases:** Diferentes metodologias de coleta e classificação entre as fontes.

5. **Dados de feminicídio específicos:** Poucas bases disponibilizam dados detalhados especificamente sobre feminicídio, sendo necessário trabalhar com categorias mais amplas de violência contra a mulher.

## 2. Objetivos de Utilização das Bases de Dados

#### 2.1.1 Perguntas Descritivas

1. **Qual é o perfil temporal dos casos de feminicídio na RMR?**
   - Identificar padrões sazonais e tendências ao longo dos anos
   - Analisar a evolução mensal e anual dos casos
   - Comparar com médias nacionais e de outros estados

2. **Qual é a distribuição geográfica dos casos na RMR?**
   - Identificar municípios com maior incidência
   - Mapear hotspots de violência contra a mulher
   - Analisar a relação entre densidade populacional e casos

3. **Qual é o perfil socioeconômico das áreas com maior incidência?**
   - Correlacionar indicadores de renda, educação e emprego com taxas de violência
   - Identificar fatores socioeconômicos associados ao feminicídio
   - Analisar desigualdades regionais dentro da RMR

4. **Qual é o perfil das vítimas e agressores?**
   - Caracterizar idade, raça, escolaridade e situação profissional
   - Analisar a relação entre vítima e agressor
   - Identificar padrões de vulnerabilidade

#### 2.1.2 Perguntas Relacionais

1. **Existe correlação entre indicadores socioeconômicos e taxas de feminicídio?**
   - Testar hipóteses sobre pobreza, desigualdade e violência
   - Analisar o papel da educação como fator protetor
   - Investigar a relação entre emprego feminino e violência doméstica

2. **Como fatores temporais influenciam a incidência de casos?**
   - Analisar sazonalidade (meses, dias da semana, horários)
   - Investigar o impacto de eventos especiais (feriados, datas comemorativas)
   - Correlacionar com fatores climáticos e econômicos

3. **Qual é a relação entre violência doméstica e feminicídio?**
   - Analisar a escalada da violência doméstica para feminicídio
   - Identificar sinais de alerta e fatores de risco
   - Avaliar a efetividade das medidas protetivas

4. **Como a pandemia de COVID-19 impactou os casos?**
   - Comparar períodos pré, durante e pós-pandemia
   - Analisar mudanças nos padrões de denúncia e registro
   - Investigar o impacto do isolamento social

### 2.2 Perguntas Preditivas

#### 2.2.1 Modelos de Regressão 

**Pergunta principal:** Qual será a taxa de feminicídio na RMR em 2026?

**Justificativa para regressão:**
- A variável dependente (número de casos ou taxa de feminicídio) é contínua
- Permite prever valores numéricos específicos
- Possibilita análise de tendências e projeções temporais
- Adequado para planejamento de políticas públicas

**Variáveis preditoras:**
- Série temporal histórica de casos
- Indicadores socioeconômicos (renda, educação, emprego)
- Densidade populacional
- Investimentos em segurança pública
- Número de medidas protetivas concedidas
- Indicadores de desenvolvimento humano

#### 2.2.2 Modelos de Classificação

**Pergunta principal:** Quais municípios da RMR têm maior probabilidade de apresentar aumento nos casos de feminicídio?

**Justificativa para classificação:**
- A variável dependente é categórica (alto risco, médio risco, baixo risco)
- Permite identificar áreas prioritárias para intervenção
- Adequado para alocação de recursos de segurança pública
- Facilita a tomada de decisão em políticas preventivas

**Classes de risco:**
- **Alto risco:** Municípios com probabilidade >70% de aumento
- **Médio risco:** Municípios com probabilidade 30-70% de aumento
- **Baixo risco:** Municípios com probabilidade <30% de aumento

### 2.3 Metodologia de Análise Proposta

#### 2.3.1 Análise Exploratória de Dados

1. **Análise univariada:** Distribuições, medidas de tendência central e dispersão
2. **Análise bivariada:** Correlações, testes de associação
3. **Análise multivariada:** Análise de componentes principais, clustering
4. **Visualizações:** Mapas de calor, séries temporais, gráficos de dispersão

#### 2.3.2 Modelagem Preditiva

**Para Regressão:**
- Regressão Linear Múltipla
- Regressão Polinomial
- Modelos de Séries Temporais (ARIMA, SARIMA)
- Random Forest Regressor
- Gradient Boosting Regressor

**Para Classificação:**
- Regressão Logística
- Random Forest Classifier
- Support Vector Machine (SVM)
- Gradient Boosting Classifier
- Redes Neurais

#### 2.3.3 Validação e Avaliação

**Métricas para Regressão:**
- Mean Absolute Error (MAE)
- Root Mean Square Error (RMSE)
- R² Score
- Mean Absolute Percentage Error (MAPE)

**Métricas para Classificação:**
- Acurácia
- Precisão, Recall e F1-Score
- Área sob a Curva ROC (AUC-ROC)
- Matriz de Confusão

### 2.4 Impacto Esperado e Aplicações

#### 2.4.1 Para Gestores Públicos

- **Planejamento estratégico:** Alocação de recursos baseada em evidências
- **Políticas preventivas:** Identificação de áreas e grupos prioritários
- **Monitoramento:** Acompanhamento da efetividade das intervenções
- **Orçamento:** Justificativa técnica para investimentos em segurança

#### 2.4.2 Para Organizações da Sociedade Civil

- **Advocacy:** Dados para pressionar por políticas públicas
- **Captação de recursos:** Evidências para projetos e financiamentos
- **Programas sociais:** Direcionamento de ações para áreas de maior risco
- **Conscientização:** Material para campanhas educativas

#### 2.4.3 Para Pesquisadores

- **Base científica:** Dados estruturados para pesquisas acadêmicas
- **Metodologia:** Framework replicável para outras regiões
- **Publicações:** Artigos científicos sobre violência de gênero
- **Formação:** Material didático para cursos e capacitações

## 3. Desafios e Limitações do Projeto

### 3.1 Desafios Técnicos

1. **Qualidade dos dados:** Inconsistências e lacunas nas bases oficiais
2. **Granularidade:** Ausência de dados por bairro limita análises espaciais detalhadas
3. **Integração:** Diferentes formatos e metodologias entre as fontes
4. **Atualização:** Defasagem temporal dos dados oficiais

### 3.2 Desafios Metodológicos

1. **Causalidade vs. Correlação:** Cuidado na interpretação de associações
2. **Viés de seleção:** Subnotificação pode distorcer análises
3. **Variáveis confundidoras:** Controle de fatores não observados
4. **Generalização:** Limitação dos resultados à RMR

### 3.3 Considerações Éticas

1. **Privacidade:** Proteção de dados sensíveis das vítimas
2. **Estigmatização:** Evitar reforçar preconceitos sobre comunidades
3. **Responsabilidade:** Uso adequado dos resultados preditivos
4. **Transparência:** Comunicação clara das limitações do modelo

## 4. Cronograma de Desenvolvimento

### Fase 1: Coleta e Estruturação de Dados (Em andamento)
- Identificação e acesso às bases de dados
- Limpeza e padronização dos dados
- Criação de base integrada

### Fase 2: Análise Exploratória (Em andamento)
- Estatísticas descritivas
- Visualizações exploratórias
- Identificação de padrões e anomalias

### Fase 3: Modelagem Preditiva (Próxima)
- Desenvolvimento de modelos de regressão e classificação
- Validação cruzada e ajuste de hiperparâmetros
- Seleção do melhor modelo

### Fase 4: Implementação na Aplicação Streamlit (Versão Demo Disponivel)
- Interface para visualização de previsões
- Mapas interativos com projeções
- Dashboard de monitoramento


Este documento representa a base metodológica e conceitual do projeto de análise preditiva de feminicídio na RMR, 
estabelecendo as diretrizes para o desenvolvimento de uma ferramenta robusta e cientificamente fundamentada para apoio à tomada de decisões em segurança pública e proteção das mulheres.
