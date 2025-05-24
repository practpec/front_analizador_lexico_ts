import React, { useRef } from 'react';

interface FileUploadProps {
  onFileLoad: (content: string, fileName: string) => void;
  disabled?: boolean;
}

// FileUpload permite cargar archivos .txt, .ts y .tsx
export const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad, disabled = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // handleFileSelect procesa el archivo seleccionado
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar extensión del archivo
    const validExtensions = ['.txt', '.ts', '.tsx'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      alert(`Tipo de archivo no soportado. Solo se permiten archivos: ${validExtensions.join(', ')}`);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Verificar tamaño del archivo (máximo 1MB)
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. El tamaño máximo permitido es 1MB.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Leer el archivo
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onFileLoad(content, file.name);
      }
    };

    reader.onerror = () => {
      alert('Error al leer el archivo. Por favor, intenta nuevamente.');
    };

    // Leer como texto UTF-8
    reader.readAsText(file, 'UTF-8');
  };

  // handleButtonClick activa el selector de archivos
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.ts,.tsx"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <button
        onClick={handleButtonClick}
        disabled={disabled}
        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-medium
                 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500
                 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                 transition-all duration-200 shadow-lg flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span>Subir Archivo</span>
      </button>
      
      <p className="text-xs text-gray-400 text-center">
        Formatos soportados: .txt, .ts, .tsx
        <br />
        Tamaño máximo: 1MB
      </p>
    </div>
  );
};