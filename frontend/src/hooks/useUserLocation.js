// useUserLocation.js
import { useState, useEffect } from 'react';

export const useUserLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch {
        localStorage.removeItem("userLocation");
      }
    }
  }, []);

  return location;
};