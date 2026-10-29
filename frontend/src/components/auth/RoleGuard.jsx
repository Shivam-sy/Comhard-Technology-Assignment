import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

export function RoleGuard({ children, allowedRoles = [] }) {
  const { user, role, loading, openSignIn, isSignedIn } = useAuth();
  const isClerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  if (loading) {
    return <LoadingSpinner fullPage text="Checking authorization..." />;
  }

  if (!user && !isSignedIn) {
    if (isClerkConfigured && openSignIn) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-2">Authentication Required</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Please sign in to access this workspace.
            </p>
            <button
              onClick={() => openSignIn({ fallbackRedirectUrl: window.location.pathname })}
              className="w-full h-11 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              Sign in with Clerk
            </button>
          </div>
        </div>
      );
    }
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
