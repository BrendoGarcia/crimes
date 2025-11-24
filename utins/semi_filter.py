def semi_filter(data: list, user_message: str):
    """
    Resume e agrupa os dados filtrados com base na pergunta do usuário.
    Detecta automaticamente qual agregação ou resumo retornar.
    """
    if not data:
        return {"mensagem": "Nenhum dado encontrado para os filtros aplicados."}

    # 🔹 Resumo geral (sempre disponível)
    resumo = {
        "Soma de Quantidade_de_Casos": sum(d.get("Suma de Quantidade_de_Casos", 0) for d in data),
        "Ocorrencias": list({d.get("ocorrencia", "Não especificado") for d in data}),
        "Faixas_Etarias": list({d.get("faixa_etaria", "Não especificado") for d in data}),
        "Tipos_de_Violencia": list({d.get("tipo_de_violencia", "Não especificado") for d in data}),
        "Anos": list({d.get("ano", "Não especificado") for d in data}),
        "Armas": list({d.get("arma", "Não especificado") for d in data}),
        "Racas": list({d.get("raca", "Não especificado") for d in data}),
        "Estados": list({d.get("estado", "Não especificado") for d in data}),
    }

    pergunta = user_message.lower()

    # 🔸 1. Casos quantitativos
    if "quantos" in pergunta or "total" in pergunta:
        total = resumo["Soma de Quantidade_de_Casos"]
        return {"resumo": f"Total de casos encontrados: {total}", "dados": resumo}

    # 🔸 2. Faixa etária
    if "faixa etária" in pergunta or "idade" in pergunta:
        grupos = {}
        for d in data:
            faixa = d.get("faixa_etaria", "Não especificado")
            grupos[faixa] = grupos.get(faixa, 0) + d.get("Suma de Quantidade_de_Casos", 0)
        top = max(grupos.items(), key=lambda x: x[1])
        return {"resumo": f"Faixa etária com mais casos: {top[0]} ({top[1]} casos)", "dados": grupos}

    # 🔸 3. Raça
    if "raça" in pergunta or "etnia" in pergunta:
        grupos = {}
        for d in data:
            raca = d.get("raca", "Não especificado")
            grupos[raca] = grupos.get(raca, 0) + d.get("Suma de Quantidade_de_Casos", 0)
        top = max(grupos.items(), key=lambda x: x[1])
        return {"resumo": f"Raça mais afetada: {top[0]} ({top[1]} casos)", "dados": grupos}

    # 🔸 4. Tipo de violência
    if "tipo" in pergunta or "violência" in pergunta:
        grupos = {}
        for d in data:
            tipo = d.get("tipo_de_violencia", "Não especificado")
            grupos[tipo] = grupos.get(tipo, 0) + d.get("Suma de Quantidade_de_Casos", 0)
        top = max(grupos.items(), key=lambda x: x[1])
        return {"resumo": f"Tipo de violência mais comum: {top[0]} ({top[1]} casos)", "dados": grupos}

    # 🔸 5. Estado
    if "estado" in pergunta or "local" in pergunta:
        grupos = {}
        for d in data:
            estado = d.get("estado", "Não especificado")
            grupos[estado] = grupos.get(estado, 0) + d.get("Suma de Quantidade_de_Casos", 0)
        top = max(grupos.items(), key=lambda x: x[1])
        return {"resumo": f"Estado com mais casos: {top[0]} ({top[1]} casos)", "dados": grupos}

    # 🔸 6. Ocorrência
    if "ocorrência" in pergunta or "crime" in pergunta:
        grupos = {}
        for d in data:
            ocorrencia = d.get("ocorrencia", "Não especificado")
            grupos[ocorrencia] = grupos.get(ocorrencia, 0) + d.get("Suma de Quantidade_de_Casos", 0)
        top = max(grupos.items(), key=lambda x: x[1])
        return {"resumo": f"Ocorrência mais comum: {top[0]} ({top[1]} casos)", "dados": grupos}

    # 🔸 Default (sem intenção clara)
    total = resumo["Soma de Quantidade_de_Casos"]
    return {"resumo": f"Foram encontrados {total} casos relevantes.", "dados": resumo}
