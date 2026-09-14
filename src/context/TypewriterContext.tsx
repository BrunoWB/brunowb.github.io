import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface TypewriterContextType {
  currentStep: number;
  isSkipped: boolean;
  advanceStep: () => void;
  setStep: (step: number) => void;
  skipAll: () => void;
  reset: () => void;
}

const TypewriterContext = createContext<TypewriterContextType | undefined>(undefined);

export const TypewriterProvider: React.FC<{
  children: React.ReactNode;
  initialStep?: number;
  enabled?: boolean;
}> = ({ children, initialStep = 0, enabled = true }) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isSkipped, setIsSkipped] = useState<boolean>(!enabled);

  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const setStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const skipAll = useCallback(() => {
    setIsSkipped(true);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setIsSkipped(!enabled);
  }, [initialStep, enabled]);

  // Global skip listener for Space or Enter key
  useEffect(() => {
    if (!enabled || isSkipped) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.code === 'Space' || e.key === 'Enter') &&
        (e.target as HTMLElement)?.tagName !== 'INPUT' &&
        (e.target as HTMLElement)?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        skipAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isSkipped, skipAll]);

  return (
    <TypewriterContext.Provider
      value={{
        currentStep,
        isSkipped,
        advanceStep,
        setStep,
        skipAll,
        reset,
      }}
    >
      {children}
    </TypewriterContext.Provider>
  );
};

export const useTypewriterController = (): TypewriterContextType => {
  const context = useContext(TypewriterContext);
  if (!context) {
    // Return fallback no-op controller if rendered outside provider
    return {
      currentStep: 999,
      isSkipped: true,
      advanceStep: () => {},
      setStep: () => {},
      skipAll: () => {},
      reset: () => {},
    };
  }
  return context;
};
