import { Car, ShoppingBag } from 'lucide-react';
import { categories } from '../data';

const Sidebar = () => {
  // Added "hidden lg:block" to hide on mobile/tablet
  return (
    <div className="hidden lg:block w-64 flex-shrink-0 space-y-8 pr-4">
      
      {/* Header Info */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Takeaways in Mountain Ash</h2>
        
        {/* Toggle Switch */}
        <div className="bg-gray-100 p-1 rounded-full flex relative">
          <button className="w-1/2 flex items-center justify-center gap-2 bg-white shadow-sm rounded-full py-2 text-sm font-bold text-gray-800 z-10">
            <Car className="w-4 h-4" /> Delivery
          </button>
          <button className="w-1/2 flex items-center justify-center gap-2 text-gray-500 text-sm font-medium hover:text-gray-700">
            <ShoppingBag className="w-4 h-4" /> Pickup
          </button>
        </div>
      </div>

      {/* Sort Section */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Sort</h3>
        <div className="flex flex-wrap gap-2">
          {['Best Match', 'Distance', 'Customer Rating', 'Delivery Time', 'Minimum Order', 'Delivery Fee', 'Discount'].map((item, idx) => (
            <button 
              key={idx}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${item === 'Distance' ? 'bg-red-50 border-red-200 text-red-600 font-medium' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Section */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Filter</h3>
        <div className="flex flex-wrap gap-2">
          {['4 Stars', 'Low Delivery Fee', 'Free Delivery', 'Offers', 'Hygiene Rating 3'].map((item, idx) => (
            <button 
              key={idx}
              className="px-3 py-1.5 text-xs rounded border bg-white border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">What's On Your Mind?</h3>
          <button className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">More</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-orange-50 p-2 mb-2 group-hover:bg-orange-100 transition-colors">
                 <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-[10px] text-center font-medium text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;