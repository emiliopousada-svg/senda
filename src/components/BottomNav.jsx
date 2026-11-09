import React from 'react';

export default function BottomNav({ activeScreen, onNavigate }) {
  const tabs = [
    { id: 'tracker', label: 'Inicio', icon: 'dashboard' },
    { id: 'map', label: 'Mapa GPS', icon: 'explore' },
    { id: 'hud', label: 'Camino', icon: 'navigation' },
    { id: 'detail', label: 'Rutas', icon: 'altitude' },
    { id: 'hostels', label: 'Albergues', icon: 'night_shelter' },
    { id: 'settings', label: 'Ajustes', icon: 'settings_bluetooth' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-surface-container/95 backdrop-blur-xl border-t border-surface-container-high shadow-[0_-4px_24px_rgba(0,0,0,0.5)] pb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[50px] py-1 transition-all relative group ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              {/* Active Pip Indicator */}
              {isActive && (
                <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#4edea3]"></span>
              )}

              <span className={`material-symbols-outlined text-2xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                {tab.icon}
              </span>

              <span className="font-label-action text-[10px] tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
