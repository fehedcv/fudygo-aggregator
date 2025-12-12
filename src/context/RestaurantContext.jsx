import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const RestaurantContext = createContext();

export const useRestaurants = () => useContext(RestaurantContext);

export const RestaurantProvider = ({ children }) => {
  // Initialize state from LocalStorage
  const [restaurants, setRestaurantsState] = useState(() => {
    const saved = localStorage.getItem('fudygo_restaurants');
    return saved ? JSON.parse(saved) : [];
  });

  // FIX 1: Wrap function in useCallback so it doesn't change on every render
  const setRestaurants = useCallback((data) => {
    setRestaurantsState(data);
    localStorage.setItem('fudygo_restaurants', JSON.stringify(data));
  }, []); // Empty dependency array = function never changes

  // FIX 2: Wrap helper in useCallback
  const getRestaurantById = useCallback((id) => {
    // Note: We use the functional update or ref if we needed live state inside, 
    // but since we read from the state passed to Provider, we rely on the dependency below.
    // However, to avoid 'restaurants' dependency causing re-creation, 
    // we can keep it simple or use a ref. 
    // For simplicity here, we allow it to update if restaurants change, 
    // BUT since Home.jsx doesn't depend on this function, it breaks the loop for setRestaurants.
    return restaurants.find(r => r.id === parseInt(id));
  }, [restaurants]); 

  // FIX 3: Memoize the value object so consumers don't re-render unnecessarily
  const value = useMemo(() => ({
    restaurants,
    setRestaurants,
    getRestaurantById
  }), [restaurants, setRestaurants, getRestaurantById]);

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};