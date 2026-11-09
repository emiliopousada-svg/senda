import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

/**
 * Converts decimal degrees to DMS notation (e.g. 42°52'41" N)
 */
export function toDMS(deg, isLat) {
  if (deg === null || deg === undefined) return '--';
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  let direction = '';
  if (isLat) {
    direction = deg >= 0 ? 'N' : 'S';
  } else {
    direction = deg >= 0 ? 'E' : 'O';
  }

  return `${degrees}°${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}" ${direction}`;
}

/**
 * Converts heading degrees to tactical cardinal text (e.g. "285° ONO")
 */
export function toCardinal(deg) {
  if (deg === null || deg === undefined || isNaN(deg)) return '285° ONO';
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  const cardinal = arr[(val % 16)];
  return `${Math.round(deg)}° ${cardinal}`;
}

/**
 * Converts speed in km/h to pace in min/km
 */
export function toPaceFromKmh(speedKmh) {
  if (!speedKmh || speedKmh < 0.5) return '14:20';
  const minutesPerKm = 60 / speedKmh;
  const mins = Math.floor(minutesPerKm);
  const secs = Math.floor((minutesPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1 in degrees
 * @param {number} lon1 - Longitude of point 1 in degrees
 * @param {number} lat2 - Latitude of point 2 in degrees
 * @param {number} lon2 - Longitude of point 2 in degrees
 * @returns {number} Distance in kilometers
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Earth's mean radius in kilometers
  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Camino de Santiago waypoint trail points used for realistic simulation
const SIMULATION_WAYPOINTS = [
  [42.9065, -8.3615], // O Pedrouzo / Arca
  [42.9058, -8.3750],
  [42.9050, -8.3900], // Amenal
  [42.9042, -8.4050],
  [42.9035, -8.4200], // San Paio
  [42.9025, -8.4350],
  [42.9015, -8.4485], // Lavacolla
  [42.8980, -8.4620],
  [42.8950, -8.4750], // Vilamaior
  [42.8910, -8.4890], // San Marcos
  [42.8872, -8.4975], // Monte do Gozo
  [42.8860, -8.5100],
  [42.8850, -8.5200], // San Lázaro
  [42.8825, -8.5260],
  [42.8810, -8.5320], // Rúa de San Pedro
  [42.8795, -8.5390], // Porta do Camiño
  [42.8788, -8.5420], // Praza de Cervantes
  [42.8782, -8.5448], // Praza do Obradoiro / Catedral de Santiago
];

function useGpsTrackerInternal(options = {}) {
  const {
    enableHighAccuracy = true,
    maximumAge = 2000,
    timeout = 10000,
    initialSimulation = false,
  } = options;

  // Tracking control states
  const [isTracking, setIsTracking] = useState(false);
  const [isSimulating, setIsSimulating] = useState(initialSimulation);

  // Real-time GPS metrics
  const [coords, setCoords] = useState({
    latitude: 42.8782,
    longitude: -8.5448,
    altitude: 260.0, // meters
    speed: 0.0, // km/h
    accuracy: 2.5, // meters
    heading: 285.0, // degrees
    timestamp: Date.now(),
  });

  // Recorded track & metrics
  const [routePath, setRoutePath] = useState([]); // Array of [lat, lon]
  const [totalDistanceKm, setTotalDistanceKm] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle' | 'locked' | 'searching' | 'denied' | 'simulated'
  const [errorMessage, setErrorMessage] = useState(null);

  // References
  const watchIdRef = useRef(null);
  const simIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const simStepRef = useRef(0);
  const lastPositionRef = useRef(null);

  // Timer tracking active session seconds
  useEffect(() => {
    if (isTracking) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTracking]);

  // Process a new incoming coordinate (from GPS hardware or Simulator)
  const processNewPosition = useCallback(
    (newPoint) => {
      const { latitude, longitude, altitude, speedKmh, accuracy, heading, timestamp } = newPoint;

      setCoords({
        latitude,
        longitude,
        altitude: altitude !== null && altitude !== undefined ? parseFloat(altitude.toFixed(1)) : 260.0,
        speed: speedKmh !== null && speedKmh !== undefined ? parseFloat(speedKmh.toFixed(1)) : 0.0,
        accuracy: accuracy !== null && accuracy !== undefined ? parseFloat(accuracy.toFixed(1)) : 2.5,
        heading: heading !== null && heading !== undefined ? parseFloat(heading.toFixed(1)) : 285.0,
        timestamp: timestamp || Date.now(),
      });

      // When tracking is active, accumulate to path & calculate distance
      if (isTracking) {
        setRoutePath((prevPath) => {
          const currentPoint = [latitude, longitude];

          if (prevPath.length === 0) {
            lastPositionRef.current = currentPoint;
            return [currentPoint];
          }

          const lastPoint = prevPath[prevPath.length - 1];
          const distDelta = calculateHaversineDistance(
            lastPoint[0],
            lastPoint[1],
            latitude,
            longitude
          );

          // Only record if movement is greater than 1 meter (0.001 km) to avoid GPS stationary noise
          if (distDelta >= 0.001) {
            setTotalDistanceKm((prevDist) => parseFloat((prevDist + distDelta).toFixed(3)));
            lastPositionRef.current = currentPoint;
            return [...prevPath, currentPoint];
          }

          return prevPath;
        });
      }
    },
    [isTracking]
  );

  // ==========================================
  // GPS HARDWARE TRACKING (watchPosition)
  // ==========================================
  useEffect(() => {
    // If simulation is running, don't bind hardware GPS
    if (isSimulating) {
      if (watchIdRef.current !== null && navigator.geolocation?.clearWatch) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!('geolocation' in navigator)) {
      setGpsStatus('denied');
      setErrorMessage('Tu navegador o dispositivo no soporta geolocalización.');
      return;
    }

    setGpsStatus('searching');

    const geoOptions = {
      enableHighAccuracy: true,
      maximumAge,
      timeout,
    };

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, altitude, accuracy, speed, heading } = position.coords;

          // Convert speed from m/s to km/h (speed * 3.6)
          const speedKmh = speed !== null && speed !== undefined ? speed * 3.6 : 0;

          setGpsStatus('locked');
          setErrorMessage(null);

          processNewPosition({
            latitude,
            longitude,
            altitude,
            speedKmh,
            accuracy,
            heading,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          let msg = 'Error obteniendo posición GPS.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = 'Permiso GPS denegado. Puedes activar el modo Simulación.';
              setGpsStatus('denied');
              break;
            case error.POSITION_UNAVAILABLE:
              msg = 'Señal GPS no disponible temporalmente.';
              setGpsStatus('searching');
              break;
            case error.TIMEOUT:
              msg = 'Tiempo de espera de señal satelital agotado.';
              setGpsStatus('searching');
              break;
            default:
              setGpsStatus('denied');
              break;
          }
          setErrorMessage(msg);
        },
        geoOptions
      );
    } catch (err) {
      setGpsStatus('denied');
      setErrorMessage('Error al inicializar el servicio de geolocalización.');
    }

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation?.clearWatch) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isSimulating, maximumAge, timeout, processNewPosition]);

  // ==========================================
  // SIMULATION MODE GENERATOR
  // ==========================================
  useEffect(() => {
    if (!isSimulating) {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
      return;
    }

    setGpsStatus('simulated');
    setErrorMessage(null);

    // Initial simulation point
    const initialPoint = SIMULATION_WAYPOINTS[simStepRef.current % SIMULATION_WAYPOINTS.length];
    processNewPosition({
      latitude: initialPoint[0],
      longitude: initialPoint[1],
      altitude: 290.0,
      speedKmh: 4.8,
      accuracy: 2.2,
      heading: 260.0,
      timestamp: Date.now(),
    });

    simIntervalRef.current = setInterval(() => {
      simStepRef.current += 1;
      const index = simStepRef.current % SIMULATION_WAYPOINTS.length;
      const targetPoint = SIMULATION_WAYPOINTS[index];

      // Add realistic microscopic jitter along the trail
      const jitterLat = (Math.random() - 0.5) * 0.00015;
      const jitterLon = (Math.random() - 0.5) * 0.00015;
      const simulatedSpeed = 4.2 + (Math.random() - 0.5) * 0.8; // 3.8 to 5.0 km/h walking pace
      const simulatedAlt = 380 - (index / SIMULATION_WAYPOINTS.length) * 120 + (Math.random() - 0.5) * 3;

      processNewPosition({
        latitude: targetPoint[0] + jitterLat,
        longitude: targetPoint[1] + jitterLon,
        altitude: parseFloat(simulatedAlt.toFixed(1)),
        speedKmh: parseFloat(simulatedSpeed.toFixed(1)),
        accuracy: parseFloat((2.0 + Math.random() * 0.8).toFixed(1)),
        heading: 255.0 + Math.random() * 10,
        timestamp: Date.now(),
      });
    }, 1800);

    return () => {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
    };
  }, [isSimulating, processNewPosition]);

  // ==========================================
  // TRACKING CONTROLS (Iniciar, Pausar, Reiniciar)
  // ==========================================
  const startTracking = useCallback(() => {
    setIsTracking(true);
    // If routePath is empty, initialize with current coordinates
    setRoutePath((prev) => {
      if (prev.length === 0 && coords.latitude && coords.longitude) {
        return [[coords.latitude, coords.longitude]];
      }
      return prev;
    });
  }, [coords.latitude, coords.longitude]);

  const pauseTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  const resetTracking = useCallback(() => {
    setIsTracking(false);
    setRoutePath([]);
    setTotalDistanceKm(0);
    setElapsedSeconds(0);
    lastPositionRef.current = null;
    simStepRef.current = 0;
  }, []);

  const toggleSimulation = useCallback(() => {
    setIsSimulating((prev) => !prev);
  }, []);

  // Formatted timer representation (hh:mm:ss)
  const formatDuration = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const coordsDMS = `${toDMS(coords.latitude, true)}, ${toDMS(coords.longitude, false)}`;
  const coordsFormatted = `${coords.latitude.toFixed(5)}°N, ${Math.abs(coords.longitude).toFixed(5)}°O`;
  const headingText = toCardinal(coords.heading);
  const pace = toPaceFromKmh(coords.speed);

  const toggleTracking = useCallback(() => {
    if (isTracking) {
      pauseTracking();
    } else {
      startTracking();
    }
  }, [isTracking, pauseTracking, startTracking]);

  return {
    // Current GPS Metrics (Standard English & Spanish Aliases)
    latitude: coords.latitude,
    longitude: coords.longitude,
    altitude: coords.altitude,
    speed: coords.speed, // in km/h
    accuracy: coords.accuracy, // in meters
    heading: coords.heading,
    timestamp: coords.timestamp,
    currentPosition: [coords.latitude, coords.longitude],

    // Spanish aliases as specified in prompt
    latitud: coords.latitude,
    longitud: coords.longitude,
    altitud: coords.altitude,
    velocidad: coords.speed, // km/h
    precision: coords.accuracy, // metros

    // Formatted telemetry strings
    coordsDMS,
    coordsFormatted,
    headingText,
    pace,

    // Route Tracking State & Metrics
    isTracking,
    routePath, // Array of [lat, lng]
    totalDistanceKm, // Accumulated kilometers
    distanciaKm: totalDistanceKm,
    elapsedSeconds,
    durationFormatted: formatDuration(elapsedSeconds),

    // Formatted outputs for tactical HUD displays
    formattedDistance: `${totalDistanceKm.toFixed(2)} km`,
    formattedSpeed: `${coords.speed.toFixed(1)} km/h`,
    formattedAltitude: `${Math.round(coords.altitude)} m`,
    formattedAccuracy: `± ${coords.accuracy.toFixed(1)} m`,
    altitudeFormatted: `${Math.round(coords.altitude)} m`,
    accuracyFormatted: `± ${coords.accuracy.toFixed(1)} m`,
    speedKmh: coords.speed.toFixed(1),

    // Tracking Control Functions (English & Spanish aliases)
    startTracking,
    pauseTracking,
    resetTracking,
    toggleTracking,
    iniciarRuta: startTracking,
    pausarRuta: pauseTracking,
    reiniciarRuta: resetTracking,
    alternarRuta: toggleTracking,

    // Simulation Mode
    isSimulating,
    toggleSimulation,
    setIsSimulating,
    startSimulation: () => setIsSimulating(true),
    stopSimulation: () => setIsSimulating(false),

    // Status
    gpsStatus, // 'idle' | 'locked' | 'searching' | 'denied' | 'simulated'
    errorMessage,
  };
}

// React Context for app-wide shared GPS tracking across all screens
export const GpsTrackerContext = createContext(null);

export function GpsTrackerProvider({ children, options }) {
  const tracker = useGpsTrackerInternal(options);
  return React.createElement(
    GpsTrackerContext.Provider,
    { value: tracker },
    children
  );
}

export function useGpsTracker(options) {
  const context = useContext(GpsTrackerContext);
  if (context && !options) {
    return context;
  }
  return useGpsTrackerInternal(options);
}

export default useGpsTracker;
