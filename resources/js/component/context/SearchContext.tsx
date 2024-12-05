import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/apiService';

interface SearchContextProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  suggestions: any[];
  fetchSuggestions: (searchTerm: string) => Promise<void>;
  allStores: any[];
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [allStores, setAllStores] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllStores = async () => {
      try {
        const response = await apiService.get('/getstores', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          withCredentials: true
        });
        console.log('API Response for /getstores:', response.data); // Debug log to check response data

        // Handle nested response structure
        const storesData = Array.isArray(response.data.data) ? response.data.data : response.data;

        if (Array.isArray(storesData)) {
          // Parse and include firstname and lastname
const storesWithParsedCoords = storesData.map(store => {
  const owner = store.user?.personal_information || { firstname: 'Unknown', lastname: 'Owner' };
  
  return {
    ...store,
    location: {
      ...store.location,
      latitude: parseFloat(store.location.latitude),
      longitude: parseFloat(store.location.longitude),
    },
    owner, // Add this line to map the owner
  };
});

setAllStores(storesWithParsedCoords);

        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching all stores:', error);
      }
    };

    fetchAllStores();
  }, []);

  const fetchSuggestions = async (searchTerm: string) => {
    if (searchTerm.length > 2) {
      try {
        const response = await apiService.get(`/search-stores?query=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          withCredentials: true
        });
        console.log('API Response for /search-stores:', response.data); // Debug log to check response data
  
        // Ensure that suggestions include stores found by both `storename` and `address`
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };
  

  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions(query);
    }
  }, [query]);

  return (
    <SearchContext.Provider value={{ query, setQuery, suggestions, fetchSuggestions, allStores }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
