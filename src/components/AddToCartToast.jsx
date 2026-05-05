import { useEffect } from 'react';
import { Check } from 'lucide-react';

const AddToCartToast = ({ show, itemName, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-500">
        <div className="bg-yellow-400/90 p-0.5 rounded-full">
          <Check className="w-3.5 h-3.5 text-slate-800" strokeWidth={3} />
        </div>
        <p className="font-semibold text-sm">Added to cart!</p>
      </div>
    </div>
  );
};

export default AddToCartToast;
