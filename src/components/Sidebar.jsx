import { useState } from 'react';
import { Car, ShoppingBag, Star } from 'lucide-react';
import { useRestaurants } from '../context/RestaurantContext';
import { categories } from '../data';

const SORT_OPTIONS = [
  { value: 'distance', label: 'Distance' },
  { value: 'rating', label: 'Rating' },
  { value: 'name', label: 'Name' },
];

const Sidebar = () => {
  const [mode, setMode] = useState('delivery');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { filters, updateFilters } = useRestaurants();

  const handleSortChange = (sortBy) => {
    const sortOrder = (filters.sort_by === sortBy && filters.sort_order === 'asc') ? 'desc' : 'asc';
    updateFilters({ sort_by: sortBy, sort_order: sortOrder });
  };
  
  const handleRatingChange = (rating) => {
    updateFilters({ min_rating: filters.min_rating === rating ? null : rating });
  };

  const onCategoryClick = (cat) => {
    setSelectedCategory(cat.name === selectedCategory ? null : cat.name);
  };

  return (
    <div className="hidden lg:block w-64 flex-shrink-0 space-y-8 pr-4">
      {/* Header Info */}
      {/*<div>

        
        <div className="bg-gray-100 p-1 rounded-full flex relative">
          <button
            onClick={() => setMode('delivery')}
            className={`w-1/2 flex items-center justify-center gap-2 py-2 text-sm font-bold z-10 rounded-full transition-all ${mode === 'delivery' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
          >
            <Car className="w-4 h-4" /> Delivery
          </button>
          <button
            onClick={() => setMode('pickup')}
            className={`w-1/2 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-full transition-all ${mode === 'pickup' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
          >
            <ShoppingBag className="w-4 h-4" /> Pickup
          </button>
        </div>
      </div> */}

      {/* Sort Section */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Sort By</h3>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((item) => (
            <button
              key={item.value}
              onClick={() => handleSortChange(item.value)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${filters.sort_by === item.value ? 'bg-red-50 border-red-200 text-red-600 font-medium' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              {item.label} {filters.sort_by === item.value ? (filters.sort_order === 'asc' ? '↑' : '↓') : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Section */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Filter by Rating</h3>
        <div className="flex space-x-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`flex items-center justify-center w-12 h-12 rounded-lg border transition-colors ${filters.min_rating === rating ? 'bg-yellow-100 border-yellow-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
            >
              <Star className={`w-4 h-4 ${filters.min_rating >= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
              <span className="ml-1 text-sm font-medium">{rating}+</span>
            </button>
          ))}
        </div>
         <label className="text-sm text-gray-600 mt-2">Minimum rating</label>
         <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.5" 
            value={filters.min_rating || 0} 
            onChange={(e) => updateFilters({ min_rating: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>5</span>
          </div>
      </div>


      {/* Categories */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Categories</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onCategoryClick(cat)}
              className={`flex flex-col items-center cursor-pointer group ${selectedCategory === cat.name ? 'opacity-100' : 'opacity-90'}`}
            >
              <div className={`w-14 h-14 rounded-full p-2 mb-2 transition-colors ${selectedCategory === cat.name ? 'bg-orange-100' : 'bg-orange-50 group-hover:bg-orange-100'}`}>
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