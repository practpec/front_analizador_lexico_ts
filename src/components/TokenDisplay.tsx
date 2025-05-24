import React from 'react';
import type { Token } from '../types/token';
import { getTokenColor, getTokenLabel } from '../utils/tokenUtils';

interface TokenDisplayProps {
  tokens: Token[];
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ tokens }) => {
  if (tokens.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-2xl mb-2">Sin tokens</div>
        <p>No hay tokens para mostrar</p>
        <p className="text-sm">Analiza código para ver los resultados</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">
          Tokens Identificados
        </h3>
        <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm font-medium">
          {tokens.length} token{tokens.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="overflow-x-auto border border-gray-600 rounded-lg shadow-sm max-h-80">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Línea
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Posición
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-600">
            {tokens.map((token, index) => (
              <tr key={index} className="hover:bg-gray-700 transition-colors duration-150">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTokenColor(token.type)}`}>
                    {getTokenLabel(token.type)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <code className="px-2 py-1 bg-gray-900 text-gray-200 rounded text-sm font-mono">
                    {token.value}
                  </code>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {token.line}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {token.position}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};