import { Search, MapPinOff, Store, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useRestaurants } from '../context/RestaurantContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RestaurantCard from '../components/RestaurantCard';
import HomeSkeleton from '../components/HomeSkeleton';
import { SORT_OPTIONS, FILTER_OPTIONS } from '../lib/filterOptions';

const Home = () => {
  const { coordinates } = useLocation();
  const { restaurants, loading, error, sortBy, setSortBy, activeFilters, toggleFilter } = useRestaurants();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showSortSheet, setShowSortSheet] = useState(false);

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

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.shortLabel ?? 'Sort';

  if (loading && restaurants.length === 0 && !error) {
    return <HomeSkeleton />;
  }

  return (
    <div className="w-full px-6 lg:px-12 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0">

          {/* Search Bar */}
          <div className="relative mb-4">
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

          {/* Mobile sort + filter bar — hidden on desktop where the sidebar handles this */}
          <div className="lg:hidden mb-5 overflow-x-auto flex items-center gap-2 pb-1 scrollbar-hide">
            {/* Sort button */}
            <button
              onClick={() => setShowSortSheet(true)}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold bg-slate-800 text-white shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {activeSortLabel}
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Divider */}
            <div className="shrink-0 w-px h-5 bg-gray-200" />

            {/* Filter chips */}
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => toggleFilter(opt.value)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
                  activeFilters.includes(opt.value)
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {activeFilters.includes(opt.value) && <Check className="w-3 h-3" />}
                {opt.label}
              </button>
            ))}

            {/* Clear all — shown only when something is active */}
            {(activeFilters.length > 0 || sortBy !== 'distance') && (
              <button
                onClick={() => { setSortBy('distance'); activeFilters.forEach(f => toggleFilter(f)); }}
                className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-full text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* Active filter summary badge (mobile) */}
          {activeFilters.length > 0 && (
            <p className="lg:hidden text-xs text-gray-400 mb-3 -mt-2">
              {activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''} active · {restaurants.length} result{restaurants.length !== 1 ? 's' : ''}
            </p>
          )}

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
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <SlidersHorizontal className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-700 mb-1">No results</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-3 smooth-scroll-container">
              {restaurants.map((restaurant, index) => (
                <RestaurantCard key={restaurant.id} data={restaurant} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile sort bottom sheet */}
      {showSortSheet && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end"
          onClick={() => setShowSortSheet(false)}
        >
          <div
            className="w-full bg-white rounded-t-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1" />

            <div className="px-5 pb-6 pt-3">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Sort By</h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSortSheet(false); }}
                    className={`w-full text-left flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-colors ${
                      sortBy === opt.value
                        ? 'bg-yellow-50 font-semibold text-slate-800'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                    {sortBy === opt.value && <Check className="w-4 h-4 text-yellow-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
