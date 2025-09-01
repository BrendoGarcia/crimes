import streamlit as st
import pandas as pd
import folium
from streamlit_folium import folium_static
import plotly.express as px
import plotly.graph_objects as go
import numpy as np

st.set_page_config(page_title="Análise de Violência - RMR", layout="wide")

@st.cache_data
def carregar_dados():
    try:
        df_violencia = pd.read_csv("violencia_domestica_rmr.csv")
        df_classe = pd.read_csv("dados_classe_economica.csv")
        df_horario = pd.read_csv("dados_horario_clima.csv")
        df_policiamento = pd.read_csv("dados_policiamento.csv")
        df_punicoes = pd.read_csv("dados_punicoes.csv")
        return df_violencia, df_classe, df_horario, df_policiamento, df_punicoes
    except FileNotFoundError as e:
        st.error(f"Erro ao carregar dados: {e}")
        return None, None, None, None, None

st.title("📊 Análise de Violência na Região Metropolitana do Recife")
st.markdown("---")

st.sidebar.title("🧭 Navegação")
page = st.sidebar.radio("Selecione uma seção:", ["🏠 Visão Geral", "👩 Violência Doméstica", "📈 Outras Métricas"])

municipios_coords = {
    'RECIFE': [-8.0578, -34.8829],
    'JABOATAO DOS GUARARAPES': [-8.1120, -35.0150],
    'OLINDA': [-8.0089, -34.8553],
    'PAULISTA': [-7.9407, -34.8728],
    'CAMARAGIBE': [-8.0196, -35.0384],
    'CABO DE SANTO AGOSTINHO': [-8.2914, -35.0349],
    'SAO LOURENCO DA MATA': [-8.0051, -35.1025],
    'IGARASSU': [-7.8342, -34.9062],
    'ABREU E LIMA': [-7.9124, -34.8973],
    'IPOJUCA': [-8.3997, -35.0638],
    'MORENO': [-8.1188, -35.0892],
    'ITAMARACA': [-7.7469, -34.8264],
    'ITAPISSUMA': [-7.7789, -34.8939],
    'ARACOIABA': [-7.7889, -35.0939],
    'GOIANA': [-7.5597, -35.0003],
    'PAUDALHO': [-7.8842, -35.1792],
    'CARPINA': [-7.8509, -35.2344],
    'ITAPETIM': [-7.3667, -37.2000],
    'TRACUNHAEM': [-7.8056, -35.2264]
}

df_violencia, df_classe, df_horario, df_policiamento, df_punicoes = carregar_dados()

if page == "🏠 Visão Geral":
    st.header("🌍 Visão Geral da Criminalidade")
    
    if df_violencia is not None:
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("📍 Mapa Interativo da Região Metropolitana do Recife")
            
            m = folium.Map(location=[-8.0578, -34.8829], zoom_start=10)
            
            for _, row in df_violencia.iterrows():
                municipio = row['Município']
                total_casos = row['TOTAL']
                
                if municipio in municipios_coords:
                    lat, lon = municipios_coords[municipio]
                    
                    color = 'red' if total_casos > 1000 else 'orange' if total_casos > 500 else 'yellow' if total_casos > 100 else 'green'
                    
                    folium.CircleMarker(
                        location=[lat, lon],
                        radius=max(5, total_casos / 100),
                        popup=f"{municipio}<br>Total de casos: {total_casos}",
                        color=color,
                        fill=True,
                        fillColor=color,
                        fillOpacity=0.7
                    ).add_to(m)
            
            folium_static(m, width=700, height=500)
        
        with col2:
            st.subheader("📊 Principais Indicadores")
            
            total_casos = df_violencia['TOTAL'].sum()
            municipio_mais_casos = df_violencia.loc[df_violencia['TOTAL'].idxmax(), 'Município']
            media_casos = df_violencia['TOTAL'].mean()
            
            st.metric("Total de Casos (Jan-Jul 2025)", f"{total_casos:,}")
            st.metric("Município com Mais Casos", municipio_mais_casos)
            st.metric("Média por Município", f"{media_casos:.0f}")
            
            st.markdown("### 🎨 Legenda do Mapa")
            st.markdown("🔴 **Vermelho**: > 1000 casos")
            st.markdown("🟠 **Laranja**: 500-1000 casos")
            st.markdown("🟡 **Amarelo**: 100-500 casos")
            st.markdown("🟢 **Verde**: < 100 casos")

