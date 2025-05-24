// FileDecoder proporciona utilidades para decodificar diferentes tipos de archivos

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  extension: string;
  encoding: string;
  lines: number;
  characters: number;
  words: number;
}

export class FileDecoder {
  
  // analyzeFile analiza las características de un archivo
  static analyzeFile(content: string, fileName: string, fileSize: number): FileInfo {
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
    const lines = content.split('\n').length;
    const characters = content.length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    
    return {
      name: fileName,
      size: fileSize,
      type: this.getFileType(extension),
      extension: extension,
      encoding: 'UTF-8',
      lines: lines,
      characters: characters,
      words: words
    };
  }

  // getFileType retorna el tipo de archivo basado en la extensión
  static getFileType(extension: string): string {
    const typeMap: Record<string, string> = {
      '.txt': 'Archivo de Texto',
      '.ts': 'TypeScript',
      '.tsx': 'TypeScript React'
    };
    
    return typeMap[extension] || 'Desconocido';
  }

  // detectEncoding intenta detectar la codificación del archivo
  static detectEncoding(content: string): string {
    // Verificar si contiene caracteres especiales
    const hasSpecialChars = /[^\x00-\x7F]/.test(content);
    
    if (hasSpecialChars) {
      // Verificar si parece ser UTF-8 válido
      try {
        const encoded = new TextEncoder().encode(content);
        const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
        return decoded === content ? 'UTF-8' : 'ASCII extendido';
      } catch {
        return 'Codificación desconocida';
      }
    }
    
    return 'ASCII';
  }

  // cleanContent limpia el contenido del archivo
  static cleanContent(content: string): string {
    // Normalizar saltos de línea
    let cleaned = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Remover BOM (Byte Order Mark) si existe
    if (cleaned.charCodeAt(0) === 0xFEFF) {
      cleaned = cleaned.slice(1);
    }
    
    return cleaned;
  }

  // validateContent valida que el contenido sea código válido
  static validateContent(content: string, extension: string): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    
    // Verificar si está vacío
    if (!content.trim()) {
      warnings.push('El archivo está vacío');
      return { valid: false, warnings };
    }
    
    // Verificar caracteres problemáticos
    const problematicChars = content.match(/[^\x00-\x7F\u00A0-\u024F\u1E00-\u1EFF]/g);
    if (problematicChars) {
      const uniqueChars = [...new Set(problematicChars)];
      warnings.push(`Contiene caracteres especiales que pueden causar errores: ${uniqueChars.join(', ')}`);
    }
    
    // Verificaciones específicas por tipo de archivo
    if (extension === '.ts' || extension === '.tsx') {
      // Verificar si parece ser código TypeScript
      const hasTypescriptKeywords = /\b(interface|type|enum|namespace|declare|abstract)\b/.test(content);
      const hasJavaScriptKeywords = /\b(function|const|let|var|if|for|while)\b/.test(content);
      
      if (!hasTypescriptKeywords && !hasJavaScriptKeywords) {
        warnings.push('El archivo no parece contener código TypeScript/JavaScript válido');
      }
      
      // Verificar JSX en archivos .tsx
      if (extension === '.tsx') {
        const hasJSX = /<[A-Za-z][A-Za-z0-9]*/.test(content);
        if (!hasJSX) {
          warnings.push('Archivo .tsx no contiene elementos JSX');
        }
      }
    }
    
    // Verificar líneas muy largas
    const longLines = content.split('\n').filter(line => line.length > 200);
    if (longLines.length > 0) {
      warnings.push(`${longLines.length} línea(s) muy larga(s) (>200 caracteres)`);
    }
    
    return { valid: warnings.length === 0, warnings };
  }

  // formatFileSize formatea el tamaño del archivo
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // extractCodeStatistics extrae estadísticas específicas del código
  static extractCodeStatistics(content: string): {
    emptyLines: number;
    commentLines: number;
    codeLines: number;
    functions: number;
    classes: number;
    interfaces: number;
  } {
    const lines = content.split('\n');
    let emptyLines = 0;
    let commentLines = 0;
    let codeLines = 0;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed === '') {
        emptyLines++;
      } else if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        commentLines++;
      } else {
        codeLines++;
      }
    });
    
    // Contar estructuras de código
    const functions = (content.match(/\bfunction\s+\w+/g) || []).length +
                     (content.match(/\w+\s*=\s*\([^)]*\)\s*=>/g) || []).length +
                     (content.match(/\w+\s*:\s*\([^)]*\)\s*=>/g) || []).length;
    
    const classes = (content.match(/\bclass\s+\w+/g) || []).length;
    const interfaces = (content.match(/\binterface\s+\w+/g) || []).length;
    
    return {
      emptyLines,
      commentLines,
      codeLines,
      functions,
      classes,
      interfaces
    };
  }
}