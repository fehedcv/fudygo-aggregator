import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext'; // Import context
import { 
  Home, ShoppingBag, RotateCcw, Menu, X, MapPin, 
  ChevronDown, MoreHorizontal, SlidersHorizontal 
} from 'lucide-react';
import LocationModal from './LocationModal';
import FilterDrawer from './FilterDrawer';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  // Use Global State
  const { locationName, updateLocation } = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const navLinks = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Reorder', icon: RotateCcw, path: '#' },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 font-sans border-b border-gray-100">
        <div className="w-full px-4 lg:px-12">
          <div className="flex justify-between h-20">
            {/* ... (Keep your existing Logo code) ... */}
            <div className="flex items-center gap-4 lg:gap-12">
              <Link to="/" className="flex flex-col items-center justify-center leading-none group cursor-pointer">
                <h1 className="text-2xl lg:text-3xl font-black text-red-600 tracking-tighter uppercase group-hover:opacity-90 transition-opacity">FudyGo</h1>
                <span className="text-[0.5rem] lg:text-[0.65rem] font-bold text-red-500 tracking-[0.2em] uppercase mt-0.5">Order. Eat. Enjoy.</span>
              </Link>

              {/* Location Selector (Desktop) */}
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

            {/* ... (Keep your existing Navigation Links & Mobile Icons code) ... */}
            {/* Just ensuring the mobile menu uses the correct locationName variable */}
            <div className="hidden xl:flex items-center space-x-8">
              {/* ... existing links ... */}
               <Link to="/cart" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all relative">
                <ShoppingBag className="w-5 h-5" />
                <span>Cart</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full shadow-sm ring-2 ring-white">{cartCount}</span>}
              </Link>
              {/* ... */}
            </div>
             
             {/* Mobile Icons */}
            <div className="flex items-center xl:hidden gap-3">
               <button onClick={() => setIsLocationModalOpen(true)} className="p-2 text-gray-600 hover:text-red-600 transition-colors md:hidden">
                <MapPin className="w-6 h-6" />
              </button>
              {/* ... rest of mobile icons ... */}
            </div>
          </div>
        </div>
      </nav>

      {/* Pass the global update function to the modal */}
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        onUpdateLocation={updateLocation} 
      />

      <FilterDrawer 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </>
  );
};

export default Navbar;