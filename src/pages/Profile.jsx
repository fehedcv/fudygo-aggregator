import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import axiosClient from '../api/axiosClient';
import { 
  User, MapPin, Camera, Save, Plus, Trash2, 
  Loader2, LogOut, ArrowLeft 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    photoURL: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', address: '' });

  // 1. Fetch User Data & Addresses
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Initialize with Firebase/Auth Context data
    setProfileData({
      name: currentUser.displayName || '',
      email: currentUser.email || '',
      phone: currentUser.phoneNumber || '',
      photoURL: currentUser.photoURL || ''
    });

    const fetchAddresses = async () => {
      try {
        const res = await axiosClient.get('/addresses/me');
        if (Array.isArray(res)) setAddresses(res);
      } catch (error) {
        console.error("Failed to load addresses", error);
      }
    };
    fetchAddresses();
  }, [currentUser, navigate]);

  // 2. Handle Profile Update
  const handleProfileSave = async () => {
    setLoading(true);
    try {
        // Assuming your backend has a PUT endpoint for profile updates
        // If not, this might need to be adjusted to your specific API
        await axiosClient.put('/auth/me', {
            name: profileData.name,
            phone: profileData.phone,
            photo_url: profileData.photoURL
        });
        setIsEditing(false);
        alert("Profile updated successfully!");
    } catch (error) {
        console.error("Update failed", error);
        alert("Failed to update profile.");
    } finally {
        setLoading(false);
    }
  };

  // 3. Handle Address Add
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.address) return;

    try {
        await axiosClient.post('/addresses', {
            label: newAddress.label,
            address: newAddress.address,
            // Add other required fields like lat/lng if your backend needs them
            latitude: 0, 
            longitude: 0 
        });
        
        // Refresh list
        const res = await axiosClient.get('/addresses/me');
        setAddresses(res);
        setShowAddressForm(false);
        setNewAddress({ label: 'Home', address: '' });
    } catch (error) {
        console.error("Add address failed", error);
    }
  };

  // 4. Handle Address Delete
  const handleDeleteAddress = async (id) => {
      if(!window.confirm("Delete this address?")) return;
      try {
          await axiosClient.delete(`/addresses/${id}`);
          setAddresses(prev => prev.filter(a => a.id !== id));
      } catch (error) {
          console.error("Delete failed", error);
      }
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-gray-500 hover:text-red-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button onClick={logout} className="text-sm font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </div>

        {/* --- PROFILE CARD --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    
                    {/* Avatar Section */}
                    <div className="relative group mx-auto sm:mx-0">
                        <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden">
                            {profileData.photoURL ? (
                                <img src={profileData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <User className="w-10 h-10" />
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-sm hover:bg-red-700 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{profileData.name || 'User'}</h2>
                                <p className="text-sm text-gray-500">{profileData.email}</p>
                            </div>
                            <button 
                                onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isEditing ? 'bg-red-600 text-white shadow-md hover:bg-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-red-100 outline-none disabled:bg-white disabled:border-transparent disabled:p-0 disabled:text-gray-800"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    disabled={!isEditing}
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                    placeholder="+91"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-red-100 outline-none disabled:bg-white disabled:border-transparent disabled:p-0 disabled:text-gray-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- ADDRESSES CARD --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" /> Saved Addresses
                </h3>
                <button 
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-sm font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>

            {/* Add Address Form */}
            {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <select 
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                            className="p-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-red-500"
                        >
                            <option>Home</option>
                            <option>Work</option>
                            <option>Other</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Full Address (House, Street, City...)"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                            className="sm:col-span-2 p-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-red-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-bold">Save Address</button>
                    </div>
                </form>
            )}

            {/* Address List */}
            <div className="space-y-3">
                {addresses.length === 0 ? (
                    <p className="text-center text-gray-400 py-4 text-sm">No saved addresses found.</p>
                ) : (
                    addresses.map((addr) => (
                        <div key={addr.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:border-red-100 hover:shadow-sm transition-all group">
                            <div className="flex gap-3">
                                <div className="mt-0.5 p-2 bg-red-50 text-red-600 rounded-full">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-gray-900 capitalize block">{addr.label}</span>
                                    <span className="text-sm text-gray-500">{addr.formatted_address || addr.address}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;