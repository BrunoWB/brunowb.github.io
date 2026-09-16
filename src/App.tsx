import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { HomePage } from './pages/HomePage';
import { UiElementsPage } from './pages/UiElementsPage';
import { BgPlaygroundPage } from './pages/BgPlaygroundPage';
import { ThemeToggle } from './components/common/ThemeToggle';
import { KofiButton } from './components/common/KofiButton';

const resolveRoute = (): string => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash === 'bg') return 'bg';
  if (hash === 'ui-elements') return 'ui-elements';
  if (hash === 'home' || hash === 'resume' || hash === 'cv' || hash === 'projects') return 'home';
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  if (path === 'bg') return 'bg';
  return 'home';
};

export const App: React.FC = () => {
  const [route, setRoute] = useState<string>(resolveRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(resolveRoute());
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="relative min-h-screen text-[var(--text-primary)] transition-colors duration-300">
          {/* Main Route Switcher */}
          {route === 'bg' ? (
            <BgPlaygroundPage />
          ) : route === 'ui-elements' ? (
            <UiElementsPage />
          ) : (
            <HomePage />
          )}

          {/* Persistent Floating Bubbles */}
          {route !== 'bg' && (
            <>
              <KofiButton />
              <ThemeToggle />
            </>
          )}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
