import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material'; 
import { usePostContext } from '../context/PostContext';
import { SelectChangeEvent } from '@mui/material'; 

const AdminDropdown = () => {
  const { fetchMyPosts, fetchDesignerPosts, fetchProviderPosts, fetchClientPosts, fetchPosts } = usePostContext();
  const [filter, setFilter] = useState('all');
  
  // Function to handle filter change
  const handleFilterChange = (event: SelectChangeEvent) => {
    const newFilter = event.target.value;
    setFilter(newFilter);

    // Fetch posts based on the selected filter
    switch (newFilter) {
      case 'myPosts':
        fetchMyPosts(1, 4); // Adjust page and limit as needed
        break;
      case 'designerPosts':
        fetchDesignerPosts(1, 4); // Adjust page and limit as needed
        break;
      case 'providerPosts':
        fetchProviderPosts(1, 4); // Adjust page and limit as needed
        break;
      case 'clientPosts':
        fetchClientPosts(1, 4); // Call to fetch client posts
        break;
      case 'all':
      default:
        fetchPosts(1, 4); // Fetch all posts
        break;
    }
  };

  useEffect(() => {
    // Fetch all posts initially when the component mounts
    fetchPosts(1, 4); // Adjust page and limit as needed
  }, [fetchPosts]);

  return (
    <div className="flex-1 p-8 mt-16">
      <div className="mb-4">
        <Select value={filter} onChange={handleFilterChange} variant="outlined">
          <MenuItem value="all">All Posts</MenuItem>
          <MenuItem value="myPosts">My Posts</MenuItem>
          <MenuItem value="designerPosts">Graphic Designer Posts</MenuItem>
          <MenuItem value="providerPosts">Printing Provider Posts</MenuItem>
          <MenuItem value="clientPosts">Client Posts</MenuItem> {/* Added menu item for client posts */}
        </Select>
      </div>
    </div>
  );
};

export default AdminDropdown;
