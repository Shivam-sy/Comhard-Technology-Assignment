import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleSwitcherBar from '../common/RoleSwitcherBar';
import { LifeBuoy, PlusCircle, Ticket, LayoutDashboard, User } from 'lucide-react';

export function CustomerLayout() {
  const { user, role } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/portal/dashboard', icon: LayoutDashboard },
    { label: 'My Tickets', path: '/portal/tickets', icon: Ticket },
    { label: 'Submit Ticket', path: '/portal/tickets/new', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Dev & Persona switcher bar */}
      <RoleSwitcherBar />

      {/* Customer Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/portal/dashboard" className="flex items-center gap-2 text-slate-950 font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  D
                </div>
                <span>Desk Flow <span className="text-slate-500 text-xs font-normal">Customer Portal</span></span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive
                          ? 'bg-freshdesk-50 text-freshdesk-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/portal/tickets/new"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-freshdesk-600 hover:bg-freshdesk-700 text-white text-sm font-medium shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4" />
                New Ticket
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-freshdesk-100 text-freshdesk-700 flex items-center justify-center text-xs font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-semibold text-slate-800 leading-tight">{user?.name}</p>
                  <p className="text-slate-500 leading-tight">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>Support Desk System — Freshdesk-Inspired Architecture</p>
      </footer>
    </div>
  );
}

export default CustomerLayout;
