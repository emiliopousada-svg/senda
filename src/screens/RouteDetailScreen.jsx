import React, { useState } from 'react';
import etapasData from '../data/etapas.json';

export default function RouteDetailScreen({ onNavigate }) {
  const [selectedStageId, setSelectedStageId] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle' | 'downloading' | 'completed'
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  const currentStage = etapasData.find(e => e.id === selectedStageId) || etapasData[0];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDownload = () => {
    if (downloadStatus === 'downloading') return;
    if (downloadStatus === 'completed') {
      showToast(`El paquete offline de ${currentStage.titulo} ya está almacenado.`);
      return;
    }
    setDownloadStatus('downloading');
    setDownloadProgress(20);
    const interval = setInterval(() => {
      setDownloadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setDownloadStatus('completed');
          showToast(`¡Paquete topográfico offline de ${currentStage.titulo} descargado! (${currentStage.tamanioOfflineMB} MB)`);
          return 100;
        }
        return p + 25;
      });
    }, 350);
  };

  // Generate SVG polygon points from dynamic elevationProfile
  const generateSvgPoints = (profile) => {
    if (!profile || profile.length < 2) return '';
    const minAlt = Math.min(...profile.map(p => p.alt));
    const maxAlt = Math.max(...profile.map(p => p.alt));
    const maxKm = profile[profile.length - 1].km || 25;

    const coords = profile.map(p => {
      const x = (p.km / maxKm) * 320;
      // map alt to y range [70, 15]
      const y = 70 - ((p.alt - minAlt) / (maxAlt - minAlt || 1)) * 55;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return {
      polyline: coords.join(' '),
      polygon: `0,80 ${coords.join(' ')} 320,80`
    };
  };

  const svgData = generateSvgPoints(currentStage.elevationProfile);

  return (
    <div className="relative min-h-screen bg-surface text-on-surface flex flex-col pb-28 selection:bg-primary/20">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl pt-safe shadow-[0_4px_20px_rgba(0,0,0,0.35)] border-b border-surface-container-high">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 min-w-0">
            <button
              aria-label="Volver"
              className="w-10 h-10 flex items-center justify-center -ml-2 text-on-surface hover:text-primary transition-colors shrink-0"
              onClick={() => onNavigate("map")}
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm text-sm font-bold text-on-surface truncate tracking-tight">Ficha de Etapa</span>
              <span className="font-label-badge text-[10px] text-primary font-bold">ETAPA {currentStage.numero} DE 5</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => showToast(`Enlace de etapa copiado al portapapeles`)}
              className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              title="Compartir etapa"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
            <button
              onClick={() => showToast(`Etapa ${currentStage.numero} guardada en favoritos`)}
              className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary hover:text-secondary-fixed"
              title="Favoritos"
            >
              <span className="material-symbols-outlined text-lg">bookmark</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface max-w-4xl mx-auto">
        {/* Horizontal Tactical Selector for the 5 Stages */}
        <section className="px-4 pt-3 pb-2 bg-surface-container-lowest/80 border-b border-surface-container-high">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-label-badge text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Seleccionar Etapa (Camino Francés)
            </span>
            <span className="font-label-badge text-[10px] text-primary font-bold">
              {currentStage.distanciaKm} KM • {currentStage.tiempoEstimado}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {etapasData.map(etapa => {
              const isSelected = etapa.id === selectedStageId;
              return (
                <button
                  key={etapa.id}
                  onClick={() => {
                    setSelectedStageId(etapa.id);
                    setDownloadStatus('idle');
                    setDownloadProgress(0);
                    showToast(`Cargando ${etapa.titulo}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-label-action font-semibold shrink-0 border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-surface-container-highest'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isSelected ? 'bg-on-primary text-primary' : 'bg-surface-container-highest text-on-surface'
                  }`}>
                    {etapa.numero}
                  </span>
                  <span>{etapa.origen.split('-')[0]} → {etapa.destino.split('/')[0]}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Hero Visual Card */}
        <section className="relative w-full h-56 bg-surface-container-low overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: selectedStageId === 1
                ? "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwcS4HDnlNS2J6yaeT3nqjzsuHgxNZ9czxEwfduej72DxPA1p2pc-KrLHE4APu7bC4C61dIvnAgA5d3PQLOiUm6TePKTTvPKb8tFzrFcF1X8nKvZ334tfxFWihNnGCyVG_Tl03aUuaCrQEsLscJesR593sNNN8CcQyjrtOCs0cBa_AHjuaKyZ7VFW2g73aH9LxrfiNQSs5CjN5FVaF0o-aCWTg9z6o4SNsvOtUaEcV')"
                : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBAmCWrNmxJpp3ul1FWrc1P_jkjf7Km1ebkFsqQl53cno-eH1y4guEU4voS07MrVURinomr6_TSNEQl0eCge9uee7Q9xMxlDmfNkNKjZ6YyOtA9IUzh_DtYPYbPef02lvZeWU0vi1W10HcT3OJdbWqnfF3h0UNkgKk-L6FRU_4O9OflYQzkwbkmpHTLEElhm4bJg8WiTqhC9jpYRlP22FfNwXYObdM95_LEouM_W5pA')"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent"></div>

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-label-badge font-bold border backdrop-blur-md ${currentStage.dificultadBadgeColor}`}>
              Dificultad: {currentStage.dificultad}
            </span>
            <span className="flex items-center gap-1 bg-surface/85 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-label-telemetry-sm font-semibold text-primary border border-surface-container-highest">
              <span className="material-symbols-outlined text-sm">satellite_alt</span>
              <span>GPS ±2.8m</span>
            </span>
          </div>

          {/* Title and subtitle */}
          <div className="absolute bottom-3 left-4 right-4 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined text-sm">hiking</span>
              <span className="font-label-badge text-xs uppercase tracking-widest font-bold">
                Camino Francés • Etapa 0{currentStage.numero}
              </span>
            </div>
            <h1 className="font-headline-lg text-xl sm:text-2xl font-extrabold text-on-surface leading-tight">
              {direction === 'forward' ? currentStage.titulo : `${currentStage.destino} → ${currentStage.origen}`}
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1 truncate">
              <span className="material-symbols-outlined text-xs text-primary">explore</span>
              <span>Punto culminante: {currentStage.puntoCulminante} ({currentStage.altitudMaxM}m)</span>
            </p>
          </div>
        </section>

        {/* Direction Switcher (Sentido de Marcha) */}
        <section className="px-4 mt-3">
          <div className="bg-surface-container rounded-2xl p-1 flex border border-surface-container-highest">
            <button
              onClick={() => {
                setDirection('forward');
                showToast(`Sentido directo: ${currentStage.origen} → ${currentStage.destino}`);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-label-action font-bold flex items-center justify-center gap-1.5 transition-all ${
                direction === 'forward'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
              <span>Directo ({currentStage.origen.split('-')[0]})</span>
            </button>
            <button
              onClick={() => {
                setDirection('reverse');
                showToast(`Sentido inverso: ${currentStage.destino} → ${currentStage.origen}`);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-label-action font-bold flex items-center justify-center gap-1.5 transition-all ${
                direction === 'reverse'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Inverso ({currentStage.destino.split('/')[0]})</span>
            </button>
          </div>
        </section>

        {/* Telemetry Bento HUD (Dynamic Stage Stats) */}
        <section className="px-4 mt-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-surface-container p-3 rounded-2xl flex flex-col justify-between border border-surface-container-highest">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-body-sm text-[11px] uppercase tracking-wider">Distancia</span>
                <span className="material-symbols-outlined text-sm text-secondary">straighten</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-label-telemetry-lg text-xl text-primary font-bold">{currentStage.distanciaKm}</span>
                <span className="font-label-telemetry-sm text-xs text-on-surface-variant">km</span>
              </div>
              <span className="font-body-sm text-[10px] text-on-surface-variant mt-0.5">Tiempo: {currentStage.tiempoEstimado}</span>
            </div>

            <div className="bg-surface-container p-3 rounded-2xl flex flex-col justify-between border border-surface-container-highest">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-body-sm text-[11px] uppercase tracking-wider">Desnivel +</span>
                <span className="material-symbols-outlined text-sm text-secondary">altitude</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-label-telemetry-lg text-xl text-secondary font-bold">+{currentStage.desnivelPositivoM}</span>
                <span className="font-label-telemetry-sm text-xs text-on-surface-variant">m</span>
              </div>
              <span className="font-body-sm text-[10px] text-on-surface-variant mt-0.5">Bajada: -{currentStage.desnivelNegativoM}m</span>
            </div>

            <div className="bg-surface-container p-3 rounded-2xl flex flex-col justify-between border border-surface-container-highest">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-body-sm text-[11px] uppercase tracking-wider">Cota Máxima</span>
                <span className="material-symbols-outlined text-sm text-primary">landscape</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-label-telemetry-lg text-xl text-on-surface font-bold">{currentStage.altitudMaxM}</span>
                <span className="font-label-telemetry-sm text-xs text-on-surface-variant">m</span>
              </div>
              <span className="font-body-sm text-[10px] text-on-surface-variant mt-0.5 truncate">{currentStage.puntoCulminante.split(' ')[0]}</span>
            </div>

            <div className="bg-surface-container p-3 rounded-2xl flex flex-col justify-between border border-surface-container-highest">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-body-sm text-[11px] uppercase tracking-wider">Ciclabilidad</span>
                <span className="material-symbols-outlined text-sm text-tertiary">pedal_bike</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-label-telemetry-lg text-xl text-tertiary font-bold">{currentStage.ciclabilidad}</span>
                <span className="font-label-telemetry-sm text-xs text-on-surface-variant">BTT</span>
              </div>
              <span className="font-body-sm text-[10px] text-on-surface-variant mt-0.5">Apto alforjas</span>
            </div>
          </div>
        </section>

        {/* Offline Download Control Hub */}
        <section className="px-4 mt-3">
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/60 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  downloadStatus === 'completed'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-surface-container-highest text-secondary'
                }`}>
                  <span className="material-symbols-outlined text-2xl">
                    {downloadStatus === 'completed' ? 'cloud_done' : 'cloud_download'}
                  </span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-sm font-bold text-on-surface">Mapa Topográfico 1:25k Offline</h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    {downloadStatus === 'completed'
                      ? 'Paquete completo guardado en memoria'
                      : `Incluye curvas de nivel e hidrografía (${currentStage.tamanioOfflineMB} MB)`}
                  </p>
                </div>
              </div>

              <span className={`font-label-badge text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                downloadStatus === 'completed'
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'bg-secondary/15 text-secondary border-secondary/30'
              }`}>
                {downloadStatus === 'completed' ? 'LISTO' : `${currentStage.tamanioOfflineMB} MB`}
              </span>
            </div>

            {/* Simulated Progress Bar */}
            {downloadStatus === 'downloading' && (
              <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
            )}

            <button
              onClick={handleDownload}
              className={`w-full py-2.5 rounded-xl text-xs font-label-action font-bold flex items-center justify-center gap-2 transition-all ${
                downloadStatus === 'completed'
                  ? 'bg-surface-container-high text-primary border border-primary/30'
                  : 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-[0.99]'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {downloadStatus === 'completed' ? 'check' : 'download'}
              </span>
              <span>
                {downloadStatus === 'completed'
                  ? 'Paquete Topográfico Listo para Navegación Offline'
                  : downloadStatus === 'downloading'
                  ? `Descargando... ${downloadProgress}%`
                  : `Descargar Paquete Offline (${currentStage.tamanioOfflineMB} MB)`}
              </span>
            </button>
          </div>
        </section>

        {/* Dynamic Elevation Profile Chart */}
        <section className="px-4 mt-3">
          <div className="bg-surface-container rounded-2xl p-4 border border-surface-container-highest shadow-xl flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">area_chart</span>
                <span className="font-headline-sm text-sm font-bold text-on-surface">Perfil Altimétrico Real</span>
              </div>
              <span className="font-label-badge text-xs text-secondary font-bold">
                Max: {currentStage.altitudMaxM}m • Min: {currentStage.altitudMinM}m
              </span>
            </div>

            {/* SVG Profile */}
            <div className="relative w-full h-32 bg-surface-container-lowest rounded-xl p-2 flex flex-col justify-end overflow-hidden border border-surface-container-high">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 320 80">
                <defs>
                  <linearGradient id={`grad-${currentStage.id}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4edea3" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#4edea3" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Horizontal Guide Lines */}
                <line x1="0" x2="320" y1="20" y2="20" stroke="#222a3d" strokeDasharray="2 2" strokeWidth="1" />
                <line x1="0" x2="320" y1="50" y2="50" stroke="#222a3d" strokeDasharray="2 2" strokeWidth="1" />

                {/* Shaded Area */}
                {svgData.polygon && (
                  <polygon fill={`url(#grad-${currentStage.id})`} points={svgData.polygon} />
                )}

                {/* Line */}
                {svgData.polyline && (
                  <polyline fill="none" stroke="#4edea3" strokeWidth="2.5" strokeLinecap="round" points={svgData.polyline} />
                )}
              </svg>

              <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-label-telemetry-sm pt-1 px-1">
                <span>0 km ({currentStage.altitudMinM}m)</span>
                <span className="text-secondary font-bold">Cima: {currentStage.altitudMaxM}m</span>
                <span>{currentStage.distanciaKm} km</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Weather on Summit Card */}
        <section className="px-4 mt-3">
          <div className="bg-surface-container rounded-2xl p-4 border border-surface-container-highest shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary border border-surface-container-highest">
                <span className="material-symbols-outlined text-2xl">{currentStage.meteo.icono}</span>
              </div>
              <div>
                <span className="font-label-badge text-[10px] text-secondary font-bold uppercase">Meteo en {currentStage.puntoCulminante}</span>
                <h4 className="font-headline-sm text-sm font-bold text-on-surface mt-0.5">{currentStage.meteo.condicion}</h4>
                <span className="font-body-sm text-[11px] text-on-surface-variant">Sensación: {currentStage.meteo.sensacion} • Viento: {currentStage.meteo.viento}</span>
              </div>
            </div>

            <span className="font-label-telemetry-lg text-2xl font-bold text-on-surface">
              {currentStage.meteo.temperatura}
            </span>
          </div>
        </section>

        {/* Technical Terrain Specifications */}
        <section className="px-4 mt-3">
          <div className="bg-surface-container rounded-2xl p-4 border border-surface-container-highest shadow-md flex flex-col gap-3">
            <button
              onClick={() => setIsSpecsOpen(o => !o)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
                <h4 className="font-headline-sm text-sm font-bold text-on-surface">Ficha Técnica del Firme</h4>
              </div>
              <span className={`material-symbols-outlined text-lg text-on-surface-variant transition-transform ${isSpecsOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {isSpecsOpen && (
              <div className="flex flex-col gap-2.5 pt-2 border-t border-surface-container-highest/60 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px]">
                    <span className="text-on-surface-variant">Sendero Rocoso / Pedregoso</span>
                    <span className="text-primary font-bold">{currentStage.terreno.senderoRocoso}%</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${currentStage.terreno.senderoRocoso}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-[11px]">
                    <span className="text-on-surface-variant">Pistas Forestales y Tierra</span>
                    <span className="text-secondary font-bold">{currentStage.terreno.pistaForestal}%</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: `${currentStage.terreno.pistaForestal}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-[11px]">
                    <span className="text-on-surface-variant">Asfalto y Pistas Rurales</span>
                    <span className="text-on-surface font-bold">{currentStage.terreno.asfalto}%</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                    <div className="bg-outline h-full rounded-full" style={{ width: `${currentStage.terreno.asfalto}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Hitos & Waypoints of the Stage */}
        <section className="px-4 mt-3 mb-6">
          <div className="bg-surface-container rounded-2xl p-4 border border-surface-container-highest shadow-md flex flex-col gap-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline-sm text-sm font-bold text-on-surface">Hitos y Puntos Clave</span>
              <span className="font-label-badge text-xs text-primary font-bold">{currentStage.hitos.length} Puntos</span>
            </div>

            <div className="flex flex-col gap-2">
              {currentStage.hitos.map((hito, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low text-xs border border-surface-container-highest/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-sm">{hito.icono}</span>
                    </div>
                    <span className="font-headline-sm text-xs font-semibold text-on-surface truncate">{hito.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-label-badge text-[10px] text-secondary font-bold">km {hito.km}</span>
                    <span className="font-label-telemetry-sm text-[11px] text-on-surface-variant">({hito.alt})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Primary Sticky Action Bar: Iniciar Navegación */}
      <div className="fixed bottom-4 inset-x-4 z-40 max-w-lg mx-auto">
        <button
          onClick={() => onNavigate('hud')}
          className="w-full h-14 rounded-2xl bg-primary text-on-primary font-label-action text-base font-bold flex items-center justify-center gap-2 shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-2xl font-bold">navigation</span>
          <span>Iniciar Navegación Activa HUD</span>
        </button>
      </div>

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
