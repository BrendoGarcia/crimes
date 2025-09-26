// src/utils/violenciaDataProcessor.ts
import { Violencia } from "../services/violenciaService";

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}
// Função para buscar os anos disponíveis
export const getYears = (data: Violencia[]): string[] => {
  const years = new Set<string>();
  data.forEach(d => {
    if (d.ano) {
      years.add(d.ano.toString());
    }
  });
  return Array.from(years);
};

// Função para agrupar por tipo de violência
export const groupByTipoViolencia = (data: Violencia[]): ChartData[] => {
  const grouped: Record<string, number> = {};

  data.forEach(d => {
    const key = d.tipo_de_violencia || "Outros";
    grouped[key] = (grouped[key] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
  });

  return Object.entries(grouped).map(([name, value], i) => ({
    name,
    value,
    color: `hsl(${(i * 50) % 360} 70% 50%)` // gera cores diferentes
  }));
};

// Função para calcular feminicídios
export const getFeminicidesCount = (data: Violencia[]) => {
  return data
    .filter(d => d.ocorrencia === "Feminicídio") // filtra apenas feminicídios
    .reduce((sum, d) => sum + (d["Suma de Quantidade_de_Casos"] || 0), 0);
};

// Função para calcular crimes sexuais
export const getCrimesSexuaisCount = (data: Violencia[]) => {
  return data
    .filter(d => d.ocorrencia === "Estupro" || d.ocorrencia === "Assédio Sexual" || d.ocorrencia === "Importunação Sexual") // filtra apenas crimes sexuais
    .reduce((sum, d) => sum + (d["Suma de Quantidade_de_Casos"] || 0), 0);
}

// Função para calcular crimes violentos
export const getCrimesViolentosCount = (data: Violencia[]) => {
  return data
    .filter(d => d.ocorrencia === "Feminicídio") // filtra apenas crimes violentos, excluindo feminicídios
    .reduce((sum, d) => sum + (d["Suma de Quantidade_de_Casos"] || 0), 0);
};


export const getTotalCrimes = (data: Violencia[]) => {
  return data.reduce((sum, d) => sum + (d["Suma de Quantidade_de_Casos"] || 0), 0);
};

// Função para agrupar por ocorrência
export const groupByOcorrencia = (data: Violencia[]): ChartData[] => {
  const grouped: Record<string, number> = {};

  data.forEach(d => {
    const key = d.ocorrencia || "Outros";
    grouped[key] = (grouped[key] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
  });

  return Object.entries(grouped).map(([name, value], i) => ({
    name,
    value,
    color: `hsl(${(i * 40) % 360} 70% 50%)` // gera cores diferentes
  }));
};


// Função para agrupar por ano
export const groupByAno = (data: Violencia[]): ChartData[] => {
  const grouped: Record<number, number> = {};
  data.forEach(d => {
    const year = d.ano || 0;
    grouped[year] = (grouped[year] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
  });

  return Object.entries(grouped)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([name, value]) => ({ name, value }));
};

// Função para agrupar por faixa etária
export const groupByFaixaEtaria = (data: Violencia[]): ChartData[] => {
  const grouped: Record<string, number> = {};
  data.forEach(d => {
    const key = d.faixa_etaria || "Desconhecido";
    grouped[key] = (grouped[key] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
  });

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};

// Função para agrupar por raça/etnia
export const groupByRaca = (data: Violencia[]): ChartData[] => {
  const grouped: Record<string, number> = {};
  data.forEach(d => {
    const key = d.raca || "Desconhecida";
    grouped[key] = (grouped[key] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
  });

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};

// Função para agrupar por arma
export const groupByArma = (data: Violencia[]): ChartData[] => {
  const grouped: Record<string, number> = {};
  data.forEach(d => {
    const key = d.arma || "Não Especificado";
    grouped[key] = (grouped[key] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
  });

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};

// Função para agrupar por cidade/estado
export const groupByEstado = (data: Violencia[]): ChartData[] => {
  const grouped: Record<string, number> = {};
  data.forEach(d => {
    const key = d.estado || "Desconhecido";
    grouped[key] = (grouped[key] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
  });

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};

// Função para gerar estatísticas resumidas
export const getSummaryStats = (data: Violencia[]) => {
  const totalCrimes = data.reduce((acc, d) => acc + (d["Suma de Quantidade_de_Casos"] || 0), 0);
  const mostAffected = getMostAffectedGroup(data);
  const criticalPeriod = getCriticalPeriod(data);
  const risk = getRiskLevel(data);
  const feminicides = data
    .filter(d => d.tipo_de_violencia?.toLowerCase().includes("feminicídio"))
    .reduce((acc, d) => acc + (d["Suma de Quantidade_de_Casos"] || 0), 0);

  const violentCrimes = data
    .filter(d => d.tipo_de_violencia?.toLowerCase() !== "feminicídio")
    .reduce((acc, d) => acc + (d["Suma de Quantidade_de_Casos"] || 0), 0);

  const ageGroups = groupByFaixaEtaria(data);
  const mostAffectedAge = ageGroups.sort((a, b) => b.value - a.value)[0]?.name || "Desconhecida";

  const ethnicityGroups = groupByRaca(data);
  const mostAffectedEthnicity = ethnicityGroups.sort((a, b) => b.value - a.value)[0]?.name || "Desconhecida";

  const monthlyGroups = data.filter(d => d.ano).reduce((acc: Record<string, number>, d) => {
    const month = new Date(d.ano, 0, 1).toLocaleString("pt-BR", { month: "long" });
    acc[month] = (acc[month] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
    return acc;
  }, {});
  const peakMonth = Object.entries(monthlyGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || "Desconhecido";

  return {
    totalCrimes,
    feminicides,
    violentCrimes,
    mostAffectedAge,
    mostAffectedEthnicity,
    peakYear: criticalPeriod.ano,
    peakCases: criticalPeriod.casos,
    riskLevel: risk.riskLevel,
    riskScore: risk.riskScore

  };
};

// Função para encontrar o grupo mais afetado (combinação faixa etária + raça)
export const getMostAffectedGroup = (data: Violencia[]) => {
  const grouped: Record<string, number> = {};

  data.forEach(d => {
    if (d.sexo === "Mulher") { // só mulheres
      const key = `${d.faixa_etaria}_${d.raca}`;
      grouped[key] = (grouped[key] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
    }
  });

  const [topKey, casos] = Object.entries(grouped).sort((a, b) => b[1] - a[1])[0] || ["Desconhecida_Desconhecida", 0];
  const [faixa_etaria, raca] = topKey.split("_");

  return { faixa_etaria, raca, casos };
};


// Função para encontrar o ano mais crítico
export const getCriticalPeriod = (data: Violencia[]) => {
  const grouped: Record<number, number> = {};

  data.forEach(d => {
    if (d.ano) {
      grouped[d.ano] = (grouped[d.ano] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
    }
  });

  const [ano, casos] = Object.entries(grouped).sort((a, b) => Number(b[1]) - Number(a[1]))[0] || ["Desconhecido", 0];
  return { ano, casos };
};

// Função para calcular nível de risco (0–100) e classificação
export const getRiskLevel = (data: Violencia[]) => {
  const grouped: Record<string, number> = {};

  data.forEach(d => {
    if (d.sexo === "Mulher") {
      const key = `${d.faixa_etaria}_${d.raca}`;
      grouped[key] = (grouped[key] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
    }
  });

  const valores = Object.values(grouped);
  if (valores.length === 0) return { riskScore: 0, riskLevel: "Baixo" };

  const maxValue = Math.max(...valores);
  const riskScore = (maxValue / maxValue) * 100; // sempre 100 para o mais afetado

  let riskLevel: string;
  if (riskScore >= 80) riskLevel = "Alto";
  else if (riskScore >= 50) riskLevel = "Médio";
  else riskLevel = "Baixo";

  return { riskScore, riskLevel };
};

// Calcula a variação percentual entre dois anos
export const getYearlyVariation = (
  data: Violencia[],
  year: string | number,
  ocorrencia?: string
): number => {
  const currentYear = data.filter(
    d => d.ano?.toString() === year.toString() && (!ocorrencia || d.ocorrencia === ocorrencia)
  );

  const previousYear = data.filter(
    d => d.ano?.toString() === (Number(year) - 1).toString() && (!ocorrencia || d.ocorrencia === ocorrencia)
  );

  const currentTotal = currentYear.reduce((sum, d) => sum + (d["Suma de Quantidade_de_Casos"] || 0), 0);
  const previousTotal = previousYear.reduce((sum, d) => sum + (d["Suma de Quantidade_de_Casos"] || 0), 0);

  if (previousTotal === 0) return 0;

  return ((currentTotal - previousTotal) / previousTotal) * 100;
};

// Calcula a taxa de feminicídios em relação a outros crimes
export const getFeminicideRate = (
  data: Violencia[],
  year?: string | number,
  estado?: string | "all"
): number => {
  // dados filtrados por ano/estado
  const filtered = data.filter(d => 
    (!year || d.ano?.toString() === year.toString()) &&
    (!estado || estado === "all" || String(d.estado).toLowerCase() === String(estado).toLowerCase())
  );

  const feminicides = filtered
    .filter(d => String(d.ocorrencia || "").toLowerCase().includes("feminic"))
    .reduce((sum, d) => sum + (d["Suma de Quantidade_de_Casos"] || 0), 0);

  const otherCrimes = filtered
    .filter(d => !String(d.ocorrencia || "").toLowerCase().includes("feminic"))
    .reduce((sum, d) => sum + (d["Suma de Quantidade_de_Casos"] || 0), 0);

  if (otherCrimes === 0) return 0;

  // taxa: feminicídios / outros crimes
  return (feminicides / otherCrimes) * 100; // retorna percentual
};

// Agrupa os dados por ano e retorna array pronto para o gráfico
export const getYearlyTrendData = (
  data: Violencia[],
  ocorrencia?: string, // opcional, filtra por tipo de crime (ex: "Feminicídio")
  estado?: string | "all"
) => {
  const grouped: Record<string, number> = {};

  data.forEach(d => {
    // filtro opcional por ano/ocorrencia/estado
    const matchesCrime = ocorrencia ? String(d.ocorrencia).toLowerCase().includes(ocorrencia.toLowerCase()) : true;
    const matchesEstado = !estado || estado === "all" || String(d.estado).toLowerCase() === String(estado).toLowerCase();

    if (d.ano && matchesCrime && matchesEstado) {
      grouped[String(d.ano)] = (grouped[String(d.ano)] || 0) + (d["Suma de Quantidade_de_Casos"] || 0);
    }
  });

  // transformar em array de objetos { name: ano, value: total }
  return Object.entries(grouped)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, value]) => ({
      name: year,
      value
    }));
};
