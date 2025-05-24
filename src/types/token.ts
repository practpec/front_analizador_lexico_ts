// Tipos de tokens disponibles
export type TokenType = 
  | 'RESERVED_WORD'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'OPERATOR'
  | 'DELIMITER'
  | 'SYNTAX_ERROR'
  | 'EOF';

// Interfaz para un token individual
export interface Token {
  type: TokenType;
  value: string;
  line: number;
  position: number;
}

// Interfaz para errores de análisis
export interface AnalysisError {
  message: string;
  line: number;
  position: number;
}

// Interfaz para la petición de análisis
export interface AnalysisRequest {
  code: string;
}

// Interfaz para la respuesta del análisis
export interface AnalysisResponse {
  tokens: Token[];
  errors: AnalysisError[];
}