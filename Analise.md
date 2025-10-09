## Análise do Projeto de MVP Supervisionado em Segurança Pública

Este relatório detalha a análise do projeto de Machine Learning supervisionado, focado na previsão de ocorrências de segurança pública no estado de Pernambuco, conforme apresentado no notebook do Google Colab. O objetivo principal é construir um MVP (Produto Mínimo Viável) que utilize técnicas de classificação ou previsão para resolver um problema bem definido.

### 1. Data Storytelling: Contexto, Perguntas, Hipóteses e Análise Descritiva

#### Contexto do Projeto
O projeto se insere no domínio da segurança pública, utilizando um conjunto de dados que conter informações sobre ocorrências em diversos estados brasileiros, mas que foi filtrado especificamente para o estado de **Pernambuco**. O foco é desenvolver um modelo preditivo para auxiliar na compreensão e possível antecipação de eventos relacionados à segurança contra a mulher.

#### Problema e Objetivo
O problema central é a **previsão quantitativa da de casos de crimes contra a mulher** (`Suma de Quantidade_de_Casos`). O objetivo é construir um MVP supervisionado capaz de prever essa métrica, o que pode ser útil para alocação de recursos, planejamento estratégico ou identificação de padrões de criminalidade.

#### Análise Descritiva
A análise exploratória inicial revelou as seguintes características do conjunto de dados processado para Pernambuco:

*   **Dados:** O DataFrame `df_pe` possui 1751 entradas e 8 colunas, sem valores nulos após o pré-processamento inicial.
*   **Colunas Categóricas:** As colunas categóricas incluem `estado`, `ocorrencia`, `tipo_de_violencia`, `faixa_etaria`, `raca` e `arma`.
    *   `estado`: Contém apenas 'Pernambuco', indicando que a coluna foi removida posteriormente por ser invariante.
    *   `ocorrencia`: Apresenta 17 tipos únicos de ocorrências, com 'Ameaça' e 'Lesão Corporal Dolosa' sendo as mais frequentes.
    *   `tipo_de_violencia`: Classifica as ocorrências em 5 tipos, com 'Violência Sexual' e 'Violência Física' como as mais comuns.
    *   `faixa_etaria`: Divide as ocorrências em 6 faixas etárias, com '15-29' e '30-44' sendo as mais representadas.
    *   `raca`: Contém 6 categorias, com 'Parda' e 'Não Especificado' como as mais prevalentes.
    *   `arma`: Possui 5 categorias, sendo 'Não Especificado' a mais comum, seguida por 'Arma de Fogo'.

### 2. Pipeline de Dados: Limpeza, Balanceamento e Processamento

O pipeline de dados implementado no projeto segue as seguintes etapas:

1.  **Carregamento e Filtragem:** O dataset `seguranca_geral_BR_2024_Hoja1.csv` é carregado e filtrado para incluir apenas dados de Pernambuco.
2.  **Remoção de Colunas Irrelevantes:** Colunas como `pais`, `tipo_base_de_dados`, `sexo` e `cod_estado` são removidas, pois são consideradas irrelevantes ou invariantes para a análise focada em Pernambuco.
3.  **One-Hot Encoding:** As colunas categóricas restantes (`ocorrencia`, `tipo_de_violencia`, `faixa_etaria`, `raca`, `arma`) são transformadas usando One-Hot Encoding. A opção `drop_first=True` é utilizada para evitar a multicolinearidade.
4.  **Definição de Variável Alvo e Features:** A variável alvo (`y`) é definida como `Suma de Quantidade_de_Casos`, e as demais colunas processadas formam o conjunto de features (`X`).
5.  **Divisão em Treino e Teste:** Os dados são divididos em conjuntos de treino e teste na proporção de 80/20, respectivamente, utilizando `random_state=42` para garantir a reprodutibilidade.

O balanceamento de dados. Caso a variável alvo ou as classes de classificação (se fosse um problema de classificação) estivessem desbalanceadas, técnicas como *oversampling* (SMOTE) ou *undersampling* seriam necessárias.

### 3. Modelagem Supervisionada: Baseline e Modelos

O projeto implementa dois modelos de regressão supervisionada para prever a `Suma de Quantidade_de_Casos`:

1.  **Regressão Linear:** Um modelo linear simples, que serve como um bom *baseline* para comparação com modelos mais complexos.
2.  **Random Forest Regressor:** Um modelo de ensemble baseado em árvores de decisão, conhecido por sua robustez e bom desempenho em diversos tipos de dados. Foi configurado com `n_estimators=500` e `random_state=42`.

Ambos os modelos são treinados com os dados de treino (`X_train`, `y_train`) e salvos em arquivos `.pkl` para uso posterior.

### 4. Avaliação dos Resultados dos Modelos Supervisionados

A avaliação dos modelos é realizada utilizando métricas comuns para problemas de regressão:

*   **MSE (Mean Squared Error):** Mede a média dos quadrados dos erros.
*   **RMSE (Root Mean Squared Error):** A raiz quadrada do MSE, fornecendo uma métrica na mesma unidade da variável alvo.
*   **MAE (Mean Absolute Error):** Mede a média dos valores absolutos dos erros.
*   **R2 Score (Coeficiente de Determinação):** Indica a proporção da variância na variável dependente que é previsível a partir das variáveis independentes.

Os resultados das métricas para os modelos são:

|Métrica    | Regressão Linear | Random Forest Regressor |
|:--------- | :--------------- | :---------------------- |
|**MSE**    | 1219.00          | 121.00                  |
|**RMSE**   | 34.91            | 11.00                   |
|**MAE**    | 11.96            | 3.79                    |
|**R2Score**| 0.46             | 0.95                    |

#### Comparação de Desempenho
Com base nas métricas, o **Random Forest Regressor** demonstrou um desempenho significativamente superior ao Modelo de Regressão Linear. O R2 Score de 0.95 para o Random Forest indica que ele explica 95% da variância na variável alvo, enquanto a Regressão Linear explica apenas 46%. Além disso, os valores de MSE, RMSE e MAE são consideravelmente menores para o Random Forest, indicando erros de previsão muito menores.

#### Visualizações
<img width="1388" height="590" alt="download (2)" src="https://github.com/user-attachments/assets/1de18282-36af-445a-b9f0-6ecf404348a2" />
O projeto inclui gráficos de dispersão comparando os valores reais (`y_test`) com os valores preditos (`y_pred`) para ambos os modelos, além de histogramas da distribuição dos resíduos. Essas visualizações são cruciais para entender visualmente a performance dos modelos e a distribuição dos erros.

### 5. Modelagem Não Supervisionada

Até o momento a parte não supervisionada ainda esta em construção data 08/10/2025 h:21:46
