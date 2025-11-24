from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4

from utins.report_charts import gerar_grafico_pizza, gerar_grafico_barras

def gerar_pdf_relatorio(resumo, caminho_pdf="/tmp/relatorio.pdf"):

    styles = getSampleStyleSheet()
    story = []

    titulo = f"Relatório Analítico - {', '.join(resumo['dados']['Ocorrencias'])}"
    story.append(Paragraph(f"<b>{titulo}</b>", styles["Title"]))
    story.append(Spacer(1, 20))

    total = resumo["dados"]["Soma de Quantidade_de_Casos"]
    story.append(Paragraph(f"Total de casos encontrados: <b>{total}</b>", styles["Normal"]))
    story.append(Spacer(1, 20))

    # --- GRÁFICO DE RAÇA ---
    racas = resumo["dados"]["Racas"]
    racas_contagem = {r: 1 for r in racas}
    caminho_raca = "/tmp/grafico_raca.png"
    gerar_grafico_pizza("Distribuição por Raça", racas_contagem, caminho_raca)
    story.append(Image(caminho_raca, width=350, height=350))
    story.append(Spacer(1, 20))

    # --- GRÁFICO DE FAIXA ETÁRIA ---
    faixas = resumo["dados"]["Faixas_Etarias"]
    faixas_contagem = {f: 1 for f in faixas}
    caminho_faixa = "/tmp/grafico_faixa_etaria.png"
    gerar_grafico_pizza("Faixas Etárias", faixas_contagem, caminho_faixa)
    story.append(Image(caminho_faixa, width=350, height=350))
    story.append(Spacer(1, 20))

    # --- GRÁFICO ANUAL ---
    anos = resumo["dados"]["Anos"]
    anos_contagem = {str(a): 1 for a in anos}
    caminho_anos = "/tmp/grafico_anos.png"
    gerar_grafico_barras("Distribuição por Ano", anos_contagem, caminho_anos)
    story.append(Image(caminho_anos, width=350, height=350))
    story.append(Spacer(1, 20))

    doc = SimpleDocTemplate(caminho_pdf, pagesize=A4)
    doc.build(story)

    return caminho_pdf
