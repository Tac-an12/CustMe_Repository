import React, { useState, useEffect, useRef } from 'react';
import { Box, InputBase } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useSearch } from '../context/SearchContext';

const SearchBar: React.FC<{ onLocationSelect?: (location: any) => void }> = ({ onLocationSelect }) => {
  const { query, setQuery, suggestions, fetchSuggestions } = useSearch();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Input change handler that triggers API call with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(async () => {
      if (value.length > 0) {
        await fetchSuggestions(value);
      }
      setIsTyping(false);
    }, 300); // Debounce time in milliseconds
  };

  // Clear suggestions when the mouse leaves the search bar or input is blurred
  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setQuery('');
      }
    };

    document.addEventListener('mousemove', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseLeave);
    };
  }, []);

  // Clear suggestions when input is blurred
  const handleInputBlur = () => {
    setQuery('');
  };

  return (
    <Box sx={{ flexGrow: 4, display: 'flex', justifyContent: 'flex-start' }} ref={searchBarRef}>
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <SearchIcon className="text-black" />
        </div>
        <InputBase
          placeholder="Search…"
          className="pl-12 pr-4 py-2 rounded-full bg-gray-200 text-black w-full"
          inputProps={{ 'aria-label': 'search' }}
          value={query}
          onChange={handleInputChange}
          onBlur={handleInputBlur} // Clear suggestions on blur
        />
        {suggestions.length > 0 && !isTyping && (
          <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 rounded-lg shadow-lg z-20">
            {suggestions.map((store) => {
              const latitude = parseFloat(store.location.latitude);
              const longitude = parseFloat(store.location.longitude);
              console.log('Latitude:', latitude, 'Longitude:', longitude); // Debug log for latitude and longitude
              
              return (
                <li
                  key={store.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    console.log('Suggestion clicked:', store.location); // Debug log for suggestion click
                    if (onLocationSelect) {
                      onLocationSelect({
                        latitude,
                        longitude,
                      });
                    }
                    setQuery('');
                  }}
                >
                  {store.storename}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Box>
  );
};

export default SearchBar;
