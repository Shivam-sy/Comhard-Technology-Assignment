import React from 'react';
import { useAuth, PRESET_USERS } from '../../context/AuthContext';
import { Shield, UserCheck, Users, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function RoleSwitcherBar() {
  const { user, role, switchUser } = useAuth();
  const location = useLocation();

  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-freshdesk-400" />
          Test Persona:
        </span>
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded border border-slate-700">
          {PRESET_USERS.map((preset) => {
            const isSelected = user?.email === preset.email;
            return (
              <button
                key={preset.id}
                onClick={() => switchUser(preset.id)}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  isSelected
                    ? 'bg-freshdesk-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title={`${preset.name} (${preset.email})`}
              >
                {preset.name.split(' ')[0]} ({preset.role})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-slate-400">
          Logged in as: <strong className="text-white">{user?.name}</strong>{' '}
          <span className="text-freshdesk-300">({user?.email})</span>
        </span>

        {role === 'ADMIN' || role === 'AGENT' ? (
          <Link
            to={isStaffRoute ? '/portal/dashboard' : '/staff/dashboard'}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <ExternalLink className="w-3 h-3 text-freshdesk-400" />
            Switch to {isStaffRoute ? 'Customer Portal' : 'Staff Workspace'}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default RoleSwitcherBar;
