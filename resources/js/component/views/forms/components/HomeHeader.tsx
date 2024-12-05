import React from 'react';
import { NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Adb as AdbIcon } from '@mui/icons-material';

const HomeHeader = () => {
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#ffff'}}>
        <Toolbar className="flex justify-between items-center px-4">
          <div className="text-black font-extrabold text-4xl ml-8">
            <span className="text-blue-500">C</span>
            <span className="text-blue-500">u</span>
            <span className="text-blue-500">s</span>
            <span className="text-yellow-500">t</span>
            <span className="text-blue-500">M</span>
            <span className="text-yellow-500">e</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex flex-grow justify-end items-center">
            <NavLink to="/" className="text-black font-semibold mx-4 cursor-pointer hover:text-blue-500">
              Home
            </NavLink>
            <NavLink to="/about" className="text-black font-semibold mx-4 cursor-pointer hover:text-blue-500">
              About
            </NavLink>
            <NavLink to="/services" className="text-black font-semibold mx-4 cursor-pointer hover:text-blue-500">
              Services
            </NavLink>
            <NavLink to="/login" className="text-black font-semibold mx-4 cursor-pointer hover:text-yellow-500">
              Sign In
            </NavLink>
            <NavLink to="/register" className="bg-blue-500 rounded text-white font-semibold mx-2 py-1 px-4 hover:bg-blue-600">
              Sign Up
            </NavLink>
          </div>

          <div className="md:hidden flex items-center">
            <AdbIcon className="text-white" />
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default HomeHeader;