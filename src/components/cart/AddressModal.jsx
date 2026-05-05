import { useState, useEffect } from 'react';
import { X, Loader2, MapPin, Home, Briefcase, Plus, CheckCircle2, Crosshair, ArrowLeft, Search } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const AddressModal = ({ isOpen, onClose, addresses, loading, selectedId, onSelect, onAddressAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    address: '',
    latitude: '',
    longitude: '',
    city: '',
    state: '',
    postal_code: ''
  });

  // Reset form state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowForm(false);
      resetForm();
    }
  }, [isOpen]);

  // Autocomplete: watch typing in address field
  useEffect(() => {
    if (newAddress.address.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const query = `${newAddress.address}, Kerala`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&addressdetails=1`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [newAddress.address]);

  const resetForm = () => {
    setNewAddress({
      label: 'Home',
      address: '',
      latitude: '',
      longitude: '',
      city: '',
      state: '',
      postal_code: ''
    });
    setSuggestions([]);
  };

  const handleSelectSuggestion = (place) => {
    const addr = place.address || {};
    setNewAddress({
      ...newAddress,
      address: place.display_name,
      latitude: place.lat,
      longitude: place.lon,
      city: addr.city || addr.town || addr.village || "",
      state: addr.state || "Kerala",
      postal_code: addr.postcode || "",
    });
    setSuggestions([]);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
          const data = await response.json();
          const addr = data.address || {};
          setNewAddress({
            ...newAddress,
            address: data.display_name,
            latitude: String(latitude),
            longitude: String(longitude),
            city: addr.city || addr.town || "",
            state: addr.state || "",
            postal_code: addr.postcode || ""
          });
        } catch (e) { alert("Could not fetch address details."); }
        finally { setIsFetchingLocation(false); }
      },
      () => {
        setIsFetchingLocation(false);
        alert('Location failed. Please search manually.');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.address.trim()) return;

    setIsSaving(true);
    try {
      const savedAddr = await axiosClient.post('/addresses/me', {
        ...newAddress,
        latitude: newAddress.latitude || "0",
        longitude: newAddress.longitude || "0",
        is_default: 0
      });

      // Notify parent to refresh addresses
      if (onAddressAdded) {
        await onAddressAdded();
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Failed to save address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const getIcon = (type) => {
    const t = type?.toLowerCase();
    if (t === 'home') return <Home className="w-5 h-5" />;
    if (t === 'work') return <Briefcase className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          {showForm ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setShowForm(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-lg text-gray-900">Add New Address</h3>
            </div>
          ) : (
            <h3 className="font-bold text-lg text-gray-900">Select Address</h3>
          )}
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {showForm ? (
            /* ---------- ADD ADDRESS FORM ---------- */
            <form onSubmit={handleSaveAddress} className="space-y-3">
              {/* GPS Button */}
              <button 
                type="button" 
                onClick={handleUseCurrentLocation} 
                disabled={isFetchingLocation} 
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-700 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
              >
                {isFetchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
                Use Current Location
              </button>

              <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                <div className="flex-1 h-px bg-gray-200"></div>
                OR SEARCH
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Label */}
              <select 
                value={newAddress.label} 
                onChange={(e) => setNewAddress({...newAddress, label: e.target.value})} 
                className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-100 bg-white font-medium"
              >
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>

              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search area (e.g. Kottakkal)"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  className="w-full p-3 pl-10 pr-10 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-100"
                  required
                />
                {isSearching && <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute right-3 top-3.5" />}

                {/* Autocomplete Dropdown */}
                {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((place, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => handleSelectSuggestion(place)}
                        className="p-3 text-sm hover:bg-red-50 cursor-pointer border-b border-gray-50 last:border-none"
                      >
                        <strong className="block text-gray-800">{place.name || place.display_name.split(',')[0]}</strong>
                        <span className="text-xs text-gray-500 line-clamp-1">{place.display_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Show selected coordinates confirmation */}
              {newAddress.latitude && newAddress.longitude && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-xs text-green-700 font-medium">Location detected successfully</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); resetForm(); }} 
                  className="flex-1 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Address
                </button>
              </div>
            </form>
          ) : (
            /* ---------- ADDRESS LIST ---------- */
            <>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <MapPin className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p>No saved addresses found.</p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => onSelect(addr)}
                    className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between group transition-all ${selectedId === addr.id ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-gray-200 hover:border-red-300 hover:shadow-md bg-white'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedId === addr.id ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600'}`}>
                        {getIcon(addr.label)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm capitalize ${selectedId === addr.id ? 'text-red-900' : 'text-gray-800'}`}>
                          {addr.label}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {addr.formatted_address || addr.address}
                        </p>
                      </div>
                    </div>
                    {selectedId === addr.id && (
                      <div className="text-red-600 bg-white rounded-full p-1 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 fill-red-600 text-white" />
                      </div>
                    )}
                  </div>
                ))
              )}

              <button 
                onClick={() => setShowForm(true)}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-semibold hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all group"
              >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Add New Address
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressModal;