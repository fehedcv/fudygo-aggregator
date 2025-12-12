import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { ArrowLeft } from 'lucide-react';

// Components
import CartEmptyState from '../components/cart/CartEmptyState';
import CartItems from '../components/cart/CartItems';
import CheckoutSidebar from '../components/cart/CheckoutSidebar';
import AddressModal from '../components/cart/AddressModal';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, deliveryAddress, setDeliveryAddress } = useCart();
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  
  // Order State
  const [instructions, setInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // --- Fetch Addresses on Login ---
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

  // Handler for address selection
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
    if (!deliveryAddress?.id) {
        alert("Please select a delivery address.");
        return;
    }

    setIsPlacingOrder(true);

    // 1. Construct Payload
    const orderPayload = {
        restaurant_id: cart.restaurantId,
        delivery_address_id: deliveryAddress.id,
        order_type: "delivery",
        items: cart.items.map(item => ({
            item_id: item.id,
            quantity: item.quantity
        })),
        payment_method: "cash",
        special_instructions: instructions || "None", // Ensure string even if empty
        scheduled_time: null
    };

    try {
        // 2. Send Request
        const response = await axiosClient.post('/orders/', orderPayload);
        console.log("Order Placed:", response);
        
        // 3. Success Handling
        alert("Order placed successfully! (You can implement Cart Clear logic here)");
        // navigate('/orders'); // Redirect to order history or tracking page
        
        // Note: You should ideally add a clearCart() function to your CartContext 
        // and call it here to empty the basket.

    } catch (error) {
        console.error("Order Failed:", error);
        alert("Failed to place order. Please try again.");
    } finally {
        setIsPlacingOrder(false);
    }
  };

  if (cart.items.length === 0) return <CartEmptyState />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
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
          
          {/* Left Column: Items */}
          <CartItems 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            instructions={instructions}
            setInstructions={setInstructions}
          />

          {/* Right Column: Checkout Flow */}
          <div className="w-full lg:w-96 space-y-6">
            <CheckoutSidebar 
              currentUser={currentUser}
              loginWithGoogle={loginWithGoogle}
              deliveryAddress={deliveryAddress}
              onChangeAddress={() => setIsAddressModalOpen(true)}
              cartTotal={getCartTotal()}
              onPlaceOrder={handlePlaceOrder}
              loading={isPlacingOrder}
            />
          </div>
        </div>
      </div>

      {/* Address Modal */}
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