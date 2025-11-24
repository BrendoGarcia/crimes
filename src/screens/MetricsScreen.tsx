import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/Metrics/MetricCard";
import { CrimeChart } from "@/components/Charts/CrimeChart";
import { violenciaService, Violencia } from "@/services/violenciaService";
import { ChatbotModal } from "@/components/Chatbot/ChatbotModal";
import { getSummaryStats, groupByEstado, getYears, getYearlyTrendData, getFeminicideRate, getFeminicidesCount, getYearlyVariation } from "@/utils/violenciaDataProcessor";

export const MetricsScreen = () => {
  const [selectedYear, setSelectedYear] = useState("2019");
  const [selectedCity, setSelectedCity] = useState("all");
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feminicidesCount, setFeminicidesCount] = useState(0);
  const years = getYears(data);
  const variation = getYearlyVariation(data, selectedYear, "Feminicídio"); 
  const feminicideRate = getFeminicideRate(data, selectedYear, selectedCity);
  const yearlyTrendData = useMemo(
    () => getYearlyTrendData(data), // todos os crimes
    [data]
  );
  const crimesPorEstado = useMemo(() => groupByEstado(data), [data]);
  const estados = [
    { value: "all", label: "Todos os estados" },
    { value: "Pernambuco", label: "Pernambuco" }

  ];

  useEffect(() => {
      async function fetchData() {
        try {
          const response = await violenciaService.getAll();
          setData(response);
          setStats(getSummaryStats(response));
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        } finally {
          setLoading(false);
        }
      }
  
      fetchData();
    }, []);

    useEffect(() => {
    const fetchData = async () => {
      try {
        // aqui já pede pro backend filtrar pelo ano
        const data = await violenciaService.filter({ ano: selectedYear });
        const count = getFeminicidesCount(data);
        setFeminicidesCount(count);
      } catch (err) {
        console.error("Erro ao buscar feminicídios:", err);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Estado com maior número de casos
  const estadoMaiorCasos = useMemo(() => {
    if (!crimesPorEstado.length) return null;
    return crimesPorEstado.reduce((max, curr) => (curr.value > max.value ? curr : max), crimesPorEstado[0]);
  }, [crimesPorEstado]);

  // Percentual de regiões (exemplo: Nordeste)
  const nordesteEstados = ["Pernambuco", "Bahia", "Maranhão", "Ceará", "Rio Grande do Norte", "Paraíba", "Alagoas", "Sergipe"];
  const nordestePercent = useMemo(() => {
    const total = crimesPorEstado.reduce((sum, c) => sum + c.value, 0);
    const nordesteSum = crimesPorEstado
      .filter(c => nordesteEstados.includes(c.name))
      .reduce((sum, c) => sum + c.value, 0);
    return ((nordesteSum / total) * 100).toFixed(0); // ex: 67%
  }, [crimesPorEstado]);

  // Percentual de regiões (exemplo: Sul)
  const sulEstados = ["Paraná", "Santa Catarina", "Rio Grande do Sul"];
  const sulData = useMemo(() => {
  const totalSul = crimesPorEstado
    .filter(c => sulEstados.includes(c.name))
    .reduce((sum, c) => sum + c.value, 0);

  // achar os 2 estados com mais casos no Sul
  const topSul = crimesPorEstado
    .filter(c => sulEstados.includes(c.name))
    .sort((a, b) => b.value - a.value)
    .slice(0, 2);

  return { totalSul, topSul };
  }, [crimesPorEstado]);
  
  if (loading || !stats) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Métricas Gerais - Evolução Temporal
        </h1>
        <p className="text-muted-foreground">
          Análise histórica e comparativa dos indicadores criminais
        </p>
      </div>
      <div>
        <ChatbotModal />
      </div>

      {/* Filters */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ano</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Estados</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

        <h2 className="text-3xl font-bold text-foreground">
          Métricas Gerais - Feminicidio
        </h2>

      {/* Key Metrics for Selected Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={`Feminicídios ${selectedYear}`}
          value={feminicidesCount.toLocaleString("pt-BR")}
          subtitle="178 no ano anterior"
          trend="down"
          variant="critical"
        />
        <MetricCard
          title="Variação Anual"
          value={`${variation.toFixed(1)}%`}
          subtitle={`Comparado a ${Number(selectedYear) - 1}`}
          trend={variation >= 0 ? "up" : "down"}
          variant={variation >= 0 ? "critical" : "warning"} // vermelho se subiu, amarelo se caiu
        />
        <MetricCard
          title="Taxa por outros crimes"
          value={`${feminicideRate.toFixed(1)}%`}
          subtitle="Feminicídios comparado a outros crimes"
          trend="neutral"
        />
        <MetricCard
          title="Ranking Nacional"
          value="8º Mokado"
          subtitle="Posição entre estados"
          trend="up"
        />
      </div>

        <h2 className="text-3xl font-bold text-foreground">
          Métricas Gerais - Outros Crimes
        </h2>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Trend */}
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Evolução Histórica - 2019 a 2023
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-[600px] h-[300px]">
              <CrimeChart
                type="line"
                data={yearlyTrendData}
              />
            </div>
            <div className="mt-4 p-3 bg-gradient-subtle rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Tendência:</span> A taxa média de crimes manteve-se em média muito aproximada desde 2019, com poucas oscilações entre 2019-2023.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado Comparison */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">
            Comparativo por Estados - 2019 a 2023
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CrimeChart
              type="bar"
              data={crimesPorEstado}
              height={300}
            />
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-primary">
                  <h4 className="font-semibold text-foreground">{estadoMaiorCasos.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Maior concentração absoluta ({estadoMaiorCasos.value} casos)
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-crime-warning">
                  <h4 className="font-semibold text-foreground">Região Nordeste</h4>
                  <p className="text-sm text-muted-foreground">
                    {nordestePercent}% dos casos
                  </p>
                </div>

                <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-crime-danger">
                  <h4 className="font-semibold text-foreground">Sul</h4>
                  <p className="text-sm text-muted-foreground">
                    {sulData.topSul.map(s => s.name).join(" e ")} lideram no Sul ({sulData.totalSul} casos)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparative Analysis */}
      <Card className="metric-card bg-gradient-subtle">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Análise Comparativa - {selectedYear}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">{`${variation.toFixed(1)}%`}</div>
                <p className="text-sm text-muted-foreground">{`Comparado a ${Number(selectedYear) - 1}`}</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">{nordestePercent}%</div>
                <p className="text-sm text-muted-foreground">Concentração no estado {estadoMaiorCasos.name}</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">{sulData.totalSul} casos</div>
                <p className="text-sm text-muted-foreground">Estados do Sul {sulData.topSul.map(s => s.name).join(" e ")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};