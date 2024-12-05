import React, { createContext, useContext, useState, useCallback } from 'react';
import { ReactNode } from 'react';
import apiService from '../services/apiService'; // Assuming apiService is already defined

interface PostSearchContextType {
query: string;
setQuery: React.Dispatch<React.SetStateAction<string>>;
suggestions: any[]; // Define the structure based on your data
fetchSuggestions: (query: string) => Promise<void>;
}

const PostSearchContext = createContext<PostSearchContextType | undefined>(undefined);

interface PostSearchProviderProps {
children: ReactNode;
}

export const PostSearchProvider: React.FC<PostSearchProviderProps> = ({ children }) => {
const [query, setQuery] = useState<string>('');
const [suggestions, setSuggestions] = useState<any[]>([]);

// Fetch suggestions based on the tag entered in the search bar
const fetchSuggestions = useCallback(async (query: string) => {
console.log('Fetching suggestions for query:', query); // Debugging the query

try {
  if (query.trim().length > 0) {
    const response = await apiService.get('/search-posts', {
      params: { tag: query },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Add token here
      },
    });

    console.log('API response received:', response.data); // Debugging the API response

    setSuggestions(response.data); // Assuming the response contains a list of posts
  } else {
    console.log('Query is empty, clearing suggestions'); // Debugging empty query
    setSuggestions([]); // Clear suggestions if the query is empty
  }
} catch (error) {
  console.error('Error fetching post suggestions:', error); // Debugging error in fetching data
}
}, []);

// Debugging context state updates
console.log('Current query:', query);
console.log('Current suggestions:', suggestions);

return (
<PostSearchContext.Provider value={{ query, setQuery, suggestions, fetchSuggestions }}>
{children}
</PostSearchContext.Provider>
);
};

export const usePostSearch = (): PostSearchContextType => {
const context = useContext(PostSearchContext);
if (!context) {
throw new Error('usePostSearch must be used within a PostSearchProvider');
}
return context;
};