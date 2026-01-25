import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';

// Components
import CartEmptyState from '../components/cart/CartEmptyState';
import CartItems from '../components/cart/CartItems';
import CheckoutSidebar from '../components/cart/CheckoutSidebar';
import AddressModal from '../components/cart/AddressModal';
import CartSkeleton from '../components/cart/CartSkeleton';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, deliveryAddress, setDeliveryAddress } = useCart();
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [instructions, setInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // ... (Keep existing useEffect for fetching addresses) ...
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentUser) {
        setSavedAddresses([]);
        return;
      }
      setLoadingAddresses(true);
      try {
        const response = await axiosClient.get('/addresses/me');
        if (Array.isArray(response)) {
            setSavedAddresses(response);
             if (response.length > 0 && (!deliveryAddress || deliveryAddress.id === 1)) {
                const defaultAddr = response.find(a => a.is_default === 1) || response[0];
                setDeliveryAddress({
                    id: defaultAddr.id,
                    label: defaultAddr.label,
                    address: defaultAddr.formatted_address || defaultAddr.address,
                    icon: defaultAddr.label.toLowerCase()
                });
             }
        }
      } catch (error) {
        setSavedAddresses([]); 
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, [currentUser, setDeliveryAddress]);

  const handleAddressSelect = (addr) => {
    setDeliveryAddress({
        id: addr.id,
        label: addr.label,
        address: addr.formatted_address || addr.address,
        icon: addr.label.toLowerCase()
    });
    setIsAddressModalOpen(false);
  };

  // --- HANDLE PLACE ORDER ---
  const handlePlaceOrder = async () => {
    // Check if user is logged in
    if (!currentUser) {
      alert("Please log in to place an order.");
      return;
    }

    // Check if address is selected
    if (!deliveryAddress?.id || deliveryAddress.id === 1) {
      alert("Please select or add a delivery address.");
      setIsAddressModalOpen(true);
      return;
    }

    // Check if user has any saved addresses
    if (savedAddresses.length === 0) {
      alert("Please add a delivery address before placing an order.");
      setIsAddressModalOpen(true);
      return;
    }

    setIsPlacingOrder(true);

    const orderPayload = {
        restaurant_id: cart.restaurantId,
        delivery_address_id: deliveryAddress.id,
        order_type: "delivery",
        items: cart.items.map(item => ({
            item_id: item.id,
            quantity: item.quantity
        })),
        payment_method: "cash",
        special_instructions: instructions || "None",
        scheduled_time: null
    };

    try {
        const response = await axiosClient.post('/orders/', orderPayload);
        console.log("Order Placed:", response);
        
        alert("Order placed successfully!");
        clearCart();
        navigate('/orders');
        
    } catch (error) {
        console.error("Order Failed:", error);
        alert("Failed to place order. Please try again.");
    } finally {
        setIsPlacingOrder(false);
    }
  };

  if (cart.items.length === 0) return <CartEmptyState />;

  if (loadingAddresses && currentUser) return <CartSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4 sm:px-6 lg:px-8 font-sans pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Link to="/" className="text-gray-400 hover:text-red-600 transition-colors">
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
              Checkout
            </h1>
            {currentUser && (
                <div className="flex items-center gap-2 md:gap-3">
                    <img src={currentUser.photoURL} alt="User" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200" />
                    <button onClick={logout} className="text-xs md:text-sm font-medium text-gray-500 hover:text-red-600 hidden sm:block">Sign Out</button>
                </div>
            )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <CartItems 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            instructions={instructions}
            setInstructions={setInstructions}
          />
          <div className="w-full lg:w-96 space-y-4 md:space-y-6">
            <CheckoutSidebar 
              currentUser={currentUser}
              loginWithGoogle={loginWithGoogle}
              deliveryAddress={deliveryAddress}
              savedAddresses={savedAddresses}
              onChangeAddress={() => setIsAddressModalOpen(true)}
              cartTotal={getCartTotal()}
              onPlaceOrder={handlePlaceOrder}
              loading={isPlacingOrder}
            />
          </div>
        </div>
      </div>

      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={savedAddresses}
        loading={loadingAddresses}
        selectedId={deliveryAddress?.id}
        onSelect={handleAddressSelect}
      />
    </div>
  );
};

export default Cart;