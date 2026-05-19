import { Search, MapPinOff, Store } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useRestaurants } from '../context/RestaurantContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RestaurantCard from '../components/RestaurantCard';
import HomeSkeleton from '../components/HomeSkeleton';

const Home = () => {
  const { coordinates } = useLocation();
  const { restaurants, loading, error } = useRestaurants();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (!searchValue.trim()) return;
    const timer = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue, navigate]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  if (loading && restaurants.length === 0 && !error) {
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
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search restaurants or food..."
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-yellow-100 focus:bg-white transition-all outline-none placeholder-gray-400 shadow-sm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
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
            <div className="text-center py-20 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Store className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Oops!</h3>
              <p className="text-slate-700 font-medium mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                Retry
              </button>
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
