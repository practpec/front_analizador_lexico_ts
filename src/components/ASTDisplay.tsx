import React, { useState } from 'react';
import type { SyntaxNode } from '../types/syntax';
import { getNodeColor, getNodeLabel } from '../utils/syntaxUtils';

interface ASTDisplayProps {
  ast: SyntaxNode;
}

interface TreeNodeProps {
  node: SyntaxNode;
  depth: number;
  isLast: boolean;
  prefix: string;
}

// TreeNode muestra un nodo individual del árbol
const TreeNode: React.FC<TreeNodeProps> = ({ node, depth, isLast, prefix }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2); // Expandir primeros 2 niveles por defecto

  const hasChildren = node.children && node.children.length > 0;
  const connector = isLast ? '└─' : '├─';
  const nextPrefix = prefix + (isLast ? '   ' : '│  ');

  // toggleExpand alterna la expansión del nodo
  const toggleExpand = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="font-mono text-sm">
      <div className="flex items-center hover:bg-gray-700 rounded px-2 py-1 cursor-pointer"
           onClick={toggleExpand}>
        <span className="text-gray-400 mr-2">{prefix}{connector}</span>
        
        {hasChildren && (
          <span className="text-blue-400 mr-2">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        
        <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${getNodeColor(node.type)}`}>
          {getNodeLabel(node.type)}
        </span>
        
        <span className="text-gray-300">
          {node.value && (
            <code className="bg-gray-800 px-1 rounded text-yellow-300">
              "{node.value}"
            </code>
          )}
        </span>
        
        <span className="text-gray-500 ml-2 text-xs">
          {node.line}:{node.position}
        </span>
        
        {node.attributes && Object.keys(node.attributes).length > 0 && (
          <span className="text-purple-400 ml-2 text-xs">
            {Object.entries(node.attributes).map(([key, value]) => (
              <span key={key} className="ml-1">
                {key}="{value}"
              </span>
            ))}
          </span>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {node.children.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              depth={depth + 1}
              isLast={index === node.children.length - 1}
              prefix={nextPrefix}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ASTDisplay muestra el árbol sintáctico completo
export const ASTDisplay: React.FC<ASTDisplayProps> = ({ ast }) => {
  const [viewMode, setViewMode] = useState<'tree' | 'json'>('tree');

  if (!ast || !ast.type) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-2xl mb-2">Sin AST</div>
        <p>No hay árbol sintáctico para mostrar</p>
        <p className="text-sm">Analiza código para ver el resultado</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">
          Árbol Sintáctico Abstracto (AST)
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'tree'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Vista Árbol
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'json'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Vista JSON
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-600 max-h-96 overflow-auto">
        {viewMode === 'tree' ? (
          <div className="p-4">
            <TreeNode node={ast} depth={0} isLast={true} prefix="" />
          </div>
        ) : (
          <pre className="p-4 text-sm text-gray-300 overflow-auto">
            {JSON.stringify(ast, null, 2)}
          </pre>
        )}
      </div>

      {/* Información adicional del AST */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-gray-400">Tipo Raíz</div>
          <div className="text-white font-medium">{getNodeLabel(ast.type)}</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-gray-400">Hijos Directos</div>
          <div className="text-white font-medium">{ast.children?.length || 0}</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-gray-400">Línea</div>
          <div className="text-white font-medium">{ast.line}</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-gray-400">Posición</div>
          <div className="text-white font-medium">{ast.position}</div>
        </div>
      </div>
    </div>
  );
};