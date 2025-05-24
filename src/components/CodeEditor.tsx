import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  onChange, 
  placeholder = "Escribe tu código aquí..." 
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Código a Analizar
      </label>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-80 p-4 bg-gray-900 border border-gray-600 rounded-lg shadow-sm 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 font-mono text-sm resize-none transition-all duration-200
                 hover:border-gray-500 text-gray-100 placeholder-gray-400"
        spellCheck={false}
      />
      <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
        <span>Líneas: {code.split('\n').length}</span>
        <span>Caracteres: {code.length}</span>
      </div>
    </div>
  );
};