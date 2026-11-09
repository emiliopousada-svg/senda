# Senda - Tactical Outdoor & Pilgrim Tracker (PWA)

Aplicación web progresiva (**PWA**) instalable desarrollada con **Vite**, **React**, **Tailwind CSS**, **Leaflet** y **vite-plugin-pwa**, importando fielmente las 6 pantallas diseñadas en **Stitch** con el sistema de diseño **Senda Tactical Outdoor** (`Rutas y Camino Tracker`).

---

## 📲 Funcionalidades PWA Offline

- **Instalable en Móvil y Escritorio (Standalone):**
  - Web App Manifest configurado con nombre, iconos temáticos (192x192, 512x512 y maskable) y color de tema `#0B1326`.
  - Soporte completo para pantalla de inicio en Android, iOS (Apple Touch Icon y barra translúcida) y Windows/Chrome.
- **Service Worker con Workbox Cache:**
  - **Pre-caché de recursos estáticos:** Bundle HTML, CSS, JavaScript y fuentes locales para carga instantánea en frío.
  - **Caché de Fuentes de Google (`CacheFirst`):** JetBrains Mono, Plus Jakarta Sans y Material Symbols Outlined disponibles sin conexión.
  - **Caché de Teselas Cartográficas (`StaleWhileRevalidate`):** OpenTopoMap y CartoDB Dark Matter se almacenan en caché local hasta 30 días (hasta 500 teselas en memoria para uso en valles de montaña sin cobertura).
  - **Detección automática de conectividad:** Barra de alerta táctica cuando se pierde la conexión de red o celular (`MODO OFFLINE PWA`).

---

## 🎨 Sistema de Diseño: Senda Tactical Outdoor

- **Modo Dark Predeterminado:** Optimizado para pantallas OLED y condiciones exteriores de alta montaña.
- **Paleta de Colores Táctica:**
  - `primary`: `#4EDEAA` (Esmeralda Táctico)
  - `secondary`: `#FFB95F` / `#F59E0B` (Amarillo Vieira Jacobeo)
  - `tertiary`: `#B4C5FF` / `#2563EB` (Azul jacobeo e hídrico)
  - `surface`: `#0B1326` (Pizarra alpina profunda)
  - `surface-container`: `#171F33` y `#222A3D`
- **Tipografía Dual Funcional:**
  - **Plus Jakarta Sans:** Textos informativos, tarjetas y controles ergonómicos.
  - **JetBrains Mono:** Telemetría numérica estricta (altitud, coordenadas UTM/DMS, ritmo y satélites).
- **Iconografía:** Google Material Symbols Outlined.

---

## 📱 Pantallas de Stitch Implementadas

1. **Senda Pilgrim Tracker (Dashboard Principal)** ([`TrackerHomeScreen.jsx`](file:///d:/senda/src/screens/TrackerHomeScreen.jsx))
   - Credencial digital (8/31 sellos) y Bento Grid de telemetría GPS en tiempo real.
   - Acceso táctico directo a todos los módulos y botón de emergencia SOS 112 con baliza satelital.
2. **Mapa Topográfico y Navegación GPS** ([`MapGpsScreen.jsx`](file:///d:/senda/src/screens/MapGpsScreen.jsx))
   - Mapa interactivo con **Leaflet** y **OpenTopoMap** con curvas de nivel 1:25k.
   - Filtro táctico nocturno oscuro conmutable (`tactical-topo-dark`).
   - Trazado real de la Etapa 1 (Saint-Jean → Roncesvalles) con hitos clave (Lepoeder, Roldán, Izandorre, Ibañeta).
3. **Navegación Activa HUD** ([`ActiveNavHudScreen.jsx`](file:///d:/senda/src/screens/ActiveNavHudScreen.jsx))
   - Telemetría deportiva en vivo sincronizada con el sensor `useGeolocation`.
   - Perfil altimétrico interactivo con marcador dinámico *"Tú Estás Aquí"*.
   - Botón de pausar/reanudar track, registrar foto y tirador táctico de finalización.
4. **Detalle de Ruta y Mapa Offline** ([`RouteDetailScreen.jsx`](file:///d:/senda/src/screens/RouteDetailScreen.jsx))
   - Datos dinámicos conectados a [`src/data/etapas.json`](file:///d:/senda/src/data/etapas.json) con selector de las 5 etapas.
   - Conmutador de sentido de marcha (Directo vs Inverso), gráfico altimétrico SVG, meteo en cumbre y ficha de firme.
5. **Etapas del Camino y Albergues** ([`StagesHostelsScreen.jsx`](file:///d:/senda/src/screens/StagesHostelsScreen.jsx))
   - Selector dinámico de etapas y directorio de albergues con plazas libres, precios y servicios.
   - Acciones interactivas de llamada y reserva de cama.
6. **Ajustes y Dispositivos Bluetooth (BLE)** ([`SettingsBluetoothScreen.jsx`](file:///d:/senda/src/screens/SettingsBluetoothScreen.jsx))
   - Gestión y vinculación de sensores exteriores: Garmin Fēnix 7 Pro, Polar H10 e inReach Mini 2 satelital.

---

## 🚀 Cómo ejecutar en desarrollo o producción

### Servidor de Desarrollo:
```powershell
cd d:\senda
npm run dev
```

### Previsualizar la PWA con Service Worker activo:
```powershell
cd d:\senda
npm run build
npm run preview
```
