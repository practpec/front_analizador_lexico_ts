import type { NodeType, SymbolKind } from '../types/syntax';

// getNodeColor retorna las clases CSS para colorear nodos del AST
export const getNodeColor = (nodeType: NodeType): string => {
  const colorMap: Record<NodeType, string> = {
    // Programa y declaraciones principales
    'PROGRAM': 'text-white bg-gray-700',
    'VARIABLE_DECLARATION': 'text-green-300 bg-green-900 bg-opacity-50',
    'FUNCTION_DECLARATION': 'text-blue-300 bg-blue-900 bg-opacity-50',
    'CLASS_DECLARATION': 'text-purple-300 bg-purple-900 bg-opacity-50',
    'INTERFACE_DECLARATION': 'text-indigo-300 bg-indigo-900 bg-opacity-50',
    
    // Expresiones
    'EXPRESSION': 'text-yellow-300 bg-yellow-900 bg-opacity-50',
    'BINARY_EXPRESSION': 'text-orange-300 bg-orange-900 bg-opacity-50',
    'UNARY_EXPRESSION': 'text-red-300 bg-red-900 bg-opacity-50',
    'CALL_EXPRESSION': 'text-cyan-300 bg-cyan-900 bg-opacity-50',
    'MEMBER_EXPRESSION': 'text-teal-300 bg-teal-900 bg-opacity-50',
    'LITERAL_EXPRESSION': 'text-pink-300 bg-pink-900 bg-opacity-50',
    'IDENTIFIER_EXPRESSION': 'text-lime-300 bg-lime-900 bg-opacity-50',
    
    // Sentencias
    'STATEMENT': 'text-gray-300 bg-gray-700',
    'BLOCK_STATEMENT': 'text-slate-300 bg-slate-800',
    'IF_STATEMENT': 'text-violet-300 bg-violet-900 bg-opacity-50',
    'FOR_STATEMENT': 'text-emerald-300 bg-emerald-900 bg-opacity-50',
    'WHILE_STATEMENT': 'text-sky-300 bg-sky-900 bg-opacity-50',
    'RETURN_STATEMENT': 'text-rose-300 bg-rose-900 bg-opacity-50',
    'EXPRESSION_STATEMENT': 'text-amber-300 bg-amber-900 bg-opacity-50',
    
    // Tipos
    'TYPE_ANNOTATION': 'text-fuchsia-300 bg-fuchsia-900 bg-opacity-50',
    'PRIMITIVE_TYPE': 'text-zinc-300 bg-zinc-800',
    'ARRAY_TYPE': 'text-stone-300 bg-stone-800',
    'FUNCTION_TYPE': 'text-neutral-300 bg-neutral-800',
    
    // Errores
    'SYNTAX_ERROR': 'text-red-200 bg-red-800',
  };

  return colorMap[nodeType] || 'text-gray-300 bg-gray-700';
};

// getNodeLabel retorna una etiqueta legible para cada tipo de nodo
export const getNodeLabel = (nodeType: NodeType): string => {
  const labelMap: Record<NodeType, string> = {
    'PROGRAM': 'Programa',
    'VARIABLE_DECLARATION': 'Declaración Variable',
    'FUNCTION_DECLARATION': 'Declaración Función',
    'CLASS_DECLARATION': 'Declaración Clase',
    'INTERFACE_DECLARATION': 'Declaración Interface',
    'EXPRESSION': 'Expresión',
    'BINARY_EXPRESSION': 'Expresión Binaria',
    'UNARY_EXPRESSION': 'Expresión Unaria',
    'CALL_EXPRESSION': 'Llamada Función',
    'MEMBER_EXPRESSION': 'Acceso Miembro',
    'LITERAL_EXPRESSION': 'Literal',
    'IDENTIFIER_EXPRESSION': 'Identificador',
    'STATEMENT': 'Sentencia',
    'BLOCK_STATEMENT': 'Bloque',
    'IF_STATEMENT': 'Sentencia If',
    'FOR_STATEMENT': 'Bucle For',
    'WHILE_STATEMENT': 'Bucle While',
    'RETURN_STATEMENT': 'Return',
    'EXPRESSION_STATEMENT': 'Sentencia Expresión',
    'TYPE_ANNOTATION': 'Anotación Tipo',
    'PRIMITIVE_TYPE': 'Tipo Primitivo',
    'ARRAY_TYPE': 'Tipo Array',
    'FUNCTION_TYPE': 'Tipo Función',
    'SYNTAX_ERROR': 'Error Sintáctico',
  };

  return labelMap[nodeType] || 'Desconocido';
};

// getSymbolColor retorna las clases CSS para colorear símbolos
export const getSymbolColor = (symbolKind: SymbolKind): string => {
  const colorMap: Record<SymbolKind, string> = {
    'VARIABLE': 'text-green-300 bg-green-900 bg-opacity-50',
    'FUNCTION': 'text-blue-300 bg-blue-900 bg-opacity-50',
    'CLASS': 'text-purple-300 bg-purple-900 bg-opacity-50',
    'INTERFACE': 'text-indigo-300 bg-indigo-900 bg-opacity-50',
    'PARAMETER': 'text-yellow-300 bg-yellow-900 bg-opacity-50',
    'PROPERTY': 'text-pink-300 bg-pink-900 bg-opacity-50',
    'METHOD': 'text-cyan-300 bg-cyan-900 bg-opacity-50',
  };

  return colorMap[symbolKind] || 'text-gray-300 bg-gray-700';
};

