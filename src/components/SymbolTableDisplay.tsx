import React, { useState } from 'react';
import type { Symbol, SymbolKind } from '../types/syntax';
import { getSymbolColor, getSymbolLabel } from '../utils/syntaxUtils';

interface SymbolTableDisplayProps {
  symbols: Symbol[];
}

// SymbolTableDisplay muestra la tabla de símbolos
export const SymbolTableDisplay: React.FC<SymbolTableDisplayProps> = ({ symbols }) => {
  const [filterKind, setFilterKind] = useState<SymbolKind | 'ALL'>('ALL');
  const [filterScope, setFilterScope] = useState<string>('ALL');
  const [showUnused, setShowUnused] = useState(true);

  if (symbols.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-2xl mb-2">Sin símbolos</div>
        <p>No hay símbolos en la tabla</p>
        <p className="text-sm">Declara variables o funciones para ver los símbolos</p>
      </div>
    );
  }

  // Filtrar símbolos según los criterios seleccionados
  const filteredSymbols = symbols.filter(symbol => {
    const kindMatch = filterKind === 'ALL' || symbol.kind === filterKind;
    const scopeMatch = filterScope === 'ALL' || symbol.scope === filterScope;
    const usageMatch = showUnused || symbol.used;
    
    return kindMatch && scopeMatch && usageMatch;
  });

  // Obtener listas únicas de tipos y scopes para los filtros
  const uniqueKinds = [...new Set(symbols.map(s => s.kind))];
  const uniqueScopes = [...new Set(symbols.map(s => s.scope))];

  // Estadísticas de símbolos
  const stats = {
    total: symbols.length,
    used: symbols.filter(s => s.used).length,
    unused: symbols.filter(s => !s.used).length,
    variables: symbols.filter(s => s.kind === 'VARIABLE').length,
    functions: symbols.filter(s => s.kind === 'FUNCTION').length,
    classes: symbols.filter(s => s.kind === 'CLASS').length,
    interfaces: symbols.filter(s => s.kind === 'INTERFACE').length,
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">
          Tabla de Símbolos
        </h3>
        <span className="px-3 py-1 bg-indigo-600 text-indigo-100 rounded-full text-sm font-medium">
          {filteredSymbols.length} símbol{filteredSymbols.length !== 1 ? 'os' : 'o'}
        </span>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-400">{stats.total}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.used}</div>
          <div className="text-xs text-gray-400">Usados</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.unused}</div>
          <div className="text-xs text-gray-400">No Usados</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.functions}</div>
          <div className="text-xs text-gray-400">Funciones</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-300">Tipo:</label>
          <select
            value={filterKind}
            onChange={(e) => setFilterKind(e.target.value as SymbolKind | 'ALL')}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-200"
          >
            <option value="ALL">Todos</option>
            {uniqueKinds.map(kind => (
              <option key={kind} value={kind}>{getSymbolLabel(kind)}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-300">Scope:</label>
          <select
            value={filterScope}
            onChange={(e) => setFilterScope(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-200"
          >
            <option value="ALL">Todos</option>
            {uniqueScopes.map(scope => (
              <option key={scope} value={scope}>{scope}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-1 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showUnused}
              onChange={(e) => setShowUnused(e.target.checked)}
              className="rounded"
            />
            <span>Mostrar no usados</span>
          </label>
        </div>
      </div>

      {/* Tabla de símbolos */}
      <div className="overflow-x-auto border border-gray-600 rounded-lg shadow-sm max-h-80">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Clase
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Scope
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-600">
            {filteredSymbols.map((symbol, index) => (
              <tr key={index} className="hover:bg-gray-700 transition-colors duration-150">
                <td className="px-4 py-3 whitespace-nowrap">
                  <code className="px-2 py-1 bg-gray-900 text-blue-300 rounded text-sm font-mono">
                    {symbol.name}
                  </code>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <code className="px-2 py-1 bg-gray-900 text-purple-300 rounded text-sm font-mono">
                    {symbol.type}
                  </code>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSymbolColor(symbol.kind)}`}>
                    {getSymbolLabel(symbol.kind)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                    {symbol.scope}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {symbol.line}:{symbol.position}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    symbol.used 
                      ? 'text-green-300 bg-green-900 bg-opacity-50' 
                      : 'text-yellow-300 bg-yellow-900 bg-opacity-50'
                  }`}>
                    {symbol.used ? 'Usado' : 'No usado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSymbols.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-lg mb-2">No hay símbolos que coincidan con los filtros</div>
          <p className="text-sm">Ajusta los filtros para ver más símbolos</p>
        </div>
      )}

      {/* Detalles adicionales */}
      {filteredSymbols.some(s => s.attributes && Object.keys(s.attributes).length > 0) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Detalles Adicionales</h4>
          <div className="space-y-2">
            {filteredSymbols
              .filter(s => s.attributes && Object.keys(s.attributes).length > 0)
              .map((symbol, index) => (
                <div key={index} className="bg-gray-700 rounded p-2 text-sm">
                  <span className="font-medium text-blue-300">{symbol.name}</span>
                  {symbol.attributes && Object.entries(symbol.attributes).map(([key, value]) => (
                    <span key={key} className="ml-2 text-gray-400">
                      {key}: <span className="text-gray-200">{value}</span>
                    </span>
                  ))}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};