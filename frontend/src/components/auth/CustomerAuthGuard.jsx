import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

export function CustomerAuthGuard({ children }) {
  const { isCustomerSignedIn, loading, openSignIn } = useAuth();
  const navigate = useNavigate();
  const isClerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  useEffect(() => {
    // If Clerk is configured and user is not signed in, redirect to Home and pop up Clerk modal directly
    if (!loading && isClerkConfigured && !isCustomerSignedIn) {
      navigate('/', { replace: true });
      if (openSignIn) {
        setTimeout(() => {
          openSignIn({
            fallbackRedirectUrl: '/portal/dashboard',
            signUpFallbackRedirectUrl: '/portal/dashboard',
          });
        }, 150);
      }
    }
  }, [loading, isClerkConfigured, isCustomerSignedIn, navigate, openSignIn]);

  if (loading || (isClerkConfigured && !isCustomerSignedIn)) {
    return <LoadingSpinner fullPage text="Loading DeskFlow..." />;
  }

  return children;
}

export default CustomerAuthGuard;