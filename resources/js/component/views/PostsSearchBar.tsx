import React from 'react';
import { Box, InputBase } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { usePostSearch } from '../context/PostSearchContext'; // Import the context hook

const PostsSearchBar: React.FC<{ onPostSelect?: (post: any) => void }> = ({ onPostSelect }) => {
  const { query, setQuery } = usePostSearch(); // Accessing the context

  // Input change handler that updates the query in context and triggers search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value); // Update the query in context
  };

  // Clear search query when input is blurred
  const handleInputBlur = () => {
    setQuery(''); // Optionally clear the search in context
  };

  return (
    <Box sx={{ flexGrow: 4, display: 'flex', justifyContent: 'flex-start' }}>
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <SearchIcon className="text-black" />
        </div>
        <InputBase
          placeholder="Search posts by tag…"
          className="pl-12 pr-4 py-2 rounded-full bg-gray-200 text-black w-full"
          inputProps={{ 'aria-label': 'search' }}
          value={query} // Bind the input value to the query in context
          onChange={handleInputChange} // Handle input change
          onBlur={handleInputBlur} // Clear search on blur
        />
      </div>
      {/* Optionally render suggestions or search results here if needed */}
    </Box>
  );
};

export default PostsSearchBar;