import { Truck, Store } from 'lucide-react';
import { useRestaurants } from '../context/RestaurantContext';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data';
import { SORT_OPTIONS, FILTER_OPTIONS } from '../lib/filterOptions';

const Sidebar = () => {
  const { sortBy, setSortBy, activeFilters, toggleFilter, orderType, setOrderType } = useRestaurants();
  const navigate = useNavigate();

  const onCategoryClick = (cat) => {
    navigate(`/search?q=${encodeURIComponent(cat.name)}`);
  };

  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-8 pr-4">

        {/* Delivery/Pickup Toggle */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Takeaways in</h3>
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 w-full">
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex-1 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                orderType === 'delivery' ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-600'
              }`}
            >
              <Truck className="w-4 h-4" />
              Delivery
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex-1 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                orderType === 'pickup' ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-600'
              }`}
            >
              <Store className="w-4 h-4" />
              Pickup
            </button>
          </div>
        </div>

        {/* Sort Section */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Sort By</h3>
          <div className="space-y-0.5">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  sortBy === opt.value
                    ? 'bg-yellow-50 text-slate-800 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  sortBy === opt.value ? 'bg-yellow-500' : 'bg-gray-200'
                }`} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Filter</h3>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => toggleFilter(opt.value)}
                className={`px-4 py-2 text-sm rounded-full border font-medium transition-all duration-150 ${
                  activeFilters.includes(opt.value)
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">What's On Your Mind?</h3>
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
