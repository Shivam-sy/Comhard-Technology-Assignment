import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';

export function StatusBadge({ status, size = 'sm' }) {
  const styles = {
    OPEN: 'bg-blue-50 text-blue-700 border-blue-200',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
    WAITING_ON_CUSTOMER: 'bg-purple-50 text-purple-700 border-purple-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const labels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    WAITING_ON_CUSTOMER: 'Waiting on Customer',
    RESOLVED: 'Resolved',
  };

  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'} ${sizeClasses}`}
    >
      {labels[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority, size = 'sm' }) {
  const styles = {
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
    MEDIUM: 'bg-sky-50 text-sky-700 border-sky-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200 font-medium',
    URGENT: 'bg-rose-50 text-rose-700 border-rose-300 font-semibold ring-1 ring-rose-200',
  };

  const labels = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
  };

  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-md border ${styles[priority] || 'bg-gray-100 text-gray-700'} ${sizeClasses}`}
    >
      {labels[priority] || priority}
    </span>
  );
}

export function OverdueBadge({ isOverdue }) {
  if (!isOverdue) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-red-100 text-red-800 border border-red-200 animate-pulse">
      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
      Overdue (&gt;24h)
    </span>
  );
}

export function RoleBadge({ role }) {
  const styles = {
    ADMIN: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    AGENT: 'bg-teal-100 text-teal-800 border-teal-200',
    CUSTOMER: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
      {role}
    </span>
  );
}
