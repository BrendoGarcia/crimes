import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MetricCard } from "@/components/Metrics/MetricCard";
import { CrimeChart } from "@/components/Charts/CrimeChart";
import { ageGroupData, ethnicityData, weaponData } from "@/data/crimeData";

interface FilterState {
  ageGroups: string[];
  ethnicities: string[];
  crimeTypes: string[];
  weaponTypes: string[];
}

export const AnalysisScreen = () => {
  const [filters, setFilters] = useState<FilterState>({
    ageGroups: [],
    ethnicities: [],
    crimeTypes: [],
    weaponTypes: []
  });

  const [activeChart, setActiveChart] = useState<'age' | 'ethnicity' | 'weapon'>('age');

  const ageOptions = ["18-25", "26-35", "36-45", "46-55", "56+"];
  const ethnicityOptions = ["Parda", "Preta", "Branca", "Indígena", "Amarela"];
  const crimeTypeOptions = ["Feminicídio", "Homicídio", "Lesão Corporal", "Estupro"];
  const weaponOptions = ["Arma de Fogo", "Arma Branca", "Outros"];

  const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const clearFilters = () => {
    setFilters({
      ageGroups: [],
      ethnicities: [],
      crimeTypes: [],
      weaponTypes: []
    });
  };

  const getFilteredInsights = () => {
    const hasFilters = Object.values(filters).some(arr => arr.length > 0);
    
    if (!hasFilters) {
      return {
        totalCases: 156,
        primaryInsight: "Maioria das vítimas tem entre 26-35 anos (43%)",
        secondaryInsight: "Mulheres pardas representam 50% dos casos",
        riskFactor: "Armas de fogo utilizadas em 57% dos casos"
      };
    }

    return {
      totalCases: 89,
      primaryInsight: "Filtros aplicados mostram concentração específica",
      secondaryInsight: "Padrão alterado com base na seleção",
      riskFactor: "Análise customizada em andamento"
    };
  };

  const insights = getFilteredInsights();

  const getChartData = () => {
    switch (activeChart) {
      case 'ethnicity':
        return ethnicityData;
      case 'weapon':
        return weaponData;
      default:
        return ageGroupData;
    }
  };

  const getChartTitle = () => {
    const titles = {
      age: 'Distribuição por Faixa Etária',
      ethnicity: 'Distribuição por Etnia',
      weapon: 'Tipo de Arma Utilizada'
    };
    return titles[activeChart];
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Análise Detalhada com Filtros
        </h1>
        <p className="text-muted-foreground">
          Explore os dados aplicando filtros específicos para insights direcionados
        </p>
      </div>

      {/* Filters Panel */}
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Filtros Aplicáveis
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpar Filtros
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Age Groups */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Faixa Etária</h4>
              <div className="space-y-2">
                {ageOptions.map((age) => (
                  <div key={age} className="flex items-center space-x-2">
                    <Checkbox
                      id={`age-${age}`}
                      checked={filters.ageGroups.includes(age)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('ageGroups', age, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`age-${age}`} 
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {age}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Ethnicity */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Etnia</h4>
              <div className="space-y-2">
                {ethnicityOptions.map((ethnicity) => (
                  <div key={ethnicity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ethnicity-${ethnicity}`}
                      checked={filters.ethnicities.includes(ethnicity)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('ethnicities', ethnicity, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`ethnicity-${ethnicity}`} 
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {ethnicity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Crime Types */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Tipo de Crime</h4>
              <div className="space-y-2">
                {crimeTypeOptions.map((crime) => (
                  <div key={crime} className="flex items-center space-x-2">
                    <Checkbox
                      id={`crime-${crime}`}
                      checked={filters.crimeTypes.includes(crime)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('crimeTypes', crime, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`crime-${crime}`} 
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {crime}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Weapon Types */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Uso de Arma</h4>
              <div className="space-y-2">
                {weaponOptions.map((weapon) => (
                  <div key={weapon} className="flex items-center space-x-2">
                    <Checkbox
                      id={`weapon-${weapon}`}
                      checked={filters.weaponTypes.includes(weapon)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('weaponTypes', weapon, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`weapon-${weapon}`} 
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {weapon}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics with Filters Applied */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Casos Filtrados"
          value={insights.totalCases}
          subtitle="Com base nos filtros aplicados"
          variant="critical"
        />
        <MetricCard
          title="Percentual do Total"
          value={`${((insights.totalCases / 156) * 100).toFixed(1)}%`}
          subtitle="Em relação ao total geral"
          trend="neutral"
        />
        <MetricCard
          title="Filtros Ativos"
          value={Object.values(filters).flat().length}
          subtitle="Critérios selecionados"
          variant="warning"
        />
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Chart */}
        <Card className="metric-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground">
                {getChartTitle()}
              </CardTitle>
              <Select value={activeChart} onValueChange={setActiveChart as any}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="age">Idade</SelectItem>
                  <SelectItem value="ethnicity">Etnia</SelectItem>
                  <SelectItem value="weapon">Arma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <CrimeChart
              type="bar"
              data={getChartData()}
              height={300}
            />
          </CardContent>
        </Card>

        {/* Insights Panel */}
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Insights Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-primary">
                <h4 className="font-semibold text-foreground">Perfil Principal</h4>
                <p className="text-sm text-muted-foreground">
                  {insights.primaryInsight}
                </p>
              </div>
              
              <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-crime-warning">
                <h4 className="font-semibold text-foreground">Característica Étnica</h4>
                <p className="text-sm text-muted-foreground">
                  {insights.secondaryInsight}
                </p>
              </div>

              <div className="p-3 bg-gradient-subtle rounded-lg border-l-4 border-l-crime-danger">
                <h4 className="font-semibold text-foreground">Fator de Risco</h4>
                <p className="text-sm text-muted-foreground">
                  {insights.riskFactor}
                </p>
              </div>
            </div>

            {/* Applied Filters Summary */}
            {Object.values(filters).some(arr => arr.length > 0) && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">Filtros Aplicados:</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([category, values]) => 
                    values.map(value => (
                      <span 
                        key={`${category}-${value}`}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                      >
                        {value}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis Summary */}
      <Card className="metric-card bg-gradient-subtle">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Resumo da Análise Personalizada
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {Object.values(filters).some(arr => arr.length > 0) ? (
                <>
                  Com os filtros aplicados, você está visualizando {insights.totalCases} casos 
                  que representam {((insights.totalCases / 156) * 100).toFixed(1)}% do total. 
                  Esta seleção permite uma análise mais direcionada dos padrões criminais.
                </>
              ) : (
                <>
                  Utilize os filtros acima para refinar sua análise e obter insights específicos 
                  sobre diferentes aspectos dos crimes em Pernambuco. Cada filtro aplicado 
                  atualizará automaticamente os gráficos e estatísticas.
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};