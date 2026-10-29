import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import { RoleBadge } from '../../components/common/Badge';
import { Users, Search, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export function AgentManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.listUsers({ search, role: roleFilter });
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users list:', err);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    setFeedback(null);
    try {
      const updated = await apiClient.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
      );
      setFeedback({ type: 'success', message: `Updated ${updated.name}'s role to ${newRole}` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update user role' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">User & Agent Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage system users, assign support agent privileges, and configure administrator roles.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-freshdesk-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-freshdesk-500"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="AGENT">Support Agent</option>
          <option value="ADMIN">Administrator</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Loading system users..." />
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4">Activity Counts</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-right">Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{u.name}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{u.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <RoleBadge role={u.role} />
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div>Created: {u._count?.customerTickets || 0} tickets</div>
                      <div>Assigned: {u._count?.assignedTickets || 0} tickets</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        disabled={updatingId === u.id}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2.5 py-1 text-xs border border-slate-300 rounded bg-white font-medium focus:ring-1 focus:ring-freshdesk-500 disabled:opacity-50"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="AGENT">Support Agent</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentManagement;
