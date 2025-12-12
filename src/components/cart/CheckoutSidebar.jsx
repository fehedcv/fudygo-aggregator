import { LogIn, MapPin, Home, Briefcase, Loader2 } from 'lucide-react';

const CheckoutSidebar = ({ 
  currentUser, 
  loginWithGoogle, 
  deliveryAddress, 
  onChangeAddress, 
  cartTotal,
  onPlaceOrder, // New Prop
  loading // New Prop
}) => {
  
  const getIcon = (type) => {
    const t = type?.toLowerCase();
    if (t === 'home') return <Home className="w-5 h-5" />;
    if (t === 'work') return <Briefcase className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Log in to Checkout</h3>
        <p className="text-gray-500 text-sm mb-6">Please sign in with your account to select your delivery address and complete your order.</p>
        
        <button onClick={loginWithGoogle} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          Continue with Google
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Delivery Address</h3>
          <button onClick={onChangeAddress} className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full transition-colors">
            Change
          </button>
        </div>
        
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="p-2 bg-white rounded-full text-gray-700 shadow-sm shrink-0">
            {getIcon(deliveryAddress.icon)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800 text-sm capitalize">{deliveryAddress.label || "Select Address"}</span>
              <span className="text-[10px] text-gray-400 font-normal border-l border-gray-300 pl-2 ml-1">{currentUser.displayName}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
              {deliveryAddress.address || "Please select a delivery address"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
        <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">₹{cartTotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery Fee</span>
            <span className="font-medium">₹40.00</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Service Fee</span>
            <span className="font-medium">₹15.00</span>
          </div>
          <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-end">
            <span className="font-bold text-gray-900">Total</span>
            <div className="text-right">
              <span className="block text-2xl font-black text-gray-900 tracking-tight">₹{(parseFloat(cartTotal) + 55).toFixed(2)}</span>
              <span className="text-[10px] text-gray-400 font-medium">Includes Tax</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onPlaceOrder}
          disabled={loading || !deliveryAddress.id}
          className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Place Order'}
        </button>
      </div>
    </>
  );
};

export default CheckoutSidebar;