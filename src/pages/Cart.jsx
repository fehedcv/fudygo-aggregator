import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // Import Axios
import { 
  Trash2, Plus, Minus, ArrowLeft, ShoppingBag, 
  MapPin, Home, Briefcase, ChevronRight, X, CheckCircle2, LogIn, LogOut, Loader2 
} from 'lucide-react';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, deliveryAddress, setDeliveryAddress } = useCart();
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  
  // New State for API Data
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

// Inside src/pages/Cart.jsx

useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentUser) {
        setSavedAddresses([]);
        return;
      }

      setLoadingAddresses(true);
      try {
        const response = await axiosClient.get('/addresses/me');
        
        // SAFETY CHECK: Ensure response is actually an array before setting state
        if (Array.isArray(response)) {
            setSavedAddresses(response);
            
            // ... (rest of your auto-select logic) ...
             if (response.length > 0 && (!deliveryAddress || deliveryAddress.id === 1)) {
                // ...
             }
        } else {
            console.error("API did not return an array:", response);
            setSavedAddresses([]);
        }

      } catch (error) {
        // Error is already logged by axios interceptor
        setSavedAddresses([]); 
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
}, [currentUser, setDeliveryAddress]);
  // Helper to choose icon based on label
  const getIcon = (type) => {
    const t = type?.toLowerCase();
    if (t === 'home') return <Home className="w-5 h-5" />;
    if (t === 'work') return <Briefcase className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="block w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors">
            Start Ordering
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Link to="/" className="text-gray-400 hover:text-red-600 transition-colors"><ArrowLeft className="w-6 h-6" /></Link>
            Checkout
            </h1>
            
            {currentUser && (
                <div className="flex items-center gap-3">
                    <img src={currentUser.photoURL} alt="User" className="w-8 h-8 rounded-full border border-gray-200" />
                    <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-red-600">Sign Out</button>
                </div>
            )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT COLUMN: ITEMS --- */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-red-600" />
                   </div>
                   <h2 className="font-bold text-gray-800">Order from {cart.restaurantName}</h2>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  20-30 mins
                </span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cart.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-gray-800 mb-0.5">{item.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">₹{item.price}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                        <button onClick={() => updateQuantity(item.name, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-600 disabled:opacity-50 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center text-gray-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.name, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-green-600 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-gray-800 w-16 text-right tabular-nums">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                      <button onClick={() => removeFromCart(item.name)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
               <h3 className="font-bold text-gray-800 mb-2 text-sm">Delivery Instructions</h3>
               <textarea placeholder="e.g. Leave at front door, ring doorbell..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-200 outline-none transition-all resize-none h-20"></textarea>
            </div>
          </div>

          {/* --- RIGHT COLUMN: CHECKOUT FLOW --- */}
          <div className="w-full lg:w-96 space-y-6">
            
            {!currentUser ? (
                // --- LOGGED OUT STATE ---
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
            ) : (
                // --- LOGGED IN STATE ---
                <>
                    {/* 1. ADDRESS CARD */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900">Delivery Address</h3>
                            <button 
                                onClick={() => setIsAddressModalOpen(true)}
                                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full transition-colors"
                            >
                                Change
                            </button>
                        </div>
                        
                        {/* Selected Address Display */}
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

                    {/* 2. PAYMENT SUMMARY */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium">₹{getCartTotal()}</span>
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
                                    <span className="block text-2xl font-black text-gray-900 tracking-tight">₹{(parseFloat(getCartTotal()) + 55).toFixed(2)}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">Includes Tax</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-[0.98]">
                            Place Order
                        </button>
                    </div>
                </>
            )}
          </div>
        </div>
      </div>

      {/* --- ADDRESS SELECTION MODAL --- */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsAddressModalOpen(false)}></div>
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                 <h3 className="font-bold text-lg text-gray-900">Select Address</h3>
                 <button onClick={() => setIsAddressModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
                 {loadingAddresses ? (
                     <div className="flex justify-center py-8">
                         <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                     </div>
                 ) : savedAddresses.length === 0 ? (
                     <div className="text-center py-6 text-gray-500">
                         <MapPin className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                         <p>No saved addresses found.</p>
                     </div>
                 ) : (
                    savedAddresses.map((addr) => (
                        <div 
                           key={addr.id} 
                           onClick={() => { 
                               // Convert API format to Context Format
                               setDeliveryAddress({
                                   id: addr.id,
                                   label: addr.label,
                                   address: addr.formatted_address || addr.address,
                                   icon: addr.label.toLowerCase()
                               });
                               setIsAddressModalOpen(false); 
                           }} 
                           className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between group transition-all ${deliveryAddress.id === addr.id ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-gray-200 hover:border-red-300 hover:shadow-md bg-white'}`}
                        >
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${deliveryAddress.id === addr.id ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600'}`}>
                                  {getIcon(addr.label)}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <h4 className={`font-bold text-sm capitalize ${deliveryAddress.id === addr.id ? 'text-red-900' : 'text-gray-800'}`}>
                                      {addr.label}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                                      {addr.formatted_address || addr.address}
                                  </p>
                              </div>
                           </div>
                           {deliveryAddress.id === addr.id && (
                               <div className="text-red-600 bg-white rounded-full p-1 shadow-sm">
                                   <CheckCircle2 className="w-5 h-5 fill-red-600 text-white" />
                               </div>
                           )}
                        </div>
                     ))
                 )}
                 
                 <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-semibold hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all group">
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Add New Address
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Cart;