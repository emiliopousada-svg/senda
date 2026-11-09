import React, { useState } from 'react';

export default function ScreenSwitcher({ activeScreen, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const screens = [
    { id: 'tracker', num: '1', title: 'Pilgrim Tracker (Dashboard)', icon: 'dashboard', tag: 'Inicio' },
    { id: 'map', num: '2', title: 'Mapa Topográfico GPS', icon: 'explore', tag: 'IGN 1:25k' },
    { id: 'hud', num: '3', title: 'Navegación Activa HUD', icon: 'navigation', tag: 'En Vivo' },
    { id: 'detail', num: '4', title: 'Detalle de Ruta & Offline', icon: 'altitude', tag: 'Ficha Etapa' },
    { id: 'hostels', num: '5', title: 'Etapas & Albergues', icon: 'night_shelter', tag: 'Camas' },
    { id: 'settings', num: '6', title: 'Ajustes & Sensores BLE', icon: 'settings_bluetooth', tag: 'Bluetooth' },
  ];

  const current = screens.find(s => s.id === activeScreen) || screens[0];

  return (
    <>
      {/* Floating Tactical Pill */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsOpen(o => !o)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest/95 border border-primary/40 text-on-surface shadow-2xl backdrop-blur-xl hover:border-primary active:scale-95 transition-all text-xs font-label-action"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-bold text-primary">STITCH #{current.num}</span>
          <span className="text-on-surface font-semibold max-w-[140px] truncate">{current.title}</span>
          <span className="material-symbols-outlined text-base text-on-surface-variant">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {/* Switcher Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-16 px-4 animate-fade-in" onClick={() => setIsOpen(false)}>
          <div
            className="w-full max-w-md bg-surface-container border border-outline-variant/80 rounded-3xl p-5 shadow-2xl flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome_motion</span>
                <span className="font-headline-sm text-sm font-bold text-on-surface">Pantallas Importadas de Stitch</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant">
              Proyecto: <strong className="text-on-surface">Rutas y Camino Tracker</strong> • Sistema <span className="text-primary font-semibold">Senda Tactical Outdoor</span>
            </p>

            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              {screens.map((screen) => {
                const isActive = activeScreen === screen.id;
                return (
                  <button
                    key={screen.id}
                    onClick={() => {
                      onNavigate(screen.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-primary/15 border-primary text-on-surface shadow-md shadow-primary/10'
                        : 'bg-surface-container-high hover:bg-surface-container-highest border-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-label-badge font-bold ${
                        isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-primary'
                      }`}>
                        {screen.num}
                      </div>
                      <div>
                        <div className="font-headline-sm text-xs font-bold text-on-surface">{screen.title}</div>
                        <span className="font-label-badge text-[10px] text-on-surface-variant">{screen.tag}</span>
                      </div>
                    </div>

                    <span className="material-symbols-outlined text-lg text-primary">
                      {isActive ? 'radio_button_checked' : 'chevron_right'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
