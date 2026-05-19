import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Bike, MapPin, UtensilsCrossed, ChevronLeft, Search } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useLocation } from '../context/LocationContext';

const SearchResultCard = ({ result }) => {
  const { restaurant, menu_items, match_type } = result;
  const [bannerError, setBannerError] = useState(false);

  const deliveryTime = restaurant.average_delivery_time
    ? `${restaurant.average_delivery_time}-${restaurant.average_delivery_time + 10} mins`
    : '30-45 mins';
  const deliveryFee = restaurant.delivery_fee === 0 ? 'Free Delivery' : `₹${restaurant.delivery_fee}`;
  const rating = restaurant.average_rating
    ? parseFloat(restaurant.average_rating).toFixed(1)
    : '0.0';

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">

        {/* Top half — restaurant banner + info overlay */}
        <div className="relative h-44 overflow-hidden bg-gray-100">
          {restaurant.banner_url && !bannerError ? (
            <img
              src={restaurant.banner_url}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setBannerError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <UtensilsCrossed className="w-14 h-14 text-slate-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="text-white font-bold text-base leading-tight truncate">{restaurant.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-white/70 flex-shrink-0" />
                <span className="text-white/70 text-xs truncate">{restaurant.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-bold">{rating}</span>
              <span className="text-white/60 text-[10px]">({restaurant.total_reviews})</span>
            </div>
          </div>
        </div>

        {/* Delivery info strip */}
        <div className="flex items-center gap-5 px-4 py-2.5 border-b border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Bike className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{deliveryFee}</span>
          </div>
        </div>

        {/* Bottom half — scrollable menu items */}
        <div className="p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {match_type === 'food' ? 'Matching Items' : 'Menu Highlights'}
          </p>
          {menu_items.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {menu_items.map(item => (
                <MenuItemChip key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-2">No menu items available</p>
          )}
        </div>
      </div>
    </Link>
  );
};

const MenuItemChip = ({ item }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex-shrink-0 w-28 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
      {item.image_url && !imgError ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-16 object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-16 bg-gray-100 flex items-center justify-center">
          <UtensilsCrossed className="w-5 h-5 text-gray-300" />
        </div>
      )}
      <div className="p-2">
        <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
        <p className="text-xs font-bold text-yellow-600 mt-0.5">₹{item.price}</p>
      </div>
    </div>
  );
};

const SearchResultsSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
        <div className="h-44 bg-gray-200" />
        <div className="px-4 py-2.5 border-b border-gray-100 flex gap-4">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
        <div className="p-4">
          <div className="h-3 bg-gray-100 rounded w-24 mb-3" />
          <div className="flex gap-3">
            {[1, 2, 3].map(j => (
              <div key={j} className="flex-shrink-0 w-28 h-24 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { coordinates } = useLocation();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync input when URL query changes (e.g. browser back/forward)
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Debounced navigation from search bar on this page
  useEffect(() => {
    if (!inputValue.trim() || inputValue.trim() === query) return;
    const timer = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, query, navigate]);

  // Fetch results whenever the URL query changes
  useEffect(() => {
    if (!query.trim()) return;

    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          query,
          latitude: coordinates?.lat,
          longitude: coordinates?.lng,
        };
        const data = await axiosClient.get('/restaurants/search', {
          params,
          signal: controller.signal,
        });
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name === 'AbortError' || err.name === 'CanceledError') return;
        setError('Failed to load results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [query, coordinates]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="w-full px-6 lg:px-12 py-8">
      <div className="max-w-2xl mx-auto">

        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search restaurants or food..."
            className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-yellow-100 focus:bg-white transition-all outline-none placeholder-gray-400 shadow-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        {loading ? (
          <SearchResultsSkeleton />
        ) : error ? (
          <div className="text-center py-20 text-red-500 text-sm">{error}</div>
        ) : results.length === 0 && query ? (
          <div className="text-center py-20 text-gray-500">
            <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium">No results found for "{query}"</p>
            <p className="text-sm mt-1">Try searching for a dish or restaurant name</p>
          </div>
        ) : (
          <>
            {query && (
              <p className="text-sm text-gray-400 mb-4">
                {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
                <span className="font-medium text-gray-600">"{query}"</span>
              </p>
            )}
            <div className="space-y-4">
              {results.map(result => (
                <SearchResultCard key={result.restaurant.id} result={result} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
