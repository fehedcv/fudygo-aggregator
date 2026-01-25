import { Search, Loader2, MapPinOff, Truck, Store } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useRestaurants } from '../context/RestaurantContext';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import RestaurantCard from '../components/RestaurantCard';
import HomeSkeleton from '../components/HomeSkeleton';

const Home = () => {
  const { coordinates } = useLocation();
  const { 
    restaurants, 
    loading, 
    error, 
    filters,
    updateFilters 
  } = useRestaurants();

  const [orderType, setOrderType] = useState('delivery');

  const handleSearchChange = (e) => {
    updateFilters({ name: e.target.value });
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="w-full px-6 lg:px-12 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0">
          {/* Delivery/Pickup Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-6 w-full lg:w-auto">
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex-1 lg:flex-none lg:px-8 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
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
              className={`flex-1 lg:flex-none lg:px-8 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                orderType === 'pickup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-600'
              }`}
            >
              <Store className="w-4 h-4" />
              Pickup
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by restaurant name..." 
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-100 focus:bg-white transition-all outline-none placeholder-gray-400 shadow-sm"
              value={filters.name}
              onChange={handleSearchChange}
            />
          </div>

          {/* Content States */}
          {!coordinates ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <MapPinOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-700">Location not set</h3>
              <p className="text-gray-500">Please select your location to see restaurants.</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-medium">{error}</div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No restaurants found.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-3">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} data={restaurant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
