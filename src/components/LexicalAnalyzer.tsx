import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { TokenDisplay } from './TokenDisplay';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { AnalyzerService } from '../services/AnalyzerService';
import type { Token, AnalysisError } from '../types/token';

export const LexicalAnalyzer: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [errors, setErrors] = useState<AnalysisError[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert('Por favor, ingresa código para analizar');
      return;
    }

    setIsLoading(true);
    try {
      const response = await AnalyzerService.analyzeCode(code);
      setTokens(response.tokens);
      setErrors(response.errors);
    } catch (error) {
      console.error('Error al analizar:', error);
      alert(error instanceof Error ? error.message : 'Error desconocido al analizar el código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setTokens([]);
    setErrors([]);
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Analizador Léxico TypeScript
          </h1>
          <p className="text-lg text-gray-300">
            Análisis automático de tokens en código TypeScript
          </p>
        </header>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !code.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium
                     hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-lg"
          >
            {isLoading ? 'Analizando...' : 'Analizar Código'}
          </button>
          
          
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium
                     hover:from-gray-500 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500
                     disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-lg"
          >
            Limpiar
          </button>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Columna 1: Editor de Código */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Editor de Código</h2>
            <CodeEditor
              code={code}
              onChange={setCode}
              placeholder="Escribe tu código TypeScript aquí..."
            />
          </div>

          {/* Columna 2: Errores */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Errores de Sintaxis</h2>
            <div className="min-h-96">
              {isLoading ? (
                <LoadingSpinner message="Analizando errores..." />
              ) : (
                <ErrorDisplay errors={errors} />
              )}
            </div>
          </div>

          {/* Columna 3: Tokens/Caracteres */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-green-400 mb-4">Tokens Identificados</h2>
            <div className="min-h-96">
              {isLoading ? (
                <LoadingSpinner message="Procesando tokens..." />
              ) : (
                <TokenDisplay tokens={tokens} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-400 text-sm">
          <p>Analizador Léxico • Backend: Go • Frontend: React + Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
};