import React, { useState } from 'react';

export default function SettingsBluetoothScreen({ onNavigate }) {
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="relative min-h-screen bg-surface text-on-surface flex flex-col pb-24 selection:bg-primary/20">
      <header className="fixed top-0 inset-x-0 z-30 bg-surface/90 backdrop-blur-md pt-safe border-b border-surface-container-high shadow-lg">
        <div className="h-16 px-margin flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0"><img alt="Senda GPS Logo" className="h-8 w-auto object-contain shrink-0" src="https://lh3.googleusercontent.com/aida/ALJJyrAJoC6ReqymPw02uDg-jfQoZASl8ttZ4dc1sq5LJ2FKn_VUPCK09_sEpSbcGhsEtLJdBBydoALBAYYrtWdgjjsCBGwDNeDZqnH3dZBYileEiYkF_waSeJUVaftVPOGA-ZHkNpwnyR-qHkOOOUpMzU8lI0fdjKQDYn-Q5AJK7PLZTS5wai8TELvOuhtW4lDVkPhr7_xAP4Fb8O4R6ISRUrV-punAi1PzBEm_RC13kAJr3A"/><div className="flex flex-col min-w-0"><div className="flex items-center gap-space-xs"><span className="text-primary font-headline-sm font-bold tracking-tight truncate">SENDA</span><span className="font-label-badge text-label-badge bg-primary/20 text-primary px-1.5 py-0.5 rounded">GPS</span></div><h1 className="font-body-sm text-body-sm text-on-surface-variant truncate uppercase tracking-wider">Camino</h1></div></div><div className="flex items-center gap-space-sm shrink-0"><div className="flex items-center gap-space-xs bg-surface-container-high/90 px-2.5 py-1.5 rounded-full"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span className="font-label-telemetry-sm text-label-telemetry-sm text-primary tracking-tight font-semibold">±3m</span><span className="text-outline-variant font-label-telemetry-sm">•</span><span className="material-symbols-outlined text-secondary text-base leading-none">cloud_off</span><span className="font-label-badge text-label-badge text-on-surface-variant font-medium">OFFLINE</span></div><img alt="Profile" className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-primary/40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy_j0kwkb3Wq-SY77wXSguMRm2pfGUsjR-FNaf7t_95X1Np8GpW9M8PMb58Frk7Ncok-OfKKRE1KR8FqnCJ_ppAgVSJWCR4AACCjDyde0dYEJZkZYwfUoj8SNwmpOxVMAccdCaWbjagMckFoKMAAI9RhDNGz-6pY_3E-IDi496xVrK5BB4Fky2AGtZsDEhnbWftEqXdjM1Vv_5T31scLUR0G8D21mnYzdqg9mmwLCf"/></div></div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
<div className="px-margin pt-space-sm pb-space-lg flex flex-col gap-space-lg">
{/*  Context Header & System Vital HUD  */}
<section className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-badge text-label-badge text-primary tracking-wider uppercase">Senda OS • Hardware</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Ajustes &amp; Sensores</h2>
</div>
<div className="flex items-center gap-space-xs bg-surface-container-high px-3 py-1.5 rounded-full shadow-sm">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-primary uppercase">BLE Activo</span>
</div>
</div>
{/*  Quick Telemetry Bento Grid  */}
<div className="grid grid-cols-3 gap-2 mt-1">
<div className="bg-surface-container-low p-3 rounded-xl flex flex-col justify-between shadow-sm">
<div className="flex items-center justify-between text-on-surface-variant">
<span className="material-symbols-outlined text-lg text-primary">bluetooth_searching</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-primary">3/5</span>
</div>
<div className="mt-2">
<p className="font-label-telemetry-md text-label-telemetry-md text-on-surface font-semibold">BLE 5.3</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Sensores</p>
</div>
</div>
<div className="bg-surface-container-low p-3 rounded-xl flex flex-col justify-between shadow-sm">
<div className="flex items-center justify-between text-on-surface-variant">
<span className="material-symbols-outlined text-lg text-secondary">battery_horiz_075</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-secondary">78%</span>
</div>
<div className="mt-2">
<p className="font-label-telemetry-md text-label-telemetry-md text-on-surface font-semibold">14h 20m</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Expedición</p>
</div>
</div>
<div className="bg-surface-container-low p-3 rounded-xl flex flex-col justify-between shadow-sm">
<div className="flex items-center justify-between text-on-surface-variant">
<span className="material-symbols-outlined text-lg text-tertiary">sd_card</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-tertiary">IGN</span>
</div>
<div className="mt-2">
<p className="font-label-telemetry-md text-label-telemetry-md text-on-surface font-semibold">1.4 GB</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Cartografía</p>
</div>
</div>
</div>
</section>
{/*  BLE Devices & Sensors Section  */}
<section className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-xl">devices</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Sensores Bluetooth (BLE)</h3>
</div>
<span className="font-label-badge text-label-badge text-on-surface-variant">3 VINCULADOS</span>
</div>
{/*  Device Card 1: Watch  */}
<div className="bg-surface-container-low p-4 rounded-xl shadow-md flex flex-col gap-3">
<div className="flex items-start justify-between">
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0 shadow-inner">
<span className="material-symbols-outlined text-2xl">watch</span>
</div>
<div className="min-w-0">
<div className="flex items-center gap-2">
<h4 className="font-headline-sm text-headline-sm text-on-surface truncate">Garmin Fēnix 7 Pro</h4>
<span className="bg-primary/20 text-primary font-label-badge text-label-badge px-2 py-0.5 rounded-full flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span> CONECTADO
                </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Sync contínua: FC + Altimetría barométrica</p>
</div>
</div>
</div>
<div className="grid grid-cols-3 gap-2 bg-surface-container rounded-lg p-2.5">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant">Batería</span>
<div className="flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-base">battery_5_bar</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm font-semibold">84%</span>
</div>
</div>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant">Pulso Vivo</span>
<div className="flex items-center gap-1 text-error">
<span className="material-symbols-outlined text-base animate-pulse">favorite</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm font-semibold">74 bpm</span>
</div>
</div>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant">Cadencia</span>
<div className="flex items-center gap-1 text-tertiary">
<span className="material-symbols-outlined text-base">directions_walk</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm font-semibold">88 spm</span>
</div>
</div>
</div>
<div className="flex items-center justify-between pt-1">
<button className="flex items-center gap-1.5 text-primary font-label-action text-label-action py-2 px-3 rounded-lg hover:bg-surface-container active:scale-95 transition-all" type="button">
<span className="material-symbols-outlined text-base">sync</span> Forzar Sincronización
          </button>
<button className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface" type="button">
<span className="material-symbols-outlined text-lg">tune</span>
</button>
</div>
</div>
{/*  Device Card 2: Chest Strap  */}
<div className="bg-surface-container-low p-4 rounded-xl shadow-md flex items-center justify-between gap-3">
<div className="flex items-center gap-3 min-w-0">
<div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0 shadow-inner">
<span className="material-symbols-outlined text-2xl">ecg_heart</span>
</div>
<div className="min-w-0">
<div className="flex items-center gap-2">
<h4 className="font-headline-sm text-headline-sm text-on-surface truncate">Polar H10</h4>
<span className="bg-primary/20 text-primary font-label-badge text-label-badge px-2 py-0.5 rounded-full flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span> CONECTADO
              </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Banda Torácica EKG • Batería 92% (CR2025)</p>
</div>
</div>
<button className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0" type="button">
<span className="material-symbols-outlined text-lg">more_vert</span>
</button>
</div>
{/*  Device Card 3: Satellite Beacon  */}
<div className="bg-surface-container-low p-4 rounded-xl shadow-md flex flex-col gap-3">
<div className="flex items-start justify-between gap-3">
<div className="flex items-center gap-3 min-w-0">
<div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary shrink-0 shadow-inner">
<span className="material-symbols-outlined text-2xl">satellite_alt</span>
</div>
<div className="min-w-0">
<div className="flex items-center gap-2">
<h4 className="font-headline-sm text-headline-sm text-on-surface truncate">Garmin inReach Mini 2</h4>
<span className="bg-secondary/20 text-secondary font-label-badge text-label-badge px-2 py-0.5 rounded-full flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> EN ESPERA
                </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Red Iridium SOS activa • 4 satélites fijados</p>
</div>
</div>
<button className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0" type="button">
<span className="material-symbols-outlined text-lg">cell_tower</span>
</button>
</div>
<div className="flex items-center justify-between bg-surface-container-high/60 px-3 py-2 rounded-lg">
<span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-base text-secondary">emergency</span> Triggers SOS Vinculados
          </span>
<span className="font-label-badge text-label-badge text-secondary font-medium">RELEVO 112 ACTIVO</span>
</div>
</div>
{/*  Pair New Sensor Button  */}
<button className="w-full h-14 bg-surface-container-high hover:bg-surface-bright active:scale-[0.99] transition-all rounded-xl flex items-center justify-center gap-2 text-primary font-label-action text-label-action shadow-sm mt-1" id="scan-btn" onClick={() => {}} type="button">
<span className="material-symbols-outlined text-xl transition-transform duration-700" id="scan-icon">sync</span>
<span>+ Vincular Nuevo Sensor BLE</span>
</button>
</section>
{/*  GPS & Sensor Calibration Section  */}
<section className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-xl">satellite</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">GPS &amp; Calibración de Sensores</h3>
</div>
<span className="font-label-badge text-label-badge text-primary">GNSS MULTI-BANDA</span>
</div>
<div className="bg-surface-container-low p-4 rounded-xl shadow-md flex flex-col gap-4">
{/*  Frequency Selector  */}
<div className="flex flex-col gap-2">
<div className="flex justify-between items-center">
<label className="font-body-md text-body-md text-on-surface font-semibold">Tasa de Registro GPS</label>
<span className="font-label-badge text-label-badge bg-primary/20 text-primary px-2 py-0.5 rounded">L1 + L5 GNSS</span>
</div>
<div className="grid grid-cols-3 gap-1.5 bg-surface-container p-1 rounded-xl">
<button className="gps-mode-btn py-2.5 px-2 rounded-lg bg-primary text-on-primary font-label-action text-body-sm font-bold flex flex-col items-center gap-0.5 shadow-sm transition-all" data-mode="high" type="button">
<span>Precisión</span>
<span className="font-label-telemetry-sm text-[10px] opacity-90">1s • Dual-Band</span>
</button>
<button className="gps-mode-btn py-2.5 px-2 rounded-lg text-on-surface-variant font-label-action text-body-sm flex flex-col items-center gap-0.5 hover:text-on-surface transition-all" data-mode="balanced" type="button">
<span>Equilibrado</span>
<span className="font-label-telemetry-sm text-[10px] opacity-75">5s • L1 Standard</span>
</button>
<button className="gps-mode-btn py-2.5 px-2 rounded-lg text-on-surface-variant font-label-action text-body-sm flex flex-col items-center gap-0.5 hover:text-on-surface transition-all" data-mode="eco" type="button">
<span>Ultra-Eco</span>
<span className="font-label-telemetry-sm text-[10px] opacity-75">30s • Ultralight</span>
</button>
</div>
</div>
{/*  Barometric Altimeter  */}
<div className="flex items-center justify-between pt-2">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
<span className="material-symbols-outlined text-xl">height</span>
</div>
<div>
<p className="font-body-md text-body-md text-on-surface font-semibold">Altitud Barométrica</p>
<div className="flex items-center gap-2">
<span className="font-label-telemetry-md text-label-telemetry-md text-primary font-bold">1.248 m</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-on-surface-variant">1013.2 hPa</span>
</div>
</div>
</div>
<button className="bg-surface-container hover:bg-surface-bright text-on-surface font-label-action text-body-sm py-2 px-3 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all" type="button">
<span className="material-symbols-outlined text-base text-primary">edit</span> Calibrar Cota
          </button>
</div>
{/*  Compass & Declination  */}
<div className="flex items-center justify-between pt-2">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
<span className="material-symbols-outlined text-xl">explore</span>
</div>
<div>
<p className="font-body-md text-body-md text-on-surface font-semibold">Brújula y Declinación</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Magnética: <span className="text-on-surface font-mono">+1.2° Este</span> (Auto WMM)</p>
</div>
</div>
<button className="bg-surface-container hover:bg-surface-bright text-on-surface font-label-action text-body-sm py-2 px-3 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all" type="button">
<span className="material-symbols-outlined text-base text-secondary">screen_rotation</span> Calibrar 8
          </button>
</div>
</div>
</section>
{/*  Offline Maps & Storage Section  */}
<section className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-xl">map</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Mapas Offline y Memoria</h3>
</div>
<span className="font-label-badge text-label-badge text-on-surface-variant">1.4 GB / 32 GB</span>
</div>
<div className="bg-surface-container-low p-4 rounded-xl shadow-md flex flex-col gap-3">
{/*  Visual Storage Gauge  */}
<div className="flex flex-col gap-1.5">
<div className="flex justify-between items-center font-body-sm text-body-sm">
<span className="text-on-surface-variant">IGN MTN25 + OpenTopo Pirineos</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-primary font-semibold">4.3% ocupado</span>
</div>
<div className="w-full h-2 rounded-full bg-surface-container overflow-hidden flex">
<div className="h-full bg-primary rounded-full" style={{ "width": "14%" }}></div>
<div className="h-full bg-tertiary rounded-full ml-1" style={{ "width": "6%" }}></div>
</div>
<div className="flex items-center gap-3 text-on-surface-variant font-label-badge text-[10px] mt-1">
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Topo IGN (1.1 GB)</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Capas DEM Sombreado (300 MB)</span>
</div>
</div>
{/*  Toggles  */}
<div className="flex flex-col gap-2 pt-2">
{/*  Toggle 1: WiFi Only  */}
<div className="flex items-center justify-between py-1">
<div className="flex flex-col pr-2">
<span className="font-body-md text-body-md text-on-surface font-semibold">Descargar solo vía Wi-Fi</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Protege datos móviles en zonas con poca cobertura</span>
</div>
<button className="toggle-btn w-14 h-8 rounded-full bg-primary p-1 flex items-center justify-end transition-colors cursor-pointer" data-checked="true" type="button">
<span className="w-6 h-6 rounded-full bg-surface-container-lowest shadow-md transform transition-transform"></span>
</button>
</div>
{/*  Toggle 2: Auto Update  */}
<div className="flex items-center justify-between py-1">
<div className="flex flex-col pr-2">
<span className="font-body-md text-body-md text-on-surface font-semibold">Actualizar capas en segundo plano</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Sincroniza cuadrículas antes de iniciar marcha</span>
</div>
<button className="toggle-btn w-14 h-8 rounded-full bg-surface-container p-1 flex items-center justify-start transition-colors cursor-pointer" data-checked="false" type="button">
<span className="w-6 h-6 rounded-full bg-on-surface-variant shadow-md transform transition-transform"></span>
</button>
</div>
</div>
{/*  Action Card to Manage Tiles  */}
<a className="bg-surface-container hover:bg-surface-bright active:scale-[0.99] p-3 rounded-lg flex items-center justify-between text-on-surface mt-1 transition-all" href="#">
<div className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-xl">grid_view</span>
<span className="font-label-action text-body-md font-semibold">Gestionar Cuadrículas Topográficas</span>
</div>
<span className="material-symbols-outlined text-on-surface-variant text-base">chevron_right</span>
</a>
</div>
</section>
{/*  Safety & Expedition Mode Section  */}
<section className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-error text-xl">shield</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Seguridad &amp; Expedición</h3>
</div>
<span className="font-label-badge text-label-badge text-error">ALTA MONTAÑA</span>
</div>
<div className="bg-surface-container-low p-4 rounded-xl shadow-md flex flex-col gap-3">
{/*  Trail Deviation Alert  */}
<div className="flex items-center justify-between py-1">
<div className="flex flex-col pr-2">
<span className="font-body-md text-body-md text-on-surface font-semibold">Alerta de Desvío de Sendero</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Aviso acústico y háptico si te alejas &gt; 25 metros</span>
</div>
<button className="toggle-btn w-14 h-8 rounded-full bg-primary p-1 flex items-center justify-end transition-colors cursor-pointer" data-checked="true" type="button">
<span className="w-6 h-6 rounded-full bg-surface-container-lowest shadow-md transform transition-transform"></span>
</button>
</div>
{/*  Cold / Snow Battery Optimization  */}
<div className="flex items-center justify-between py-1">
<div className="flex flex-col pr-2">
<div className="flex items-center gap-1.5">
<span className="font-body-md text-body-md text-on-surface font-semibold">Modo Batería Frío / Nieve</span>
<span className="material-symbols-outlined text-tertiary text-sm">ac_unit</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Bloquea 30Hz OLED y modula la pantalla bajo 0°C</span>
</div>
<button className="toggle-btn w-14 h-8 rounded-full bg-primary p-1 flex items-center justify-end transition-colors cursor-pointer" data-checked="true" type="button">
<span className="w-6 h-6 rounded-full bg-surface-container-lowest shadow-md transform transition-transform"></span>
</button>
</div>
{/*  SOS Emergency Contacts Setup  */}
<div className="bg-surface-container rounded-lg p-3 flex items-center justify-between mt-1">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center text-error shrink-0">
<span className="material-symbols-outlined text-xl">phone_in_talk</span>
</div>
<div>
<p className="font-body-md text-body-md text-on-surface font-semibold">Contactos de Emergencia</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">112 España + 2 contactos configurados</p>
</div>
</div>
<button className="text-primary font-label-action text-body-sm hover:underline py-1 px-2" type="button">Editar</button>
</div>
</div>
</section>
{/*  Cloud Sync & Jacobean Credentials Section  */}
<section className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-xl">cloud_sync</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Servicios &amp; Sincronización</h3>
</div>
</div>
<div className="bg-surface-container-low p-4 rounded-xl shadow-md flex flex-col gap-3">
<div className="grid grid-cols-2 gap-2">
{/*  Strava  */}
<div className="bg-surface-container p-3 rounded-lg flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-lg">bolt</span>
<span className="font-body-md text-body-md text-on-surface font-semibold">Strava</span>
</div>
<span className="font-label-badge text-label-badge text-primary">ACTIVO</span>
</div>
{/*  Wikiloc  */}
<div className="bg-surface-container p-3 rounded-lg flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-lg">hiking</span>
<span className="font-body-md text-body-md text-on-surface font-semibold">Wikiloc</span>
</div>
<span className="font-label-badge text-label-badge text-primary">ACTIVO</span>
</div>
{/*  Komoot  */}
<div className="bg-surface-container p-3 rounded-lg flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-tertiary text-lg">route</span>
<span className="font-body-md text-body-md text-on-surface font-semibold">Komoot</span>
</div>
<span className="font-label-badge text-label-badge text-on-surface-variant">PAUSADO</span>
</div>
{/*  IGN España  */}
<div className="bg-surface-container p-3 rounded-lg flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-lg">flag</span>
<span className="font-body-md text-body-md text-on-surface font-semibold">IGN ES</span>
</div>
<span className="font-label-badge text-label-badge text-primary">ACTIVO</span>
</div>
</div>
<div className="pt-2 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
<span>Versión Senda Táctica:</span>
<span className="font-label-telemetry-sm text-label-telemetry-sm text-on-surface">v2.4.1 (Build 488 - Offline Core)</span>
</div>
</div>
</section>
{/*  Master Action: Field Calibration & Restart GPS Sensor  */}
<div className="pt-2 pb-6">
<button className="w-full h-14 bg-primary text-on-primary font-label-action text-label-action rounded-xl flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-[0.99] transition-all" type="button">
<span className="material-symbols-outlined text-xl">published_with_changes</span>
<span>Guardar &amp; Reanudar Rastreo GPS</span>
</button>
<p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-2">
        Todos los ajustes se aplican automáticamente en almacenamiento táctico fuera de línea.
      </p>
</div>
</div>
</div>

      </main>

      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-container-highest/95 border border-primary/40 text-on-surface px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fade-in font-label-action text-sm">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
