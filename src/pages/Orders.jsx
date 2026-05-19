import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useRestaurants } from '../context/RestaurantContext'; // To look up restaurant names
import { useCart } from '../context/CartContext';
import { 
  Package, Clock, CheckCircle, XCircle, ChevronRight, 
  MapPin, Calendar, Receipt, ShoppingBag, ArrowLeft, Loader2, RotateCcw, LogIn
} from 'lucide-react';

const Orders = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  const { getRestaurantById } = useRestaurants();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axiosClient.get('/orders/');
        // Sort by date (newest first) if API doesn't already
        const sorted = response.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrders(sorted);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  // Show login prompt if not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">View Your Orders</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to see your orders</p>
          
          <button
            onClick={loginWithGoogle}
            className="w-full bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mb-3"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-500 text-sm py-2 hover:text-gray-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Helper: Status Color & Icon
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="w-3 h-3" />, label: 'Delivered' };
      case 'cancelled':
        return { color: 'bg-red-50 text-red-600 border-red-100', icon: <XCircle className="w-3 h-3" />, label: 'Cancelled' };
      case 'pending':
        return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Clock className="w-3 h-3" />, label: 'Pending' };
      case 'preparing':
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Package className="w-3 h-3" />, label: 'Preparing' };
      default:
        return { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: <Clock className="w-3 h-3" />, label: status };
    }
  };

  // Helper: Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleReorder = (order) => {
    const restaurant = getRestaurantById(order.restaurant_id);
    const restaurantName = restaurant ? restaurant.name : `Restaurant #${order.restaurant_id}`;

    order.items.forEach((item) => {
      const cartItem = {
        id: item.id || item.item_id || `${order.restaurant_id}-${item.name}`,
        name: item.name,
        price: item.price || item.unit_price || (item.quantity && item.total_price ? (item.total_price / item.quantity).toFixed(2) : 0),
        image: item.image_url || item.image || ''
      };
      addToCart(cartItem, order.restaurant_id, restaurantName);
    });

    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-slate-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-slate-700 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-slate-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              Start Exploring <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = getStatusBadge(order.status);
              // Try to find restaurant name, or fallback to ID
              const restaurant = getRestaurantById(order.restaurant_id);
              const restaurantName = restaurant ? restaurant.name : `Restaurant #${order.restaurant_id}`;
              const restaurantImage = restaurant?.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop";

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                  
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                             <img src={restaurantImage} alt="Restaurant" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{restaurantName}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" /> {restaurant?.address || "Kerala"}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <div className={`px-2.5 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${status.color}`}>
                            {status.icon}
                            <span className="capitalize">{status.label}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-400">
                            #{order.order_number.slice(-6)}
                        </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row gap-6">
                        
                        {/* Items List */}
                        <div className="flex-1 space-y-2">
                             {order.items.map((item, idx) => (
                                 <div key={idx} className="flex items-start justify-between text-sm">
                                     <div className="flex gap-2">
                                         <span className="font-bold text-gray-400">{item.quantity}x</span>
                                         <span className="text-gray-700 font-medium">{item.name}</span>
                                     </div>
                                     <span className="text-gray-500">₹{item.total_price}</span>
                                 </div>
                             ))}
                        </div>

                        {/* Order Meta */}
                        <div className="w-full sm:w-48 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 flex flex-col justify-center space-y-3">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Amount</p>
                                <p className="text-xl font-black text-gray-900">₹{order.total_amount}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Ordered On</p>
                                <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {formatDate(order.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                      <button className="text-xs font-bold text-gray-500 hover:text-gray-900">
                          View Details
                      </button>
                      <button
                        onClick={() => handleReorder(order)}
                        className="text-sm font-bold text-slate-700 hover:bg-yellow-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                          <RotateCcw className="w-3 h-3" /> Reorder
                      </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;