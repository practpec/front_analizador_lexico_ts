import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { TokenDisplay } from './TokenDisplay';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { FileUpload } from './FileUpload';
import { AnalyzerService } from '../services/AnalyzerService';
import { FileDecoder } from '../utils/FileDecoder';
import type { Token, AnalysisError } from '../types/token';

// LexicalAnalyzer es el componente principal que coordina toda la funcionalidad
export const LexicalAnalyzer: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [errors, setErrors] = useState<AnalysisError[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentFileName, setCurrentFileName] = useState<string>('');

  // handleAnalyze ejecuta el análisis del código ingresado
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

  // handleClear limpia el editor y los resultados
  const handleClear = () => {
    setCode('');
    setTokens([]);
    setErrors([]);
    setCurrentFileName('');
  };

  // handleFileLoad procesa el archivo cargado
  const handleFileLoad = (content: string, fileName: string) => {
    // Limpiar el contenido
    const cleanedContent = FileDecoder.cleanContent(content);
    
    // Validar el contenido
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
    const validation = FileDecoder.validateContent(cleanedContent, extension);
    
    if (!validation.valid && validation.warnings.length > 0) {
      const proceedWithWarnings = window.confirm(
        `Se encontraron las siguientes advertencias:\n\n${validation.warnings.join('\n')}\n\n¿Deseas continuar cargando el archivo?`
      );
      
      if (!proceedWithWarnings) {
        return;
      }
    }
    
    // Actualizar estado
    setCode(cleanedContent);
    setCurrentFileName(fileName);
    
    // Limpiar resultados anteriores
    setTokens([]);
    setErrors([]);
    
    // Mostrar información de carga exitosa
    const warningsText = validation.warnings.length > 0 
      ? ` (${validation.warnings.length} advertencia${validation.warnings.length > 1 ? 's' : ''})`
      : '';
    
    alert(`Archivo "${fileName}" cargado exitosamente${warningsText}`);
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
          {currentFileName && (
            <p className="text-sm text-blue-400 mt-2">
              Archivo cargado: {currentFileName}
            </p>
          )}
        </header>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
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
          
          <FileUpload 
            onFileLoad={handleFileLoad}
            disabled={isLoading}
          />
          
          
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
              placeholder="Escribe tu código TypeScript aquí o sube un archivo..."
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

          {/* Columna 3: Tokens */}
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

        {/* Resumen de Resultados */}
        {(tokens.length > 0 || errors.length > 0) && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-indigo-400 mb-4 text-center">Resumen del Análisis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-400">{tokens.length}</p>
                  <p className="text-gray-300 text-sm">Tokens Identificados</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-3xl font-bold text-red-400">{errors.length}</p>
                  <p className="text-gray-300 text-sm">Errores Encontrados</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-3xl font-bold text-blue-400">
                    {tokens.length + errors.length > 0 
                      ? Math.round((tokens.length / (tokens.length + errors.length)) * 100)
                      : 0}%
                  </p>
                  <p className="text-gray-300 text-sm">Tokens Válidos</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
   