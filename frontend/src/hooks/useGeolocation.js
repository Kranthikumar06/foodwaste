import { useState, useEffect, useRef } from 'react';

const DEFAULT_LOCATION = [20.5937, 78.9629]; // India center

export const useGeolocation = () => {
  const watchIdRef = useRef(null);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('❌ Geolocation API not available');
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    console.log('🔵 Starting geolocation detection...');
    setLoading(true);

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude);
        const lon = parseFloat(position.coords.longitude);
        const acc = position.coords.accuracy;

        console.log('✅ ACTUAL GPS Location Found:', lat, lon);
        console.log('Latitude:', lat);
        console.log('Longitude:', lon);
        console.log('Accuracy:', acc, 'm');

        setLocation([lat, lon]);
        setAccuracy(Math.round(acc));
        setError(null);
        setLoading(false);
      },
      (error) => {
        console.error('❌ Location Error:', error.code, error.message);

        let errorMsg = 'Unknown error';
        if (error.code === 1) {
          errorMsg = '🔒 Permission Denied - Enable location access in browser settings';
        } else if (error.code === 2) {
          errorMsg = '📍 Position Unavailable - GPS signal weak or unavailable';
        } else if (error.code === 3) {
          errorMsg = '⏱️ Timeout - GPS took too long to respond';
        }

        console.warn('⚠️', errorMsg);
        setError(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Watch for continuous updates
    console.log('👁️ Starting location watch for continuous updates...');
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude);
        const lon = parseFloat(position.coords.longitude);
        const acc = position.coords.accuracy;

        console.log('📍 Location Update:', lat, lon);
        console.log('Accuracy:', acc, 'm');

        setLocation([lat, lon]);
        setAccuracy(Math.round(acc));
      },
      (error) => {
        console.error('❌ Watch Error:', error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        console.log('🛑 Stopped location watch');
      }
    };
  }, []);

  return { location, accuracy, loading, error };
};

