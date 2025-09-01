import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

municipios_rmr = [
    'RECIFE', 'JABOATAO DOS GUARARAPES', 'OLINDA', 'PAULISTA', 'CAMARAGIBE',
    'CABO DE SANTO AGOSTINHO', 'SAO LOURENCO DA MATA', 'IGARASSU', 'ABREU E LIMA',
    'IPOJUCA', 'MORENO', 'ITAMARACA', 'ITAPISSUMA', 'ARACOIABA', 'GOIANA',
    'PAUDALHO', 'CARPINA', 'ITAPETIM', 'TRACUNHAEM'
]

def gerar_dados_classe_economica():
    dados = []
    for municipio in municipios_rmr:
        renda_media = np.random.uniform(800, 4500)
        indice_gini = np.random.uniform(0.45, 0.65)
        pop_vulneravel = np.random.uniform(15, 45)
        crimes_por_mil = np.random.uniform(8, 35)
        
        dados.append({
            'Município': municipio,
            'Renda_Media': round(renda_media, 2),
            'Indice_Gini': round(indice_gini, 3),
            'Pop_Vulneravel_Pct': round(pop_vulneravel, 1),
            'Crimes_Por_Mil_Hab': round(crimes_por_mil, 1)
        })
    
    return pd.DataFrame(dados)

def gerar_dados_horario_clima():
    horarios = ['00-06h', '06-12h', '12-18h', '18-24h']
    climas = ['Ensolarado', 'Nublado', 'Chuvoso']
    
    dados = []
    for horario in horarios:
        for clima in climas:
            crimes = np.random.randint(50, 300)
            dados.append({
                'Horario': horario,
                'Clima': clima,
                'Crimes': crimes
            })
    
    return pd.DataFrame(dados)

def gerar_dados_policiamento():
    dados = []
    for municipio in municipios_rmr:
        policiais_por_mil = np.random.uniform(1.5, 4.2)
        operacoes_mes = np.random.randint(5, 25)
        prisoes_mes = np.random.randint(10, 80)
        efetividade = np.random.uniform(0.3, 0.8)
        
        dados.append({
            'Município': municipio,
            'Policiais_Por_Mil_Hab': round(policiais_por_mil, 2),
            'Operacoes_Mes': operacoes_mes,
            'Prisoes_Mes': prisoes_mes,
            'Efetividade_Pct': round(efetividade * 100, 1)
        })
    
    return pd.DataFrame(dados)

def gerar_dados_punicoes():
    tipos_crime = ['Homicídio', 'Roubo', 'Furto', 'Violência Doméstica', 'Tráfico']
    
    dados = []
    for crime in tipos_crime:
        tempo_resolucao = np.random.uniform(30, 365)
        taxa_elucidacao = np.random.uniform(0.2, 0.7)
        condenacoes = np.random.randint(50, 300)
        
        dados.append({
            'Tipo_Crime': crime,
            'Tempo_Medio_Resolucao_Dias': round(tempo_resolucao, 0),
            'Taxa_Elucidacao_Pct': round(taxa_elucidacao * 100, 1),
            'Condenacoes_Ano': condenacoes
        })
    
    return pd.DataFrame(dados)

if __name__ == "__main__":
    df_classe = gerar_dados_classe_economica()
    df_horario = gerar_dados_horario_clima()
    df_policiamento = gerar_dados_policiamento()
    df_punicoes = gerar_dados_punicoes()
    
    df_classe.to_csv('dados_classe_economica.csv', index=False)
    df_horario.to_csv('dados_horario_clima.csv', index=False)
    df_policiamento.to_csv('dados_policiamento.csv', index=False)
    df_punicoes.to_csv('dados_punicoes.csv', index=False)
    
    print("Dados simulados gerados com sucesso!")
    print(f"Classe Econômica: {len(df_classe)} registros")
    print(f"Horário e Clima: {len(df_horario)} registros")
    print(f"Policiamento: {len(df_policiamento)} registros")
    print(f"Punições: {len(df_punicoes)} registros")

