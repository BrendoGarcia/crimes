# Análise de Violência na Região Metropolitana do Recife

## Descrição do Projeto

Este projeto desenvolvido em Streamlit apresenta uma análise abrangente dos dados de violência na Região Metropolitana do Recife (RMR), com foco especial em violência doméstica e familiar contra a mulher.

## Funcionalidades

### 🏠 Visão Geral
- **Mapa Interativo**: Visualização geográfica dos casos de violência doméstica por município
- **Indicadores Principais**: Métricas resumidas dos dados coletados
- **Legenda Visual**: Sistema de cores para identificar níveis de violência por região

### 👩 Violência Doméstica
- **Dados Oficiais**: Informações da Secretaria de Defesa Social de Pernambuco (Jan-Jul 2025)
- **Análise Temporal**: Evolução mensal dos casos
- **Ranking Municipal**: Distribuição e comparação entre municípios
- **Análise Detalhada**: Seleção individual de municípios para análise específica

### 📈 Outras Métricas
- **Classe Econômica**: Correlação entre indicadores socioeconômicos e criminalidade
- **Horário & Clima**: Padrões de criminalidade por período do dia e condições climáticas
- **Policiamento**: Análise da efetividade policial e recursos por município
- **Punições & Resolução**: Dados sobre tempo de resolução e taxa de elucidação de crimes

## Estrutura de Arquivos

```
projeto-violencia-rmr/
├── app_completo.py              # Aplicação principal do Streamlit
├── dados_simulados.py           # Script para gerar dados complementares
├── violencia_domestica_rmr.csv  # Dados reais de violência doméstica
├── dados_classe_economica.csv   # Dados socioeconômicos simulados
├── dados_horario_clima.csv      # Dados de horário e clima simulados
├── dados_policiamento.csv       # Dados de policiamento simulados
├── dados_punicoes.csv           # Dados de punições simulados
├── requirements.txt             # Dependências do projeto
└── README.md                    # Este arquivo
```

## Instalação e Execução

### Pré-requisitos
- Python 3.11+
- pip

### Instalação das Dependências
```bash
pip install -r requirements.txt
```

### Execução da Aplicação
```bash
streamlit run app_completo.py
```

A aplicação estará disponível em: `http://localhost:8501`

## Dependências

- streamlit
- pandas
- folium
- streamlit-folium
- plotly
- numpy

## Fontes de Dados

### Dados Reais
- **Violência Doméstica**: Secretaria de Defesa Social de Pernambuco
- **Atlas da Violência**: Instituto de Pesquisa Econômica Aplicada (IPEA)
- **Fórum Brasileiro de Segurança Pública**: Relatórios anuais

### Dados Simulados
Para fins demonstrativos, foram criados dados simulados para:
- Indicadores socioeconômicos por município
- Padrões de criminalidade por horário e clima
- Dados de policiamento e efetividade
- Informações sobre punições e resolução de casos

## Características Técnicas

- **Interface Responsiva**: Compatível com desktop e dispositivos móveis
- **Mapas Interativos**: Utilizando Folium para visualização geográfica
- **Gráficos Dinâmicos**: Plotly para visualizações interativas
- **Cache de Dados**: Otimização de performance com @st.cache_data
- **Navegação Intuitiva**: Sistema de abas e seções organizadas

## Limitações e Considerações

1. **Dados Complementares**: Algumas métricas utilizam dados simulados devido à indisponibilidade de fontes oficiais estruturadas
2. **Período de Análise**: Dados de violência doméstica limitados ao período de janeiro a julho de 2025
3. **Escopo Geográfico**: Análise restrita à Região Metropolitana do Recife

## Próximos Passos

- Integração com APIs oficiais para dados em tempo real
- Expansão para outros tipos de criminalidade
- Implementação de modelos preditivos
- Adição de funcionalidades de exportação de relatórios

## Contato e Suporte

Este projeto foi desenvolvido para análise e transparência de dados públicos sobre violência na RMR, contribuindo para o debate informado sobre segurança pública.

