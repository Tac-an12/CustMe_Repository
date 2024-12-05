import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoutes = () => {
    const { user } = useAuth();

    if (user) {
        switch (user.role.rolename) {
            case 'Admin':
                return <Navigate to="/admin" />;
            case 'User':
                return <Navigate to="/user" />;
            case 'Graphic Designer':
                return <Navigate to="/graphic-designer" />;
            case 'Printing Shop':
                return <Navigate to="/printing-shop" />;
            default:
                return <Navigate to="/" />;
        }
    }

    return <Outlet />;
};

export default GuestRoutes;
