import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { LayoutDashboard, Inbox, UserCheck, Users, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StaffLayout() {
  const { user, role, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'All tickets', path: '/staff/tickets', icon: Inbox },
    { label: 'Assigned to me', path: '/staff/assigned', icon: UserCheck },
    ...(isAdmin ? [{ label: 'Team', path: '/staff/agents', icon: Users }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex min-h-0">
        <aside className="w-56 shrink-0 border-r border-border bg-muted/30 flex flex-col">
          <Link to="/" className="h-14 flex items-center gap-2 px-4">
            <div className="w-7 h-7 rounded-md bg-foreground text-background flex items-center justify-center text-sm font-semibold">
              D
            </div>
            <span className="font-semibold tracking-tight">DeskFlow</span>
          </Link>

          <nav className="flex-1 px-2 py-2 space-y-0.5">
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-background text-foreground font-medium shadow-sm border border-border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarFallback className="text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate leading-tight">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{role?.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Sign out of staff desk"
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <header className="h-14 border-b border-border flex items-center justify-between gap-4 px-6 shrink-0">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tickets"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/staff/tickets?search=${encodeURIComponent(e.target.value.trim())}`);
                  }
                }}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <Link
              to="/portal/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              Customer portal
            </Link>
          </header>

          <main className="flex-1 p-6 max-w-6xl w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default StaffLayout;
