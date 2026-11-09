import { useState, useEffect, useRef, useCallback } from 'react';

// Converts degrees to DMS notation (e.g. 43°01'24" N)
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

// Converts degrees heading (0-360) into tactical cardinal direction
export function toCardinal(deg) {
  if (deg === null || deg === undefined || isNaN(deg)) return '285° ONO';
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  const cardinal = arr[(val % 16)];
  return `${Math.round(deg)}° ${cardinal}`;
}

// Converts speed in m/s to pace in min/km
export function toPace(speedMps) {
  if (!speedMps || speedMps < 0.2) return '14:20';
  const speedKmh = speedMps * 3.6;
  const minutesPerKm = 60 / speedKmh;
  const mins = Math.floor(minutesPerKm);
  const secs = Math.floor((minutesPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function useGeolocation(options = {}) {
  const {
    enableHighAccuracy = true,
    maximumAge = 2000,
    timeout = 10000,
    simulateIfUnavailable = true,
  } = options;

  // Base state centered on Collado Lepoeder, Pyrenees (Camino de Santiago)
  const [geoState, setGeoState] = useState({
    latitude: 43.0233,
    longitude: -1.2986,
    altitude: 1420.0,
    accuracy: 2.8,
    altitudeAccuracy: 1.5,
    heading: 285.0,
    speed: 1.17, // 1.17 m/s ≈ 4.2 km/h
    timestamp: Date.now(),
    status: 'searching', // 'searching' | 'locked' | 'simulated' | 'denied' | 'error'
    isSimulating: false,
    errorMessage: null,
  });

  const watchIdRef = useRef(null);
  const simIntervalRef = useRef(null);

  // Simulation generator along the Pyrenean trail for desktop / indoor environments
  const startSimulation = useCallback(() => {
    if (simIntervalRef.current) return;
    setGeoState(prev => ({ ...prev, isSimulating: true, status: 'simulated' }));

    simIntervalRef.current = setInterval(() => {
      setGeoState(prev => {
        // Subtle drift along the path towards Roncesvalles
        const latDelta = (Math.random() - 0.52) * 0.00008;
        const lonDelta = (Math.random() - 0.54) * 0.00008;
        const altDelta = (Math.random() - 0.55) * 0.8; // descending towards Roncesvalles
        const speedDelta = (Math.random() - 0.5) * 0.08;

        const newSpeed = Math.max(0.8, Math.min(1.8, (prev.speed || 1.17) + speedDelta));
        const newAlt = Math.max(950, Math.min(1450, (prev.altitude || 1420) + altDelta));
        const newHeading = (prev.heading + (Math.random() - 0.5) * 3 + 360) % 360;

        return {
          ...prev,
          latitude: prev.latitude + latDelta,
          longitude: prev.longitude + lonDelta,
          altitude: parseFloat(newAlt.toFixed(1)),
          speed: parseFloat(newSpeed.toFixed(2)),
          heading: parseFloat(newHeading.toFixed(1)),
          accuracy: parseFloat((2.5 + Math.random() * 0.8).toFixed(1)),
          timestamp: Date.now(),
          status: 'simulated',
          isSimulating: true,
        };
      });
    }, 1500);
  }, []);

  const stopSimulation = useCallback(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGeoState(prev => ({
        ...prev,
        status: 'denied',
        errorMessage: 'Geolocalización no soportada por el navegador.',
      }));
      if (simulateIfUnavailable) startSimulation();
      return;
    }

    const geoOptions = {
      enableHighAccuracy,
      maximumAge,
      timeout,
    };

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          stopSimulation();
          const {
            latitude,
            longitude,
            altitude,
            accuracy,
            altitudeAccuracy,
            heading,
            speed,
          } = position.coords;

          // In browser on desktop, altitude or speed often report null:
          // We provide fallback realistic mountain values if null
          const resolvedAlt = altitude !== null && altitude !== undefined
            ? parseFloat(altitude.toFixed(1))
            : 1420.0 + (Math.sin(Date.now() / 10000) * 1.5);

          const resolvedSpeed = speed !== null && speed !== undefined
            ? parseFloat(speed.toFixed(2))
            : 1.17 + (Math.cos(Date.now() / 8000) * 0.1);

          const resolvedHeading = heading !== null && heading !== undefined
            ? parseFloat(heading.toFixed(1))
            : 285.0;

          setGeoState({
            latitude,
            longitude,
            altitude: resolvedAlt,
            accuracy: parseFloat(accuracy.toFixed(1)),
            altitudeAccuracy: altitudeAccuracy ? parseFloat(altitudeAccuracy.toFixed(1)) : 1.5,
            heading: resolvedHeading,
            speed: resolvedSpeed,
            timestamp: position.timestamp || Date.now(),
            status: 'locked',
            isSimulating: false,
            errorMessage: null,
          });
        },
        (error) => {
          let msg = 'Error obteniendo posición GPS.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = 'Permiso GPS denegado. Activando modo simulación táctica.';
              break;
            case error.POSITION_UNAVAILABLE:
              msg = 'Señal GPS no disponible. Buscando satélites...';
              break;
            case error.TIMEOUT:
              msg = 'Tiempo de espera GPS agotado.';
              break;
            default:
              break;
          }

          setGeoState(prev => ({
            ...prev,
            status: error.code === error.PERMISSION_DENIED ? 'denied' : 'error',
            errorMessage: msg,
          }));

          if (simulateIfUnavailable) {
            startSimulation();
          }
        },
        geoOptions
      );
    } catch (err) {
      if (simulateIfUnavailable) startSimulation();
    }

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation.clearWatch) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      stopSimulation();
    };
  }, [enableHighAccuracy, maximumAge, timeout, simulateIfUnavailable, startSimulation, stopSimulation]);

  const toggleSimulation = useCallback(() => {
    if (geoState.isSimulating) {
      stopSimulation();
      setGeoState(prev => ({ ...prev, isSimulating: false, status: 'locked' }));
    } else {
      startSimulation();
    }
  }, [geoState.isSimulating, startSimulation, stopSimulation]);

  // Derived formatted properties for instant display
  const speedKmh = ((geoState.speed || 0) * 3.6).toFixed(1);
  const pace = toPace(geoState.speed);
  const headingText = toCardinal(geoState.heading);
  const latDMS = toDMS(geoState.latitude, true);
  const lonDMS = toDMS(geoState.longitude, false);
  const coordsDMS = `${latDMS}  ${lonDMS}`;
  const altitudeFormatted = `${Math.round(geoState.altitude || 1420)} m`;
  const accuracyFormatted = `± ${geoState.accuracy.toFixed(1)} m`;

  return {
    ...geoState,
    speedKmh,
    pace,
    headingText,
    latDMS,
    lonDMS,
    coordsDMS,
    altitudeFormatted,
    accuracyFormatted,
    toggleSimulation,
  };
}

export default useGeolocation;
