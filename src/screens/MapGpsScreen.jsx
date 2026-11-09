import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useGpsTracker from '../hooks/useGpsTracker';

// Centro en Galicia: Santiago de Compostela (Praza do Obradoiro / Catedral)
const santiagoCoords = [42.8782, -8.5448];

// Coordenadas de la ruta de ejemplo completa (O Pedrouzo → Monte do Gozo → Catedral de Santiago)
const galiciaRouteExample = [
  [42.9065, -8.3615], // 1. Punto de Inicio: O Pedrouzo / Arca (290m)
  [42.9050, -8.3900], // Amenal
  [42.9035, -8.4200], // San Paio
  [42.9015, -8.4485], // Lavacolla (Río del ritual de purificación, 310m)
  [42.8950, -8.4750], // Vilamaior
  [42.8910, -8.4890], // Subida al Monte do Gozo
  [42.8872, -8.4975], // 2. Albergue Intermedio: Monte do Gozo (380m)
  [42.8850, -8.5200], // Barrio de San Lázaro
  [42.8810, -8.5320], // Rúa de San Pedro
  [42.8795, -8.5390], // Porta do Camiño
  [42.8788, -8.5420], // Praza de Cervantes
  [42.8782, -8.5448], // 3. Destino de la Etapa: Catedral de Santiago / Praza do Obradoiro (260m)
];

// Puntos clave requeridos con metadatos para popups interactivos
const stageMilestones = {
  inicio: {
    id: 'inicio-pedrouzo',
    titulo: 'Punto de Inicio: O Pedrouzo',
    pos: [42.9065, -8.3615],
    badge: 'SALIDA DE ETAPA • KM 0.0',
    altitud: '290 m',
    distanciaRestante: '19.4 km a Santiago',
    descripcion: 'Punto de partida de la última jornada del Camino Francés. Vía rural arbolada entre eucaliptales y pastizales gallegos con todos los servicios para el peregrino.',
    icono: 'hiking',
    color: '#10b981'
  },
  albergue: {
    id: 'albergue-gozo',
    titulo: 'Albergue Intermedio: Monte do Gozo',
    pos: [42.8872, -8.4975],
    badge: 'KM 14.7 • 85 CAMAS LIBRES',
    altitud: '380 m',
    precio: '14 € / noche',
    telefono: '+34 981 558 942',
    servicios: ['WiFi alta velocidad', 'Terraza panorámica', 'Restaurante / Bar', 'Cocina comunitaria', 'Lavandería', 'Taquillas individuales'],
    descripcion: 'El mayor y más emblemático complejo de albergues del Camino. Desde su mirador se divisan por primera vez las torres barrocas de la Catedral de Santiago de Compostela.',
    icono: 'night_shelter',
    color: '#ff9f1c'
  },
  destino: {
    id: 'destino-catedral',
    titulo: 'Destino: Catedral de Santiago de Compostela',
    pos: [42.8782, -8.5448],
    badge: 'META JACOBEA • KM 0.0 OFICIAL',
    altitud: '260 m',
    distanciaCompletada: '19.4 km recorridos hoy',
    descripcion: 'Praza do Obradoiro. Meta absoluta de todas las peregrinaciones jacobeas. Acceso a la Oficina del Peregrino para la obtención de la Compostela y sellado oficial.',
    icono: 'flag',
    color: '#4edea3'
  }
};

