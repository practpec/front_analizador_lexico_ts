// Tipos de nodos sintácticos
export type NodeType = 
  | 'PROGRAM'
  | 'VARIABLE_DECLARATION'
  | 'FUNCTION_DECLARATION'
  | 'CLASS_DECLARATION'
  | 'INTERFACE_DECLARATION'
  | 'EXPRESSION'
  | 'BINARY_EXPRESSION'
  | 'UNARY_EXPRESSION'
  | 'CALL_EXPRESSION'
  | 'MEMBER_EXPRESSION'
  | 'LITERAL_EXPRESSION'
  | 'IDENTIFIER_EXPRESSION'
  | 'STATEMENT'
  | 'BLOCK_STATEMENT'
  | 'IF_STATEMENT'
  | 'FOR_STATEMENT'
  | 'WHILE_STATEMENT'
  | 'RETURN_STATEMENT'
  | 'EXPRESSION_STATEMENT'
  | 'TYPE_ANNOTATION'
  | 'PRIMITIVE_TYPE'
  | 'ARRAY_TYPE'
  | 'FUNCTION_TYPE'
  | 'SYNTAX_ERROR';

// Nodo del árbol sintáctico
export interface SyntaxNode {
  type: NodeType;
  value: string;
  line: number;
  position: number;
  children: SyntaxNode[];
  attributes?: Record<string, string>;
}

// Error sintáctico
export interface SyntaxError {
  message: string;
  line: number;
  position: number;
  errorType: string;
  expected?: string;
  found?: string;
  severity: 'ERROR' | 'WARNING';
}

// Error semántico
export interface SemanticError {
  message: string;
  line: number;
  position: number;
  errorType: string;
  symbol?: string;
  symbolType?: string;
  severity: 'ERROR' | 'WARNING';
}

// Tipo de símbolo
export type SymbolKind = 
  | 'VARIABLE'
  | 'FUNCTION'
  | 'CLASS'
  | 'INTERFACE'
  | 'PARAMETER'
  | 'PROPERTY'
  | 'METHOD';

// Símbolo en la tabla de símbolos
export interface Symbol {
  name: string;
  type: string;
  kind: SymbolKind;
  line: number;
  position: number;
  scope: string;
  used: boolean;
  attributes?: Record<string, string>;
}

// Petición de análisis sintáctico
export interface SyntaxAnalysisRequest {
  code: string;
}

// Respuesta del análisis sintáctico/semántico
export interface SyntaxAnalysisResponse {
  ast: SyntaxNode;
  syntaxErrors: SyntaxError[];
  semanticErrors: SemanticError[];
  symbolTable: Symbol[];
  isValid: boolean;
}

// Respuesta de validación de estructura específica
export interface StructureValidationRequest {
  code: string;
  structureType: 'for_loop' | 'function' | 'variable_declaration';
}

export interface StructureValidationResponse {
  structureType: string;
  isValid: boolean;
  structureErrors: SyntaxError[];
  generalErrors: SyntaxError[];
  ast: SyntaxNode;
}

// Respuesta del AST únicamente
export interface ASTResponse {
  ast: SyntaxNode;
  isValid: boolean;
  summary: {
    nodeType: string;
    nodeValue: string;
    childCount: number;
    hasErrors: boolean;
    nodeTypeCounts: Record<string, number>;
    depth: number;
  };
}

// Respuesta de la tabla de símbolos únicamente
export interface SymbolTableResponse {
  symbolTable: Symbol[];
  symbolCount: number;
  semanticErrors: SemanticError[];
}