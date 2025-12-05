import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalysisScreen } from './AnalysisScreen';
import { violenciaService } from '../services/violenciaService';

// 1. Mock do Serviço de API
jest.mock('../services/violenciaService', () => ({
  violenciaService: {
    getAll: jest.fn(() => Promise.resolve([
      { "Suma de Quantidade_de_Casos": 10, "faixa_etaria": "18-24", "raca": "Branca", "tipo_de_violencia": "Roubo", "arma": "Faca", "ocorrencia": "Rua" },
      { "Suma de Quantidade_de_Casos": 5, "faixa_etaria": "25-34", "raca": "Preta", "tipo_de_violencia": "Furto", "arma": "Pistola", "ocorrencia": "Casa" },
      { "Suma de Quantidade_de_Casos": 15, "faixa_etaria": "18-24", "raca": "Branca", "tipo_de_violencia": "Roubo", "arma": "Faca", "ocorrencia": "Rua" },
    ])),
    filter: jest.fn(() => Promise.resolve([
      { "Suma de Quantidade_de_Casos": 20, "faixa_etaria": "18-24", "raca": "Branca", "tipo_de_violencia": "Roubo", "arma": "Faca", "ocorrencia": "Rua" },
    ])),
  },
}));

// 2. Mock dos Componentes de UI (para simplificar o teste e focar na lógica)
// O AnalysisScreen usa muitos componentes de UI (Card, Select, Checkbox, etc.)
// Mockamos eles para que o teste não quebre ao tentar renderizar componentes externos.
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="Card">{children}</div>,
  CardHeader: ({ children }) => <div data-testid="CardHeader">{children}</div>,
  CardTitle: ({ children }) => <h2 data-testid="CardTitle">{children}</h2>,
  CardContent: ({ children }) => <div data-testid="CardContent">{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ id, checked, onCheckedChange }) => (
    <input
      type="checkbox"
      data-testid={id}
      checked={checked}
      onChange={() => onCheckedChange(!checked)}
    />
  ),
}));

// Mock do Select para simular a seleção de um valor
jest.mock('@/components/ui/select', () => ({
  Select: ({ children }) => <select data-testid="Select">{children}</select>,
  SelectTrigger: ({ children }) => <div data-testid="SelectTrigger">{children}</div>,
  SelectValue: ({ children }) => <span data-testid="SelectValue">{children}</span>,
  SelectContent: ({ children }) => <div data-testid="SelectContent">{children}</div>,
  SelectItem: ({ value, children }) => <option value={value}>{children}</option>,
}));

describe('AnalysisScreen - Testes Unitários de Lógica de Filtro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Teste 1: Verifica se a API é chamada na montagem do componente
  test('deve chamar violenciaService.getAll() na montagem inicial', async () => {
    render(<AnalysisScreen />);
    
    // Espera a chamada da API
    await waitFor(() => {
      expect(violenciaService.getAll).toHaveBeenCalledTimes(2);
    });
  });

  // Teste 2: Testar a função clearFilters (Limpar Filtros)
  test('deve chamar clearFilters ao clicar no botão "Limpar Filtros"', async () => {
    render(<AnalysisScreen />);
    
    // Simula a seleção de um filtro (para garantir que o estado não está vazio)
    // O filtro '18-24' deve ser renderizado baseado no mock de dados
    await waitFor(() => {
      const checkbox = screen.getByTestId('age-18-24');
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    // Clica no botão de limpar filtros
    const clearButton = screen.getByText('Limpar Filtros');
    fireEvent.click(clearButton);

    // Verifica se o checkbox foi desmarcado (estado limpo)
    await waitFor(() => {
      const checkbox = screen.getByTestId('age-18-24');
      expect(checkbox).not.toBeChecked();
    });
  });

  // Teste 3: Testar a função handleFilterChange para ADICIONAR um filtro
  test('deve adicionar um filtro ao clicar em um checkbox', async () => {
    render(<AnalysisScreen />);
    
    // Espera os filtros dinâmicos serem renderizados
    await waitFor(() => {
      expect(screen.getByText('Faixa Etária')).toBeInTheDocument();
    });

    // Simula o clique no checkbox '18-24'
    const checkbox = screen.getByTestId('age-18-24');
    fireEvent.click(checkbox);

    // Verifica se o checkbox está marcado
    expect(checkbox).toBeChecked();
  });

  // Teste 4: Testar a função handleFilterChange para REMOVER um filtro
  test('deve remover um filtro ao clicar em um checkbox marcado', async () => {
    render(<AnalysisScreen />);
    
    // 1. Adiciona o filtro
    await waitFor(() => {
      const checkbox = screen.getByTestId('age-18-24');
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    // 2. Remove o filtro
    const checkbox = screen.getByTestId('age-18-24');
    fireEvent.click(checkbox);

    // Verifica se o checkbox está desmarcado
    expect(checkbox).not.toBeChecked();
  });

  // Teste 5: Verifica se a API de filtro é chamada após a aplicação de um filtro
  test('deve chamar violenciaService.filter() após a aplicação de um filtro', async () => {
    // Garante que o getAll foi chamado na montagem
    render(<AnalysisScreen />);
    await waitFor(() => {
      expect(violenciaService.getAll).toHaveBeenCalledTimes(2);
    });
    
    // Simula a aplicação de um filtro
    const checkbox = screen.getByTestId('age-18-24');
    fireEvent.click(checkbox);

    // Espera a chamada do filter
    await waitFor(() => {
      expect(violenciaService.filter).toHaveBeenCalledTimes(1);
      // Verifica se os parâmetros de filtro foram passados corretamente
      expect(violenciaService.filter).toHaveBeenCalledWith({
        faixa_etaria: '18-24',
      });
    });
  });
});
