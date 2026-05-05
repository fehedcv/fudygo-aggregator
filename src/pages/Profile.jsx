import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { 
  User, MapPin, Plus, Trash2, Loader2, LogOut, ArrowLeft, Receipt, Crosshair, Search, LogIn 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, logout, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  // Profile State
  const [profileData, setProfileData] = useState({ name: '', email: '', photoURL: '' });
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Search / Location State
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // For Autocomplete
  const [isSearching, setIsSearching] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    address: '',
    latitude: '',
    longitude: '',
    city: '',
    state: '',
    postal_code: ''
  });

  // 1. Initialize Data
  useEffect(() => {
    if (!currentUser) { return; }

    setProfileData({
      name: currentUser.displayName || '',
      email: currentUser.email || '',
      photoURL: currentUser.photoURL || ''
    });

    const fetchAddresses = async () => {
      try {
        const res = await axiosClient.get('/addresses/me');
        if (Array.isArray(res)) setAddresses(res);
      } catch (error) { console.error(error); }
    };
    fetchAddresses();
  }, [currentUser]);

  // Show login prompt if not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Profile</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to manage your profile</p>
          
          <button
            onClick={loginWithGoogle}
            className="w-full bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mb-3"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-500 text-sm py-2 hover:text-gray-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // 2. AUTOCOMPLETE: Watch for typing in address field
  useEffect(() => {
    if (newAddress.address.length < 3) {
      setSuggestions([]);
      return;
    }

    // Debounce to avoid API spam
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const query = `${newAddress.address}, Kerala`; // Bias results to Kerala
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

  // 3. Handle Selecting a Search Suggestion
  const handleSelectSuggestion = (place) => {
    const addr = place.address || {};
    
    setNewAddress({
      ...newAddress,
      address: place.display_name, // Full address
      latitude: place.lat,
      longitude: place.lon,
      city: addr.city || addr.town || addr.village || "",
      state: addr.state || "Kerala",
      postal_code: addr.postcode || "",
      country: addr.country || "India"
    });
    setSuggestions([]); // Clear dropdown
  };

  // 4. Handle GPS (Laptop: IP-based / Phone: GPS-based)
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

  // 5. Submit Address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
        await axiosClient.post('/addresses/me', {
            ...newAddress,
            latitude: newAddress.latitude || "0",
            longitude: newAddress.longitude || "0",
            is_default: 0
        });
        const res = await axiosClient.get('/addresses/me');
        setAddresses(res);
        setShowAddressForm(false);
        setNewAddress({ label: 'Home', address: '', latitude: '', longitude: '' });
    } catch (error) { alert("Failed to save address."); }
  };

  // 6. Delete Address
  const handleDeleteAddress = async (id) => {
      if(!window.confirm("Delete?")) return;
      try {
          await axiosClient.delete(`/addresses/me/${id}`);
          setAddresses(prev => prev.filter(a => a.id !== id));
      } catch (e) { console.error(e); }
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-gray-500 hover:text-slate-700 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button onClick={logout} className="text-sm font-bold text-slate-700 hover:bg-yellow-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </div>

        {/* Orders Shortcut */}
        <Link to="/orders" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-yellow-200 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full group-hover:scale-110 transition-transform">
                        <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">My Orders</h3>
                        <p className="text-sm text-gray-500">View past orders and reorder</p>
                    </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                </div>
            </div>
        </Link>

        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden shrink-0">
                {profileData.photoURL ? <img src={profileData.photoURL} className="w-full h-full object-cover"/> : <User className="w-8 h-8 m-auto mt-5 text-gray-400"/>}
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
                <p className="text-sm text-gray-500">{profileData.email}</p>
            </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-yellow-600" /> Saved Addresses
                </h3>
                <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-sm font-bold text-slate-700 hover:bg-yellow-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>

            {/* --- ADD ADDRESS FORM --- */}
            {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    
                    {/* GPS Button */}
                    <button type="button" onClick={handleUseCurrentLocation} disabled={isFetchingLocation} className="w-full mb-4 flex items-center justify-center gap-2 bg-yellow-100 text-slate-700 font-bold py-2.5 rounded-lg hover:bg-yellow-200 transition-colors">
                        {isFetchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
                        Use Current Location
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <select value={newAddress.label} onChange={(e) => setNewAddress({...newAddress, label: e.target.value})} className="p-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-yellow-500">
                            <option>Home</option>
                            <option>Work</option>
                            <option>Other</option>
                        </select>
                        
                        {/* SEARCH INPUT */}
                        <div className="sm:col-span-2 relative">
                            <input 
                                type="text" 
                                placeholder="Search area (e.g. Kottakkal)"
                                value={newAddress.address}
                                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                                className="w-full p-2.5 pr-10 rounded-lg border border-gray-300 text-sm outline-none focus:border-yellow-500"
                                required
                            />
                            {isSearching && <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute right-3 top-3" />}
                            
                            {/* Autocomplete Dropdown */}
                            {suggestions.length > 0 && (
                                <ul className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                                    {suggestions.map((place, idx) => (
                                        <li 
                                            key={idx} 
                                            onClick={() => handleSelectSuggestion(place)}
                                            className="p-3 text-sm hover:bg-yellow-50 cursor-pointer border-b border-gray-50 last:border-none"
                                        >
                                            <strong className="block text-gray-800">{place.name || place.display_name.split(',')[0]}</strong>
                                            <span className="text-xs text-gray-500 line-clamp-1">{place.display_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-bold">Save Address</button>
                    </div>
                </form>
            )}

            {/* Address List */}
            <div className="space-y-3">
                {addresses.map((addr) => (
                    <div key={addr.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:border-yellow-200 transition-all">
                        <div className="flex gap-3">
                            <div className="mt-0.5 p-2 bg-yellow-50 text-yellow-600 rounded-full"><MapPin className="w-4 h-4" /></div>
                            <div>
                                <span className="text-sm font-bold text-gray-900 capitalize block">{addr.label}</span>
                                <span className="text-sm text-gray-500">{addr.formatted_address || addr.address}</span>
                            </div>
                        </div>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-gray-300 hover:text-slate-700 hover:bg-yellow-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;