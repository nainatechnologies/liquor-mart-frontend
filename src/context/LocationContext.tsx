import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { popularLocations } from '../data/offers';

export interface LocationData {
  city: string;
  state: string;
  pincode: string;
}

interface LocationContextType {
  location: LocationData;
  setLocation: (loc: LocationData) => void;
  selectPopularCity: (cityName: string) => void;
  detectCurrentLocation: () => Promise<boolean>;
  isDetecting: boolean;
  popularList: typeof popularLocations;
}

const DEFAULT_LOCATION: LocationData = {
  city: 'Hyderabad',
  state: 'Telangana',
  pincode: '500001',
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationData>(() => {
    try {
      const saved = localStorage.getItem('homeocare_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('homeocare_location', JSON.stringify(location));
    } catch (e) {
      console.error('Failed to save location to localStorage', e);
    }
  }, [location]);

  const setLocation = (newLoc: LocationData) => {
    setLocationState(newLoc);
  };

  const selectPopularCity = (cityName: string) => {
    const match = popularLocations.find(l => l.city.toLowerCase() === cityName.toLowerCase());
    if (match) {
      setLocationState(match);
    } else {
      setLocationState({
        city: cityName,
        state: 'India',
        pincode: '500001'
      });
    }
  };

  const detectCurrentLocation = async (): Promise<boolean> => {
    setIsDetecting(true);
    // Simulate geolocation detection with smooth realistic delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Set to detected city (e.g., Hyderabad / Bengaluru)
    setLocationState({
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081'
    });
    setIsDetecting(false);
    return true;
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        selectPopularCity,
        detectCurrentLocation,
        isDetecting,
        popularList: popularLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
