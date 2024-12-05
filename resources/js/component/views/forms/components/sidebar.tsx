import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaPlus, FaTasks, FaSignOutAlt, FaComments, FaShoppingCart, FaPencilRuler } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void; // Function passed from parent to open/close the sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('https://via.placeholder.com/40');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfilePictureUrl = (user: any) => {
    if (user && user.personal_information && user.personal_information.profilepicture) {
      const imageUrl = `http://127.0.0.1:8000/${user.personal_information.profilepicture}?user_id=${user.id}&personal_info_id=${user.personal_information.id}`;
      setProfilePictureUrl(imageUrl);
    } else {
      setProfilePictureUrl('https://via.placeholder.com/40');
    }
  };

  useEffect(() => {
    updateProfilePictureUrl(user);
  }, [user]);

  return (
    <Drawer
      variant="temporary" // Temporary drawer for pop-out
      anchor="left"
      open={isOpen}
      onClose={toggleSidebar} // Close the sidebar when clicking outside
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1e3a8a',
          color: 'white',
        },
      }}
    >
      <List>
        {/* Profile Picture */}
        {isOpen && (
          <div className="flex justify-center mt-4 mb-2">
            <Avatar
              src={profilePictureUrl}
              alt="Profile"
              sx={{ width: 64, height: 64, marginBottom: 2 }}
            />
            {user && (
              <NavLink to={`/users/${user.id}/profile`} className="text-white text-sm hover:underline">
                {user.username}
              </NavLink>
            )}
          </div>
        )}

        {/* Menu Items */}
        <ListItem component={NavLink} to="/dashboard">
          <ListItemIcon sx={{ color: 'white' }}>
            <FaHome />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Dashboard" />}
        </ListItem>

        <ListItem component={NavLink} to="/chats">
          <ListItemIcon sx={{ color: 'white' }}>
            <FaComments />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Chats" />}
        </ListItem>

        <ListItem component={NavLink} to="/purchases">
          <ListItemIcon sx={{ color: 'white' }}>
            <FaShoppingCart />
          </ListItemIcon>
          {isOpen && <ListItemText primary="My Purchases" />}
        </ListItem>

        <ListItem component={NavLink} to="/allposts">
          <ListItemIcon sx={{ color: 'white' }}>
            <FaPencilRuler />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Designer" />}
        </ListItem>

        <ListItem component={NavLink} to="/users">
          <ListItemIcon sx={{ color: 'white' }}>
            <FaTasks />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Users" />}
        </ListItem>

        <ListItem component={NavLink} to="/posts">
          <ListItemIcon sx={{ color: 'white' }}>
            <FaPlus />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Add post" />}
        </ListItem>

        {/* Logout Button */}
        <ListItem onClick={handleLogout} sx={{ cursor: 'pointer' }}>
          <ListItemIcon sx={{ color: 'white' }}>
            <FaSignOutAlt />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Logout" />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
