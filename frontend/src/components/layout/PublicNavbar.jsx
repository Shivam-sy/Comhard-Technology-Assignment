import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useAuth } from '../../context/AuthContext';
import { StaffAuthModal } from '../auth/StaffAuthModal';
import { ArrowRight, LogIn } from 'lucide-react';

export function PublicNavbar() {
  const navigate = useNavigate();
  const { user, staffUser, role, isSignedIn, isStaff, isCustomer, openSignIn } = useAuth();
  const isClerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const handleCustomerPortalClick = (e) => {
    if (isClerkConfigured && !isSignedIn && openSignIn) {
      e.preventDefault();
      openSignIn({
        fallbackRedirectUrl: '/portal/dashboard',
        signUpFallbackRedirectUrl: '/portal/dashboard',
      });
    } else {
      navigate('/portal/dashboard');
    }
  };

  const handleStaffDeskClick = (e) => {
    e.preventDefault();
    if (staffUser) {
      navigate('/staff/dashboard');
    } else {
      setIsStaffModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-[72px] flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-base shadow-sm transition-transform group-hover:scale-105">
            F
          </div>
          <span className="font-bold text-xl tracking-tight text-neutral-950">
            DeskFlow
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <a href="#features" className="hover:text-neutral-950 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-neutral-950 transition-colors">
            How it works
          </a>
          <a href="#pricing" className="hover:text-neutral-950 transition-colors">
            Pricing
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Customer Portal Action */}
          <button
            onClick={handleCustomerPortalClick}
            className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors px-2 py-1 cursor-pointer"
          >
            Customer portal
          </button>

          {/* Staff Desk Action */}
          <button
            onClick={handleStaffDeskClick}
            className="h-10 px-5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>Staff desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* If Signed In: Show Clerk UserButton & Role Badge */}
          {isClerkConfigured && isSignedIn && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-200">
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                {role}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      </div>

      <StaffAuthModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
      />
    </header>
  );
}

export default PublicNavbar;