// 1. Marcador táctico personalizado para Punto de Inicio
const createStartIcon = () => L.divIcon({
  className: 'custom-start-marker',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="background: #10b981; color: #003824; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); letter-spacing: 0.5px; border: 1px solid #4edea3; margin-bottom: 2px;">
        INICIO
      </div>
      <div style="background: #0b1326; border: 2.5px solid #10b981; width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(16, 185, 129, 0.75);">
        <span class="material-symbols-outlined" style="font-size: 22px; color: #10b981;">hiking</span>
      </div>
      <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #10b981; margin-top: -1px;"></div>
    </div>
  `,
  iconSize: [64, 64],
  iconAnchor: [32, 62],
  popupAnchor: [0, -60]
});

// 2. Marcador táctico personalizado para Albergue Intermedio
const createHostelIcon = () => L.divIcon({
  className: 'custom-hostel-marker',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="background: #ff9f1c; color: #472a00; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); letter-spacing: 0.5px; border: 1px solid #ffb95f; margin-bottom: 2px;">
        ALBERGUE
      </div>
      <div style="background: #0b1326; border: 2.5px solid #ff9f1c; width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(255, 159, 28, 0.75);">
        <span class="material-symbols-outlined" style="font-size: 22px; color: #ff9f1c;">night_shelter</span>
      </div>
      <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #ff9f1c; margin-top: -1px;"></div>
    </div>
  `,
  iconSize: [72, 64],
  iconAnchor: [36, 62],
  popupAnchor: [0, -60]
});

// 3. Marcador táctico personalizado para Destino de la Etapa (Catedral)
const createDestIcon = () => L.divIcon({
  className: 'custom-dest-marker',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="background: #4edea3; color: #003824; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); letter-spacing: 0.5px; border: 1px solid #6ffbbe; margin-bottom: 2px;">
        META
      </div>
      <div style="background: #0b1326; border: 2.5px solid #4edea3; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(78, 222, 163, 0.9);">
        <span class="material-symbols-outlined" style="font-size: 24px; color: #4edea3;">flag</span>
      </div>
      <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #4edea3; margin-top: -1px;"></div>
    </div>
  `,
  iconSize: [64, 66],
  iconAnchor: [32, 64],
  popupAnchor: [0, -62]
});

// 4. Marcador circular azul/naranja pulsante en la posición actual del usuario
const createUserPosIcon = (heading = 0, isTracking = false) => L.divIcon({
  className: 'custom-user-pulsing-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 52px; height: 52px;">
      <!-- Onda de radar exterior pulsante -->
      <div style="position: absolute; width: 48px; height: 48px; border-radius: 50%; background: ${isTracking ? 'rgba(255, 159, 28, 0.35)' : 'rgba(0, 210, 255, 0.35)'}; border: 1.5px solid ${isTracking ? '#ff9f1c' : '#00e5ff'}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <!-- Halo concéntrico con resplandor táctico -->
      <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${isTracking ? 'rgba(255, 159, 28, 0.2)' : 'rgba(0, 210, 255, 0.2)'}; border: 2px solid ${isTracking ? '#ff9f1c' : '#00d2ff'}; box-shadow: 0 0 16px ${isTracking ? 'rgba(255, 159, 28, 0.85)' : 'rgba(0, 229, 255, 0.85)'};"></div>
      <!-- Núcleo circular táctico con rumbo -->
      <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background: ${isTracking ? '#ff9f1c' : '#00d2ff'}; border: 2.5px solid #0b1326; box-shadow: 0 0 12px ${isTracking ? '#ff9f1c' : '#00d2ff'}; display: flex; align-items: center; justify-content: center;">
        <span class="material-symbols-outlined" style="font-size: 14px; color: #0b1326; font-weight: 900; transform: rotate(${heading}deg); transition: transform 0.3s ease;">navigation</span>
      </div>
    </div>
  `,
  iconSize: [52, 52],
  iconAnchor: [26, 26],
  popupAnchor: [0, -26]
});

