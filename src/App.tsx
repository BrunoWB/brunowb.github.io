import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { HomePage } from './pages/HomePage';
import { UiElementsPage } from './pages/UiElementsPage';
import { ThemeToggle } from './components/common/ThemeToggle';
import { KofiButton } from './components/common/KofiButton';

export const App: React.FC = () => {
  const [route, setRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.replace(/^#\/?/, '') || 'home';
    }
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const currentRoute = window.location.hash.replace(/^#\/?/, '') || 'home';
      setRoute(currentRoute);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="relative min-h-screen text-[var(--text-primary)] transition-colors duration-300">
          {/* Main Route Switcher */}
          {route === 'ui-elements' ? <UiElementsPage /> : <HomePage />}

          {/* Persistent Floating Bubbles */}
          <KofiButton />
          <ThemeToggle />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
