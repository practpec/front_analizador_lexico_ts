import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { TokenDisplay } from './TokenDisplay';
import { ErrorDisplay } from './ErrorDisplay';
import { ASTDisplay } from './ASTDisplay';
import { SymbolTableDisplay } from './SymbolTableDisplay';
import { SyntaxErrorDisplay } from './SyntaxErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { FileUpload } from './FileUpload';
import { AnalyzerService } from '../services/AnalyzerService';
import { SyntaxService } from '../services/SyntaxService';
import { FileDecoder } from '../utils/FileDecoder';
import type { Token, AnalysisError } from '../types/token';
import type { SyntaxNode, SyntaxError, SemanticError, Symbol } from '../types/syntax';

// LexicalAnalyzer es el componente principal que coordina toda la funcionalidad
export const LexicalAnalyzer: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'lexical' | 'syntax'>('lexical');
  
  // Estados para análisis léxico
  const [tokens, setTokens] = useState<Token[]>([]);
  const [lexicalErrors, setLexicalErrors] = useState<AnalysisError[]>([]);
  const [isLexicalLoading, setIsLexicalLoading] = useState<boolean>(false);
  
  // Estados para análisis sintáctico/semántico
  const [ast, setAST] = useState<SyntaxNode | null>(null);
  const [syntaxErrors, setSyntaxErrors] = useState<SyntaxError[]>([]);
  const [semanticErrors, setSemanticErrors] = useState<SemanticError[]>([]);
  const [symbolTable, setSymbolTable] = useState<Symbol[]>([]);
  const [isSyntaxLoading, setIsSyntaxLoading] = useState<boolean>(false);
  const [syntaxAnalysisValid, setSyntaxAnalysisValid] = useState<boolean>(false);

  // handleLexicalAnalysis ejecuta solo el análisis léxico
  const handleLexicalAnalysis = async () => {
    if (!code.trim()) {
      alert('Por favor, ingresa código para analizar');
      return;
    }

    setIsLexicalLoading(true);
    try {
      const response = await AnalyzerService.analyzeCode(code);
      setTokens(response.tokens);
      setLexicalErrors(response.errors);
    } catch (error) {
      console.error('Error al analizar léxicamente:', error);
      alert(error instanceof Error ? error.message : 'Error desconocido al analizar el código');
    } finally {
      setIsLexicalLoading(false);
    }
  };

  // handleSyntaxAnalysis ejecuta el análisis sintáctico y semántico completo
  const handleSyntaxAnalysis = async () => {
    if (!code.trim()) {
      alert('Por favor, ingresa código para analizar');
      return;
    }

    setIsSyntaxLoading(true);
    try {
      const response = await SyntaxService.analyzeSyntax(code);
      setAST(response.ast);
      setSyntaxErrors(response.syntaxErrors);
      setSemanticErrors(response.semanticErrors);
      setSymbolTable(response.symbolTable);
      setSyntaxAnalysisValid(response.isValid);
      
      // También actualizar tokens si no están cargados
      if (tokens.length === 0) {
        const lexicalResponse = await AnalyzerService.analyzeCode(code);
        setTokens(lexicalResponse.tokens);
        setLexicalErrors(lexicalResponse.errors);
      }
    } catch (error) {
      console.error('Error al analizar sintaxis:', error);
      alert(error instanceof Error ? error.message : 'Error desconocido al analizar la sintaxis');
    } finally {
      setIsSyntaxLoading(false);
    }
  };

  // handleCompleteAnalysis ejecuta ambos análisis
  const handleCompleteAnalysis = async () => {
    if (!code.trim()) {
      alert('Por favor, ingresa código para analizar');
      return;
    }

    // Ejecutar análisis sintáctico (que incluye léxico internamente)
    await handleSyntaxAnalysis();
  };

  // handleClear limpia todos los resultados
  const handleClear = () => {
    setCode('');
    setTokens([]);
    setLexicalErrors([]);
    setAST(null);
    setSyntaxErrors([]);
    setSemanticErrors([]);
    setSymbolTable([]);
    setCurrentFileName('');
    setSyntaxAnalysisValid(false);
  };

  // handleFileLoad procesa el archivo cargado
  const handleFileLoad = (content: string, fileName: string) => {
    const cleanedContent = FileDecoder.cleanContent(content);
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
    
    setCode(cleanedContent);
    setCurrentFileName(fileName);
    
    // Limpiar resultados anteriores
    setTokens([]);
    setLexicalErrors([]);
    setAST(null);
    setSyntaxErrors([]);
    setSemanticErrors([]);
    setSymbolTable([]);
    setSyntaxAnalysisValid(false);
    
    const warningsText = validation.warnings.length > 0 
      ? ` (${validation.warnings.length} advertencia${validation.warnings.length > 1 ? 's' : ''})`
      : '';
    
    alert(`Archivo "${fileName}" cargado exitosamente${warningsText}`);
  };

  // Calcular estadísticas generales
  const totalErrors = lexicalErrors.length + syntaxErrors.length + semanticErrors.length;
  const hasAnyAnalysis = tokens.length > 0 || ast !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Analizador Léxico, Sintáctico y Semántico
          </h1>
          <p className="text-lg text-gray-300">
            Análisis completo de código TypeScript
          </p>
          {currentFileName && (
            <p className="text-sm text-blue-400 mt-2">
              Archivo cargado: {currentFileName}
            </p>
          )}
        </header>

        {/* Pestañas de análisis */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-lg p-1 flex space-x-1">
            <button
              onClick={() => setActiveTab('lexical')}
              className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === 'lexical'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              Análisis Léxico
            </button>
            <button
              onClick={() => setActiveTab('syntax')}
              className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === 'syntax'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              Análisis Sintáctico/Semántico
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {activeTab === 'lexical' ? (
            <button
              onClick={handleLexicalAnalysis}
              disabled={isLexicalLoading || !code.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium
                       hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-lg"
            >
              {isLexicalLoading ? 'Analizando Tokens...' : 'Analizar Léxico'}
            </button>
          ) : (
            <button
              onClick={handleSyntaxAnalysis}
              disabled={isSyntaxLoading || !code.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium
                       hover:from-purple-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500
                       disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-lg"
            >
              {isSyntaxLoading ? 'Analizando Sintaxis...' : 'Analizar Sintaxis/Semántica'}
            </button>
          )}
          
          <button
            onClick={handleCompleteAnalysis}
            disabled={isLexicalLoading || isSyntaxLoading || !code.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium
                     hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500
                     disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-lg"
          >
            {(isLexicalLoading || isSyntaxLoading) ? 'Analizando...' : 'Análisis Completo'}
          </button>
          
          <FileUpload 
            onFileLoad={handleFileLoad}
            disabled={isLexicalLoading || isSyntaxLoading}
          />
          
          <button
            onClick={handleClear}
            disabled={isLexicalLoading || isSyntaxLoading}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium
                     hover:from-gray-500 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500
                     disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-lg"
          >
            Limpiar
          </button>
        </div>

        {/* Layout condicional según la pestaña activa */}
        {activeTab === 'lexical' ? (
          /* Layout para análisis léxico - 3 columnas */
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

            {/* Columna 2: Errores Léxicos */}
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-red-400 mb-4">Errores Léxicos</h2>
              <div className="min-h-96">
                {isLexicalLoading ? (
                  <LoadingSpinner message="Analizando errores léxicos..." />
                ) : (
                  <ErrorDisplay errors={lexicalErrors} />
                )}
              </div>
            </div>

            {/* Columna 3: Tokens */}
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-green-400 mb-4">Tokens Identificados</h2>
              <div className="min-h-96">
                {isLexicalLoading ? (
                  <LoadingSpinner message="Procesando tokens..." />
                ) : (
                  <TokenDisplay tokens={tokens} />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Layout para análisis sintáctico/semántico - 2 filas */
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Primera fila: Editor y AST */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Editor de Código */}
              <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-purple-400 mb-4">Editor de Código</h2>
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  placeholder="Escribe tu código TypeScript aquí o sube un archivo..."
                />
              </div>

              {/* AST */}
              <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-indigo-400 mb-4">Árbol Sintáctico (AST)</h2>
                <div className="min-h-96">
                  {isSyntaxLoading ? (
                    <LoadingSpinner message="Generando AST..." />
                  ) : (
                    ast && <ASTDisplay ast={ast} />
                  )}
                </div>
              </div>
            </div>

            {/* Segunda fila: Errores y Tabla de Símbolos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Errores Sintácticos y Semánticos */}
              <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-red-400 mb-4">Errores y Advertencias</h2>
                <div className="min-h-96">
                  {isSyntaxLoading ? (
                    <LoadingSpinner message="Analizando errores..." />
                  ) : (
                    <SyntaxErrorDisplay 
                      syntaxErrors={syntaxErrors} 
                      semanticErrors={semanticErrors} 
                    />
                  )}
                </div>
              </div>

              {/* Tabla de Símbolos */}
              <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-cyan-400 mb-4">Tabla de Símbolos</h2>
                <div className="min-h-96">
                  {isSyntaxLoading ? (
                    <LoadingSpinner message="Construyendo tabla de símbolos..." />
                  ) : (
                    <SymbolTableDisplay symbols={symbolTable} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de Resultados */}
        {hasAnyAnalysis && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-indigo-400 mb-4 text-center">Resumen del Análisis</h3>
              
              {activeTab === 'lexical' ? (
                /* Resumen léxico */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-3xl font-bold text-green-400">{tokens.length}</p>
                    <p className="text-gray-300 text-sm">Tokens Identificados</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-3xl font-bold text-red-400">{lexicalErrors.length}</p>
                    <p className="text-gray-300 text-sm">Errores Léxicos</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-3xl font-bold text-blue-400">
                      {tokens.length + lexicalErrors.length > 0 
                        ? Math.round((tokens.length / (tokens.length + lexicalErrors.length)) * 100)
                        : 0}%
                    </p>
                    <p className="text-gray-300 text-sm">Tokens Válidos</p>
                  </div>
                </div>
              ) : (
                /* Resumen sintáctico/semántico */
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-3xl font-bold text-green-400">{syntaxAnalysisValid ? '✓' : '✗'}</p>
                    <p className="text-gray-300 text-sm">Análisis Válido</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-3xl font-bold text-red-400">{syntaxErrors.length}</p>
                    <p className="text-gray-300 text-sm">Errores Sintácticos</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-3xl font-bold text-purple-400">{semanticErrors.length}</p>
                    <p className="text-gray-300 text-sm">Errores Semánticos</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-3xl font-bold text-cyan-400">{symbolTable.length}</p>
                    <p className="text-gray-300 text-sm">Símbolos</p>
                  </div>
                </div>
              )}
              
              {/* Indicador de estado general */}
              <div className="mt-6 text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  totalErrors === 0 
                    ? 'bg-green-900 text-green-200 border border-green-700'
                    : 'bg-red-900 text-red-200 border border-red-700'
                }`}>
                  {totalErrors === 0 ? (
                    <>
                      <span className="mr-2">✅</span>
                      Código analizado sin errores
                    </>
                  ) : (
                    <>
                      <span className="mr-2">❌</span>
                      {totalErrors} error{totalErrors !== 1 ? 'es' : ''} encontrado{totalErrors !== 1 ? 's' : ''}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información de ayuda */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">💡 Guía de Uso</h4>
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>Análisis Léxico:</strong> Identifica tokens (palabras reservadas, identificadores, números, operadores, etc.)</p>
              <p><strong>Análisis Sintáctico:</strong> Construye el árbol sintáctico abstracto (AST) y detecta errores de sintaxis</p>
              <p><strong>Análisis Semántico:</strong> Verifica tipos, scope de variables, y construye la tabla de símbolos</p>
              <p><strong>Ejemplo de código para probar:</strong> <code className="bg-gray-800 px-2 py-1 rounded">for(let i=1; i&lt;=10; i++) &#123; console.log(i); &#125;</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};