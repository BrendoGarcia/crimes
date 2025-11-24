import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/Metrics/MetricCard";
import { CrimeChart } from "@/components/Charts/CrimeChart";
import {  getSummaryStats, getCrimesViolentosCount, getCrimesViolentosEDanosCount, groupByOcorrencia, getFeminicidesCount, getCrimesSexuaisCount } from "@/utils/violenciaDataProcessor";
import { violenciaService, Violencia } from "@/services/violenciaService";
import { ChatbotModal } from "@/components/Chatbot/ChatbotModal";

interface OverviewScreenProps {
  onNavigate: (screen: string) => void;
}

export const OverviewScreen = ({ onNavigate }: OverviewScreenProps) => {
  const [data, setData] = useState<Violencia[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const feminicidesCount = getFeminicidesCount(data);
  const crimessexuais = getCrimesSexuaisCount(data);
  const violentCrimes = getCrimesViolentosEDanosCount(data);


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


  if (loading || !stats) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Métricas e análises das violências contra a mulher no estado de pernambuco
        </h1>
        <p className="text-muted-foreground">
          Análise baseada em dados entre 2019 - 2023 • Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
      <div>
        <ChatbotModal />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Crimes"
          value={stats.totalCrimes.toLocaleString('pt-BR')}
          subtitle="Registrados entre 2019 - 2023"
          variant="critical"
        />
        <MetricCard
          title="Feminicídios"
          value={feminicidesCount.toLocaleString('pt-BR')}
          subtitle="Casos confirmados"
          trend="down"
          variant="critical"
        />
        <MetricCard
          title="Crimes Violentos"
          value={violentCrimes.toLocaleString('pt-BR')}
          subtitle="Homicídios + Lesões"
          trend="neutral"
        />
        <MetricCard
          title="Crimes Sexuais"
          value={crimessexuais.toLocaleString('pt-BR')}
          subtitle="Estupro + Assédio Sexual + Importunação Sexual"
          trend="up"
          variant="warning"
        />
      </div>

      {/* Main Chart and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crime Distribution Chart */}
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Distribuição por Tipo de Crime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CrimeChart
              type="bar"
              data={data ? groupByOcorrencia(data).sort((a, b) => b.value - a.value) : []}
              height={350}
            />
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Principais Indicadores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-primary">
                <h4 className="font-semibold text-foreground">Grupo Mais Afetado</h4>
                <p className="text-sm text-muted-foreground">
                  Mulheres de {stats.mostAffectedAge}, {stats.mostAffectedEthnicity.toLowerCase()}s
                </p>
              </div>
              
              <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-crime-warning">
                <h4 className="font-semibold text-foreground">Período Crítico</h4>
                <p className="text-sm text-muted-foreground">
                  {stats.peakYear} registra o maior número de casos
                </p>
              </div>

              <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-crime-danger">
                <h4 className="font-semibold text-foreground">Nível de Risco</h4>
                <p className="text-sm text-muted-foreground">
                  Classificação atual: <span className="font-semibold text-primary">{stats.riskLevel}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => onNavigate('analysis')}
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                Ver Detalhes
              </Button>
              <Button 
                onClick={() => onNavigate('simulation')}
                variant="outline"
                className="flex-1"
              >
                Simular Cenários
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Summary */}
      <Card className="metric-card bg-gradient-subtle">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Resumo Executivo
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Entre 2019 - 2023, Pernambuco registrou {stats.totalCrimes.toLocaleString('pt-BR')} crimes, 
              com {feminicidesCount.toLocaleString('pt-BR')} casos de feminicídio. A análise revela concentração em 
              determinados grupos demográficos e períodos, indicando a necessidade de 
              políticas públicas direcionadas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};