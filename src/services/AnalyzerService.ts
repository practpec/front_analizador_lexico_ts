import type { AnalysisRequest, AnalysisResponse } from '../types/token';

const API_BASE_URL = 'http://localhost:8080/api';

export class AnalyzerService {
  
  static async analyzeCode(code: string): Promise<AnalysisResponse> {
    try {
      const request: AnalysisRequest = { code };
      
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: AnalysisResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error al analizar código:', error);
      throw new Error('No se pudo conectar con el servidor. Verifica que esté ejecutándose.');
    }
  }


  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Error al verificar estado del servidor:', error);
      return false;
    }
  }
}