import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { useLocation } from './LocationContext';

const RestaurantContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRestaurants = () => useContext(RestaurantContext);

const formatRestaurant = (item) => ({
  id: item.id,
  name: item.name,
  address: item.address,
  image: item.banner_url || item.logo_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60',
  logo: item.logo_url || 'https://cdn-icons-png.flaticon.com/512/732/732217.png',
  rating: item.average_rating ? parseFloat(item.average_rating).toFixed(1) : '0.0',
  reviews: item.total_reviews || 0,
  distance: item.distance_km ? `${item.distance_km.toFixed(2)} km` : null,
  time: item.average_delivery_time
    ? `${item.average_delivery_time}-${item.average_delivery_time + 10} mins`
    : '30-45 mins',
  deliveryFee: item.delivery_fee === 0
    ? 'Free Delivery'
    : item.delivery_fee
      ? `₹${item.delivery_fee}`
      : '₹2.50',
  minOrder: item.minimum_order_amount ? `₹${item.minimum_order_amount}` : null,
  rawRating: parseFloat(item.average_rating) || 0,
  rawDeliveryFee: item.delivery_fee ?? 0,
  rawDeliveryTime: item.average_delivery_time || 999,
  rawReviews: item.total_reviews || 0,
  rawDistance: item.distance_km ?? null,
  rawMinOrder: item.minimum_order_amount || 0,
});

export const RestaurantProvider = ({ children }) => {
  const [rawRestaurants, setRawRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [activeFilters, setActiveFilters] = useState([]);
  const [orderType, setOrderType] = useState('delivery');

  const { coordinates } = useLocation();
  // Cache keyed by `${lat},${lng}:${orderType}` — different location = different key = new fetch
  const cacheRef = useRef({});

  useEffect(() => {
    if (!coordinates) return;

    const cacheKey = `${coordinates.lat},${coordinates.lng}:${orderType}`;

    // Serve instantly from cache — no loading state
    if (cacheRef.current[cacheKey]) {
      setRawRestaurants(cacheRef.current[cacheKey]);
      setError(null);
      return;
    }

    // Cache miss — fetch from API
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        const params = { latitude: coordinates.lat, longitude: coordinates.lng };
        if (orderType === 'pickup') params.pickup = true;

        const response = await axiosClient.get('/restaurants/', {
          params,
          signal: controller.signal,
        });

        if (!response || !Array.isArray(response)) {
          setRawRestaurants([]);
          return;
        }

        const formattedData = response.map(formatRestaurant);
        cacheRef.current[cacheKey] = formattedData;
        setRawRestaurants(formattedData);
      } catch (err) {
        if (err.name === 'AbortError' || err.name === 'CanceledError') return;
        console.error('Error fetching restaurants:', err);

        if (err.response) {
          const status = err.response.status;
          if (status === 404) setError('No restaurants found in your area.');
          else if (status >= 500) setError('Server error. Please try again later.');
          else setError('Failed to load restaurants. Please try again.');
        } else if (err.request) {
          setError('Network error. Please check your connection.');
        } else {
          setError('Failed to load restaurants.');
        }
        setRawRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [coordinates, orderType]);

  // Client-side sort + filter on the fetched list
  const restaurants = useMemo(() => {
    let result = [...rawRestaurants];

    if (activeFilters.includes('free_delivery')) result = result.filter(r => r.rawDeliveryFee === 0);
    if (activeFilters.includes('top_rated'))     result = result.filter(r => r.rawRating >= 4);
    if (activeFilters.includes('fast_delivery')) result = result.filter(r => r.rawDeliveryTime <= 30);

    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':        return b.rawRating - a.rawRating;
        case 'delivery_time': return a.rawDeliveryTime - b.rawDeliveryTime;
        case 'popularity':    return b.rawReviews - a.rawReviews;
        case 'delivery_fee':  return a.rawDeliveryFee - b.rawDeliveryFee;
        case 'min_order':     return a.rawMinOrder - b.rawMinOrder;
        default:              return (a.rawDistance ?? 999) - (b.rawDistance ?? 999);
      }
    });

    return result;
  }, [rawRestaurants, sortBy, activeFilters]);

  const toggleFilter = useCallback((filter) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  }, []);

  const getRestaurantById = useCallback((id) => {
    return rawRestaurants.find(r => r.id === parseInt(id));
  }, [rawRestaurants]);

  const updateFilters = useCallback(() => {}, []);

  const value = useMemo(() => ({
    restaurants,
    loading,
    error,
    sortBy,
    setSortBy,
    activeFilters,
    toggleFilter,
    orderType,
    setOrderType,
    updateFilters,
    getRestaurantById,
  }), [restaurants, loading, error, sortBy, activeFilters, toggleFilter, orderType, updateFilters, getRestaurantById]);

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};
