import React, { useState, useEffect } from 'react';
import { AnalyzerService } from '../services/AnalyzerService';

// StatusIndicator muestra el estado de conexión con el servidor
export const StatusIndicator: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkServerStatus = async () => {
    try {
      const status = await AnalyzerService.checkHealth();
      setIsConnected(status);
    } catch (error) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-sm">Verificando servidor...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-sm font-medium">
        {isConnected ? 'Servidor conectado' : 'Servidor desconectado'}
      </span>
    </div>
  );
};