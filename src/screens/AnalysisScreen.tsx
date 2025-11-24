import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MetricCard } from "@/components/Metrics/MetricCard";
import { CrimeChart } from "@/components/Charts/CrimeChart";
import { violenciaService, Violencia } from "@/services/violenciaService";
import { ChatbotModal } from "@/components/Chatbot/ChatbotModal";

interface FilterState {
  ageGroups: string[];
  ethnicities: string[];
  crimeTypes: string[];
  weaponTypes: string[];
  occurrenceTypes: string[];
}

export const AnalysisScreen = () => {
  const [filters, setFilters] = useState<FilterState>({
    ageGroups: [],
    ethnicities: [],
    crimeTypes: [],
    weaponTypes: [],
    occurrenceTypes: []
  });

  const [activeChart, setActiveChart] = useState<"age" | "ethnicity" | "weapon">("age");
  const [data, setData] = useState<Violencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalGlobalCases, setTotalGlobalCases] = useState(0);


  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const allData = await violenciaService.getAll();
        const total = allData.reduce((acc, item) => acc + (item["Suma de Quantidade_de_Casos"] || 0), 0);
        setTotalGlobalCases(total);
      } catch (error) {
        console.error("Erro ao buscar total geral:", error);
      }
    };

    fetchTotal();
  }, []);


  // busca dados iniciais e filtrados
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {};

        if (filters.ageGroups.length > 0) params["faixa_etaria"] = filters.ageGroups.join(",");
        if (filters.ethnicities.length > 0) params["raca"] = filters.ethnicities.join(",");
        if (filters.crimeTypes.length > 0) params["tipo_de_violencia"] = filters.crimeTypes.join(",");
        if (filters.weaponTypes.length > 0) params["arma"] = filters.weaponTypes.join(",");
        if (filters.occurrenceTypes.length > 0) params["ocorrencia"] = filters.occurrenceTypes.join(",");


        const result = Object.keys(params).length > 0
          ? await violenciaService.filter(params)
          : await violenciaService.getAll();
          

          setData(result);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const clearFilters = () => {
    setFilters({ ageGroups: [], ethnicities: [], crimeTypes: [], weaponTypes: [], occurrenceTypes: [] });
  };

  // valores únicos para montar os filtros dinâmicos
  const uniqueValues = useMemo(() => {
    const ages = new Set<string>();
    const ethnicities = new Set<string>();
    const crimes = new Set<string>();
    const weapons = new Set<string>();
    const occurrences = new Set<string>();

    data.forEach(item => {
      if (item.faixa_etaria) ages.add(item.faixa_etaria);
      if (item.raca) ethnicities.add(item.raca);
      if (item.tipo_de_violencia) crimes.add(item.tipo_de_violencia);
      if (item.arma) weapons.add(item.arma);
      if (item.ocorrencia) occurrences.add(item.ocorrencia);
    });

    return {
      ages: Array.from(ages).sort(),
      ethnicities: Array.from(ethnicities).sort(),
      crimes: Array.from(crimes).sort(),
      weapons: Array.from(weapons).sort(),
      occurrences: Array.from(occurrences).sort()
    };
  }, [data]);

  // processa dados para gráficos
  const getChartData = () => {
    const grouped: Record<string, number> = {};

    data.forEach(item => {
      let key = "";
      if (activeChart === "age") key = item.faixa_etaria;
      if (activeChart === "ethnicity") key = item.raca;
      if (activeChart === "weapon") key = item.arma;

      if (!grouped[key]) grouped[key] = 0;
      grouped[key] += item["Suma de Quantidade_de_Casos"];
    });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getChartTitle = () => {
    const titles = {
      age: "Distribuição por Faixa Etária",
      ethnicity: "Distribuição por Etnia",
      weapon: "Tipo de Arma Utilizada"
    };
    return titles[activeChart];
  };

  const totalCases = data.reduce((acc, item) => acc + item["Suma de Quantidade_de_Casos"], 0);

  const percentageOfTotal = totalGlobalCases > 0 ? ((totalCases / totalGlobalCases) * 100).toFixed(2) + "%" : "...";


  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Análise Detalhada com Filtros</h1>
        <p className="text-muted-foreground">
          Explore os dados aplicando filtros específicos para insights direcionados
        </p>
      </div>
      <div>
        <ChatbotModal />
      </div>

      {/* Filters Panel */}
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Filtros Aplicáveis</CardTitle>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Age Groups */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Faixa Etária</h4>
              <div className="space-y-2">
                {uniqueValues.ages.map(age => (
                  <div key={age} className="flex items-center space-x-2">
                    <Checkbox
                      id={`age-${age}`}
                      checked={filters.ageGroups.includes(age)}
                      onCheckedChange={checked =>
                        handleFilterChange("ageGroups", age, checked as boolean)
                      }
                    />
                    <label htmlFor={`age-${age}`} className="text-sm text-muted-foreground cursor-pointer">
                      {age}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Ethnicities */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Etnia</h4>
              <div className="space-y-2">
                {uniqueValues.ethnicities.map(ethnicity => (
                  <div key={ethnicity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ethnicity-${ethnicity}`}
                      checked={filters.ethnicities.includes(ethnicity)}
                      onCheckedChange={checked =>
                        handleFilterChange("ethnicities", ethnicity, checked as boolean)
                      }
                    />
                    <label htmlFor={`ethnicity-${ethnicity}`} className="text-sm text-muted-foreground cursor-pointer">
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
                {uniqueValues.crimes.map(crime => (
                  <div key={crime} className="flex items-center space-x-2">
                    <Checkbox
                      id={`crime-${crime}`}
                      checked={filters.crimeTypes.includes(crime)}
                      onCheckedChange={checked =>
                        handleFilterChange("crimeTypes", crime, checked as boolean)
                      }
                    />
                    <label htmlFor={`crime-${crime}`} className="text-sm text-muted-foreground cursor-pointer">
                      {crime}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Crime Ocorrência */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Tipo de Ocorrência</h4>
              <div className="space-y-2">
                {uniqueValues.occurrences.map(occ => (
                  <div key={occ} className="flex items-center space-x-2">
                    <Checkbox
                      id={`occ-${occ}`}
                      checked={filters.occurrenceTypes.includes(occ)}
                      onCheckedChange={checked =>
                        handleFilterChange("occurrenceTypes", occ, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`occ-${occ}`}
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {occ}
                    </label>
                  </div>
                ))}
              </div>
            </div>


            {/* Weapons */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Uso de Arma</h4>
              <div className="space-y-2">
                {uniqueValues.weapons.map(weapon => (
                  <div key={weapon} className="flex items-center space-x-2">
                    <Checkbox
                      id={`weapon-${weapon}`}
                      checked={filters.weaponTypes.includes(weapon)}
                      onCheckedChange={checked =>
                        handleFilterChange("weaponTypes", weapon, checked as boolean)
                      }
                    />
                    <label htmlFor={`weapon-${weapon}`} className="text-sm text-muted-foreground cursor-pointer">
                      {weapon}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Casos Filtrados"
          value={loading ? "..." : totalCases}
          subtitle="Com base nos filtros aplicados"
          variant="critical"
        />
        <MetricCard
          title="Percentual do Total"
          value={loading ? "..." : percentageOfTotal}
          subtitle="Casos filtrados em relação ao total geral"
          trend="neutral"
        />
        <MetricCard
          title="Filtros Ativos"
          value={Object.values(filters).flat().length}
          subtitle="Critérios selecionados"
          variant="warning"
        />
      </div>

      {/* Chart */}
      <Card className="metric-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground">{getChartTitle()}</CardTitle>
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
          <CrimeChart type="bar" data={getChartData()} height={300} />
        </CardContent>
      </Card>
    </div>
  );
};
