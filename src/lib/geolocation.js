import { Capacitor } from '@capacitor/core';

/**
 * Returns { latitude, longitude } using the Capacitor Geolocation plugin on
 * Android/iOS (which triggers the native runtime-permission dialog) and falls
 * back to the browser Web API on web.
 */
export const getCurrentPosition = async () => {
  if (Capacitor.isNativePlatform()) {
    const { Geolocation } = await import('@capacitor/geolocation');

    const perm = await Geolocation.requestPermissions();
    if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
      throw new Error('Location permission denied');
    }

    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  }

  // Web fallback
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
};
