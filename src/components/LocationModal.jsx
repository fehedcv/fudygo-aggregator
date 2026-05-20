import { useState, useEffect, useRef } from 'react';
import { X, Crosshair, Search, Loader2, MapPin } from 'lucide-react';
import { getCurrentPosition } from '../lib/geolocation';

const LocationModal = ({ isOpen, onClose, onUpdateLocation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  
  // Search Suggestions State
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Debounced Search Effect
  useEffect(() => {
    // Only search if user typed 3+ characters
    if (manualAddress.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Append ", Kerala" to query and limit to 5 results
        const query = `${manualAddress}, Kerala`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&addressdetails=1`
        );
        
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [manualAddress]);

  // 2. Handle Selecting a Result (Updated for your JSON)
  const handleSelectSuggestion = (place) => {
    // PREFER 'name' field from API (e.g. "Kottakkal")
    // Fallback to first part of display_name if name is missing
    const locationName = place.name || place.display_name.split(',')[0].trim();
    
    onUpdateLocation(locationName, { 
        lat: parseFloat(place.lat), 
        lng: parseFloat(place.lon) 
    });

    setManualAddress('');
    setSuggestions([]);
    onClose();
  };

  // 3. Handle GPS
  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { latitude, longitude } = await getCurrentPosition();
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Current Location';
        onUpdateLocation(city, { lat: latitude, lng: longitude });
      } catch {
        onUpdateLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, { lat: latitude, lng: longitude });
      }
      onClose();
    } catch {
      alert('Location failed. Please allow location permission and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Manual "Enter" Key
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualAddress.trim()) {
        onUpdateLocation(manualAddress, null);
        onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md min-h-[500px] relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
         
         {/* Header */}
         <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">Select Location</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
         </div>
         
         <div className="p-6 space-y-6">
            
            {/* GPS Button */}
            <button 
              onClick={handleUseCurrentLocation}
              disabled={isLoading}
              className="w-full flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors group text-left"
            >
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm group-hover:scale-110 transition-transform">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crosshair className="w-5 h-5" />}
               </div>
               <div>
                  <h4 className="font-bold text-gray-900">Use Current Location</h4>
                  <p className="text-xs text-gray-500">Enable GPS to find nearby restaurants</p>
               </div>
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">Or enter manually</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* --- SEARCH INPUT & SUGGESTIONS --- */}
            <div className="relative" ref={dropdownRef}>
                <form onSubmit={handleManualSubmit}>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search area (e.g. Kottakkal, Kochi)" 
                            value={manualAddress}
                            onChange={(e) => setManualAddress(e.target.value)}
                            className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all font-medium text-gray-700"
                            autoFocus
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        
                        {isSearching && (
                            <Loader2 className="w-4 h-4 text-red-500 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
                        )}
                    </div>
                </form>

                {/* --- SUGGESTIONS LIST --- */}
                {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-60 overflow-y-auto">
                        <ul className="divide-y divide-gray-50">
                            {suggestions.map((place, idx) => (
                                <li 
                                    key={idx}
                                    onClick={() => handleSelectSuggestion(place)}
                                    className="px-4 py-3 hover:bg-red-50 cursor-pointer flex items-start gap-3 transition-colors group"
                                >
                                    <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0 group-hover:text-red-500" />
                                    <div className="flex-1 min-w-0">
                                        {/* Main Name: "Kottakkal" */}
                                        <p className="text-sm font-bold text-gray-800 line-clamp-1">
                                            {place.name}
                                        </p>
                                        {/* Full Context: "Kottakkal, Ernad, Malappuram..." */}
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-tight mt-0.5">
                                            {place.display_name}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* No Results State */}
                {!isSearching && manualAddress.length > 3 && suggestions.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100 z-50 text-center text-gray-500 text-sm">
                        No places found in Kerala matching "{manualAddress}"
                    </div>
                )}
            </div>

         </div>
      </div>
    </div>
  );
};

export default LocationModal;