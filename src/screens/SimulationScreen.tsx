import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/Metrics/MetricCard";
import { CrimeChart } from "@/components/Charts/CrimeChart";

interface SimulationParams {
  ageGroup: string;
  ethnicity: string;
  crimeType: string;
  weaponType: string;
}

interface SimulationResult {
  estimatedCases: number;
  riskLevel: string;
  impactPercentage: number;
  comparison: string;
}

export const SimulationScreen = () => {
  const [params, setParams] = useState<SimulationParams>({
    ageGroup: "",
    ethnicity: "",
    crimeType: "",
    weaponType: ""
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const runSimulation = () => {
    // Mock simulation logic
    const baseRate = 156; // Total feminicides
    let estimatedCases = baseRate;
    
    // Apply demographic factors
    if (params.ageGroup === "26-35") estimatedCases *= 0.43;
    else if (params.ageGroup === "18-25") estimatedCases *= 0.29;
    else if (params.ageGroup === "36-45") estimatedCases *= 0.20;
    else estimatedCases *= 0.08;

    if (params.ethnicity === "Parda") estimatedCases *= 1.2;
    else if (params.ethnicity === "Preta") estimatedCases *= 1.1;
    else estimatedCases *= 0.8;

    if (params.weaponType === "Arma de Fogo") estimatedCases *= 1.3;
    else if (params.weaponType === "Arma Branca") estimatedCases *= 0.8;

    estimatedCases = Math.round(estimatedCases);
    const impactPercentage = ((estimatedCases / baseRate) * 100);
    
    const riskLevel = estimatedCases > 80 ? "Alto" : estimatedCases > 40 ? "Médio" : "Baixo";
    const comparison = estimatedCases > baseRate * 0.5 ? "acima da média" : "abaixo da média";

    setResult({
      estimatedCases,
      riskLevel,
      impactPercentage,
      comparison
    });
    setShowResult(true);
  };

  const resetSimulation = () => {
    setParams({
      ageGroup: "",
      ethnicity: "",
      crimeType: "",
      weaponType: ""
    });
    setResult(null);
    setShowResult(false);
  };

  const isSimulationReady = Object.values(params).every(value => value !== "");

  const generateResultChart = () => {
    if (!result) return [];
    
    return [
      { name: 'Cenário Simulado', value: result.estimatedCases, color: 'hsl(0 73% 41%)' },
      { name: 'Casos Restantes', value: 156 - result.estimatedCases, color: 'hsl(0 0% 45%)' }
    ];
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Simulação de Cenários
        </h1>
        <p className="text-muted-foreground">
          Configure parâmetros específicos para simular possíveis cenários criminais
        </p>
      </div>

      {/* Simulation Parameters */}
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Parâmetros da Simulação
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetSimulation}
            className="text-muted-foreground hover:text-foreground"
          >
            Resetar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Age Group */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Faixa Etária</label>
              <Select value={params.ageGroup} onValueChange={(value) => 
                setParams(prev => ({ ...prev, ageGroup: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a idade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-25">18-25 anos</SelectItem>
                  <SelectItem value="26-35">26-35 anos</SelectItem>
                  <SelectItem value="36-45">36-45 anos</SelectItem>
                  <SelectItem value="46-55">46-55 anos</SelectItem>
                  <SelectItem value="56+">56+ anos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ethnicity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Etnia</label>
              <Select value={params.ethnicity} onValueChange={(value) => 
                setParams(prev => ({ ...prev, ethnicity: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a etnia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parda">Parda</SelectItem>
                  <SelectItem value="Preta">Preta</SelectItem>
                  <SelectItem value="Branca">Branca</SelectItem>
                  <SelectItem value="Indígena">Indígena</SelectItem>
                  <SelectItem value="Amarela">Amarela</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Crime Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tipo de Crime</label>
              <Select value={params.crimeType} onValueChange={(value) => 
                setParams(prev => ({ ...prev, crimeType: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o crime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Feminicídio">Feminicídio</SelectItem>
                  <SelectItem value="Homicídio">Homicídio</SelectItem>
                  <SelectItem value="Lesão Corporal">Lesão Corporal</SelectItem>
                  <SelectItem value="Estupro">Estupro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Weapon Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tipo de Arma</label>
              <Select value={params.weaponType} onValueChange={(value) => 
                setParams(prev => ({ ...prev, weaponType: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a arma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arma de Fogo">Arma de Fogo</SelectItem>
                  <SelectItem value="Arma Branca">Arma Branca</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button 
              onClick={runSimulation}
              disabled={!isSimulationReady}
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-8"
            >
              Executar Simulação
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Results */}
      {showResult && result && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Casos Estimados"
              value={result.estimatedCases}
              subtitle="Para o cenário simulado"
              variant="critical"
            />
            <MetricCard
              title="Nível de Risco"
              value={result.riskLevel}
              subtitle="Classificação do cenário"
              variant={result.riskLevel === "Alto" ? "critical" : "warning"}
            />
            <MetricCard
              title="Impacto Percentual"
              value={`${result.impactPercentage.toFixed(1)}%`}
              subtitle="Do total de casos"
              trend={result.impactPercentage > 50 ? "up" : "down"}
            />
            <MetricCard
              title="Comparação"
              value={result.comparison}
              subtitle="Em relação à média geral"
            />
          </div>

          {/* Results Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Result Chart */}
            <Card className="metric-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Resultado da Simulação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CrimeChart
                  type="pie"
                  data={generateResultChart()}
                  height={300}
                />
                <div className="mt-4 p-3 bg-gradient-subtle rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Estimativa:</span> 
                    {result.estimatedCases} casos para o perfil simulado 
                    ({result.impactPercentage.toFixed(1)}% do total)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Card className="metric-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Análise Detalhada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-primary">
                    <h4 className="font-semibold text-foreground">Perfil Simulado</h4>
                    <p className="text-sm text-muted-foreground">
                      {params.ethnicity}, {params.ageGroup}, {params.crimeType}, {params.weaponType}
                    </p>
                  </div>
                  
                  <div className={`p-3 bg-gradient-subtle rounded-lg border-l-4 ${
                    result.riskLevel === "Alto" ? "border-l-primary" : 
                    result.riskLevel === "Médio" ? "border-l-crime-warning" : "border-l-crime-neutral"
                  }`}>
                    <h4 className="font-semibold text-foreground">Avaliação de Risco</h4>
                    <p className="text-sm text-muted-foreground">
                      Cenário classificado como <span className="font-semibold">{result.riskLevel}</span> risco
                      com base nos parâmetros selecionados
                    </p>
                  </div>

                  <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-crime-danger">
                    <h4 className="font-semibold text-foreground">Impacto Projetado</h4>
                    <p className="text-sm text-muted-foreground">
                      Este perfil representa {result.impactPercentage.toFixed(1)}% dos casos totais,
                      ficando {result.comparison} estatística geral
                    </p>
                  </div>
                </div>

                {/* Scenario Parameters Summary */}
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-foreground mb-2">Parâmetros Utilizados:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Idade:</span> <span className="text-foreground">{params.ageGroup}</span></div>
                    <div><span className="text-muted-foreground">Etnia:</span> <span className="text-foreground">{params.ethnicity}</span></div>
                    <div><span className="text-muted-foreground">Crime:</span> <span className="text-foreground">{params.crimeType}</span></div>
                    <div><span className="text-muted-foreground">Arma:</span> <span className="text-foreground">{params.weaponType}</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Simulation Insights */}
          <Card className="metric-card bg-gradient-subtle">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Insights da Simulação
                </h3>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                  {result.riskLevel === "Alto" ? (
                    <>
                      A simulação indica um cenário de <strong>alto risco</strong> com {result.estimatedCases} casos 
                      estimados. Este perfil demográfico apresenta vulnerabilidade elevada e requer 
                      atenção especial das políticas de prevenção.
                    </>
                  ) : result.riskLevel === "Médio" ? (
                    <>
                      O cenário simulado apresenta <strong>risco moderado</strong> com {result.estimatedCases} casos 
                      estimados. Embora não seja o grupo mais vulnerável, ainda necessita de 
                      medidas preventivas direcionadas.
                    </>
                  ) : (
                    <>
                      A simulação indica um cenário de <strong>baixo risco</strong> com {result.estimatedCases} casos 
                      estimados. Este perfil apresenta menor vulnerabilidade estatística, mas 
                      ainda requer monitoramento.
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Instructions Card (when no simulation has been run) */}
      {!showResult && (
        <Card className="metric-card bg-gradient-subtle">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Como Funciona a Simulação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mx-auto">1</div>
                  <h4 className="font-semibold text-foreground text-center">Configure</h4>
                  <p className="text-sm text-muted-foreground">
                    Selecione todos os parâmetros: idade, etnia, tipo de crime e arma utilizada.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mx-auto">2</div>
                  <h4 className="font-semibold text-foreground text-center">Execute</h4>
                  <p className="text-sm text-muted-foreground">
                    Clique em "Executar Simulação" para gerar estimativas baseadas nos dados históricos.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mx-auto">3</div>
                  <h4 className="font-semibold text-foreground text-center">Analise</h4>
                  <p className="text-sm text-muted-foreground">
                    Visualize os resultados, gráficos e insights gerados pela simulação.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};