// src/services/violenciaService.ts
import axios, { AxiosResponse } from "axios";

// Definindo a interface do documento Violencia
export interface Violencia {
  _id: string;
  ano?: number;
  cod_estado?: number;
  "Suma de Quantidade_de_Casos"?: number;
  [key: string]: any; // para outros campos dinâmicos
}

// Base URL da API Flask
const API_BASE_URL = "http://127.0.0.1:5000/api/violencias";

export const violenciaService = {
  // Pega todos os documentos
  getAll: async (): Promise<Violencia[]> => {
    try {
      const response: AxiosResponse<Violencia[]> = await axios.get(API_BASE_URL + "/");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar todos os documentos:", error);
      throw error;
    }
  },

  // Pega documento por ID
  getById: async (id: string): Promise<Violencia> => {
    try {
      const response: AxiosResponse<Violencia> = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Documento não encontrado");
      }
      console.error(`Erro ao buscar documento ${id}:`, error);
      throw error;
    }
  },

  // Filtra documentos por parâmetros dinâmicos
  filter: async (params: Record<string, string | number>): Promise<Violencia[]> => {
    try {
      const response: AxiosResponse<Violencia[]> = await axios.get(`${API_BASE_URL}/filter`, { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao filtrar documentos:", error);
      throw error;
    }
  },

  // Insere um novo documento
  insert: async (data: Partial<Violencia>): Promise<Violencia> => {
    try {
      const response: AxiosResponse<Violencia> = await axios.post(`${API_BASE_URL}/`, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao inserir documento:", error);
      throw error;
    }
  },

  // Faz predição real com o modelo treinado (e salva no banco)
  predict: async (data: {
    ano: number;
    ocorrencia: string;
    tipo_de_violencia: string;
    faixa_etaria: string;
    raca: string;
    arma: string;
  }): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await axios.post(`${API_BASE_URL}/predict`, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao executar predição:", error);
      throw error;
    }
  },

};

