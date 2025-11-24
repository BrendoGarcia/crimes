import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/Metrics/MetricCard";
import { CrimeChart } from "@/components/Charts/CrimeChart";
import { violenciaService } from "@/services/violenciaService";
import { toast } from "sonner";
import { ChatbotModal } from "@/components/Chatbot/ChatbotModal";

interface SimulationParams {
  year: string;
  ageGroup: string;
  ethnicity: string;
  crimeType: string;
  weaponType: string;
  occurrence: string;
}

interface SimulationResult {
  estimatedCases: number;
  riskLevel: string;
  impactPercentage: number;
  comparison: string;
  baseRate: number; // adicionando baseRate
}

export const SimulationScreen = () => {
  const [params, setParams] = useState<SimulationParams>({
    year: "",
    ageGroup: "",
    ethnicity: "",
    crimeType: "",
    weaponType: "",
    occurrence: ""
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [ethnicities, setEthnicities] = useState<string[]>([]);
  const [crimeTypes, setCrimeTypes] = useState<string[]>([]);
  const [weaponTypes, setWeaponTypes] = useState<string[]>([]);
  const [occurrences, setOccurrences] = useState<string[]>([]);

  // Buscar filtros dinâmicos
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await violenciaService.getAll();
        setAgeGroups([...new Set(data.map(d => d.faixa_etaria))].sort());
        setEthnicities([...new Set(data.map(d => d.raca))].sort());
        setCrimeTypes([...new Set(data.map(d => d.tipo_de_violencia))].sort());
        setWeaponTypes([...new Set(data.map(d => d.arma))].sort());
        setOccurrences([...new Set(data.map(d => d.ocorrencia))].sort());
      } catch (error) {
        console.error("Erro ao buscar filtros:", error);
        toast.error("Falha ao carregar filtros dinâmicos.");
      }
    };
    fetchFilters();
  }, []);

  const runSimulation = async () => {
    if (!params.year) {
      toast.error("Informe o ano da simulação!");
      return;
    }

    try {
      // 1️⃣ Predição pelo modelo
      const response = await violenciaService.predict({
        ano: Number(params.year),
        ocorrencia: params.occurrence,
        tipo_de_violencia: params.crimeType,
        faixa_etaria: params.ageGroup,
        raca: params.ethnicity,
        arma: params.weaponType
      });

      const predictedCases = Number(response.predicao);

      // 2️⃣ Filtra dados históricos para o mesmo cenário
      const filteredData = await violenciaService.filter({
        ano: params.year,
        ocorrencia: params.occurrence,
        tipo_de_violencia: params.crimeType,
        faixa_etaria: params.ageGroup,
        raca: params.ethnicity,
        arma: params.weaponType
      });

      // 3️⃣ Calcula baseRate real
      const baseRate = filteredData.reduce(
        (sum, d) => sum + (d["Suma de Quantidade_de_Casos"] || 0),
        0
      );

      // 4️⃣ Calcula impacto percentual
      const impactPercentage = baseRate ? (predictedCases / baseRate) * 100 : 0;

      // 5️⃣ Calcula nível de risco
      let riskLevel: "Baixo" | "Médio" | "Alto";
      if (impactPercentage >= 120) riskLevel = "Alto";
      else if (impactPercentage >= 80) riskLevel = "Médio";
      else riskLevel = "Baixo";

      // 6️⃣ Comparação com média
      const comparison = baseRate && predictedCases > baseRate ? "acima da média" : "abaixo da média";

      // 7️⃣ Atualiza estado com todas as métricas
      setResult({
        estimatedCases: Math.round(predictedCases),
        riskLevel,
        impactPercentage,
        comparison,
        baseRate
      });
      setShowResult(true);

    } catch (error) {
      console.error("Erro ao executar predição:", error);
      toast.error("Falha ao executar a simulação.");
    }
  };

  const resetSimulation = () => {
    setParams({
      year: "",
      ageGroup: "",
      ethnicity: "",
      crimeType: "",
      weaponType: "",
      occurrence: ""
    });
    setResult(null);
    setShowResult(false);
  };

  const isSimulationReady = Object.values(params).every(value => value !== "");

  const generateResultChart = () => {
    if (!result) return [];
    return [
      { name: 'Cenário Simulado', value: result.estimatedCases, color: 'hsl(0 73% 41%)' },
      { name: 'Casos Restantes', value: Math.max(result.baseRate - result.estimatedCases, 0), color: 'hsl(0 0% 45%)' }
    ];
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Simulação de Cenários</h1>
        <p className="text-muted-foreground">
          Configure parâmetros específicos para simular possíveis cenários criminais
        </p>
      </div>
      <div>
        <ChatbotModal />
      </div>

      {/* Simulation Parameters */}
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Parâmetros da Simulação</CardTitle>
          <Button variant="outline" size="sm" onClick={resetSimulation}>Resetar</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Year */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ano</label>
              <Input 
                placeholder="Digite o ano"
                value={params.year}
                onChange={(e) => setParams(prev => ({ ...prev, year: e.target.value }))}
              />
            </div>

            {/* Age Group */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Faixa Etária</label>
              <Select value={params.ageGroup} onValueChange={(value) => setParams(prev => ({ ...prev, ageGroup: value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione a idade" /></SelectTrigger>
                <SelectContent>
                  {ageGroups.map(age => <SelectItem key={age} value={age}>{age}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Ethnicity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Etnia</label>
              <Select value={params.ethnicity} onValueChange={(value) => setParams(prev => ({ ...prev, ethnicity: value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione a etnia" /></SelectTrigger>
                <SelectContent>
                  {ethnicities.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Crime Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tipo de Crime</label>
              <Select value={params.crimeType} onValueChange={(value) => setParams(prev => ({ ...prev, crimeType: value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o crime" /></SelectTrigger>
                <SelectContent>
                  {crimeTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Weapon Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tipo de Arma</label>
              <Select value={params.weaponType} onValueChange={(value) => setParams(prev => ({ ...prev, weaponType: value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione a arma" /></SelectTrigger>
                <SelectContent>
                  {weaponTypes.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Occurrence */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ocorrência</label>
              <Select value={params.occurrence} onValueChange={(value) => setParams(prev => ({ ...prev, occurrence: value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione a ocorrência" /></SelectTrigger>
                <SelectContent>
                  {occurrences.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={runSimulation} disabled={!isSimulationReady} className="bg-primary hover:bg-primary-hover text-primary-foreground px-8">
              Executar Simulação
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Results and Instructions */}
      {showResult && result && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Casos Estimados" value={result.estimatedCases} subtitle="Para o cenário simulado" variant="critical" />
            <MetricCard title="Nível de Risco" value={result.riskLevel} subtitle="Classificação do cenário" variant={result.riskLevel === "Alto" ? "critical" : "warning"} />
            <MetricCard title="Impacto Percentual" value={`${result.impactPercentage.toFixed(1)}%`} subtitle="Do total de casos" trend={result.impactPercentage > 50 ? "up" : "down"} />
            <MetricCard title="Comparação" value={result.comparison} subtitle="Em relação à média geral" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="metric-card">
              <CardHeader><CardTitle className="text-xl font-bold text-foreground">Resultado da Simulação</CardTitle></CardHeader>
              <CardContent>
                <CrimeChart type="pie" data={generateResultChart()} height={300} />
              </CardContent>
            </Card>

            <Card className="metric-card">
              <CardHeader><CardTitle className="text-xl font-bold text-foreground">Análise Detalhada</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-primary">
                    <h4 className="font-semibold text-foreground">Perfil Simulado</h4>
                    <p className="text-sm text-muted-foreground">{params.ethnicity}, {params.ageGroup}, {params.crimeType}, {params.weaponType}, {params.occurrence}</p>
                  </div>
                  <div className={`p-3 bg-gradient-subtle rounded-lg border-l-4 ${
                    result.riskLevel === "Alto" ? "border-l-primary" : result.riskLevel === "Médio" ? "border-l-crime-warning" : "border-l-crime-neutral"
                  }`}>
                    <h4 className="font-semibold text-foreground">Avaliação de Risco</h4>
                    <p className="text-sm text-muted-foreground">Cenário classificado como <span className="font-semibold">{result.riskLevel}</span> risco</p>
                  </div>
                  <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-crime-danger">
                    <h4 className="font-semibold text-foreground">Impacto Projetado</h4>
                    <p className="text-sm text-muted-foreground">{result.impactPercentage.toFixed(1)}% do total, ficando {result.comparison} estatística geral</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {!showResult && (
        <Card className="metric-card bg-gradient-subtle">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Como Funciona a Simulação</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mx-auto">1</div>
                  <h4 className="font-semibold text-foreground text-center">Configure</h4>
                  <p className="text-sm text-muted-foreground">Selecione todos os parâmetros: Ano, idade, etnia, tipo de crime, arma utilizada e ocorrência.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mx-auto">2</div>
                  <h4 className="font-semibold text-foreground text-center">Execute</h4>
                  <p className="text-sm text-muted-foreground">Clique em "Executar Simulação" O Sistema vai consultar o modelo Ramdom Forest que vai gerar estimativas baseadas no treinamento.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mx-auto">3</div>
                  <h4 className="font-semibold text-foreground text-center">Analise</h4>
                  <p className="text-sm text-muted-foreground">Visualize os resultados, gráficos e insights gerados pela simulação.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
