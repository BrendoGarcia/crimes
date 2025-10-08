# Projeto de Análise de Dados (React/TypeScript)

## Descrição do Projeto

Este projeto é uma aplicação web desenvolvida com React e TypeScript, projetada para apresentar e analisar dados através de uma interface de usuário interativa. A aplicação utiliza um sistema de navegação por telas para organizar diferentes seções de análise e visualização de informações.

## Integrantes do Grupo
- João Guilherme de Lima Martins
- Edson Nascimento Silva
- Brendo Garcia da Silva
- Gian Vitor Melo de Lira
- Josivaldo Braga Junior
- Ruan Ribeiro de Oliveira
- Leandro Marques da Silva

## Funcionalidades

### 🏠 Visão Geral
A aplicação é estruturada em diferentes telas, cada uma com um propósito específico:
- **Visão Geral (OverviewScreen): Provavelmente a tela inicial, oferecendo um resumo ou um ponto de partida para a exploração dos dados.
- **Métricas (MetricsScreen): Exibe métricas e indicadores relevantes, possivelmente com gráficos e tabelas para uma análise aprofundada.
- **Análise (AnalysisScreen): Permite uma análise mais detalhada dos dados, com opções de filtragem, agrupamento e visualização personalizada.
- **Simulação (SimulationScreen): Oferece a capacidade de simular cenários ou interagir com modelos para entender o impacto de diferentes variáveis.



### Estrutura de Arquivos
O projeto segue uma estrutura modular, organizada da seguinte forma:
```bash
src/
├── App.tsx                  # Componente principal da aplicação e configuração de rotas
├── main.tsx                 # Ponto de entrada da aplicação React
├── index.css                # Estilos globais da aplicação
├── components/              # Componentes reutilizáveis da interface (Layout, Charts, Metrics, UI)
│   ├── Charts/              # Componentes de gráficos (ex: CrimeChart.tsx)
│   ├── Layout/              # Componentes de layout (ex: Navigation.tsx)
│   ├── Metrics/             # Componentes para exibição de métricas (ex: MetricCard.tsx)
│   └── ui/                  # Componentes de UI genéricos (shadcn/ui)
├── data/                    # Módulos de dados (ex: crimeData.ts)
├── hooks/                   # Hooks customizados do React (ex: use-mobile.tsx, use-toast.ts)
├── lib/                     # Funções utilitárias e de configuração (ex: utils.ts)
├── pages/                   # Páginas principais da aplicação (ex: Index.tsx, NotFound.tsx)
├── screens/                 # Telas específicas da aplicação (OverviewScreen, MetricsScreen, AnalysisScreen, SimulationScreen)
├── services/                # Serviços para interação com APIs ou fontes de dados (ex: violenciaService.ts)
└── utils/                   # Utilitários gerais do projeto (ex: violenciaDataProcessor.ts)
```

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior é recomendada)
- npm, yarn ou pnpm (gerenciador de pacotes de sua preferência)

### Instalação das Dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### Execução da Aplicação
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

A aplicação estará disponível em: `http://localhost:8080`

## Dependências

- React: Biblioteca JavaScript para construção de interfaces de usuário.
- TypeScript: Superset de JavaScript que adiciona tipagem estática.
- Vite: Ferramenta de build e desenvolvimento rápido (inferido pelo vite-env.d.ts e estrutura).
- React Router DOM: Para gerenciamento de rotas na aplicação (BrowserRouter, Routes, Route).
- @tanstack/react-query: Para gerenciamento de estado assíncrono e cache de dados.
- Tailwind CSS: Framework CSS utilitário (inferido pela convenção de classes bg-background, min-h-screen).
- shadcn/ui: Coleção de componentes de UI (inferido pelos imports @/components/ui/).
- Recharts ou similar: Para gráficos (inferido pela existência de Charts/CrimeChart.tsx).

## Fontes de Dados

### Dadoss
- **Violência Doméstica**: Secretaria de Defesa Social de Pernambuco
- **Atlas da Violência**: Instituto de Pesquisa Econômica Aplicada (IPEA)
- **Fórum Brasileiro de Segurança Pública**: Relatórios anuais

## Próximos Passos

- Integração com APIs oficiais para dados em tempo real
- Expansão para outros tipos de criminalidade
- Adição de funcionalidades de exportação de relatórios

