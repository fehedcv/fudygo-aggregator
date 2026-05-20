import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { 
  Home, ShoppingBag, RotateCcw, Menu, X, MapPin, 
  ChevronDown, MoreHorizontal, SlidersHorizontal, User, Receipt, LogOut, LogIn, MapPinned
} from 'lucide-react';
import LocationModal from './LocationModal';
import FilterDrawer from './FilterDrawer';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=475569&color=fff&bold=true&size=128&name=';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  
  const { locationName, updateLocation } = useLocation();
  const { getCartCount } = useCart();
  const { currentUser, loginWithGoogle, logout } = useAuth();
  
  const cartCount = getCartCount();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAvatarUrl = () => {
    if (currentUser?.photoURL) return currentUser.photoURL;
    const name = currentUser?.displayName || currentUser?.email || 'U';
    return `${DEFAULT_AVATAR}${encodeURIComponent(name)}`;
  };

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await logout();
    navigate('/');
  };

  // Add 'Orders' to the navigation links array
  const navLinks = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Orders', icon: Receipt, path: '/orders' }, // New Link
  ];

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 font-sans border-b border-gray-100">
        <div className="w-full px-4 lg:px-12">
          <div className="flex justify-between h-20">
            
            {/* LEFT SIDE: Brand & Location */}
            <div className="flex items-center gap-4 lg:gap-12">
              <Link to="/" className="flex items-center justify-center group cursor-pointer">
                <img 
                  src="/fudygo-logo.png" 
                  alt="FudyGo" 
                  className="h-16 lg:h-20 w-auto object-contain group-hover:opacity-90 transition-opacity"
                />
              </Link>

              {/* Location (Desktop) */}
              <div 
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-3 group cursor-pointer select-none border-l border-gray-200 pl-8 h-10"
              >
                <div className="p-2 bg-yellow-50 rounded-full group-hover:bg-yellow-100 transition-colors">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-800 text-sm group-hover:text-slate-700 transition-colors truncate max-w-[150px]">
                    {locationName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${link.name === 'Home' ? 'text-yellow-500' : 'text-gray-500 hover:text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg'}`}>
                  <link.icon className={`w-4 h-4 ${link.name === 'Home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {link.name}
                </Link>
              ))}

              <Link to="/cart" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all relative">
                <ShoppingBag className="w-5 h-5" />
                <span>Cart</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-slate-800 bg-yellow-400 rounded-full shadow-sm ring-2 ring-white">{cartCount}</span>}
              </Link>

              {/* USER PROFILE DROPDOWN (DESKTOP) */}
              <div className="relative pl-4 border-l border-gray-200" ref={dropdownRef}>
                {currentUser ? (
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 hover:border-yellow-400 transition-colors">
                      <img 
                        src={getAvatarUrl()} 
                        alt="User" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.src = `${DEFAULT_AVATAR}U`; }}
                      />
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <button 
                    onClick={loginWithGoogle}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )}

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && currentUser && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-4 bg-gray-50/80 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                          <img 
                            src={getAvatarUrl()} 
                            alt="User" 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = `${DEFAULT_AVATAR}U`; }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-gray-900 truncate">{currentUser.displayName || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => { setIsProfileDropdownOpen(false); navigate('/profile'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                      >
                        <MapPinned className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Saved Addresses</span>
                      </button>

                      <div className="mx-3 border-t border-gray-100"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-slate-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MOBILE ICONS SECTION */}
            <div className="flex items-center xl:hidden gap-2">
               <button onClick={() => setIsLocationModalOpen(true)} className="p-2 text-gray-600 hover:text-slate-700 transition-colors md:hidden">
                <MapPin className="w-6 h-6" />
              </button>
              
              
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-gray-100 bg-white shadow-lg absolute w-full left-0">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <div onClick={() => { setIsMobileMenuOpen(false); setIsLocationModalOpen(true); }} className="flex items-center gap-3 px-3 py-4 border-b border-gray-100 mb-2 cursor-pointer active:bg-gray-50">
                <MapPin className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-800">{locationName}</span>
                <span className="text-xs text-slate-600 ml-auto font-medium">Change</span>
              </div>
              
              {/* Map through navLinks for Mobile Menu as well */}
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-slate-700 hover:bg-slate-50"
                >
                    <link.icon className="w-5 h-5" /> {link.name}
                </Link>
              ))}

              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-slate-700 hover:bg-slate-50">
                  <MapPinned className="w-5 h-5" /> Saved Addresses
              </Link>
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-slate-700 hover:bg-slate-50">
                  <ShoppingBag className="w-5 h-5" /> Cart ({cartCount})
              </Link>

              {currentUser && (
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} 
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-yellow-50"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} onUpdateLocation={updateLocation} />
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* BOTTOM NAVBAR FOR MOBILE */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around h-16 px-2">
          <Link to="/" className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-slate-700 transition-colors">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link to="/orders" className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-slate-700 transition-colors">
            <Receipt className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Orders</span>
          </Link>
          
          <Link to="/cart" className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-slate-700 transition-colors relative">
            <ShoppingBag className="w-6 h-6 mb-1" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1/2 translate-x-3 -translate-y-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-slate-800 bg-yellow-400 rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
            <span className="text-xs font-medium">Cart</span>
          </Link>
          
          <Link to="/profile" className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-slate-700 transition-colors">
            {currentUser ? (
              <>
                <img 
                  src={getAvatarUrl()} 
                  className="w-6 h-6 rounded-full border border-gray-200 mb-1" 
                  alt="User"
                  onError={(e) => { e.target.src = `${DEFAULT_AVATAR}U`; }} 
                />
                <span className="text-xs font-medium">Profile</span>
              </>
            ) : (
              <>
                <User className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Profile</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;