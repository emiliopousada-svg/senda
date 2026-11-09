import React, { useState } from 'react';
import etapasData from '../data/etapas.json';
import useGeolocation from '../hooks/useGeolocation';

export default function StagesHostelsScreen({ onNavigate }) {
  const geo = useGeolocation({ enableHighAccuracy: true });
  const [selectedStageId, setSelectedStageId] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'free' | 'municipal' | 'wifi'
  const [toastMsg, setToastMsg] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [bookedHostels, setBookedHostels] = useState({});

  const currentStage = etapasData.find(e => e.id === selectedStageId) || etapasData[0];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCall = (hostel) => {
    showToast(`Iniciando llamada con ${hostel.nombre}: ${hostel.telefono}`);
  };

  const handleBook = (hostel) => {
    setBookedHostels(prev => ({
      ...prev,
      [hostel.id]: true
    }));
    showToast(`¡Cama reservada en ${hostel.nombre}! Se ha enviado un bono SMS a tu teléfono.`);
  };

  // Filter hostels
  const filteredHostels = currentStage.albergues.filter(hostel => {
    if (activeFilter === 'free') return hostel.plazasLibres > 5;
    if (activeFilter === 'municipal') return hostel.tipo.toLowerCase().includes('municipal') || hostel.tipo.toLowerCase().includes('parroquial');
    if (activeFilter === 'wifi') return hostel.servicios.some(s => s.toLowerCase().includes('wifi'));
    return true;
  });

  return (
    <div className="relative min-h-screen bg-surface text-on-surface flex flex-col pb-28 selection:bg-primary/20">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-30 bg-surface/90 backdrop-blur-md pt-safe border-b border-surface-container-high shadow-lg">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              alt="Senda GPS Logo"
              className="h-8 w-auto object-contain shrink-0"
              src="https://lh3.googleusercontent.com/aida/ALJJyrAJoC6ReqymPw02uDg-jfQoZASl8ttZ4dc1sq5LJ2FKn_VUPCK09_sEpSbcGhsEtLJdBBydoALBAYYrtWdgjjsCBGwDNeDZqnH3dZBYileEiYkF_waSeJUVaftVPOGA-ZHkNpwnyR-qHkOOOUpMzU8lI0fdjKQDYn-Q5AJK7PLZTS5wai8TELvOuhtW4lDVkPhr7_xAP4Fb8O4R6ISRUrV-punAi1PzBEm_RC13kAJr3A"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-primary font-headline-sm text-sm font-bold tracking-tight truncate">SENDA</span>
                <span className="font-label-badge text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">ALBERGUES</span>
              </div>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                Etapa {currentStage.numero}: {currentStage.origen.split('-')[0]} → {currentStage.destino.split('/')[0]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-surface-container-high/90 px-2 py-1 rounded-full text-xs border border-surface-container-highest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-telemetry-sm text-[11px] font-bold text-primary">{geo.accuracyFormatted}</span>
            </div>
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy_j0kwkb3Wq-SY77wXSguMRm2pfGUsjR-FNaf7t_95X1Np8GpW9M8PMb58Frk7Ncok-OfKKRE1KR8FqnCJ_ppAgVSJWCR4AACCjDyde0dYEJZkZYwfUoj8SNwmpOxVMAccdCaWbjagMckFoKMAAI9RhDNGz-6pY_3E-IDi496xVrK5BB4Fky2AGtZsDEhnbWftEqXdjM1Vv_5T31scLUR0G8D21mnYzdqg9mmwLCf"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface max-w-4xl mx-auto">
        {/* GPS Live Telemetry Sub-Banner */}
        <div className="mx-4 mt-3 bg-surface-container-lowest/90 border border-primary/30 p-2.5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shrink-0"></span>
            <div className="min-w-0">
              <span className="font-label-telemetry-sm text-xs font-bold text-on-surface tracking-wide truncate block">
                {geo.coordsDMS}
              </span>
              <span className="font-body-sm text-[10px] text-on-surface-variant truncate block">
                Alt: <strong className="text-primary">{geo.altitudeFormatted}</strong> • Vel: <strong className="text-secondary">{geo.speedKmh} km/h</strong> • Hacia {currentStage.destino}
              </span>
            </div>
          </div>
          <button
            onClick={geo.toggleSimulation}
            className="px-2 py-1 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-surface-container-highest text-[10px] font-label-badge text-primary font-bold active:scale-95 shrink-0 ml-2"
          >
            {geo.isSimulating ? 'SIM: ON' : 'SIM: OFF'}
          </button>
        </div>

        {/* Tactical Stage Selector Dropdown */}
        <section className="px-4 mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-badge text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Etapa Activa del Camino
            </span>
            <span className="font-label-badge text-[10px] text-primary font-bold">
              {currentStage.distanciaKm} KM • +{currentStage.desnivelPositivoM}m
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(o => !o)}
              className="w-full flex items-center justify-between bg-surface-container-high px-4 py-3 rounded-2xl shadow-md text-left border border-surface-container-highest active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-2xl">hiking</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-sm font-bold text-on-surface truncate">
                      Etapa {currentStage.numero}: {currentStage.titulo}
                    </span>
                    <span className="font-label-badge text-[10px] bg-primary text-on-primary px-1.5 py-0.5 rounded font-bold">
                      ACTIVA
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant truncate">
                    {currentStage.tiempoEstimado} • Dificultad: {currentStage.dificultad}
                  </p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Dropdown Menu with all 5 Stages */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-highest rounded-2xl p-2 shadow-2xl z-40 border border-outline-variant flex flex-col gap-1.5 animate-fade-in">
                {etapasData.map(etapa => {
                  const isSelected = etapa.id === selectedStageId;
                  return (
                    <button
                      key={etapa.id}
                      onClick={() => {
                        setSelectedStageId(etapa.id);
                        setIsDropdownOpen(false);
                        showToast(`Etapa ${etapa.numero}: ${etapa.titulo}`);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-primary/20 text-primary font-bold border border-primary/30'
                          : 'hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {etapa.numero}
                        </span>
                        <span className="text-xs truncate">{etapa.titulo}</span>
                      </div>
                      <span className="font-label-telemetry-sm text-[11px] text-on-surface-variant shrink-0 ml-2">
                        {etapa.distanciaKm} km
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Digital Credential Summary Card */}
        <section className="px-4 mt-3">
          <div className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-3xl p-4 shadow-xl border border-primary/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">approval</span>
                </span>
                <div>
                  <span className="font-label-badge text-xs font-bold text-secondary">CREDENCIAL DEL PEREGRINO</span>
                  <div className="font-headline-sm text-sm font-bold text-on-surface">Etapa {currentStage.numero} de 33 · {currentStage.destino}</div>
                </div>
              </div>
              <span className="font-label-badge text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold border border-primary/30">
                {currentStage.albergues.length} ALBERGUES
              </span>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
              {currentStage.descripcion}
            </p>
          </div>
        </section>

        {/* Trail Schematic Hitos & Landmarks Breakdown */}
        <section className="px-4 mt-3">
          <div className="bg-surface-container rounded-3xl p-4 border border-surface-container-highest shadow-md flex flex-col gap-2.5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">alt_route</span>
                <span className="font-headline-sm text-sm font-bold text-on-surface">Puntos de Paso de la Etapa</span>
              </div>
              <span className="font-label-badge text-[10px] text-secondary font-bold">
                {currentStage.hitos.length} HITOS
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {currentStage.hitos.map((hito, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-low p-2.5 rounded-2xl flex flex-col justify-between shrink-0 min-w-[130px] border border-surface-container-highest"
                >
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="font-label-badge text-[10px] text-primary font-bold">km {hito.km}</span>
                    <span className="material-symbols-outlined text-sm text-secondary">{hito.icono}</span>
                  </div>
                  <span className="font-headline-sm text-xs font-bold text-on-surface truncate">{hito.nombre}</span>
                  <span className="font-label-telemetry-sm text-[10px] text-on-surface-variant mt-0.5">{hito.alt}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hostels Directory & Availability Section */}
        <section className="px-4 mt-3 mb-6">
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">Albergues de la Etapa</h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Disponibilidad en tiempo real en {currentStage.destino}
                </p>
              </div>
              <span className="font-label-badge text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary font-bold border border-primary/30">
                {filteredHostels.reduce((acc, h) => acc + h.plazasLibres, 0)} PLAZAS DISPONIBLES
              </span>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'free', label: 'Camas Libres' },
                { id: 'municipal', label: 'Municipales' },
                { id: 'wifi', label: 'Con WiFi' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-label-action font-semibold shrink-0 transition-all border ${
                    activeFilter === f.id
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant border-surface-container-highest'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hostels Cards Grid */}
          <div className="flex flex-col gap-3">
            {filteredHostels.map(hostel => {
              const isBooked = bookedHostels[hostel.id];
              return (
                <article
                  key={hostel.id}
                  className="bg-surface-container border border-surface-container-highest rounded-3xl p-4 shadow-xl flex flex-col gap-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary border border-surface-container-highest shrink-0">
                        <span className="material-symbols-outlined text-2xl">{hostel.icono}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline-sm text-sm font-bold text-on-surface">{hostel.nombre}</h3>
                          <span className="font-label-badge text-[10px] text-secondary font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">star</span>
                            <span>{hostel.puntuacion}</span>
                          </span>
                        </div>
                        <span className="font-body-sm text-xs text-on-surface-variant block mt-0.5">{hostel.tipo}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-label-telemetry-lg text-lg font-bold text-primary block leading-none">{hostel.precio}</span>
                      <span className="font-body-sm text-[10px] text-on-surface-variant">por noche</span>
                    </div>
                  </div>

                  {/* Beds Availability Indicator */}
                  <div className="bg-surface-container-low p-2.5 rounded-2xl flex flex-col gap-1.5 border border-surface-container-highest">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-body-sm text-on-surface-variant">Disponibilidad de Camas</span>
                      <span className="font-label-badge text-xs font-bold text-primary">
                        {hostel.plazasLibres} de {hostel.plazas} libres
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${(hostel.plazasLibres / hostel.plazas) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Services Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {hostel.servicios.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-surface-container-high text-[11px] font-label-action text-on-surface-variant border border-surface-container-highest"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-container-highest/60">
                    <button
                      onClick={() => handleCall(hostel)}
                      className="py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-action text-xs font-bold flex items-center justify-center gap-1.5 border border-surface-container-highest active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-base text-secondary">phone</span>
                      <span>Llamar</span>
                    </button>

                    <button
                      onClick={() => handleBook(hostel)}
                      className={`py-2.5 rounded-xl font-label-action text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${
                        isBooked
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-primary text-on-primary hover:bg-primary-container shadow-primary/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isBooked ? 'check_circle' : 'book_online'}
                      </span>
                      <span>{isBooked ? 'Cama Reservada' : 'Reservar Cama'}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* Floating Action Shortcut to Map */}
      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={() => onNavigate('map')}
          className="h-12 px-4 rounded-full bg-primary text-on-primary font-label-action text-xs font-bold shadow-2xl flex items-center gap-2 hover:bg-primary-container active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-xl">map</span>
          <span>Ver Mapa Topo</span>
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
