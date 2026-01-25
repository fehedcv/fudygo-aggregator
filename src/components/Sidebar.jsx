import { useState } from 'react';
import { Car, ShoppingBag, Star, Truck, Store } from 'lucide-react';
import { useRestaurants } from '../context/RestaurantContext';
import { categories } from '../data';

const Sidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [orderType, setOrderType] = useState('delivery');
  const { filters, updateFilters } = useRestaurants();

  const onCategoryClick = (cat) => {
    setSelectedCategory(cat.name === selectedCategory ? null : cat.name);
  };

  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-8 pr-4">
        {/* Delivery/Pickup Toggle */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Takeaways in</h3>
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 w-full">
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex-1 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                orderType === 'delivery'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-600'
              }`}
            >
              <Truck className="w-4 h-4" />
              Delivery
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex-1 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                orderType === 'pickup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-600'
              }`}
            >
              <Store className="w-4 h-4" />
              Pickup
            </button>
          </div>
        </div>
      {/* Filter Section */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Filter</h3>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 text-sm rounded-full border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            4 Stars
          </button>
          <button className="px-4 py-2 text-sm rounded-full border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            Low Delivery Fee
          </button>
          <button className="px-4 py-2 text-sm rounded-full border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            Free Delivery
          </button>
          <button className="px-4 py-2 text-sm rounded-full border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            Offers
          </button>
          <button className="px-4 py-2 text-sm rounded-full border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            Hygiene Rating 3
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">What's On Your Mind?</h3>
          <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">More</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onCategoryClick(cat)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-16 h-16 mb-2 transition-transform group-hover:scale-110">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-center font-medium text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
