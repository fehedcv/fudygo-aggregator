import { Search, Loader2, MapPinOff, Truck, Store } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useRestaurants } from '../context/RestaurantContext';
import { useState, useRef, useEffect } from 'react';
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
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (restaurants.length > 0 || error || (!loading && coordinates)) {
      isFirstLoad.current = false;
    }
  }, [restaurants, error, loading, coordinates]);

  const handleSearchChange = (e) => {
    updateFilters({ name: e.target.value });
  };

  if (loading && isFirstLoad.current) {
    return <HomeSkeleton />;
  }

  return (
    <div className="w-full px-6 lg:px-12 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {loading && !isFirstLoad.current ? (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-gray-400" />
              )}
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
            <div className="text-center py-20 bg-red-50 rounded-xl border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Store className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Oops!</h3>
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Retry
              </button>
            </div>
          ) : loading && restaurants.length === 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="w-full h-32 lg:h-36 bg-gray-300"></div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-5 w-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No restaurants found.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-3 smooth-scroll-container">
              {restaurants.map((restaurant, index) => (
                <RestaurantCard key={restaurant.id} data={restaurant} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
