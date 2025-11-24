import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
def gerar_grafico_pizza(titulo, dados, caminho_saida):
    labels = list(dados.keys())
    valores = list(dados.values())

    plt.figure(figsize=(6, 6))
    plt.pie(valores, labels=labels, autopct='%1.1f%%')
    plt.title(titulo)
    plt.tight_layout()
    plt.savefig(caminho_saida)
    plt.close()


def gerar_grafico_barras(titulo, dados, caminho_saida):
    labels = list(dados.keys())
    valores = list(dados.values())

    plt.figure(figsize=(8, 6))
    plt.bar(labels, valores)
    plt.title(titulo)
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.savefig(caminho_saida)
    plt.close()
