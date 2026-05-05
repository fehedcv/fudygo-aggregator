import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const CartEmptyState = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="block w-full bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
          Start Ordering
        </Link>
      </div>
    </div>
  );
};

export default CartEmptyState;