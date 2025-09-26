// Mock data for crime analysis in Pernambuco
export const crimeOverviewData = [
  { name: 'Feminicídio', value: 156, color: 'hsl(0 73% 41%)' },
  { name: 'Homicídio', value: 3420, color: 'hsl(0 84% 60%)' },
  { name: 'Lesão Corporal', value: 12543, color: 'hsl(38 92% 50%)' },
  { name: 'Estupro', value: 1876, color: 'hsl(0 0% 45%)' },
  { name: 'Outros', value: 8905, color: 'hsl(0 0% 15%)' }
];

export const yearlyTrendData = [
  { name: '2019', value: 4892 },
  { name: '2020', value: 4156 },
  { name: '2021', value: 3987 },
  { name: '2022', value: 4234 },
  { name: '2023', value: 3876 },
  { name: '2024', value: 3542 }
];

export const ageGroupData = [
  { name: '18-25', value: 45 },
  { name: '26-35', value: 67 },
  { name: '36-45', value: 32 },
  { name: '46-55', value: 18 },
  { name: '56+', value: 12 }
];

export const ethnicityData = [
  { name: 'Parda', value: 78 },
  { name: 'Preta', value: 45 },
  { name: 'Branca', value: 23 },
  { name: 'Indígena', value: 8 },
  { name: 'Amarela', value: 2 }
];

export const weaponData = [
  { name: 'Arma de Fogo', value: 89 },
  { name: 'Arma Branca', value: 43 },
  { name: 'Outros', value: 24 }
];

export const cityData = [
  { name: 'Recife', value: 1250 },
  { name: 'Jaboatão', value: 890 },
  { name: 'Olinda', value: 654 },
  { name: 'Caruaru', value: 432 },
  { name: 'Petrolina', value: 378 },
  { name: 'Outros', value: 1896 }
];

export const monthlyData = [
  { name: 'Jan', value: 12 },
  { name: 'Fev', value: 15 },
  { name: 'Mar', value: 18 },
  { name: 'Abr', value: 14 },
  { name: 'Mai', value: 16 },
  { name: 'Jun', value: 13 },
  { name: 'Jul', value: 19 },
  { name: 'Ago', value: 17 },
  { name: 'Set', value: 11 },
  { name: 'Out', value: 9 },
  { name: 'Nov', value: 8 },
  { name: 'Dez', value: 4 }
];

export const getSummaryStats = () => ({
  totalCrimes: 26900,
  feminicides: 156,
  violentCrimes: 17995,
  clearanceRate: 23.4,
  mostAffectedAge: '26-35 anos',
  mostAffectedEthnicity: 'Parda',
  peakMonth: 'Julho',
  riskLevel: 'Alto'
});