// getSymbolLabel retorna una etiqueta legible para cada tipo de símbolo
export const getSymbolLabel = (symbolKind: SymbolKind): string => {
  const labelMap: Record<SymbolKind, string> = {
    'VARIABLE': 'Variable',
    'FUNCTION': 'Función',
    'CLASS': 'Clase',
    'INTERFACE': 'Interface',
    'PARAMETER': 'Parámetro',
    'PROPERTY': 'Propiedad',
    'METHOD': 'Método',
  };

  return labelMap[symbolKind] || 'Desconocido';
};

// getNodeTypeDescription retorna una descripción detallada del tipo de nodo
export const getNodeTypeDescription = (nodeType: NodeType): string => {
  const descriptionMap: Record<NodeType, string> = {
    'PROGRAM': 'Nodo raíz que representa todo el programa',
    'VARIABLE_DECLARATION': 'Declaración de una variable (let, const, var)',
    'FUNCTION_DECLARATION': 'Declaración de una función',
    'CLASS_DECLARATION': 'Declaración de una clase',
    'INTERFACE_DECLARATION': 'Declaración de una interface TypeScript',
    'EXPRESSION': 'Expresión genérica',
    'BINARY_EXPRESSION': 'Expresión con dos operandos (a + b, a == b, etc.)',
    'UNARY_EXPRESSION': 'Expresión con un operando (!a, -b, etc.)',
    'CALL_EXPRESSION': 'Llamada a una función (func(), obj.method())',
    'MEMBER_EXPRESSION': 'Acceso a miembro de objeto (obj.prop)',
    'LITERAL_EXPRESSION': 'Valor literal (números, strings, booleans)',
    'IDENTIFIER_EXPRESSION': 'Nombre de variable, función, etc.',
    'STATEMENT': 'Sentencia genérica',
    'BLOCK_STATEMENT': 'Bloque de código entre llaves { }',
    'IF_STATEMENT': 'Sentencia condicional if',
    'FOR_STATEMENT': 'Bucle for',
    'WHILE_STATEMENT': 'Bucle while',
    'RETURN_STATEMENT': 'Sentencia return',
    'EXPRESSION_STATEMENT': 'Expresión usada como sentencia',
    'TYPE_ANNOTATION': 'Anotación de tipo TypeScript',
    'PRIMITIVE_TYPE': 'Tipo primitivo (string, number, boolean)',
    'ARRAY_TYPE': 'Tipo array',
    'FUNCTION_TYPE': 'Tipo función',
    'SYNTAX_ERROR': 'Error en la sintaxis del código',
  };

  return descriptionMap[nodeType] || 'Tipo de nodo desconocido';
};

// isErrorNode verifica si un nodo representa un error
export const isErrorNode = (nodeType: NodeType): boolean => {
  return nodeType === 'SYNTAX_ERROR';
};

// isDeclarationNode verifica si un nodo es una declaración
export const isDeclarationNode = (nodeType: NodeType): boolean => {
  return [
    'VARIABLE_DECLARATION',
    'FUNCTION_DECLARATION', 
    'CLASS_DECLARATION',
    'INTERFACE_DECLARATION'
  ].includes(nodeType);
};

// isExpressionNode verifica si un nodo es una expresión
export const isExpressionNode = (nodeType: NodeType): boolean => {
  return [
    'EXPRESSION',
    'BINARY_EXPRESSION',
    'UNARY_EXPRESSION',
    'CALL_EXPRESSION',
    'MEMBER_EXPRESSION',
    'LITERAL_EXPRESSION',
    'IDENTIFIER_EXPRESSION'
  ].includes(nodeType);
};

// isStatementNode verifica si un nodo es una sentencia
export const isStatementNode = (nodeType: NodeType): boolean => {
  return [
    'STATEMENT',
    'BLOCK_STATEMENT',
    'IF_STATEMENT',
    'FOR_STATEMENT',
    'WHILE_STATEMENT',
    'RETURN_STATEMENT',
    'EXPRESSION_STATEMENT'
  ].includes(nodeType);
};

// getNodeCategory retorna la categoría de un nodo
export const getNodeCategory = (nodeType: NodeType): 'declaration' | 'expression' | 'statement' | 'type' | 'error' | 'program' => {
  if (nodeType === 'PROGRAM') return 'program';
  if (isErrorNode(nodeType)) return 'error';
  if (isDeclarationNode(nodeType)) return 'declaration';
  if (isExpressionNode(nodeType)) return 'expression';
  if (isStatementNode(nodeType)) return 'statement';
  if (['TYPE_ANNOTATION', 'PRIMITIVE_TYPE', 'ARRAY_TYPE', 'FUNCTION_TYPE'].includes(nodeType)) {
    return 'type';
  }
  return 'statement';
};

// formatNodeInfo formatea información de un nodo para mostrar
export const formatNodeInfo = (nodeType: NodeType, value?: string, line?: number, position?: number): string => {
  const label = getNodeLabel(nodeType);
  const parts = [label];
  
  if (value) {
    parts.push(`"${value}"`);
  }
  
  if (line !== undefined && position !== undefined) {
    parts.push(`(${line}:${position})`);
  }
  
  return parts.join(' ');
};

// getErrorSeverityColor retorna el color según la severidad del error
export const getErrorSeverityColor = (severity: 'ERROR' | 'WARNING'): string => {
  switch (severity) {
    case 'ERROR':
      return 'text-red-400 bg-red-900 bg-opacity-30 border-red-700';
    case 'WARNING':
      return 'text-yellow-400 bg-yellow-900 bg-opacity-30 border-yellow-700';
    default:
      return 'text-gray-400 bg-gray-900 bg-opacity-30 border-gray-700';
  }
};