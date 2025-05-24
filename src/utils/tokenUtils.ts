import type { TokenType } from '../types/token';

// getTokenColor retorna el color de Tailwind CSS para cada tipo de token (tema oscuro)
export const getTokenColor = (tokenType: TokenType): string => {
  const colorMap: Record<TokenType, string> = {
    RESERVED_WORD: 'text-blue-300 bg-blue-900 bg-opacity-50',
    IDENTIFIER: 'text-green-300 bg-green-900 bg-opacity-50',
    NUMBER: 'text-purple-300 bg-purple-900 bg-opacity-50',
    OPERATOR: 'text-orange-300 bg-orange-900 bg-opacity-50',
    DELIMITER: 'text-gray-300 bg-gray-700 bg-opacity-50',
    SYNTAX_ERROR: 'text-red-300 bg-red-900 bg-opacity-50',
    EOF: 'text-gray-400 bg-gray-800',
  };

  return colorMap[tokenType] || 'text-gray-300 bg-gray-700';
};

// getTokenLabel retorna una etiqueta legible para cada tipo de token
export const getTokenLabel = (tokenType: TokenType): string => {
  const labelMap: Record<TokenType, string> = {
    RESERVED_WORD: 'Palabra Reservada',
    IDENTIFIER: 'Identificador',
    NUMBER: 'Número',
    OPERATOR: 'Operador',
    DELIMITER: 'Delimitador',
    SYNTAX_ERROR: 'Error de Sintaxis',
    EOF: 'Fin de Archivo',
  };

  return labelMap[tokenType] || 'Desconocido';
};