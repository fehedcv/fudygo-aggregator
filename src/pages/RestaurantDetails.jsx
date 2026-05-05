import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurants } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import axiosClient from '../api/axiosClient';
import { Star, Clock, MapPin, Info, ChevronDown, Bike, ShoppingBag, Loader2, Plus, Minus, UtensilsCrossed, PackageOpen } from 'lucide-react';
import BottomCartBar from '../components/BottomCartBar';
import toast, { Toaster } from 'react-hot-toast';
import RestaurantDetailsSkeleton from '../components/SkeletonLoader';


const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=60';
const DEFAULT_LOGO = 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, cart } = useCart();
  const { getRestaurantById } = useRestaurants();
  
  // API State
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImgError, setHeroImgError] = useState(false);
  const [logoImgError, setLogoImgError] = useState(false);

  // Helper to get item quantity from cart
  const getItemQuantity = (itemName) => {
    const cartItem = cart.items.find(item => item.name === itemName);
    return cartItem ? cartItem.quantity : 0;
  };

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
    image: DEFAULT_HERO_IMAGE,
    logo: DEFAULT_LOGO
  };

  // Get safe image URLs with fallbacks
  const heroImage = (!restaurantInfo.image || heroImgError) ? DEFAULT_HERO_IMAGE : restaurantInfo.image;
  const logoImage = (!restaurantInfo.logo || logoImgError) ? DEFAULT_LOGO : restaurantInfo.logo;

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

  // 4. Cart Handler - Only show toast for first add, not for quantity increase via + button
  const handleAddToCart = (item) => {
    const cartItem = {
      name: item.name,
      price: item.price,
      id: item.id,
      image: item.image_url
    };
    addToCart(cartItem, id, restaurantInfo.name);

    // Dismiss any existing toasts before showing a new one
    toast.dismiss();
    toast.success(`${item.name} added to cart!`, {
      id: `cart-${item.id}`, // Unique ID prevents duplicate toasts for same item
      icon: '🛒',
      style: {
        borderRadius: '12px',
        background: '#1f2937',
        color: '#fff',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
      duration: 1500,
    });
  };

  if (loading) {
      return <RestaurantDetailsSkeleton />;
  }

  // Check if menu is empty
  const hasNoMenu = menuItems.length === 0 && categories.length === 0;
  const hasNoCategories = categories.length === 0 && menuItems.length > 0;

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{ style: { marginTop: '60px' } }} 
        containerStyle={{ top: 20 }}
      />
      <BottomCartBar />
      <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 md:h-80 w-full overflow-hidden bg-gray-200">
          {heroImgError || !restaurantInfo.image ? (
            <div className="w-full h-full bg-gradient-to-br from-red-100 via-orange-50 to-amber-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <UtensilsCrossed className="w-10 h-10 text-red-300" />
                </div>
                <p className="text-sm font-semibold text-red-300 uppercase tracking-wider">{restaurantInfo.name}</p>
              </div>
            </div>
          ) : (
            <img
              src={restaurantInfo.image}
              alt={restaurantInfo.name}
              loading="lazy"
              className="w-full h-full object-cover brightness-75"
              onError={() => setHeroImgError(true)}
            />
          )}
        </div>
        
        {/* ... Info Card Logic ... */}
         <div className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-20 z-10">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 relative">
            {/* Logo */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-xl shadow-md">
              {logoImgError || !restaurantInfo.logo ? (
                <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="w-8 h-8 text-red-400" />
                </div>
              ) : (
                <img
                  src={restaurantInfo.logo}
                  alt="Logo"
                  loading="lazy"
                  className="w-16 h-16 object-contain"
                  onError={() => setLogoImgError(true)}
                />
              )}
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
        {hasNoMenu ? (
          /* Empty Menu State */
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageOpen className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Menu Available Yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              This restaurant hasn't added any items to their menu yet. Please check back later!
            </p>
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">
           {/* ... Categories Sidebar ... */}
           <div className="hidden lg:block w-64 flex-shrink-0">
             <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-red-100 bg-red-50">
                   <h3 className="font-bold text-red-600">Categories</h3>
                </div>
                {availableCategories.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    <p className="text-sm">No categories found</p>
                  </div>
                ) : (
                <ul className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                   {availableCategories.map((cat, idx) => (
                      <li key={idx}>
                        <a href={`#${cat}`} className="block px-4 py-3 text-sm font-medium border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-red-600 hover:border-red-500 transition-colors">
                           {cat}
                        </a>
                      </li>
                   ))}
                </ul>
                )}
             </div>
          </div>

           {/* ... Menu List ... */}
           <div className="flex-1 space-y-8">
                {availableCategories.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UtensilsCrossed className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-base font-bold text-gray-700 mb-1">No items in this menu</h3>
                    <p className="text-sm text-gray-400">Menu items will appear here once added.</p>
                  </div>
                ) : (
                availableCategories.map((category) => (
                  <div key={category} id={category} className="scroll-mt-24">
                     <div className="bg-gray-50 border-l-4 border-red-600 px-4 py-2.5 mb-4 rounded-r-lg">
                       <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">{category}</h2>
                       <p className="text-xs text-gray-500 mt-0.5">{menuGrouped[category].length} items</p>
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        {menuGrouped[category].map((item) => {
                          const quantity = getItemQuantity(item.name);
                          return (
                           <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all flex justify-between items-start gap-4">
                              <div className="flex-1">
                                 <h4 className="font-bold text-gray-900 mb-1 text-sm capitalize">{item.name}</h4>
                                 {item.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>}
                                 <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                              </div>
                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  {item.image_url && (
                                    <div className="relative">
                                      <img src={item.image_url} alt={item.name} className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                                    </div>
                                  )}
                                  {quantity === 0 ? (
                                    <button 
                                      onClick={() => handleAddToCart(item)} 
                                      className="px-6 py-1.5 bg-white text-red-600 border-2 border-red-500 rounded-lg text-xs font-bold hover:bg-red-50 transition-all shadow-sm"
                                    >
                                      ADD
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-2 bg-red-50 border-2 border-red-500 rounded-lg px-2 py-1">
                                      <button
                                        onClick={() => updateQuantity(item.name, -1)}
                                        className="w-6 h-6 flex items-center justify-center bg-white text-red-600 rounded hover:bg-red-100 transition-colors"
                                      >
                                        <Minus className="w-3 h-3" strokeWidth={3} />
                                      </button>
                                      <span className="text-sm font-bold text-red-700 min-w-[20px] text-center">{quantity}</span>
                                      <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-6 h-6 flex items-center justify-center bg-white text-red-600 rounded hover:bg-red-100 transition-colors"
                                      >
                                        <Plus className="w-3 h-3" strokeWidth={3} />
                                      </button>
                                    </div>
                                  )}
                              </div>
                           </div>
                          );
                        })}
                     </div>
                  </div>
                ))
                )}
           </div>
        </div>
        )}
      </div>
    </div>
    </>
  );
};

export default RestaurantDetails;