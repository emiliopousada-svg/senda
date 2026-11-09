import React, { useState, useEffect } from 'react';
import { GpsTrackerProvider } from './hooks/useGpsTracker';
import TrackerHomeScreen from './screens/TrackerHomeScreen';
import MapGpsScreen from './screens/MapGpsScreen';
import ActiveNavHudScreen from './screens/ActiveNavHudScreen';
import RouteDetailScreen from './screens/RouteDetailScreen';
import StagesHostelsScreen from './screens/StagesHostelsScreen';
import SettingsBluetoothScreen from './screens/SettingsBluetoothScreen';
import BottomNav from './components/BottomNav';
import ScreenSwitcher from './components/ScreenSwitcher';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('tracker');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showPwaToast, setShowPwaToast] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for PWA install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPwaToast(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Service Worker registration check
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        console.log('[Senda PWA] Service Worker activo y listo para uso offline.');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPwaToast(false);
      setInstallPrompt(null);
    }
  };

  const handleNavigate = (screenId) => {
    setActiveScreen(screenId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'tracker':
        return <TrackerHomeScreen onNavigate={handleNavigate} />;
      case 'map':
        return <MapGpsScreen onNavigate={handleNavigate} />;
      case 'hud':
        return <ActiveNavHudScreen onNavigate={handleNavigate} />;
      case 'detail':
        return <RouteDetailScreen onNavigate={handleNavigate} />;
      case 'hostels':
        return <StagesHostelsScreen onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsBluetoothScreen onNavigate={handleNavigate} />;
      default:
        return <TrackerHomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <GpsTrackerProvider>
      <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md selection:bg-primary/20">
        {/* Offline Alert Strip (Only visible when device loses cell/WiFi connection) */}
        {!isOnline && (
          <div className="fixed top-0 inset-x-0 z-50 bg-secondary-container text-on-secondary px-3 py-1 flex items-center justify-center gap-1.5 text-xs font-label-badge font-bold shadow-lg animate-fade-in">
            <span className="material-symbols-outlined text-sm">cloud_off</span>
            <span>MODO OFFLINE PWA • Usando mapas y recursos en caché local</span>
          </div>
        )}

        {/* PWA Install Banner */}
        {showPwaToast && installPrompt && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-surface-container-high/95 backdrop-blur-xl border border-primary/40 px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in max-w-sm">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-xl">install_mobile</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm text-xs font-bold text-on-surface">Instalar Senda GPS</span>
              <span className="font-body-sm text-[10px] text-on-surface-variant truncate">Disponible offline en tu pantalla de inicio</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-label-action text-[11px] font-bold shadow-md hover:bg-primary-container"
              >
                Instalar
              </button>
              <button
                onClick={() => setShowPwaToast(false)}
                className="w-6 h-6 rounded-lg text-on-surface-variant hover:text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Fast Screen Switcher across all 6 Stitch designs */}
        <ScreenSwitcher activeScreen={activeScreen} onNavigate={handleNavigate} />

        {/* Screen Viewport */}
        <div className="flex-1 w-full">
          {renderScreen()}
        </div>

        {/* Persistent Bottom Nav */}
        <BottomNav activeScreen={activeScreen} onNavigate={handleNavigate} />
      </div>
    </GpsTrackerProvider>
  );
}
