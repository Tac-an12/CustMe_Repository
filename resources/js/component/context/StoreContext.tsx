import React, { createContext, useContext, useState, ReactNode } from 'react';
import apiService from '../services/apiService';
import { useAuth } from './AuthContext';

export interface Location {
  id?: number;
  longitude: number | string;
  latitude: number | string;
  address: string;
}

export interface Store {
  id: number;
  storename: string;
  description: string;
  location: Location;
  user_id: number;
}

interface StoreContextProps {
  stores: Store[];
  fetchStores: () => Promise<void>;
  createStore: (store: Omit<Store, 'id' | 'user_id'>) => Promise<boolean>;
  updateStore: (id: number, store: Store) => Promise<boolean>;
  deleteStore: (id: number) => Promise<boolean>;
  getCurrentLocation: () => Promise<Location | null>; // New method for geolocation
  loading: boolean;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/stores', { withCredentials: true });
      setStores(response.data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (store: Omit<Store, 'id' | 'user_id'>): Promise<boolean> => {
    if (!user) return false;

    const storeWithUserId = { ...store, user_id: user.id };
    try {
        const response = await apiService.post('/stores', storeWithUserId, { withCredentials: true });
        setStores((prevStores) => [...prevStores, response.data]);
        return true;
    } catch (error) {
        // Improved error handling
        if (error.response) {
            // Server responded with a status other than 200
            console.error('Failed to create store:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received when creating store:', error.request);
        } else {
            // Something happened in setting up the request that triggered an error
            console.error('Error creating store:', error.message);
        }
        return false;
    }
};


  const updateStore = async (id: number, store: Store): Promise<boolean> => {
    try {
      const response = await apiService.put(`/stores/${id}`, store, { withCredentials: true });
      setStores((prevStores) => prevStores.map((s) => (s.id === id ? response.data : s)));
      return true;
    } catch (error) {
      console.error('Failed to update store:', error);
      return false;
    }
  };

  const deleteStore = async (id: number): Promise<boolean> => {
    try {
      await apiService.delete(`/stores/${id}`, { withCredentials: true });
      setStores((prevStores) => prevStores.filter((s) => s.id !== id));
      return true;
    } catch (error) {
      console.error('Failed to delete store:', error);
      return false;
    }
  };

  // New method to get the current geolocation
  const getCurrentLocation = (): Promise<Location | null> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              address: '', // You might want to reverse geocode this later
            });
          },
          (error) => {
            console.error('Geolocation error:', error);
            resolve(null);
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
        resolve(null);
      }
    });
  };

  return (
    <StoreContext.Provider
      value={{ stores, fetchStores, createStore, updateStore, deleteStore, getCurrentLocation, loading }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextProps => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
