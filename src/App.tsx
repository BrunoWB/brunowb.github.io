import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { HomePage } from './pages/HomePage';
import { ThemeToggle } from './components/common/ThemeToggle';
import { KofiButton } from './components/common/KofiButton';

const UiElementsPage = React.lazy(() => import('./pages/UiElementsPage'));
const BgPlaygroundPage = React.lazy(() => import('./pages/BgPlaygroundPage'));
const BgCanvasPlaygroundPage = React.lazy(() => import('./pages/BgCanvasPlaygroundPage'));

export const resolveRoute = (): string => {
  if (typeof window === 'undefined') return 'home';
  const rawHash = window.location.hash;
  const hash = rawHash.replace(/^#\/?/, '');
  if (hash === 'home' || hash === 'resume' || hash === 'cv' || hash === 'projects') return 'home';
  if (hash === 'ui-elements') return 'ui-elements';

  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  const isBgCanvasPath = path === 'bg-canvas' || path.startsWith('bg-canvas/');
  const isBgPath = path === 'bg' || path.startsWith('bg/');

  const isBgCanvasHash =
    hash === 'bg-canvas' ||
    hash.startsWith('bg-canvas#') ||
    hash.startsWith('bg-canvas/') ||
    hash.startsWith('bg-canvas?') ||
    /(?:^|[#/&?])bg-canvas(?:[#/&?]|$)/.test(rawHash);

  // If hash explicitly points to bg-canvas
  if (isBgCanvasHash) {
    return 'bg-canvas';
  }

  // If hash is explicitly #off while already on a bg-canvas pathname
  if (isBgCanvasPath && (hash === 'off' || /(?:^|[#/&?])off(?:[#/&?]|$)/.test(rawHash)) && !hash.includes('bg')) {
    return 'bg-canvas';
  }

  const isBgHash =
    hash === 'bg' ||
    hash === 'off' ||
    hash.startsWith('bg#') ||
    hash.startsWith('bg/') ||
    hash.startsWith('bg?') ||
    /(?:^|[#/&?])bg(?:[#/&?]|$)/.test(rawHash) ||
    (/(?:^|[#/&?])off(?:[#/&?]|$)/.test(rawHash) && !hash.includes('ui-elements'));

  if (isBgHash) {
    return 'bg';
  }

  // Fallback to pathname when no hash route matches
  if (isBgCanvasPath) return 'bg-canvas';
  if (isBgPath) return 'bg';
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
          <React.Suspense fallback={<div className="min-h-screen bg-[#021319]" />}>
            {route === 'bg-canvas' ? (
              <BgCanvasPlaygroundPage />
            ) : route === 'bg' ? (
              <BgPlaygroundPage />
            ) : route === 'ui-elements' ? (
              <UiElementsPage />
            ) : (
              <HomePage />
            )}
          </React.Suspense>

          {/* Persistent Floating Bubbles */}
          {route !== 'bg' && route !== 'bg-canvas' && (
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
