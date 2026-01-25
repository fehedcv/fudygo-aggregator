import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BottomCartBar = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, getCartCount } = useCart();
  
  const itemCount = getCartCount();
  const total = getCartTotal();

  if (itemCount === 0) return null;

  return (
    <div 
      onClick={() => navigate('/cart')}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-2xl z-50 cursor-pointer hover:from-red-700 hover:to-red-600 transition-all xl:bottom-4 xl:left-1/2 xl:transform xl:-translate-x-1/2 xl:max-w-2xl xl:rounded-2xl"
    >
      <div className="px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
            <p className="text-xs text-red-50 font-medium">{cart.restaurantName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-base font-bold">₹{total}</p>
            <p className="text-xs text-red-50 font-medium">View Cart</p>
          </div>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default BottomCartBar;
