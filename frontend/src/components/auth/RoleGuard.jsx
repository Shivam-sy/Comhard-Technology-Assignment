import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

export function RoleGuard({ children, allowedRoles = [] }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage text="Checking authorization..." />;
  }

  if (!user) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If a Customer attempts to enter /staff, redirect to customer portal
    if (role === 'CUSTOMER') {
      return <Navigate to="/portal/dashboard" replace />;
    }
    // If an Agent attempts to access Admin-only route, redirect to staff dashboard
    return <Navigate to="/staff/dashboard" replace />;
  }

  return children;
}

export default RoleGuard;
