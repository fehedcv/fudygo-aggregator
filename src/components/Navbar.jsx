import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { 
  Home, ShoppingBag, RotateCcw, Menu, X, MapPin, 
  ChevronDown, MoreHorizontal, SlidersHorizontal, User, Receipt // Import Receipt Icon
} from 'lucide-react';
import LocationModal from './LocationModal';
import FilterDrawer from './FilterDrawer';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  const { locationName, updateLocation } = useLocation();
  const { getCartCount } = useCart();
  const { currentUser } = useAuth();
  
  const cartCount = getCartCount();

  // Add 'Orders' to the navigation links array
  const navLinks = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Orders', icon: Receipt, path: '/orders' }, // New Link
    { name: 'Reorder', icon: RotateCcw, path: '#' },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 font-sans border-b border-gray-100">
        <div className="w-full px-4 lg:px-12">
          <div className="flex justify-between h-20">
            
            {/* LEFT SIDE: Brand & Location */}
            <div className="flex items-center gap-4 lg:gap-12">
              <Link to="/" className="flex flex-col items-center justify-center leading-none group cursor-pointer">
                <h1 className="text-2xl lg:text-3xl font-black text-red-600 tracking-tighter uppercase group-hover:opacity-90 transition-opacity">FudyGo</h1>
                <span className="text-[0.5rem] lg:text-[0.65rem] font-bold text-red-500 tracking-[0.2em] uppercase mt-0.5">Order. Eat. Enjoy.</span>
              </Link>

              {/* Location (Desktop) */}
              <div 
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-3 group cursor-pointer select-none border-l border-gray-200 pl-8 h-10"
              >
                <div className="p-2 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-800 text-sm group-hover:text-red-600 transition-colors truncate max-w-[150px]">
                    {locationName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${link.name === 'Home' ? 'text-red-600' : 'text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg'}`}>
                  <link.icon className={`w-4 h-4 ${link.name === 'Home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {link.name}
                </Link>
              ))}

              <Link to="/cart" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all relative">
                <ShoppingBag className="w-5 h-5" />
                <span>Cart</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full shadow-sm ring-2 ring-white">{cartCount}</span>}
              </Link>

              {/* USER PROFILE BUTTON (DESKTOP) */}
              {currentUser ? (
                <Link to="/profile" className="flex items-center gap-2 pl-4 border-l border-gray-200">
                    <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden border border-gray-200 hover:border-red-400 transition-colors">
                        {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="w-5 h-5" /></div>
                        )}
                    </div>
                </Link>
              ) : (
                <button 
                    onClick={() => navigate('/cart')} 
                    className="text-sm font-bold text-gray-700 hover:text-red-600"
                >
                    Log In
                </button>
              )}
            </div>

            {/* MOBILE ICONS SECTION */}
            <div className="flex items-center xl:hidden gap-2">
               <button onClick={() => setIsLocationModalOpen(true)} className="p-2 text-gray-600 hover:text-red-600 transition-colors md:hidden">
                <MapPin className="w-6 h-6" />
              </button>
              
              <button onClick={() => setIsFilterOpen(true)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                <SlidersHorizontal className="w-6 h-6" />
              </button>

              <Link to={currentUser ? "/profile" : "/cart"} className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                 {currentUser && currentUser.photoURL ? (
                     <img src={currentUser.photoURL} className="w-6 h-6 rounded-full border border-gray-200" alt="User" />
                 ) : (
                     <User className="w-6 h-6" />
                 )}
              </Link>

              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full border border-white">{cartCount}</span>
                )}
              </Link>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-colors">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-gray-100 bg-white shadow-lg absolute w-full left-0">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <div onClick={() => { setIsMobileMenuOpen(false); setIsLocationModalOpen(true); }} className="flex items-center gap-3 px-3 py-4 border-b border-gray-100 mb-2 cursor-pointer active:bg-gray-50">
                <MapPin className="w-5 h-5 text-red-600" />
                <span className="font-bold text-gray-800">{locationName}</span>
                <span className="text-xs text-blue-500 ml-auto font-medium">Change</span>
              </div>
              
              {/* Map through navLinks for Mobile Menu as well */}
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50"
                >
                    <link.icon className="w-5 h-5" /> {link.name}
                </Link>
              ))}

              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50">
                  <User className="w-5 h-5" /> My Profile
              </Link>
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50">
                  <ShoppingBag className="w-5 h-5" /> Cart ({cartCount})
              </Link>
            </div>
          </div>
        )}
      </nav>

      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} onUpdateLocation={updateLocation} />
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  );
};

export default Navbar;