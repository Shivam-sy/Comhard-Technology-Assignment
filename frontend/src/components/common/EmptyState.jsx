import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export function EmptyState({
  title = 'No tickets found',
  description = 'There are no support tickets matching your current view or filter criteria.',
  actionLabel,
  onAction,
  icon: Icon = Inbox,
}) {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-lg border border-dashed border-slate-300">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
