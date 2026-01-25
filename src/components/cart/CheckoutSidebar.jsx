import { LogIn, MapPin, Home, Briefcase, Loader2, Plus, AlertCircle } from 'lucide-react';

const CheckoutSidebar = ({ 
  currentUser, 
  loginWithGoogle, 
  deliveryAddress, 
  savedAddresses,
  onChangeAddress, 
  cartTotal,
  onPlaceOrder,
  loading
}) => {
  
  const getIcon = (type) => {
    const t = type?.toLowerCase();
    if (t === 'home') return <Home className="w-5 h-5" />;
    if (t === 'work') return <Briefcase className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center sticky top-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Sign in to Checkout</h3>
        <p className="text-sm text-gray-500 mb-6">Login to complete your order</p>
        
        <button 
          onClick={loginWithGoogle} 
          className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:border-gray-300 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    );
  }

  const hasNoAddresses = !savedAddresses || savedAddresses.length === 0;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 text-sm md:text-base">Delivery Address</h3>
          <button 
            onClick={onChangeAddress} 
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full transition-colors"
          >
            {hasNoAddresses ? 'Add' : 'Change'}
          </button>
        </div>
        
        {hasNoAddresses ? (
          <div className="flex flex-col items-center justify-center bg-red-50 border-2 border-dashed border-red-200 p-4 md:p-6 rounded-lg text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            </div>
            <p className="text-xs md:text-sm font-bold text-gray-800 mb-1">No Address Added</p>
            <p className="text-xs text-gray-500 mb-3 md:mb-4">Please add a delivery address to continue</p>
            <button 
              onClick={onChangeAddress}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="p-2 bg-white rounded-full text-gray-700 shadow-sm shrink-0">
              {getIcon(deliveryAddress.icon)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-800 text-xs md:text-sm capitalize">{deliveryAddress.label || "Select Address"}</span>
                <span className="text-[10px] text-gray-400 font-normal border-l border-gray-300 pl-2">{currentUser.displayName}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                {deliveryAddress.address || "Please select a delivery address"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 sticky top-4">
        <h3 className="font-bold text-gray-900 mb-4 text-sm md:text-base">Payment Summary</h3>
        <div className="space-y-2.5 md:space-y-3 mb-5 md:mb-6">
          <div className="flex justify-between text-xs md:text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">₹{cartTotal}</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm text-gray-600">
            <span>Delivery Fee</span>
            <span className="font-medium">₹40.00</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm text-gray-600">
            <span>Service Fee</span>
            <span className="font-medium">₹15.00</span>
          </div>
          <div className="border-t border-dashed border-gray-200 pt-3 md:pt-4 flex justify-between items-end">
            <span className="font-bold text-gray-900 text-sm md:text-base">Total</span>
            <div className="text-right">
              <span className="block text-xl md:text-2xl font-black text-gray-900 tracking-tight">₹{(parseFloat(cartTotal) + 55).toFixed(2)}</span>
              <span className="text-[10px] text-gray-400 font-medium">Includes Tax</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onPlaceOrder}
          disabled={loading || hasNoAddresses}
          className="w-full bg-red-600 text-white font-bold py-3 md:py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm md:text-base"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Place Order'}
        </button>
        {hasNoAddresses && (
          <p className="text-xs text-center text-red-600 mt-2 font-medium">Add an address to place order</p>
        )}
      </div>
    </>
  );
};

export default CheckoutSidebar;