import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../component/context/AuthContext';

const ProtectedRoutes = ({ roles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !roles.includes(user.role.rolename)) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
