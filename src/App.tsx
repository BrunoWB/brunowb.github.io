import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { PrintModeProvider } from './context/PrintModeContext';
import { HomePage } from './pages/HomePage';
import { ThemeToggle } from './components/common/ThemeToggle';
import { KofiButton } from './components/common/KofiButton';

const UiElementsPage = React.lazy(() => import('./pages/UiElementsPage'));
const BgCanvasPlaygroundPage = React.lazy(() => import('./pages/BgCanvasPlaygroundPage'));

export const resolveRoute = (): string => {
  if (typeof window === 'undefined') return 'home';
  const rawHash = window.location.hash;
  const hash = rawHash.replace(/^#\/?/, '');
  if (hash === 'home' || hash === 'resume' || hash === 'cv' || hash === 'projects') return 'home';
  if (hash === 'ui-elements') return 'ui-elements';

  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  const isBgCanvasPath = path === 'bg-canvas' || path.startsWith('bg-canvas/') || path === 'bg' || path.startsWith('bg/');

  const isBgCanvasHash =
    hash === 'bg-canvas' ||
    hash === 'bg' ||
    hash === 'off' ||
    hash.startsWith('bg-canvas') ||
    hash.startsWith('bg#') ||
    hash.startsWith('bg/') ||
    hash.startsWith('bg?') ||
    /(?:^|[#/&?])(bg-canvas|bg|off)(?:[#/&?]|$)/.test(rawHash);

  if (isBgCanvasHash || isBgCanvasPath) {
    return 'bg-canvas';
  }

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
        <PrintModeProvider>
          <div className="relative min-h-screen text-[var(--text-primary)] transition-colors duration-300">
            {/* Main Route Switcher */}
            <React.Suspense fallback={<div className="min-h-screen bg-[#021319]" />}>
              {route === 'bg-canvas' ? (
                <BgCanvasPlaygroundPage />
              ) : route === 'ui-elements' ? (
                <UiElementsPage />
              ) : (
                <HomePage />
              )}
            </React.Suspense>

            {/* Persistent Floating Bubbles */}
            {route !== 'bg-canvas' && (
              <div className="print:hidden">
                <KofiButton />
                <ThemeToggle />
              </div>
            )}
          </div>
        </PrintModeProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
