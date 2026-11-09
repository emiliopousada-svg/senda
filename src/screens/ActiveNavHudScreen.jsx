import React, { useState, useEffect } from 'react';
import useGpsTracker from '../hooks/useGpsTracker';

export default function ActiveNavHudScreen({ onNavigate }) {
  const tracker = useGpsTracker();
  const geo = tracker;
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleFinishRoute = () => {
    showToast("¡Ruta finalizada con éxito! Track guardado en tu diario de viaje.");
    setTimeout(() => onNavigate('tracker'), 1500);
  };

  return (
    <div className="relative min-h-screen bg-surface text-on-surface flex flex-col pb-28 selection:bg-primary/20">
      <header className="fixed top-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl pt-safe shadow-[0_4px_20px_rgba(0,0,0,0.35)] border-b border-surface-container-high">
        <div className="h-16 px-margin flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-xs min-w-0"><button aria-label="Volver" className="w-12 h-12 flex items-center justify-center -ml-2 text-on-surface hover:text-primary transition-colors shrink-0" onClick={() => onNavigate("map")}><span className="material-symbols-outlined text-2xl">arrow_back</span></button><img alt="Senda GPS Logo" className="h-7 w-auto object-contain shrink-0 hidden sm:block" src="https://lh3.googleusercontent.com/aida/ALJJyrAJoC6ReqymPw02uDg-jfQoZASl8ttZ4dc1sq5LJ2FKn_VUPCK09_sEpSbcGhsEtLJdBBydoALBAYYrtWdgjjsCBGwDNeDZqnH3dZBYileEiYkF_waSeJUVaftVPOGA-ZHkNpwnyR-qHkOOOUpMzU8lI0fdjKQDYn-Q5AJK7PLZTS5wai8TELvOuhtW4lDVkPhr7_xAP4Fb8O4R6ISRUrV-punAi1PzBEm_RC13kAJr3A"/><h1 className="font-headline-sm text-headline-sm text-on-surface truncate tracking-tight">Navegación Activa</h1></div><div className="flex items-center gap-space-sm shrink-0"><div className="flex items-center gap-space-xs bg-surface-container-high/90 px-2.5 py-1.5 rounded-full"><span className="w-2 h-2 rounded-full bg-primary"></span><span className="font-label-badge text-label-badge text-primary">{geo.isSimulating ? "GPS SIM" : "GPS LIVE"}</span></div><img alt="Profile" className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-primary/40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy_j0kwkb3Wq-SY77wXSguMRm2pfGUsjR-FNaf7t_95X1Np8GpW9M8PMb58Frk7Ncok-OfKKRE1KR8FqnCJ_ppAgVSJWCR4AACCjDyde0dYEJZkZYwfUoj8SNwmpOxVMAccdCaWbjagMckFoKMAAI9RhDNGz-6pY_3E-IDi496xVrK5BB4Fky2AGtZsDEhnbWftEqXdjM1Vv_5T31scLUR0G8D21mnYzdqg9mmwLCf"/></div></div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface">
        <div className="flex flex-col w-full text-on-surface select-none pb-8">
{/* Telemetría Satelital GPS en Tiempo Real (Hook watchPosition) */}
<div className="mx-margin mb-2 bg-surface-container-lowest/90 border border-primary/30 px-3 py-2 rounded-xl flex items-center justify-between shadow-md">
  <div className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
    <div className="flex flex-col">
      <span className="font-label-telemetry-sm text-[11px] font-bold text-on-surface tracking-tight">
        {geo.coordsDMS}
      </span>
      <span className="font-body-sm text-[10px] text-on-surface-variant">
        Alt: <strong className="text-primary">{geo.altitudeFormatted}</strong> • Vel: <strong className="text-secondary">{geo.speedKmh} km/h</strong> • Err: <strong className="text-on-surface">{geo.accuracyFormatted}</strong>
      </span>
    </div>
  </div>
  <button
    onClick={geo.toggleSimulation}
    className="px-2 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-surface-container-highest text-[10px] font-label-badge text-primary font-bold active:scale-95 transition-all"
    title="Alternar entre coordenadas GPS reales del navegador y simulación pirenaica"
  >
    {geo.isSimulating ? 'SIM: ACTIVA' : 'SIM: DESACTIVADA'}
  </button>
</div>

{/*  Status Banner: Táctico & Orientación Jacobea  */}
<section className="px-margin pt-3 pb-2">
<div className="bg-surface-container-high rounded-xl p-3 shadow-lg flex flex-col gap-2 relative overflow-hidden">
<div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary-container/20 text-primary">
<span className="material-symbols-outlined text-lg">explore</span>
</span>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">Etapa 2 · Camino Francés</span>
<span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
<span>Roncesvalles → Zubiri</span>
<span className="w-1 h-1 rounded-full bg-outline"></span>
<span className="text-secondary font-semibold">Collado Lepoeder</span>
</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary font-label-badge text-label-badge">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span>EN SENDA ({geo.status === "locked" ? "GPS FIJADO" : "GPS EN VIVO"})</span>
</div>
</div>
<div className="flex items-center justify-between bg-surface-container-lowest/80 px-3 py-1.5 rounded-lg text-on-surface-variant font-label-telemetry-sm text-label-telemetry-sm">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-base text-primary">navigation</span>
<span className="text-on-surface font-semibold">RUMBO {geo.headingText}</span>
</div>
<div className="flex items-center gap-3">
<span className="flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-sm text-secondary">wb_sunny</span>
<span>LUZ 2h 30m</span>
</span>
<span className="text-primary font-bold">GPS {geo.accuracyFormatted}</span>
</div>
</div>
</div>
</section>
{/*  Canvas Cartográfico Interactivo con HUD Flotante  */}
<section className="px-margin relative mt-1">
<div className="relative w-full h-80 rounded-xl overflow-hidden bg-surface-container-lowest shadow-2xl">
{/*  Mapa Topográfico Dinámico de Fondo  */}
<div className="w-full h-full bg-cover bg-center" data-location="Collado Lepoeder, Roncesvalles, Spain" style={{ "backgroundImage": "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwcS4HDnlNS2J6yaeT3nqjzsuHgxNZ9czxEwfduej72DxPA1p2pc-KrLHE4APu7bC4C61dIvnAgA5d3PQLOiUm6TePKTTvPKb8tFzrFcF1X8nKvZ334tfxFWihNnGCyVG_Tl03aUuaCrQEsLscJesR593sNNN8CcQyjrtOCs0cBa_AHjuaKyZ7VFW2g73aH9LxrfiNQSs5CjN5FVaF0o-aCWTg9z6o4SNsvOtUaEcV')" }}></div>
{/*  Capa de Líneas Topográficas y Track SVG  */}
<div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-surface-container-lowest/40"></div>
<svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" viewBox="0 0 360 320">
{/*  Curvas de Nivel Vectoriales  */}
<path d="M-20 60 C80 90, 160 40, 260 80 S380 110, 400 90" opacity="0.35" stroke="#3c4a42" strokeDasharray="3 3" strokeWidth="1" />
<path d="M-20 120 C70 150, 170 100, 270 140 S390 160, 410 130" opacity="0.35" stroke="#3c4a42" strokeWidth="1" />
<path d="M-20 190 C60 210, 150 170, 250 210 S370 200, 400 180" opacity="0.35" stroke="#3c4a42" strokeDasharray="4 2" strokeWidth="1" />
<path d="M-10 260 C90 280, 180 230, 280 270 S380 250, 420 240" opacity="0.3" stroke="#3c4a42" strokeWidth="1" />
{/*  Trazado de Ruta Recorrida  */}
<path d="M 40 290 Q 70 230 110 200 T 175 145" opacity="0.5" stroke="#bbcabf" strokeLinecap="round" strokeWidth="4" />
{/*  Trazado del Track Restante (Amarillo Dorado Jacobeo)  */}
<path d="M 175 145 C 205 110, 220 85, 290 60 S 330 35, 345 25" stroke="#ffb95f" strokeDasharray="8 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
{/*  Waypoint Destacado Adelantado: Fuente de Roldán  */}
<circle cx="270" cy="72" fill="#ffb95f" r="4.5" />
<circle cx="270" cy="72" opacity="0.6" r="10" stroke="#ffb95f" strokeWidth="1.5" />
{/*  Flecha de Rumbo Posición Actual (Heading Pointer)  */}
<g transform={`translate(175, 145) rotate(${geo.heading - 320})`}>
{/*  Pulso de radar animado  */}
<circle cx="0" cy="0" fill="#4edea3" opacity="0.25" r="18">
<animate attributeName="r" dur="2.4s" repeatCount="indefinite" values="8;24;8" />
<animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" values="0.4;0.05;0.4" />
</circle>
{/*  Círculo base  */}
<circle cx="0" cy="0" fill="#0b1326" r="8" />
{/*  Aguja directriz  */}
<polygon fill="#4edea3" points="0,-14 6,5 0,2 -6,5" />
<circle cx="0" cy="0" fill="#ffffff" r="2.5" />
</g>
</svg>
{/*  Botones Tácticos de Mapa Flotantes (Hitboxes generosos)  */}
<div className="absolute right-3 top-3 flex flex-col gap-2">
<button aria-label="Centrar mapa en mi posición" className="w-12 h-12 rounded-xl bg-surface-container/90 backdrop-blur-md shadow-lg flex items-center justify-center text-primary active:scale-95 transition-transform" id="btn-recenter">
<span className="material-symbols-outlined text-2xl">my_location</span>
</button>
<button aria-label="Alternar capa topográfica" className="w-12 h-12 rounded-xl bg-surface-container/90 backdrop-blur-md shadow-lg flex items-center justify-center text-on-surface active:scale-95 transition-transform" id="btn-layer">
<span className="material-symbols-outlined text-2xl">layers</span>
</button>
<button aria-label="Orientar al norte" className="w-12 h-12 rounded-xl bg-surface-container/90 backdrop-blur-md shadow-lg flex items-center justify-center text-secondary active:scale-95 transition-transform" id="btn-compass">
<span className="material-symbols-outlined text-2xl">north</span>
</button>
</div>
{/*  Mini-tarjeta Overlay Próximo Hito  */}
<div className="absolute left-3 bottom-3 right-16 bg-surface-container-high/90 backdrop-blur-md rounded-lg p-2.5 shadow-xl flex items-center gap-2.5">
<div className="w-8 h-8 rounded-md bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
<span className="material-symbols-outlined text-xl">water_drop</span>
</div>
<div className="min-w-0 flex-1">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-body-sm font-bold truncate text-on-surface">Fuente de Roldán</span>
<span className="font-label-badge text-label-badge text-secondary ml-1">a 1.4 km</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate block">Agua potable garantizada · +45m</span>
</div>
</div>
</div>
</section>
{/*  Gran HUD Táctico de Métricas Deportivas y Altimetría  */}
<section className="px-margin mt-3">
<div className="bg-surface-container rounded-xl p-3.5 shadow-xl flex flex-col gap-3">
{/*  Fila 1: Distancia Restante & Progreso Real  */}
<div className="grid grid-cols-2 gap-2.5">
<div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-between">
<div className="flex items-center justify-between text-on-surface-variant">
<span className="font-body-sm text-body-sm uppercase tracking-wider">Dist. Restante</span>
<span className="material-symbols-outlined text-base text-secondary">flag</span>
</div>
<div className="flex items-baseline gap-1 mt-1">
<span className="font-label-telemetry-lg text-label-telemetry-lg text-primary tracking-tight">{tracker.formattedDistance}</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-on-surface-variant">km</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Recorrido: <span className="font-label-telemetry-sm text-label-telemetry-sm text-on-surface">{tracker.formattedDistance}</span></span>
</div>
<div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-between">
<div className="flex items-center justify-between text-on-surface-variant">
<span className="font-body-sm text-body-sm uppercase tracking-wider">Altitud Actual</span>
<span className="material-symbols-outlined text-base text-primary">landscape</span>
</div>
<div className="flex items-baseline gap-1 mt-1">
<span className="font-label-telemetry-lg text-label-telemetry-lg text-on-surface tracking-tight">{Math.round(geo.altitude)}</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-on-surface-variant">m</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Collado de Lepoeder</span>
</div>
</div>
{/*  Fila 2: Desnivel & Pendiente Inmediata  */}
<div className="grid grid-cols-3 gap-2">
<div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">Desnivel +</span>
<span className="font-label-telemetry-md text-label-telemetry-md text-secondary mt-0.5">+540 m</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-on-surface-variant">-180 m desc.</span>
</div>
<div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">Pendiente</span>
<span className="font-label-telemetry-md text-label-telemetry-md text-primary mt-0.5">+11%</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-on-surface-variant">Subida fuerte</span>
</div>
<div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">Ritmo</span>
<span className="font-label-telemetry-md text-label-telemetry-md text-on-surface mt-0.5">{geo.pace}</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-on-surface-variant">min/km ({geo.speedKmh} km/h)</span>
</div>
</div>
{/*  Fila 3: Tiempo & Estimación de Llegada (ETA)  */}
<div className="bg-surface-container-low rounded-lg p-3 flex items-center justify-between">
<div className="flex items-center gap-2.5">
<div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-xl">timer</span>
</div>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant">Tiempo en Marcha</span>
<span className="font-label-telemetry-md text-label-telemetry-md text-on-surface">{tracker.durationFormatted}</span>
</div>
</div>
<div className="text-right">
<span className="font-body-sm text-body-sm text-on-surface-variant">ETA Zubiri</span>
<div className="flex items-baseline justify-end gap-1">
<span className="font-label-telemetry-md text-label-telemetry-md text-secondary font-bold">17:45</span>
<span className="font-label-badge text-label-badge text-primary-fixed-dim">OK SOL</span>
</div>
</div>
</div>
</div>
</section>
{/*  Perfil Altimétrico Dinámico con Marcador "Tú Estás Aquí"  */}
<section className="px-margin mt-3">
<div className="bg-surface-container rounded-xl p-3.5 shadow-xl">
<div className="flex items-center justify-between mb-2">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-base">area_chart</span>
<span className="font-headline-sm text-headline-sm text-on-surface text-sm font-bold">Perfil Altimétrico de Etapa</span>
</div>
<span className="font-label-badge text-label-badge text-on-surface-variant">22.0 KM TOTAL</span>
</div>
{/*  SVG Gráfico Altimétrico  */}
<div className="relative w-full h-28 bg-surface-container-lowest rounded-lg p-2 overflow-hidden flex flex-col justify-end">
<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 320 80">
<defs>
<lineargradient id="alt-grad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#4edea3" stopOpacity="0.45" />
<stop offset="100%" stopColor="#4edea3" stopOpacity="0.02" />
</lineargradient>
</defs>
{/*  Cuadrícula altimétrica horizontal  */}
<line stroke="#222a3d" strokeDasharray="2 2" strokeWidth="1" x1="0" x2="320" y1="20" y2="20" />
<line stroke="#222a3d" strokeDasharray="2 2" strokeWidth="1" x1="0" x2="320" y1="50" y2="50" />
{/*  Área del perfil de elevación  */}
<polygon fill="url(#alt-grad)" points="0,80 0,65 30,55 70,40 115,15 160,35 210,60 260,70 320,68 320,80" />
{/*  Línea de cresta  */}
<polyline fill="none" points="0,65 30,55 70,40 115,15 160,35 210,60 260,70 320,68" stroke="#4edea3" strokeLinecap="round" strokeWidth="2.5" />
{/*  Punto y línea 'TÚ ESTÁS AQUÍ' en el collado actual (km 7.8 aprox, x=115)  */}
<line stroke="#ffb95f" strokeDasharray="2 2" strokeWidth="1.5" x1="115" x2="115" y1="15" y2="80" />
<circle cx="115" cy="15" fill="#ffb95f" r="4" />
<circle cx="115" cy="15" opacity="0.6" r="8" stroke="#ffb95f" strokeWidth="1" />
</svg>
{/*  Tooltip Flotante TÚ ESTÁS AQUÍ  */}
<div className="absolute left-24 top-2 bg-secondary-container px-2 py-0.5 rounded shadow text-on-secondary font-label-badge text-label-badge flex items-center gap-1 font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>
<span>TÚ: 1.420m (CIMA)</span>
</div>
<div className="flex justify-between items-center text-on-surface-variant font-label-telemetry-sm text-body-sm px-1 pt-1">
<span>0km (950m)</span>
<span className="text-secondary font-semibold">Descenso 700m próx.</span>
<span>22km (530m)</span>
</div>
</div>
</div>
</section>
{/*  Puntos de Referencia y Galería Visual Inmediata  */}
<section className="px-margin mt-3">
<div className="flex items-center justify-between mb-2">
<span className="font-headline-sm text-headline-sm text-sm font-bold text-on-surface">Puntos Próximos en Ruta</span>
<span className="font-body-sm text-body-sm text-primary flex items-center gap-0.5">
<span>3 waypoints</span>
<span className="material-symbols-outlined text-sm">chevron_right</span>
</span>
</div>
<div className="grid grid-cols-2 gap-2.5">
{/*  Card Waypoint 1  */}
<div className="bg-surface-container rounded-xl p-2.5 shadow-md flex flex-col gap-2">
<div className="relative h-20 w-full rounded-lg overflow-hidden bg-surface-container-highest">
<img className="w-full h-full object-cover" data-alt="A rugged high-mountain stone refuge and spring on the Camino de Santiago trail, surrounded by mist, green pyrenean pastures, natural dramatic ambient light, tactical outdoor photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx0DQ8IJLmlWDBIJQzd8i-DMYq5KIq3-3l3xfynytJLjFAkRZZ4NWJxKhxCo71n6oWUYimRv8-y531np8lCRysnzmWwg12xsLAqg2kYu2AVJ2vpzK4enx2G6cESHOymtN16Tz6RwIlNNlW3bm_Q2fc8rmJhuqLgQEILQcMAXp5E7sdkBJtnvF70SdOZ4OWH-9ULk-duETcaxO4izKhjSRKUQA8DkGEWCd7IUEHhgDb"/>
<div className="absolute top-1.5 left-1.5 bg-surface/85 backdrop-blur-md px-1.5 py-0.5 rounded font-label-badge text-label-badge text-secondary">
            1.4 km
          </div>
</div>
<div className="flex flex-col">
<span className="font-headline-sm text-body-sm font-bold truncate text-on-surface">Refugio Izandorre</span>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">Refugio de emergencia SOS</span>
</div>
</div>
{/*  Card Waypoint 2  */}
<div className="bg-surface-container rounded-xl p-2.5 shadow-md flex flex-col gap-2">
<div className="relative h-20 w-full rounded-lg overflow-hidden bg-surface-container-highest">
<img className="w-full h-full object-cover" data-alt="Dense enchanted beech forest of Mount Alduide along the camino route, ancient mossy trees, narrow single-track footpath, soft atmospheric fog" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiO47FI1-l5DTtkobKKQmfWEUe6tLGP-HpHFKcYgQqSFwgzuR1pLS11DUjZwP82Z0fz7Pwc2nPLMORe9yzSZhgq-7QvIgxeWBMHwce_pzSKxxRU4HQELj7u3NA4LNJYSPtQwJkIGDxdKPCBuQ0HgT4Pxz5usIXlJxlc06HaskxikEaTfaQdQBaEVqUD5SunA1RceN8sJhJBvvq7kQnCe1PrelhPNp6EP-4O6fj-vV6"/>
<div className="absolute top-1.5 left-1.5 bg-surface/85 backdrop-blur-md px-1.5 py-0.5 rounded font-label-badge text-label-badge text-primary">
            3.2 km
          </div>
</div>
<div className="flex flex-col">
<span className="font-headline-sm text-body-sm font-bold truncate text-on-surface">Hayedo de Nabala</span>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">Inicio tramo sombrío</span>
</div>
</div>
</div>
</section>
{/*  Panel Inferior de Controles Tácticos (Thumb-Zone Ergonómica)  */}
<section className="px-margin mt-4 flex flex-col gap-3">
{/*  Fila de Acciones Rápidas  */}
<div className="grid grid-cols-2 gap-3">
{/*  Botón Pausa/Reanudar Track  */}
<button
  onClick={() => {
    tracker.toggleTracking();
    showToast(tracker.isTracking ? "Track GPS pausado" : "Track GPS iniciado");
  }}
  className="h-14 rounded-xl bg-surface-container-high active:bg-surface-container-highest text-on-surface font-label-action text-label-action shadow-lg flex items-center justify-center gap-2 transition-all"
  id="btn-pause-track"
>
<span className={`material-symbols-outlined text-2xl ${tracker.isTracking ? 'text-secondary' : 'text-primary'}`}>
  {tracker.isTracking ? 'pause_circle' : 'play_circle'}
</span>
<span>{tracker.isTracking ? 'Pausar Track' : (tracker.elapsedSeconds > 0 ? 'Reanudar Track' : 'Iniciar Track')}</span>
</button>
{/*  Botón Registrar Waypoint / Foto  */}
<button className="h-14 rounded-xl bg-surface-container-high active:bg-surface-container-highest text-on-surface font-label-action text-label-action shadow-lg flex items-center justify-center gap-2 transition-all" id="btn-add-poi">
<span className="material-symbols-outlined text-2xl text-primary">add_a_photo</span>
<span>Hito / Foto</span>
</button>
</div>
{/*  Botón Deslizante Táctico de Seguridad: Finalizar y Guardar Ruta  */}
<div className="relative w-full h-16 bg-surface-container-lowest rounded-xl p-1.5 flex items-center shadow-2xl overflow-hidden" id="slider-container">
{/*  Fondo Informativo  */}
<div className="w-full flex items-center justify-center text-on-surface-variant font-label-action text-label-action tracking-wider uppercase pointer-events-none pl-10">
<span>Deslizar para finalizar</span>
<span className="material-symbols-outlined text-lg text-primary ml-1.5 animate-pulse">chevron_right</span>
</div>
{/*  Tirador Deslizante  */}
<div className="absolute left-1.5 top-1.5 bottom-1.5 w-14 rounded-lg bg-primary text-on-primary flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md z-10 transition-transform" id="slider-handle">
<span className="material-symbols-outlined text-3xl font-bold">check</span>
</div>
</div>
{/*  Píldora de Advertencia de Seguridad & Batería  */}
<div className="flex items-center justify-between px-2 py-1 text-on-surface-variant font-label-telemetry-sm text-label-telemetry-sm">
<span className="flex items-center gap-1.5 text-primary">
<span className="material-symbols-outlined text-sm">battery_charging_full</span>
<span>BAT 78% (Ahorro GPS)</span>
</span>
<span className="flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-sm">wifi_off</span>
<span>MODO OFFLINE ACTIVO</span>
</span>
</div>
</section>
</div>

      </main>

      <div className="fixed bottom-4 inset-x-4 z-40 max-w-lg mx-auto flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              tracker.toggleTracking();
              showToast(tracker.isTracking ? "Track GPS pausado" : "Track GPS iniciado");
            }}
            className={`h-14 rounded-2xl flex items-center justify-center gap-2 shadow-xl font-label-action text-sm font-bold transition-all border active:scale-95 ${
              tracker.isTracking
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/20'
                : 'bg-primary text-on-primary border-primary shadow-primary/20'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${tracker.isTracking ? 'text-amber-400' : 'text-on-primary'}`}>
              {tracker.isTracking ? 'pause_circle' : 'play_circle'}
            </span>
            <span>{tracker.isTracking ? 'Pausar Track' : (tracker.elapsedSeconds > 0 ? 'Reanudar Track' : 'Iniciar Track')}</span>
          </button>

          <button
            onClick={() => showToast("Hito fotográfico registrado con coordenadas UTM")}
            className="h-14 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-surface-container-highest flex items-center justify-center gap-2 shadow-xl font-label-action text-sm font-bold active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-2xl text-primary">add_a_photo</span>
            <span>Hito / Foto</span>
          </button>
        </div>

        <div className="relative w-full h-16 bg-surface-container-lowest rounded-2xl p-1.5 flex items-center shadow-2xl border border-surface-container-high overflow-hidden">
          <div className="w-full flex items-center justify-center text-on-surface-variant font-label-action text-xs tracking-wider uppercase pointer-events-none select-none pl-12">
            <span>Pulsar para finalizar ruta</span>
            <span className="material-symbols-outlined text-base text-primary ml-1.5 animate-pulse">chevron_right</span>
          </div>

          <button
            onClick={handleFinishRoute}
            className="absolute left-1.5 top-1.5 bottom-1.5 w-14 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer hover:bg-primary-container"
            title="Finalizar Ruta"
          >
            <span className="material-symbols-outlined text-2xl font-bold">check</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-container-highest/95 border border-primary/40 text-on-surface px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fade-in font-label-action text-sm">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