elif page == "👩 Violência Doméstica":
    st.header("👩‍⚖️ Violência Doméstica e Familiar Contra a Mulher")
    st.markdown("Dados oficiais da Secretaria de Defesa Social de Pernambuco (Janeiro a Julho de 2025)")
    
    if df_violencia is not None:
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("📋 Dados por Município")
            df_display = df_violencia.copy()
            df_display = df_display.sort_values('TOTAL', ascending=False)
            st.dataframe(df_display, use_container_width=True)
        
        with col2:
            st.subheader("📊 Total de Casos por Município")
            fig = px.bar(
                df_violencia.sort_values('TOTAL', ascending=True),
                x='TOTAL',
                y='Município',
                orientation='h',
                title="Casos de Violência Doméstica (Jan-Jul 2025)",
                color='TOTAL',
                color_continuous_scale='Reds'
            )
            fig.update_layout(height=600)
            st.plotly_chart(fig, use_container_width=True)
        
        st.markdown("---")
        
        col3, col4 = st.columns(2)
        
        with col3:
            st.subheader("📈 Evolução Mensal")
            meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL']
            total_mensal = df_violencia[meses].sum()
            
            fig_linha = px.line(
                x=meses,
                y=total_mensal.values,
                title="Evolução dos Casos por Mês (2025)",
                markers=True
            )
            fig_linha.update_traces(line_color='red', line_width=3)
            fig_linha.update_layout(xaxis_title="Mês", yaxis_title="Total de Casos")
            st.plotly_chart(fig_linha, use_container_width=True)
        
        with col4:
            st.subheader("🥧 Distribuição por Município (Top 5)")
            top5 = df_violencia.nlargest(5, 'TOTAL')
            
            fig_pizza = px.pie(
                top5,
                values='TOTAL',
                names='Município',
                title="Top 5 Municípios com Mais Casos"
            )
            st.plotly_chart(fig_pizza, use_container_width=True)
        
        st.markdown("---")
        st.subheader("🔍 Análise Detalhada")
        
        municipio_selecionado = st.selectbox(
            "Selecione um município para análise detalhada:",
            df_violencia['Município'].tolist()
        )
        
        if municipio_selecionado:
            dados_municipio = df_violencia[df_violencia['Município'] == municipio_selecionado].iloc[0]
            
            col5, col6 = st.columns(2)
            
            with col5:
                st.markdown(f"### 📍 {municipio_selecionado}")
                st.metric("Total de Casos", dados_municipio['TOTAL'])
                st.metric("Média Mensal", f"{dados_municipio[meses].mean():.1f}")
                st.metric("Mês com Mais Casos", meses[dados_municipio[meses].idxmax()])
            
            with col6:
                dados_mensais = dados_municipio[meses].values
                fig_municipio = px.bar(
                    x=meses,
                    y=dados_mensais,
                    title=f"Casos Mensais - {municipio_selecionado}",
                    color=dados_mensais,
                    color_continuous_scale='Reds'
                )
                st.plotly_chart(fig_municipio, use_container_width=True)

