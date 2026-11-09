import React, { useState } from 'react';
import useGpsTracker from '../hooks/useGpsTracker';

export default function TrackerHomeScreen({ onNavigate }) {
  const tracker = useGpsTracker();
  const geo = tracker;
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const screensList = [
    {
      id: 'map',
      title: 'Mapa Topográfico GPS',
      desc: 'OpenTopoMap interactivo, curvas de nivel 1:25k y brújula',
      icon: 'explore',
      badge: 'OPEN TOPO MAP',
      badgeColor: 'text-primary bg-primary/10 border-primary/20',
      actionLabel: 'Abrir Mapa',
    },
    {
      id: 'hud',
      title: 'Navegación Activa HUD',
      desc: 'Telemetría en tiempo real, altimetría acumulada y rumbo',
      icon: 'navigation',
      badge: 'LIVE GPS',
      badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
      actionLabel: 'Ver HUD',
    },
    {
      id: 'detail',
      title: 'Detalle de Ruta & Offline',
      desc: 'Ficha Saint-Jean → Roncesvalles, meteo y descarga 185 MB',
      icon: 'altitude',
      badge: 'ETAPA 1',
      badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
      actionLabel: 'Ver Ficha',
    },
    {
      id: 'hostels',
      title: 'Etapas del Camino & Albergues',
      desc: 'Credencial digital, reservas de albergues y fuentes de agua',
      icon: 'night_shelter',
      badge: '18 CAMAS LIBRES',
      badgeColor: 'text-primary bg-primary/10 border-primary/20',
      actionLabel: 'Ver Albergues',
    },
    {
      id: 'settings',
      title: 'Ajustes & Sensores Bluetooth',
      desc: 'Garmin Fēnix 7, Polar H10, inReach satelital y calibración',
      icon: 'settings_bluetooth',
      badge: '3 BLE CONECTADOS',
      badgeColor: 'text-primary-fixed bg-primary/15 border-primary/30',
      actionLabel: 'Ajustes BLE',
    },
  ];

  return (
    <div className="relative min-h-screen bg-surface text-on-surface flex flex-col pb-24 selection:bg-primary/20">
      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-30 bg-surface/90 backdrop-blur-md pt-safe border-b border-surface-container-high shadow-lg">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              alt="Senda GPS Logo"
              className="h-8 w-auto object-contain shrink-0"
              src="https://lh3.googleusercontent.com/aida/ALJJyrAJoC6ReqymPw02uDg-jfQoZASl8ttZ4dc1sq5LJ2FKn_VUPCK09_sEpSbcGhsEtLJdBBydoALBAYYrtWdgjjsCBGwDNeDZqnH3dZBYileEiYkF_waSeJUVaftVPOGA-ZHkNpwnyR-qHkOOOUpMzU8lI0fdjKQDYn-Q5AJK7PLZTS5wai8TELvOuhtW4lDVkPhr7_xAP4Fb8O4R6ISRUrV-punAi1PzBEm_RC13kAJr3A"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-sm font-bold tracking-tight text-on-surface leading-tight">SENDA TRACKER</span>
              <span className="font-label-badge text-[10px] text-primary flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                CAMINO FRANCÉS • {geo.isSimulating ? 'SIMULADO' : 'ONLINE'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1.5 rounded-full border border-surface-container-highest text-xs">
              <span className="material-symbols-outlined text-sm text-primary">satellite</span>
              <span className="font-label-telemetry-sm text-[11px] font-bold text-on-surface">14 SAT</span>
            </div>
            <div className="flex items-center gap-1 bg-primary/15 px-2.5 py-1.5 rounded-full text-xs font-bold text-primary font-label-telemetry-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>{geo.altitudeFormatted}</span>
            </div>
            <img
              alt="Pilgrim Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy_j0kwkb3Wq-SY77wXSguMRm2pfGUsjR-FNaf7t_95X1Np8GpW9M8PMb58Frk7Ncok-OfKKRE1KR8FqnCJ_ppAgVSJWCR4AACCjDyde0dYEJZkZYwfUoj8SNwmpOxVMAccdCaWbjagMckFoKMAAI9RhDNGz-6pY_3E-IDi496xVrK5BB4Fky2AGtZsDEhnbWftEqXdjM1Vv_5T31scLUR0G8D21mnYzdqg9mmwLCf"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative w-full pt-20 px-4 max-w-4xl mx-auto gap-4">
        {/* Pilgrim Credential Progress Card */}
        <section className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-3xl p-5 border border-primary/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">verified</span>
              </span>
              <div>
                <h2 className="font-headline-sm text-base font-bold text-on-surface">Credencial del Peregrino</h2>
                <span className="font-body-sm text-xs text-on-surface-variant">Santiago de Compostela · 779 km meta</span>
              </div>
            </div>
            <span className="font-label-badge text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary font-bold border border-primary/30">
              8 / 31 SELLOS
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5 border border-surface-container-highest my-2">
            <div className="bg-gradient-to-r from-primary via-secondary to-primary h-full rounded-full transition-all duration-500" style={{ width: '22%' }}></div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-surface-container-highest/60 text-center">
            <div className="flex flex-col">
              <span className="font-body-sm text-[11px] text-on-surface-variant">Recorrido Grabado</span>
              <span className="font-label-telemetry-md text-base text-primary font-bold">{tracker.formattedDistance}</span>
            </div>
            <div className="flex flex-col border-x border-surface-container-highest/60">
              <span className="font-body-sm text-[11px] text-on-surface-variant">Tiempo Activo</span>
              <span className="font-label-telemetry-md text-base text-secondary font-bold">{tracker.durationFormatted}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-body-sm text-[11px] text-on-surface-variant">Restante</span>
              <span className="font-label-telemetry-md text-base text-on-surface font-bold">700.6 km</span>
            </div>
          </div>
        </section>

        {/* Live GPS Telemetry Bento Grid (Hook watchPosition & useGpsTracker) */}
        <section className="bg-surface-container rounded-3xl p-5 border border-primary/30 shadow-xl flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${tracker.isTracking ? 'bg-error animate-ping' : 'bg-primary animate-pulse'}`}></span>
              <span className="font-headline-sm text-sm font-bold text-on-surface">Telemetría GPS en Vivo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-label-badge text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                tracker.gpsStatus === 'locked' ? 'bg-primary/15 text-primary border-primary/30' : 'bg-secondary/15 text-secondary border-secondary/30'
              }`}>
                {tracker.isSimulating ? 'GPS SIMULADO' : (tracker.gpsStatus === 'locked' ? 'GPS FIJADO' : 'BUSCANDO')}
              </span>
              <button
                onClick={() => {
                  tracker.toggleSimulation();
                  showToast(tracker.isSimulating ? 'Simulación desactivada (GPS real)' : 'Simulación GPS iniciada');
                }}
                className="px-2 py-0.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-[10px] font-label-badge text-on-surface-variant hover:text-primary transition-colors border border-surface-container-highest active:scale-95"
                title="Alternar entre señal GPS real del navegador o simulación"
              >
                {tracker.isSimulating ? 'Desactivar Sim' : 'Simular GPS'}
              </button>
            </div>
          </div>

          {/* Barra de Control Iniciar / Pausar Recorrido (useGpsTracker) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest/90 border border-primary/25 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-3 h-3 rounded-full shrink-0 ${tracker.isTracking ? 'bg-error animate-ping' : (tracker.elapsedSeconds > 0 ? 'bg-amber-400' : 'bg-outline')}`} />
              <div className="flex flex-col min-w-0">
                <span className="font-label-badge text-[10px] font-bold text-on-surface">
                  {tracker.isTracking ? 'GRABANDO RECORRIDO' : (tracker.elapsedSeconds > 0 ? 'RECORRIDO EN PAUSA' : 'GPS LISTO')}
                </span>
                <span className="font-mono text-xs text-primary font-bold truncate">
                  {tracker.durationFormatted} • {tracker.formattedDistance}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Botón Iniciar / Pausar */}
              <button
                onClick={() => {
                  tracker.toggleTracking();
                  showToast(tracker.isTracking ? 'Recorrido GPS pausado' : 'Recorrido GPS iniciado');
                }}
                className={`px-3.5 py-1.5 rounded-xl font-label-action text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  tracker.isTracking
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-amber-500/20'
                    : 'bg-primary text-on-primary hover:bg-primary-container shadow-primary/20'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {tracker.isTracking ? 'pause' : 'play_arrow'}
                </span>
                <span>{tracker.isTracking ? 'Pausar' : (tracker.elapsedSeconds > 0 ? 'Reanudar' : 'Iniciar')}</span>
              </button>

              {/* Botón Reiniciar si hay recorrido */}
              {(tracker.elapsedSeconds > 0 || tracker.routePath.length > 0) && (
                <button
                  onClick={() => {
                    tracker.resetTracking();
                    showToast('Recorrido GPS reiniciado');
                  }}
                  className="p-1.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-error hover:bg-error/10 border border-surface-container-highest transition-colors active:scale-95"
                  title="Reiniciar recorrido y distancia"
                >
                  <span className="material-symbols-outlined text-base">restart_alt</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-surface-container-low p-3 rounded-2xl flex flex-col justify-between">
              <span className="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Altitud</span>
              <span className="font-label-telemetry-lg text-lg text-primary font-bold mt-0.5">{geo.altitudeFormatted}</span>
              <span className="font-label-telemetry-sm text-[10px] text-on-surface-variant">Collado Lepoeder</span>
            </div>

            <div className="bg-surface-container-low p-3 rounded-2xl flex flex-col justify-between">
              <span className="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Velocidad</span>
              <span className="font-label-telemetry-lg text-lg text-secondary font-bold mt-0.5">{geo.speedKmh} km/h</span>
              <span className="font-label-telemetry-sm text-[10px] text-on-surface-variant">Ritmo: {geo.pace} min/km</span>
            </div>

            <div className="bg-surface-container-low p-3 rounded-2xl flex flex-col justify-between">
              <span className="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Rumbo</span>
              <span className="font-label-telemetry-lg text-lg text-on-surface font-bold mt-0.5">{geo.headingText}</span>
              <span className="font-label-telemetry-sm text-[10px] text-on-surface-variant">Rumbo a Zubiri</span>
            </div>

            <div className="bg-surface-container-low p-3 rounded-2xl flex flex-col justify-between">
              <span className="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Precisión</span>
              <span className="font-label-telemetry-lg text-lg text-primary font-bold mt-0.5">{geo.accuracyFormatted}</span>
              <span className="font-label-telemetry-sm text-[10px] text-on-surface-variant">Dual-Band L1/L5</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest/90 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs border border-surface-container-high">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-primary text-base shrink-0">my_location</span>
              <span className="font-label-telemetry-sm text-xs font-semibold text-on-surface tracking-wider truncate">
                {geo.coordsDMS}
              </span>
            </div>
            <span className="font-label-badge text-[10px] text-primary font-bold shrink-0 ml-2">watchPosition ACTIVO</span>
          </div>
        </section>

        {/* Current Active Stage Hero Banner */}
        <section className="bg-surface-container rounded-3xl p-5 border border-outline-variant/60 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-label-badge text-xs text-secondary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">hiking</span>
              ETAPA EN CURSO
            </span>
            <span className="font-label-telemetry-sm text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
              COLLADO LEPOEDER
            </span>
          </div>

          <div>
            <h1 className="font-headline-lg text-xl font-extrabold text-on-surface">Saint-Jean-Pied-de-Port → Roncesvalles</h1>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              25.1 km • +1.250m desnivel • 7h 30m est. Paso de montaña pirenaico de alta exigencia física y técnica.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => onNavigate('hud')}
              className="h-12 rounded-xl bg-primary text-on-primary font-label-action text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">navigation</span>
              <span>Iniciar Navegación HUD</span>
            </button>
            <button
              onClick={() => onNavigate('detail')}
              className="h-12 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-surface-container-highest font-label-action text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg text-secondary">fact_check</span>
              <span>Ver Ficha de Ruta</span>
            </button>
          </div>
        </section>

        {/* Quick Access to the other screens */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">Pantallas del Ecosistema Senda</h3>
            <span className="font-label-badge text-xs text-on-surface-variant">5 Módulos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {screensList.map((screen) => (
              <div
                key={screen.id}
                onClick={() => onNavigate(screen.id)}
                className="bg-surface-container hover:bg-surface-container-high border border-surface-container-highest rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-md hover:border-primary/40 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary group-hover:scale-105 transition-transform border border-surface-container-highest shrink-0">
                      <span className="material-symbols-outlined text-2xl">{screen.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-headline-sm text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                        {screen.title}
                      </h4>
                      <p className="font-body-sm text-xs text-on-surface-variant line-clamp-1 mt-0.5">{screen.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-surface-container-highest/60 text-xs">
                  <span className={`font-label-badge px-2 py-0.5 rounded-full border text-[10px] font-bold ${screen.badgeColor}`}>
                    {screen.badge}
                  </span>
                  <span className="text-primary font-label-action font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{screen.actionLabel}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency SOS Bar */}
        <section className="bg-error-container/20 border border-error/40 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-error/20 text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">sos</span>
            </span>
            <div>
              <span className="font-headline-sm text-xs font-bold text-error block">SOS Montaña & Rescate 112</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">
                Posición: {geo.coordsDMS} • Baliza inReach Iridium activa
              </span>
            </div>
          </div>
          <button
            onClick={() => showToast(`Alerta SOS 112 enviada con coordenadas: ${geo.coordsDMS}`)}
            className="px-3 py-1.5 rounded-xl bg-error text-on-error font-label-action text-xs font-bold hover:brightness-110 active:scale-95 transition-all shrink-0"
          >
            Activar SOS
          </button>
        </section>
      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-container-highest/95 border border-primary/40 text-on-surface px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fade-in font-label-action text-sm">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
