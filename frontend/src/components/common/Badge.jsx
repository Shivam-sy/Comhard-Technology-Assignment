import React from 'react';
import { Badge as ShadcnBadge } from '../ui/badge';
import { cn } from '@/lib/utils';

const STATUS = {
  OPEN: { label: 'Open', dot: 'bg-blue-500' },
  IN_PROGRESS: { label: 'In progress', dot: 'bg-amber-500' },
  WAITING_ON_CUSTOMER: { label: 'Waiting on customer', dot: 'bg-zinc-400' },
  RESOLVED: { label: 'Resolved', dot: 'bg-emerald-500' },
};

const PRIORITY = {
  LOW: { label: 'Low', className: 'text-muted-foreground' },
  MEDIUM: { label: 'Medium', className: 'text-foreground' },
  HIGH: { label: 'High', className: 'text-orange-600 font-medium' },
  URGENT: { label: 'Urgent', className: 'text-rose-600 font-medium' },
};

export function StatusBadge({ status, size = 'sm', className = '' }) {
  const config = STATUS[status] || { label: status, dot: 'bg-zinc-400' };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-foreground select-none',
        size === 'xs' ? 'text-xs' : 'text-sm',
        className
      )}
    >
      <span className={cn('w-2 h-2 rounded-full shrink-0', config.dot)} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority, size = 'sm', className = '' }) {
  const config = PRIORITY[priority] || { label: priority, className: 'text-muted-foreground' };
  return (
    <span className={cn('select-none', size === 'xs' ? 'text-xs' : 'text-sm', config.className, className)}>
      {config.label}
    </span>
  );
}

export function OverdueBadge({ isOverdue, className = '' }) {
  if (!isOverdue) return null;
  return (
    <span
      className={cn(
        'shrink-0 px-1.5 py-0.5 text-xs font-medium rounded bg-rose-50 text-rose-700 select-none',
        className
      )}
    >
      Overdue
    </span>
  );
}

export function RoleBadge({ role, className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground capitalize select-none',
        className
      )}
    >
      {role?.toLowerCase()}
    </span>
  );
}

export { ShadcnBadge as Badge };
