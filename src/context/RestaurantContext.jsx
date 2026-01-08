import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
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

  const fetchRestaurants = useCallback(async () => {
    if (!coordinates) return;

    setLoading(true);
    setError(null);
    
    try {
      const params = {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        ...filters,
      };

      const response = await axiosClient.get(`/restaurants/`, { params });
      
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
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to load restaurants.");
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [coordinates, filters]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

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