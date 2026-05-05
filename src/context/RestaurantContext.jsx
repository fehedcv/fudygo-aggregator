import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { useLocation } from './LocationContext';

const RestaurantContext = createContext();

export const useRestaurants = () => useContext(RestaurantContext);

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    min_rating: null,
    sort_by: 'distance',
    sort_order: 'asc',
  });
  
  const { coordinates } = useLocation();
  const abortControllerRef = useRef(null);
  const isInitialMount = useRef(true);

  const fetchRestaurants = useCallback(async () => {
    if (!coordinates) {
      // Clear error when coordinates are not available
      setError(null);
      setLoading(false);
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    
    try {
      const params = {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        ...filters,
      };

      const response = await axiosClient.get(`/restaurants/`, { 
        params,
        signal: abortControllerRef.current.signal 
      });
      
      // Handle empty or invalid response
      if (!response || !Array.isArray(response)) {
        setRestaurants([]);
        setError(null);
        return;
      }
      
      const formattedData = response.map(item => ({
        id: item.id,
        name: item.name,
        address: item.address,
        image: item.logo_url || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60",
        logo: item.logo_url || "https://cdn-icons-png.flaticon.com/512/732/732217.png",
        rating: item.average_rating || 0, 
        reviews: 100, // placeholder
        distance: item.distance_km ? `${item.distance_km.toFixed(2)} km` : 'N/A',
        time: "30-45 mins", // placeholder
        deliveryFee: "£2.50", // placeholder
        minOrder: "£10", // placeholder
        discount: null, // placeholder
        isPreOrder: false // placeholder
      }));

      setRestaurants(formattedData);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        return; // Request was cancelled, ignore
      }
      console.error("Error fetching restaurants:", err);
      
      // More specific error messages
      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        if (status === 404) {
          setError("No restaurants found in your area.");
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to load restaurants. Please try again.");
        }
      } else if (err.request) {
        // Request made but no response
        setError("Network error. Please check your connection.");
      } else {
        setError("Failed to load restaurants.");
      }
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [coordinates, filters]);

  useEffect(() => {
    // Skip fetch on initial mount if no coordinates
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!coordinates) {
        return;
      }
    }

    fetchRestaurants();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchRestaurants, coordinates]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getRestaurantById = useCallback((id) => {
    return restaurants.find(r => r.id === parseInt(id));
  }, [restaurants]); 

  const value = useMemo(() => ({
    restaurants,
    loading,
    error,
    filters,
    updateFilters,
    fetchRestaurants,
    getRestaurantById,
  }), [restaurants, loading, error, filters, fetchRestaurants, getRestaurantById]);

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};