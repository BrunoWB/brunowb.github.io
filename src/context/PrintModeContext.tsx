import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PrintMode = 'paper' | 'digital';

interface PrintModeContextType {
  printMode: PrintMode;
  triggerPrint: (mode?: PrintMode) => void;
}

const PrintModeContext = createContext<PrintModeContextType | undefined>(undefined);

export const PrintModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [printMode, setPrintMode] = useState<PrintMode>('paper');

  const triggerPrint = useCallback((mode: PrintMode = 'paper') => {
    setPrintMode(mode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-print-mode', mode);
      document.body.setAttribute('data-print-mode', mode);
    }
    // Timeout allows React to render the chosen mode before the synchronous print dialog freezes execution
    setTimeout(() => {
      window.print();
    }, 40);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAfterPrint = () => {
      setPrintMode('paper');
      if (typeof document !== 'undefined') {
        document.documentElement.removeAttribute('data-print-mode');
        document.body.removeAttribute('data-print-mode');
      }
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  return (
    <PrintModeContext.Provider value={{ printMode, triggerPrint }}>
      {children}
    </PrintModeContext.Provider>
  );
};

export const usePrintMode = (): PrintModeContextType => {
  const context = useContext(PrintModeContext);
  if (!context) {
    return {
      printMode: 'paper',
      triggerPrint: (mode: PrintMode = 'paper') => {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-print-mode', mode);
          document.body.setAttribute('data-print-mode', mode);
        }
        window.print();
      },
    };
  }
  return context;
};
