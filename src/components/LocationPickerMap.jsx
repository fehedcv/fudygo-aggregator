import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { X, MapPin, Loader2, Check } from 'lucide-react';

// Fix Leaflet's broken default icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Inner component: listens for map clicks and drag to move the marker
const DraggableMarker = ({ position, onMove }) => {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = e.target.getLatLng();
          onMove(lat, lng);
        },
      }}
    />
  );
};

const LocationPickerMap = ({ initialPosition, onConfirm, onClose }) => {
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const reverseGeocode = useCallback(async (lat, lng) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await res.json();
      setAddress(data.display_name || '');
      return data;
    } catch {
      setAddress('');
      return null;
    } finally {
      setIsReverseGeocoding(false);
    }
  }, []);

  // Reverse geocode on first render
  useEffect(() => {
    reverseGeocode(initialPosition[0], initialPosition[1]);
  }, []);

  const handleMove = useCallback(async (lat, lng) => {
    setPosition([lat, lng]);
    await reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const handleConfirm = async () => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}&addressdetails=1`
      );
      const data = await res.json();
      onConfirm(position[0], position[1], data);
    } catch {
      onConfirm(position[0], position[1], null);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-gray-900">Confirm Your Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hint */}
        <p className="text-xs text-gray-500 text-center px-5 pt-3 pb-1">
          Drag the pin or tap anywhere on the map to adjust your location
        </p>

        {/* Map */}
        <div className="h-72 w-full">
          <MapContainer
            center={position}
            zoom={17}
            style={{ height: '100%', width: '100%' }}
            zoomControl
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <DraggableMarker position={position} onMove={handleMove} />
          </MapContainer>
        </div>

        {/* Address preview */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 min-h-[52px] flex items-center gap-2">
          {isReverseGeocoding ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />
          ) : (
            <MapPin className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          )}
          <p className="text-sm text-gray-600 line-clamp-2">
            {address || 'Fetching address…'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 py-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isReverseGeocoding}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isReverseGeocoding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerMap;
