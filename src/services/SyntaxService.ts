import type { 
  SyntaxAnalysisRequest, 
  SyntaxAnalysisResponse,
  StructureValidationRequest,
  StructureValidationResponse,
  ASTResponse,
  SymbolTableResponse
} from '../types/syntax';

const API_BASE_URL = 'http://localhost:8080/api/syntax';

export class SyntaxService {
  
  // analyzeSyntax realiza análisis sintáctico y semántico completo
  static async analyzeSyntax(code: string): Promise<SyntaxAnalysisResponse> {
    try {
      const request: SyntaxAnalysisRequest = { code };
      
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

      const data: SyntaxAnalysisResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error al analizar sintaxis:', error);
      throw new Error('No se pudo conectar con el servidor sintáctico. Verifica que esté ejecutándose.');
    }
  }

  // getAST obtiene solo el árbol sintáctico abstracto
  static async getAST(code: string): Promise<ASTResponse> {
    try {
      const request: SyntaxAnalysisRequest = { code };
      
      const response = await fetch(`${API_BASE_URL}/ast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: ASTResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener AST:', error);
      throw new Error('No se pudo obtener el árbol sintáctico.');
    }
  }

  // getSymbolTable obtiene solo la tabla de símbolos
  static async getSymbolTable(code: string): Promise<SymbolTableResponse> {
    try {
      const request: SyntaxAnalysisRequest = { code };
      
      const response = await fetch(`${API_BASE_URL}/symbols`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: SymbolTableResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener tabla de símbolos:', error);
      throw new Error('No se pudo obtener la tabla de símbolos.');
    }
  }

  // validateStructure valida una estructura específica del código
  static async validateStructure(
    code: string, 
    structureType: 'for_loop' | 'function' | 'variable_declaration'
  ): Promise<StructureValidationResponse> {
    try {
      const request: StructureValidationRequest = { code, structureType };
      
      const response = await fetch(`${API_BASE_URL}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: StructureValidationResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error al validar estructura:', error);
      throw new Error('No se pudo validar la estructura del código.');
    }
  }

  // checkHealth verifica el estado del servicio sintáctico
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Error al verificar estado del servidor sintáctico:', error);
      return false;
    }
  }
}