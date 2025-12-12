import { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  // Initialize from LocalStorage
  const [locationName, setLocationName] = useState(() => {
    return localStorage.getItem('fudygo_location_name') || 'Mountain Ash';
  });

  const [coordinates, setCoordinates] = useState(() => {
    const saved = localStorage.getItem('fudygo_coordinates');
    return saved ? JSON.parse(saved) : null;
  });

  // Global update function
  const updateLocation = (name, coords) => {
    setLocationName(name);
    setCoordinates(coords);
    
    // Save to LocalStorage
    localStorage.setItem('fudygo_location_name', name);
    if (coords) {
      localStorage.setItem('fudygo_coordinates', JSON.stringify(coords));
    } else {
      localStorage.removeItem('fudygo_coordinates');
    }
  };

  return (
    <LocationContext.Provider value={{ locationName, coordinates, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};