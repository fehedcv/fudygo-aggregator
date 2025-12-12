import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurants } from '../context/RestaurantContext'; // Import Context
import { useCart } from '../context/CartContext';
import axiosClient from '../api/axiosClient';
import { Star, Clock, MapPin, Info, ChevronDown, Bike, ShoppingBag, Loader2 } from 'lucide-react';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { getRestaurantById } = useRestaurants(); // Get helper function
  
  // API State
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Get Basic Info from Context (persisted data)
  const restaurantInfo = getRestaurantById(id) || {
    // Robust Fallback in case user lands here directly without Home
    name: "Restaurant",
    address: "Kerala, India",
    distance: "-- km",
    rating: 4.5,
    reviews: 100,
    deliveryFee: "₹40",
    minOrder: "₹100",
    discount: null,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=60",
    logo: "https://cdn-icons-png.flaticon.com/512/732/732217.png"
  };

  // 2. Fetch Menu Data
  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      try {
        const [menuRes, categoryRes] = await Promise.all([
          axiosClient.get(`/menu/restaurants/${id}`),
          axiosClient.get(`/restaurants/${id}/categories`)
        ]);
        setMenuItems(menuRes);
        setCategories(categoryRes);
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
    window.scrollTo(0, 0);
  }, [id]);

  // 3. Process Menu Data
  const menuGrouped = categories.reduce((acc, cat) => {
    const itemsInCategory = menuItems.filter(item => item.category_id === cat.id);
    if (itemsInCategory.length > 0) {
      acc[cat.name] = itemsInCategory;
    }
    return acc;
  }, {});

  const availableCategories = Object.keys(menuGrouped);

  // 4. Cart Handler
  const handleAddToCart = (item) => {
    const cartItem = {
      name: item.name,
      price: item.price,
      id: item.id,
      image: item.image_url
    };
    addToCart(cartItem, id, restaurantInfo.name);
  };

  if (loading && !restaurantInfo) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          </div>
      );
  }

  // ... (Rest of the UI remains the same as previous step) ...
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 md:h-80 w-full overflow-hidden">
          <img src={restaurantInfo.image} alt={restaurantInfo.name} className="w-full h-full object-cover brightness-75" />
        </div>
        
        {/* ... Info Card Logic ... */}
         <div className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-20 z-10">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 relative">
            {/* Logo */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-xl shadow-md">
              <img src={restaurantInfo.logo} alt="Logo" className="w-16 h-16 object-contain" />
            </div>
            
            {/* Name & Address from Context */}
            <div className="mt-8 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{restaurantInfo.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-gray-500 mt-2 mb-6">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {restaurantInfo.address}</span>
                  <span className="flex items-center gap-1"><Bike className="w-4 h-4" /> {restaurantInfo.distance}</span>
                </div>
                {/* ... rest of the buttons ... */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content (Menu) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
           {/* ... Categories Sidebar ... */}
           <div className="hidden lg:block w-64 flex-shrink-0">
             <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-red-100 bg-red-50">
                   <h3 className="font-bold text-red-600">Categories</h3>
                </div>
                <ul className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                   {availableCategories.map((cat, idx) => (
                      <li key={idx}>
                        <a href={`#${cat}`} className="block px-4 py-3 text-sm font-medium border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-red-600 hover:border-red-500 transition-colors">
                           {cat}
                        </a>
                      </li>
                   ))}
                </ul>
             </div>
          </div>

           {/* ... Menu List ... */}
           <div className="flex-1 space-y-8">
                {availableCategories.map((category) => (
                  <div key={category} id={category} className="scroll-mt-24">
                     <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">{category}</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {menuGrouped[category].map((item) => (
                           <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-start">
                              <div className="flex-1 pr-2">
                                 <h4 className="font-bold text-gray-800 mb-1 capitalize">{item.name}</h4>
                                 {item.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>}
                                 <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                  {item.image_url && <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-lg object-cover border border-gray-100" />}
                                  <button onClick={() => handleAddToCart(item)} className="w-full py-1.5 bg-white text-green-600 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-50 transition-colors">ADD</button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;