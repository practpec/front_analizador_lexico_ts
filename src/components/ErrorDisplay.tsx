import React from 'react';
import type { AnalysisError } from '../types/token';

interface ErrorDisplayProps {
  errors: AnalysisError[];
}

// ErrorDisplay muestra los errores encontrados durante el análisis
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => {
  if (errors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-2xl mb-2">Sin errores</div>
        <p>No se encontraron errores de sintaxis</p>
        <p className="text-sm">El código parece estar sintácticamente correcto</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">
          Errores Encontrados
        </h3>
        <span className="px-3 py-1 bg-red-600 text-red-100 rounded-full text-sm font-medium">
          {errors.length} error{errors.length !== 1 ? 'es' : ''}
        </span>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {errors.map((error, index) => (
          <div 
            key={index}
            className="p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-red-100 text-sm font-bold">!</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-red-200 font-medium">
                  {error.message}
                </p>
                <div className="mt-1 text-sm text-red-300">
                  Línea {error.line}, Posición {error.position}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};