elif page == "📈 Outras Métricas":
    st.header("📊 Outras Métricas de Criminalidade")
    st.markdown("Análises complementares sobre diversos aspectos da criminalidade na RMR.")
    
    tabs = st.tabs(["💰 Classe Econômica", "🕐 Horário & Clima", "👮 Policiamento", "⚖️ Punições & Resolução"])
    
    with tabs[0]:
        st.subheader("💰 Classe Econômica e Criminalidade")
        
        if df_classe is not None:
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("#### 📊 Correlação Renda vs Criminalidade")
                fig_scatter = px.scatter(
                    df_classe,
                    x='Renda_Media',
                    y='Crimes_Por_Mil_Hab',
                    size='Pop_Vulneravel_Pct',
                    color='Indice_Gini',
                    hover_name='Município',
                    title="Renda Média vs Taxa de Criminalidade",
                    labels={
                        'Renda_Media': 'Renda Média (R$)',
                        'Crimes_Por_Mil_Hab': 'Crimes por Mil Habitantes',
                        'Pop_Vulneravel_Pct': 'População Vulnerável (%)',
                        'Indice_Gini': 'Índice de Gini'
                    }
                )
                st.plotly_chart(fig_scatter, use_container_width=True)
            
            with col2:
                st.markdown("#### 📈 Índice de Desigualdade")
                fig_bar = px.bar(
                    df_classe.sort_values('Indice_Gini', ascending=True),
                    x='Indice_Gini',
                    y='Município',
                    orientation='h',
                    title="Índice de Gini por Município",
                    color='Indice_Gini',
                    color_continuous_scale='Reds'
                )
                st.plotly_chart(fig_bar, use_container_width=True)
            
            st.markdown("#### 📋 Dados Socioeconômicos")
            st.dataframe(df_classe, use_container_width=True)
        else:
            st.error("Dados de classe econômica não disponíveis")
    
    with tabs[1]:
        st.subheader("🕐 Horário e Clima")
        
        if df_horario is not None:
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("#### ⏰ Criminalidade por Horário")
                crimes_por_horario = df_horario.groupby('Horario')['Crimes'].sum().reset_index()
                fig_horario = px.bar(
                    crimes_por_horario,
                    x='Horario',
                    y='Crimes',
                    title="Total de Crimes por Período do Dia",
                    color='Crimes',
                    color_continuous_scale='Blues'
                )
                st.plotly_chart(fig_horario, use_container_width=True)
            
            with col2:
                st.markdown("#### 🌤️ Criminalidade por Clima")
                crimes_por_clima = df_horario.groupby('Clima')['Crimes'].sum().reset_index()
                fig_clima = px.pie(
                    crimes_por_clima,
                    values='Crimes',
                    names='Clima',
                    title="Distribuição de Crimes por Condição Climática"
                )
                st.plotly_chart(fig_clima, use_container_width=True)
            
            st.markdown("#### 🔥 Mapa de Calor: Horário vs Clima")
            pivot_table = df_horario.pivot(index='Horario', columns='Clima', values='Crimes')
            fig_heatmap = px.imshow(
                pivot_table,
                title="Crimes por Horário e Condição Climática",
                color_continuous_scale='Reds'
            )
            st.plotly_chart(fig_heatmap, use_container_width=True)
        else:
            st.error("Dados de horário e clima não disponíveis")
    
    with tabs[2]:
        st.subheader("👮 Policiamento e Grupos Criminosos")
        
        if df_policiamento is not None:
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("#### 👮‍♂️ Efetivo Policial")
                fig_policiais = px.bar(
                    df_policiamento.sort_values('Policiais_Por_Mil_Hab', ascending=True),
                    x='Policiais_Por_Mil_Hab',
                    y='Município',
                    orientation='h',
                    title="Policiais por Mil Habitantes",
                    color='Policiais_Por_Mil_Hab',
                    color_continuous_scale='Blues'
                )
                st.plotly_chart(fig_policiais, use_container_width=True)
            
            with col2:
                st.markdown("#### 🎯 Efetividade Policial")
                fig_efetividade = px.scatter(
                    df_policiamento,
                    x='Operacoes_Mes',
                    y='Efetividade_Pct',
                    size='Prisoes_Mes',
                    hover_name='Município',
                    title="Operações vs Efetividade",
                    labels={
                        'Operacoes_Mes': 'Operações por Mês',
                        'Efetividade_Pct': 'Efetividade (%)',
                        'Prisoes_Mes': 'Prisões por Mês'
                    }
                )
                st.plotly_chart(fig_efetividade, use_container_width=True)
            
            st.markdown("#### 📊 Dados de Policiamento")
            st.dataframe(df_policiamento, use_container_width=True)
        else:
            st.error("Dados de policiamento não disponíveis")
    
    with tabs[3]:
        st.subheader("⚖️ Punições e Resolução")
        
        if df_punicoes is not None:
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("#### ⏱️ Tempo de Resolução")
                fig_tempo = px.bar(
                    df_punicoes,
                    x='Tipo_Crime',
                    y='Tempo_Medio_Resolucao_Dias',
                    title="Tempo Médio de Resolução por Tipo de Crime",
                    color='Tempo_Medio_Resolucao_Dias',
                    color_continuous_scale='Oranges'
                )
                fig_tempo.update_xaxes(tickangle=45)
                st.plotly_chart(fig_tempo, use_container_width=True)
            
            with col2:
                st.markdown("#### 🔍 Taxa de Elucidação")
                fig_elucidacao = px.bar(
                    df_punicoes,
                    x='Tipo_Crime',
                    y='Taxa_Elucidacao_Pct',
                    title="Taxa de Elucidação por Tipo de Crime",
                    color='Taxa_Elucidacao_Pct',
                    color_continuous_scale='Greens'
                )
                fig_elucidacao.update_xaxes(tickangle=45)
                st.plotly_chart(fig_elucidacao, use_container_width=True)
            
            st.markdown("#### 📋 Dados do Sistema de Justiça")
            st.dataframe(df_punicoes, use_container_width=True)
            
            st.markdown("#### 📊 Resumo Executivo")
            col3, col4, col5 = st.columns(3)
            
            with col3:
                tempo_medio_geral = df_punicoes['Tempo_Medio_Resolucao_Dias'].mean()
                st.metric("Tempo Médio Geral", f"{tempo_medio_geral:.0f} dias")
            
            with col4:
                taxa_media_elucidacao = df_punicoes['Taxa_Elucidacao_Pct'].mean()
                st.metric("Taxa Média de Elucidação", f"{taxa_media_elucidacao:.1f}%")
            
            with col5:
                total_condenacoes = df_punicoes['Condenacoes_Ano'].sum()
                st.metric("Total de Condenações/Ano", f"{total_condenacoes:,}")
        else:
            st.error("Dados de punições não disponíveis")

st.sidebar.markdown("---")
st.sidebar.markdown("### 📋 Sobre o Projeto")
st.sidebar.markdown("Análise de dados de violência na Região Metropolitana do Recife com foco em transparência e informação pública.")
st.sidebar.markdown("**Fonte principal**: Secretaria de Defesa Social de Pernambuco")
st.sidebar.markdown("**Dados complementares**: Simulados para fins demonstrativos")