// Controlador de mapa Leaflet para desplazamiento suave
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapGpsScreen({ onNavigate }) {
  const tracker = useGpsTracker();
  const [activeLayer, setActiveLayer] = useState('opentopo');
  const [isTopoDark, setIsTopoDark] = useState(true);
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(santiagoCoords);
  const [mapZoom, setMapZoom] = useState(13);
  const [toastMsg, setToastMsg] = useState(null);
  const [compassHeading, setCompassHeading] = useState(-45);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCenterOnUser = () => {
    if (tracker.latitude && tracker.longitude) {
      setMapCenter([tracker.latitude, tracker.longitude]);
      setMapZoom(16);
      showToast(`Centrado en mi ubicación: ${tracker.latitude.toFixed(4)}, ${tracker.longitude.toFixed(4)}`);
    } else {
      showToast("Buscando señal GPS actual...");
    }
  };

  const layersConfig = {
    opentopo: {
      name: 'OpenTopoMap (Topográfico 1:25k)',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
      maxZoom: 17,
      desc: 'Curvas de nivel oficiales, orografía gallega y senderos rurales',
      icon: 'landscape'
    },
    dark: {
      name: 'CartoDB Dark Matter',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap',
      maxZoom: 19,
      desc: 'Fondo táctico negro puro para optimizar batería OLED',
      icon: 'dark_mode'
    },
    sat: {
      name: 'Satélite HD (Esri Imagery)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri, Earthstar Geographics',
      maxZoom: 18,
      desc: 'Ortofotografía aérea satelital del trazado jacobeo',
      icon: 'satellite_alt'
    },
    cyclosm: {
      name: 'CyclOSM / Senderismo',
      url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors | CyclOSM',
      maxZoom: 18,
      desc: 'Red senderista y caminos rurales con cotas altimétricas',
      icon: 'hiking'
    }
  };

  const handleRecenter = () => {
    setMapCenter([...santiagoCoords]);
    setMapZoom(14);
    showToast("Centrando mapa en Santiago de Compostela (Praza do Obradoiro)");
  };

  const handleCompassClick = () => {
    setCompassHeading(h => h - 45);
    showToast("Brújula orientada: Rumbo directo a las torres de la Catedral");
  };

  const handleZoomIn = () => setMapZoom(z => Math.min(z + 1, 18));
  const handleZoomOut = () => setMapZoom(z => Math.max(z - 1, 9));

  const focusMilestone = (milestoneKey) => {
    const item = stageMilestones[milestoneKey];
    if (item) {
      setMapCenter(item.pos);
      setMapZoom(15);
      showToast(`Enfocando ${item.titulo}`);
    }
  };

  return (
    <div className="relative w-full h-screen bg-surface text-on-surface overflow-hidden flex flex-col select-none">
      {/* 1. Header Táctico Superior Flotante (z-30) */}
      <header className="fixed top-0 inset-x-0 z-30 bg-surface/90 backdrop-blur-md pt-safe border-b border-surface-container-high shadow-lg">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-5xl mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              alt="Senda GPS Logo"
              className="h-8 w-auto object-contain shrink-0"
              src="https://lh3.googleusercontent.com/aida/ALJJyrAJoC6ReqymPw02uDg-jfQoZASl8ttZ4dc1sq5LJ2FKn_VUPCK09_sEpSbcGhsEtLJdBBydoALBAYYrtWdgjjsCBGwDNeDZqnH3dZBYileEiYkF_waSeJUVaftVPOGA-ZHkNpwnyR-qHkOOOUpMzU8lI0fdjKQDYn-Q5AJK7PLZTS5wai8TELvOuhtW4lDVkPhr7_xAP4Fb8O4R6ISRUrV-punAi1PzBEm_RC13kAJr3A"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-sm font-bold tracking-tight text-on-surface truncate">SENDA GPS</span>
                <span className="font-label-badge text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold">
                  GALICIA LIVE
                </span>
              </div>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                OPENTOPOMAP • RUTA A SANTIAGO (19.4 KM)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-surface-container-high/90 px-2.5 py-1 rounded-full border border-surface-container-highest text-xs">
              <span className={`material-symbols-outlined text-sm ${tracker.isSimulating ? 'text-secondary' : 'text-primary'}`}>
                {tracker.isSimulating ? 'smart_toy' : 'satellite'}
              </span>
              <span className="font-label-telemetry-sm text-[11px] font-bold text-on-surface">
                {tracker.isSimulating ? 'SIMULADOR' : (tracker.gpsStatus === 'locked' ? 'GPS FIJADO' : '14 SAT')}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-primary/15 px-2.5 py-1 rounded-full text-xs font-bold text-primary font-label-telemetry-sm border border-primary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>{tracker.formattedAltitude}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Botón Flotante 'Mi Ubicación' (z-30) con centrado automático */}
      <div className="fixed top-20 left-4 z-30 flex items-center gap-2">
        <button
          onClick={handleCenterOnUser}
          className="px-3.5 py-2.5 rounded-2xl bg-surface-container-high/95 backdrop-blur-xl border border-primary/40 text-xs font-headline-sm font-bold text-on-surface hover:text-primary flex items-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.65)] active:scale-95 transition-all group"
          title="Centrar mapa automáticamente en mi posición GPS"
        >
          <span className="material-symbols-outlined text-lg text-primary group-hover:scale-110 transition-transform animate-pulse">my_location</span>
          <span>Mi ubicación</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        </button>
      </div>

      {/* 2. Contenedor del Mapa Leaflet Interactivo (z-0) con filtro táctico oscuro */}
      <div className="absolute inset-0 pt-16 pb-20 w-full h-full z-0 bg-surface">
        <MapContainer
          center={santiagoCoords}
          zoom={mapZoom}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full"
        >
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Capa de OpenTopoMap con filtro CSS táctico */}
          <TileLayer
            url={layersConfig[activeLayer].url}
            attribution={layersConfig[activeLayer].attribution}
            maxZoom={layersConfig[activeLayer].maxZoom}
            className={
              activeLayer === 'opentopo'
                ? (isTopoDark ? 'tactical-topo-dark' : 'tactical-topo-natural')
                : (activeLayer === 'dark' ? 'tactical-dark-matter' : '')
            }
          />

          {/* Sombra de relieve inferior para la Polyline */}
          <Polyline
            positions={galiciaRouteExample}
            pathOptions={{
              color: '#060e20',
              weight: 9,
              opacity: 0.7,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />

          {/* RUTA DE EJEMPLO: Polyline táctica llamativa (Naranja Táctico Brillante / Ámbar #ff9f1c) */}
          <Polyline
            positions={galiciaRouteExample}
            pathOptions={{
              color: '#ff9f1c', // Naranja táctico de alta visibilidad
              weight: 5.5,
              opacity: 0.98,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />

          {/* Línea complementaria en verde esmeralda para el tramo final hacia la Catedral */}
          <Polyline
            positions={galiciaRouteExample.slice(6)}
            pathOptions={{
              color: '#4edea3', // Verde esmeralda táctico llamativo
              weight: 4.5,
              opacity: 0.9,
              dashArray: '6 6',
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />

          {/* Círculo de cobertura de llegada sobre la Plaza del Obradoiro */}
          <Circle
            center={santiagoCoords}
            radius={75}
            pathOptions={{
              fillColor: '#4edea3',
              fillOpacity: 0.15,
              color: '#4edea3',
              weight: 1.5,
              dashArray: '4 4',
            }}
          />

          {/* 📍 1. MARCADOR PERSONALIZADO: Punto de Inicio (O Pedrouzo) */}
          <Marker position={stageMilestones.inicio.pos} icon={createStartIcon()}>
            <Popup>
              <div className="p-1.5 flex flex-col gap-2 min-w-[220px]">
                <div className="flex items-center justify-between">
                  <span className="font-label-badge text-primary text-[10px] font-bold">
                    {stageMilestones.inicio.badge}
                  </span>
                  <span className="font-label-telemetry-sm text-xs font-bold text-on-surface">
                    {stageMilestones.inicio.altitud}
                  </span>
                </div>

                <h4 className="font-headline-sm text-sm font-bold text-on-surface leading-tight">
                  {stageMilestones.inicio.titulo}
                </h4>

                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  {stageMilestones.inicio.descripcion}
                </p>

                <div className="bg-surface-container-low px-2 py-1 rounded-lg text-[11px] font-label-telemetry-sm text-primary font-semibold flex items-center justify-between">
                  <span>Ruta restante a Santiago:</span>
                  <span className="font-bold">{stageMilestones.inicio.distanciaRestante}</span>
                </div>

                <button
                  onClick={() => showToast("Punto de inicio establecido: O Pedrouzo (km 0.0)")}
                  className="w-full mt-1 py-1.5 rounded-xl bg-primary text-on-primary font-label-action text-xs font-bold hover:bg-primary-container transition-all"
                >
                  Fijar como Punto de Salida
                </button>
              </div>
            </Popup>
          </Marker>

          {/* 📍 2. MARCADOR PERSONALIZADO: Albergue Intermedio (Monte do Gozo) */}
          <Marker position={stageMilestones.albergue.pos} icon={createHostelIcon()}>
            <Popup>
              <div className="p-1.5 flex flex-col gap-2 min-w-[240px]">
                <div className="flex items-center justify-between">
                  <span className="font-label-badge text-secondary text-[10px] font-bold">
                    {stageMilestones.albergue.badge}
                  </span>
                  <span className="font-label-telemetry-sm text-xs font-bold text-secondary">
                    {stageMilestones.albergue.precio}
                  </span>
                </div>

                <h4 className="font-headline-sm text-sm font-bold text-on-surface leading-tight">
                  {stageMilestones.albergue.titulo}
                </h4>

                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  {stageMilestones.albergue.descripcion}
                </p>

                {/* Servicios en chips */}
                <div className="flex flex-wrap gap-1">
                  {stageMilestones.albergue.servicios.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px] font-label-badge text-on-surface-variant border border-surface-container-highest"
                    >
                      {srv}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1.5 mt-1 pt-1 border-t border-surface-container-highest">
                  <button
                    onClick={() => showToast(`Llamando a recepción: ${stageMilestones.albergue.telefono}`)}
                    className="py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-action text-xs font-bold flex items-center justify-center gap-1 border border-surface-container-highest"
                  >
                    <span className="material-symbols-outlined text-sm text-secondary">phone</span>
                    <span>Llamar</span>
                  </button>
                  <button
                    onClick={() => showToast("¡Plaza en Albergue Monte do Gozo reservada con éxito!")}
                    className="py-1.5 rounded-xl bg-secondary text-on-secondary font-label-action text-xs font-bold hover:brightness-110 shadow-md"
                  >
                    Reservar Cama
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* 📍 3. MARCADOR PERSONALIZADO: Destino de la Etapa (Catedral de Santiago) */}
          <Marker position={stageMilestones.destino.pos} icon={createDestIcon()}>
            <Popup>
              <div className="p-1.5 flex flex-col gap-2 min-w-[240px]">
                <div className="flex items-center justify-between">
                  <span className="font-label-badge text-primary text-[10px] font-bold">
                    {stageMilestones.destino.badge}
                  </span>
                  <span className="font-label-telemetry-sm text-xs font-bold text-primary">
                    {stageMilestones.destino.altitud}
                  </span>
                </div>

                <h4 className="font-headline-sm text-sm font-bold text-on-surface leading-tight">
                  {stageMilestones.destino.titulo}
                </h4>

                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  {stageMilestones.destino.descripcion}
                </p>

                <div className="bg-primary/10 border border-primary/20 p-2 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-on-surface-variant">Progreso de la jornada:</span>
                  <span className="font-label-telemetry-sm text-primary font-bold">
                    {stageMilestones.destino.distanciaCompletada}
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('tracker')}
                  className="w-full mt-1 py-2 rounded-xl bg-primary text-on-primary font-label-action text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25 hover:bg-primary-container"
                >
                  <span className="material-symbols-outlined text-sm font-bold">verified</span>
                  <span>Ver Credencial Finalizada</span>
                </button>
              </div>
            </Popup>
          </Marker>

          {/* 📍 RUTA EN VIVO GRABADA POR EL USUARIO (Polyline reactivo en cian/naranja táctico) */}
          {tracker.routePath && tracker.routePath.length > 1 && (
            <>
              {/* Trazo inferior para contraste táctico */}
              <Polyline
                positions={tracker.routePath}
                pathOptions={{
                  color: '#002b49',
                  weight: 8,
                  opacity: 0.6,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
              {/* Trazo táctico de alta visibilidad */}
              <Polyline
                positions={tracker.routePath}
                pathOptions={{
                  color: tracker.isTracking ? '#ff9f1c' : '#00d2ff',
                  weight: 5.5,
                  opacity: 0.98,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </>
          )}

          {/* 📍 MARCADOR TÁCTICO CIRCULAR PULSANTE DE USUARIO EN TIEMPO REAL */}
          {tracker.latitude && tracker.longitude && (
            <Marker
              position={[tracker.latitude, tracker.longitude]}
              icon={createUserPosIcon(tracker.heading, tracker.isTracking)}
            >
              <Popup>
                <div className="p-1.5 flex flex-col gap-2 min-w-[220px]">
                  <div className="flex items-center justify-between border-b border-surface-container-highest pb-1">
                    <span className="font-label-badge text-primary text-[10px] font-bold">
                      {tracker.isSimulating ? 'SIMULACIÓN GPS ACTIVA' : 'SEÑAL GPS EN VIVO'}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">{tracker.formattedAccuracy}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-[10px] text-on-surface-variant">Velocidad</div>
                      <div className="font-bold text-on-surface font-mono">{tracker.formattedSpeed}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-on-surface-variant">Altitud</div>
                      <div className="font-bold text-primary font-mono">{tracker.formattedAltitude}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-on-surface-variant">Distancia Grabada</div>
                      <div className="font-bold text-secondary font-mono">{tracker.formattedDistance}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-on-surface-variant">Tiempo Activo</div>
                      <div className="font-bold text-on-surface font-mono">{tracker.durationFormatted}</div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* 3. Dock de Controles Tácticos Flotantes (z-30) */}
      <div className="fixed top-20 right-3.5 z-30 flex flex-col gap-2">
        {/* Selector de Capas */}
        <button
          onClick={() => setIsLayerModalOpen(true)}
          className="w-12 h-12 rounded-2xl bg-surface-container/95 backdrop-blur-xl shadow-2xl flex items-center justify-center text-primary active:scale-95 transition-all border border-primary/30 hover:border-primary"
          title="Capas cartográficas y estilos"
        >
          <span className="material-symbols-outlined text-2xl">layers</span>
        </button>

        {/* Conmutador de Filtro Oscuro / Natural sobre OpenTopoMap */}
        {activeLayer === 'opentopo' && (
          <button
            onClick={() => {
              setIsTopoDark(d => !d);
              showToast(isTopoDark ? "Modo Natural de Curvas de Nivel" : "Filtro Táctico Nocturno Oscuro");
            }}
            className={`w-12 h-12 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center justify-center active:scale-95 transition-all border ${
              isTopoDark
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'bg-surface-container/95 text-secondary border-surface-container-highest'
            }`}
            title="Alternar filtro nocturno / natural"
          >
            <span className="material-symbols-outlined text-2xl">
              {isTopoDark ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
        )}

        {/* Brújula / Orientar a la Catedral */}
        <button
          onClick={handleCompassClick}
          className="w-12 h-12 rounded-2xl bg-surface-container/95 backdrop-blur-xl shadow-2xl flex items-center justify-center text-secondary active:scale-95 transition-all border border-surface-container-highest"
          title="Orientar brújula hacia la Catedral"
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ transform: `rotate(${-compassHeading - 45}deg)`, transition: 'transform 0.4s ease' }}
          >
            explore
          </span>
        </button>

        {/* Centrar Mapa en Mi Ubicación (my_location) */}
        <button
          onClick={handleCenterOnUser}
          className="w-12 h-12 rounded-2xl bg-surface-container/95 backdrop-blur-xl shadow-2xl flex items-center justify-center text-primary active:scale-95 transition-all border border-primary/40 hover:border-primary"
          title="Centrar en Mi ubicación GPS"
        >
          <span className="material-symbols-outlined text-2xl animate-pulse">my_location</span>
        </button>

        {/* Clúster de Zoom (+ / -) */}
        <div className="flex flex-col bg-surface-container/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-surface-container-highest">
          <button
            onClick={handleZoomIn}
            className="w-12 h-10 flex items-center justify-center text-on-surface hover:text-primary active:bg-surface-container-highest transition-colors"
            title="Acercar mapa"
          >
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
          <div className="h-[1px] bg-surface-container-highest"></div>
          <button
            onClick={handleZoomOut}
            className="w-12 h-10 flex items-center justify-center text-on-surface hover:text-primary active:bg-surface-container-highest transition-colors"
            title="Alejar mapa"
          >
            <span className="material-symbols-outlined text-xl">remove</span>
          </button>
        </div>
      </div>

      {/* 4. Panel Inferior Flotante (z-30): Barra GPS Tracker y Ficha de Etapa */}
      <div className="fixed bottom-20 inset-x-3 z-30 flex flex-col gap-2 max-w-lg mx-auto">
        {/* Barra Táctica de Grabación GPS en Tiempo Real (useGpsTracker) */}
        <div className="bg-surface-container-high/95 backdrop-blur-2xl border border-primary/30 p-2.5 px-3 rounded-2xl flex items-center justify-between gap-2 shadow-2xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-3 h-3 rounded-full shrink-0 ${tracker.isTracking ? 'bg-red-500 animate-ping' : (tracker.isSimulating ? 'bg-secondary animate-pulse' : 'bg-outline')}`} />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-label-badge text-[10px] font-bold text-on-surface">
                  {tracker.isTracking ? 'GRABANDO RUTA' : (tracker.elapsedSeconds > 0 ? 'RUTA PAUSADA' : 'GPS STANDBY')}
                </span>
                <span className="font-mono text-[11px] text-primary font-bold">
                  {tracker.durationFormatted}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-mono truncate">
                <span className="text-primary font-semibold">{tracker.formattedDistance}</span>
                <span>•</span>
                <span>{tracker.formattedSpeed}</span>
                <span>•</span>
                <span>{tracker.formattedAltitude}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Conmutador Modo Simulación */}
            <button
              onClick={() => {
                tracker.toggleSimulation();
                showToast(tracker.isSimulating ? 'Simulación desactivada: usando GPS real' : 'Simulación GPS iniciada: recorriendo Camino a Santiago');
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors ${
                tracker.isSimulating
                  ? 'bg-secondary/20 text-secondary border-secondary/40'
                  : 'bg-surface-container text-on-surface-variant border-surface-container-highest hover:text-on-surface'
              }`}
              title="Conmutar simulación de movimiento para pruebas sin desplazarse"
            >
              SIM {tracker.isSimulating ? 'ON' : 'OFF'}
            </button>

            {/* Iniciar / Pausar Grabación */}
            <button
              onClick={() => {
                if (tracker.isTracking) {
                  tracker.pauseTracking();
                  showToast('Grabación de ruta pausada');
                } else {
                  tracker.startTracking();
                  showToast('Grabación GPS iniciada');
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-label-action text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95 ${
                tracker.isTracking
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-primary text-on-primary hover:bg-primary-container shadow-primary/20'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {tracker.isTracking ? 'pause' : 'play_arrow'}
              </span>
              <span>{tracker.isTracking ? 'Pausar' : 'Grabar'}</span>
            </button>

            {/* Reiniciar Ruta Grabada */}
            {(tracker.elapsedSeconds > 0 || tracker.routePath.length > 0) && (
              <button
                onClick={() => {
                  tracker.resetTracking();
                  showToast('Ruta grabada reiniciada');
                }}
                className="p-1.5 rounded-xl bg-surface-container text-on-surface-variant hover:text-error hover:bg-error/10 border border-surface-container-highest transition-colors active:scale-95"
                title="Reiniciar ruta y acumulador de distancia"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-surface-container-high/95 backdrop-blur-2xl border border-primary/30 p-3.5 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.65)] flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div
              className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              onClick={() => onNavigate('detail')}
            >
              <div className="w-10 h-10 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-2xl">route</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-sm font-bold text-on-surface truncate">
                    O Pedrouzo → Santiago
                  </span>
                  <span className="font-label-badge text-[10px] px-1.5 py-0.2 rounded bg-secondary/20 text-secondary font-bold">
                    19.4 KM
                  </span>
                </div>
                <span className="font-body-sm text-xs text-on-surface-variant truncate block">
                  Etapa Final Jacobea • Monte do Gozo
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onNavigate('detail')}
                className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs font-label-action font-semibold border border-surface-container-highest"
              >
                Ficha
              </button>
              <button
                onClick={() => onNavigate('hud')}
                className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-label-action font-bold flex items-center gap-1 shadow-lg shadow-primary/25 active:scale-95 transition-all hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-sm">navigation</span>
                <span>Navegar</span>
              </button>
            </div>
          </div>

          {/* Accesos rápidos interactivos a los 3 marcadores principales */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-surface-container-highest/60 text-center">
            <button
              onClick={() => focusMilestone('inicio')}
              className="px-2 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-highest border border-surface-container-highest flex flex-col items-center gap-0.5 active:scale-95 transition-all"
            >
              <span className="font-label-badge text-[9px] text-primary font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                1. INICIO
              </span>
              <span className="text-[11px] font-headline-sm font-bold text-on-surface truncate max-w-[85px]">
                O Pedrouzo
              </span>
            </button>

            <button
              onClick={() => focusMilestone('albergue')}
              className="px-2 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-highest border border-surface-container-highest flex flex-col items-center gap-0.5 active:scale-95 transition-all"
            >
              <span className="font-label-badge text-[9px] text-secondary font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                2. ALBERGUE
              </span>
              <span className="text-[11px] font-headline-sm font-bold text-on-surface truncate max-w-[85px]">
                Monte Gozo
              </span>
            </button>

            <button
              onClick={() => focusMilestone('destino')}
              className="px-2 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-highest border border-surface-container-highest flex flex-col items-center gap-0.5 active:scale-95 transition-all"
            >
              <span className="font-label-badge text-[9px] text-primary font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                3. META
              </span>
              <span className="text-[11px] font-headline-sm font-bold text-on-surface truncate max-w-[85px]">
                Catedral
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Modal de Selección de Capas Cartográficas (z-50) */}
      {isLayerModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setIsLayerModalOpen(false)}
        >
          <div
            className="bg-surface-container w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-outline-variant flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1 border-b border-surface-container-highest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">layers</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Capas Cartográficas</h3>
              </div>
              <button
                onClick={() => setIsLayerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[50vh] overflow-y-auto">
              {Object.entries(layersConfig).map(([key, config]) => {
                const isSelected = activeLayer === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveLayer(key);
                      setIsLayerModalOpen(false);
                      showToast(`Capa activada: ${config.name}`);
                    }}
                    className={`p-3.5 rounded-2xl flex items-center justify-between border text-left transition-all ${
                      isSelected
                        ? 'bg-primary/15 border-primary text-on-surface shadow-md shadow-primary/10'
                        : 'bg-surface-container-high border-surface-container-highest text-on-surface-variant hover:border-outline'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-2xl ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {config.icon}
                      </span>
                      <div>
                        <div className="font-headline-sm text-sm font-bold text-on-surface">{config.name}</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant leading-tight">{config.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-xl text-primary">check_circle</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-surface-container-lowest/90 p-3 rounded-2xl flex items-center justify-between border border-surface-container-high text-xs">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-base">cloud_download</span>
                <span>Paquete Topo Galicia (Santiago de Compostela)</span>
              </div>
              <span className="font-label-badge text-primary font-bold">DESCARGADO</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Notificaciones Toast Flotantes (z-50) */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-container-highest/95 border border-primary/40 text-on-surface px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fade-in font-label-action text-sm">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
