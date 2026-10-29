import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleSwitcherBar from '../common/RoleSwitcherBar';
import { RoleBadge } from '../common/Badge';
import {
  LifeBuoy,
  LayoutDashboard,
  Inbox,
  UserCheck,
  Users,
  Plus,
  Search,
  Settings,
  ChevronRight,
} from 'lucide-react';

export function StaffLayout() {
  const { user, role, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'All Tickets', path: '/staff/tickets', icon: Inbox },
    { label: 'Assigned to Me', path: '/staff/assigned', icon: UserCheck },
    ...(isAdmin ? [{ label: 'User & Agent Management', path: '/staff/agents', icon: Users }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Dev Switcher Bar */}
      <RoleSwitcherBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Freshdesk Helpdesk Sidebar */}
        <aside className="w-64 bg-freshdesk-navy text-slate-200 flex flex-col shrink-0 border-r border-slate-800">
          {/* Logo & Product Heading */}
          <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 bg-freshdesk-dark">
            <div className="w-8 h-8 rounded-lg bg-freshdesk-500 flex items-center justify-center text-white shadow">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">FreshSupport</span>
              <span className="block text-[10px] text-freshdesk-300 uppercase tracking-widest font-semibold">
                Helpdesk Console
              </span>
            </div>
          </div>

          {/* Quick Action */}
          <div className="p-4">
            <Link
              to="/portal/tickets/new"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-freshdesk-500 hover:bg-freshdesk-600 text-white font-medium text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              New Ticket
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-freshdesk-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-freshdesk-200" />}
                </Link>
              );
            })}
          </nav>

          {/* Current Staff User Card in Sidebar */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-freshdesk-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate leading-tight">{user?.name}</p>
                <div className="mt-0.5">
                  <RoleBadge role={role} />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tickets by subject, customer name or email..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      navigate(`/staff/tickets?search=${encodeURIComponent(e.target.value.trim())}`);
                    }
                  }}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-freshdesk-500 focus:border-freshdesk-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Support Workspace — <strong>{role === 'ADMIN' ? 'All Workspace Queue' : 'Agent Queue'}</strong>
              </span>
            </div>
          </header>

          {/* Content Outlet */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default StaffLayout;
