import React, { useState } from 'react';
import type { SyntaxError, SemanticError } from '../types/syntax';

interface SyntaxErrorDisplayProps {
  syntaxErrors: SyntaxError[];
  semanticErrors: SemanticError[];
}

// SyntaxErrorDisplay muestra errores sintácticos y semánticos
export const SyntaxErrorDisplay: React.FC<SyntaxErrorDisplayProps> = ({ 
  syntaxErrors, 
  semanticErrors 
}) => {
  const [activeTab, setActiveTab] = useState<'syntax' | 'semantic' | 'all'>('all');

  const totalErrors = syntaxErrors.length + semanticErrors.length;
  const syntaxErrorCount = syntaxErrors.filter(e => e.severity === 'ERROR').length;
  const syntaxWarningCount = syntaxErrors.filter(e => e.severity === 'WARNING').length;
  const semanticErrorCount = semanticErrors.filter(e => e.severity === 'ERROR').length;
  const semanticWarningCount = semanticErrors.filter(e => e.severity === 'WARNING').length;

  if (totalErrors === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-2xl mb-2">✅ Sin errores</div>
        <p>No se encontraron errores sintácticos ni semánticos</p>
        <p className="text-sm">El código parece estar correcto</p>
      </div>
    );
  }

  // getErrorIcon retorna el icono apropiado para cada tipo de error
  const getErrorIcon = (severity: string) => {
    switch (severity) {
      case 'ERROR':
        return <span className="text-red-400 text-lg">❌</span>;
      case 'WARNING':
        return <span className="text-yellow-400 text-lg">⚠️</span>;
      default:
        return <span className="text-gray-400 text-lg">ℹ️</span>;
    }
  };

  // getErrorBorderColor retorna el color del borde según la severidad
  const getErrorBorderColor = (severity: string) => {
    switch (severity) {
      case 'ERROR':
        return 'border-red-700 bg-red-900 bg-opacity-20';
      case 'WARNING':
        return 'border-yellow-700 bg-yellow-900 bg-opacity-20';
      default:
        return 'border-gray-700 bg-gray-900 bg-opacity-20';
    }
  };

  // filteredErrors retorna los errores según la pestaña activa
  const getFilteredErrors = () => {
    switch (activeTab) {
      case 'syntax':
        return { 
          title: 'Errores Sintácticos', 
          errors: syntaxErrors.map(e => ({ ...e, type: 'syntax' as const }))
        };
      case 'semantic':
        return { 
          title: 'Errores Semánticos', 
          errors: semanticErrors.map(e => ({ ...e, type: 'semantic' as const }))
        };
      default:
        return { 
          title: 'Todos los Errores', 
          errors: [
            ...syntaxErrors.map(e => ({ ...e, type: 'syntax' as const })),
            ...semanticErrors.map(e => ({ ...e, type: 'semantic' as const }))
          ].sort((a, b) => a.line - b.line || a.position - b.position)
        };
    }
  };

  const { title, errors } = getFilteredErrors();

  return (
    <div className="w-full">
      {/* Header con pestañas */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">
          Errores y Advertencias
        </h3>
        <span className="px-3 py-1 bg-red-600 text-red-100 rounded-full text-sm font-medium">
          {totalErrors} error{totalErrors !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-400">{syntaxErrorCount + semanticErrorCount}</div>
          <div className="text-xs text-gray-400">Errores</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{syntaxWarningCount + semanticWarningCount}</div>
          <div className="text-xs text-gray-400">Advertencias</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{syntaxErrors.length}</div>
          <div className="text-xs text-gray-400">Sintácticos</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{semanticErrors.length}</div>
          <div className="text-xs text-gray-400">Semánticos</div>
        </div>
      </div>

      {/* Pestañas de filtrado */}
      <div className="flex space-x-1 mb-4 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors flex-1 ${
            activeTab === 'all'
              ? 'bg-gray-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          }`}
        >
          Todos ({totalErrors})
        </button>
        <button
          onClick={() => setActiveTab('syntax')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors flex-1 ${
            activeTab === 'syntax'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          }`}
        >
          Sintácticos ({syntaxErrors.length})
        </button>
        <button
          onClick={() => setActiveTab('semantic')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors flex-1 ${
            activeTab === 'semantic'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          }`}
        >
          Semánticos ({semanticErrors.length})
        </button>
      </div>

      {/* Lista de errores */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {errors.map((error, index) => (
          <div 
            key={index}
            className={`p-4 border rounded-lg ${getErrorBorderColor(error.severity)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getErrorIcon(error.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    error.type === 'syntax' 
                      ? 'bg-blue-600 text-blue-100'
                      : 'bg-purple-600 text-purple-100'
                  }`}>
                    {error.type === 'syntax' ? 'Sintáctico' : 'Semántico'}
                  </span>
                  
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    error.severity === 'ERROR'
                      ? 'bg-red-600 text-red-100'
                      : 'bg-yellow-600 text-yellow-100'
                  }`}>
                    {error.severity === 'ERROR' ? 'Error' : 'Advertencia'}
                  </span>
                  
                  <span className="text-xs text-gray-400">
                    {error.errorType}
                  </span>
                </div>
                
                <p className="text-gray-200 font-medium mb-2">
                  {error.message}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">
                    Línea {error.line}, Posición {error.position}
                  </div>
                  
                  {/* Información adicional para errores sintácticos */}
                  {'expected' in error && error.expected && (
                    <div className="text-xs text-gray-500">
                      Esperado: <code className="bg-gray-800 px-1 rounded">{error.expected}</code>
                      {error.found && (
                        <>
                          , Encontrado: <code className="bg-gray-800 px-1 rounded">{error.found}</code>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Información adicional para errores semánticos */}
                  {'symbol' in error && error.symbol && (
                    <div className="text-xs text-gray-500">
                      Símbolo: <code className="bg-gray-800 px-1 rounded">{error.symbol}</code>
                      {error.symbolType && (
                        <span className="ml-1">({error.symbolType})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de tipos de errores */}
      {errors.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Resumen de Errores</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            
            {/* Errores sintácticos más comunes */}
            {syntaxErrors.length > 0 && (
              <div>
                <h5 className="text-blue-400 font-medium mb-2">Errores Sintácticos Comunes:</h5>
                <ul className="space-y-1 text-gray-300">
                  {Array.from(new Set(syntaxErrors.map(e => e.errorType))).map(type => (
                    <li key={type} className="flex justify-between">
                      <span>{type.replace(/_/g, ' ')}</span>
                      <span className="text-gray-400">
                        {syntaxErrors.filter(e => e.errorType === type).length}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Errores semánticos más comunes */}
            {semanticErrors.length > 0 && (
              <div>
                <h5 className="text-purple-400 font-medium mb-2">Errores Semánticos Comunes:</h5>
                <ul className="space-y-1 text-gray-300">
                  {Array.from(new Set(semanticErrors.map(e => e.errorType))).map(type => (
                    <li key={type} className="flex justify-between">
                      <span>{type.replace(/_/g, ' ')}</span>
                      <span className="text-gray-400">
                        {semanticErrors.filter(e => e.errorType === type).length}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Consejos para corregir errores */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg">
          <h4 className="text-blue-400 font-medium mb-2">💡 Consejos para Corregir</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            {syntaxErrors.length > 0 && (
              <li>• Revisa que todas las llaves, paréntesis y corchetes estén balanceados</li>
            )}
            {semanticErrors.some(e => e.errorType === 'UNDEFINED_VARIABLE') && (
              <li>• Verifica que todas las variables estén declaradas antes de usarlas</li>
            )}
            {semanticErrors.some(e => e.errorType === 'TYPE_MISMATCH') && (
              <li>• Asegúrate de que los tipos de datos sean compatibles en las operaciones</li>
            )}
            {semanticErrors.some(e => e.errorType === 'REDECLARATION') && (
              <li>• Evita declarar variables o funciones con el mismo nombre en el mismo scope</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};