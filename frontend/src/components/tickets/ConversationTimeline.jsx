import React from 'react';
import { RoleBadge } from '../common/Badge';
import { Lock, MessageSquare, Clock } from 'lucide-react';

export function ConversationTimeline({ entries = [] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-lg border border-slate-200">
        No conversation messages yet.
      </div>
    );
  }

  const formatTimestamp = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const isInternalNote = entry.type === 'INTERNAL_NOTE';
        const isCustomer = entry.author?.role === 'CUSTOMER';

        return (
          <div
            key={entry.id}
            className={`rounded-lg border shadow-sm overflow-hidden transition-all ${
              isInternalNote
                ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Entry Header */}
            <div className={`px-4 py-2.5 flex items-center justify-between border-b text-xs ${
              isInternalNote
                ? 'bg-amber-100/60 border-amber-200 text-amber-900'
                : 'bg-slate-50/70 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  isInternalNote
                    ? 'bg-amber-200 text-amber-900'
                    : isCustomer
                    ? 'bg-freshdesk-100 text-freshdesk-800'
                    : 'bg-teal-100 text-teal-800'
                }`}>
                  {entry.author?.name ? entry.author.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <span className="font-semibold">{entry.author?.name || 'Support User'}</span>
                <RoleBadge role={entry.author?.role || 'CUSTOMER'} />

                {isInternalNote && (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-800 text-[11px] bg-amber-200/70 px-2 py-0.5 rounded">
                    <Lock className="w-3 h-3" />
                    Internal Note
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                {formatTimestamp(entry.createdAt)}
              </div>
            </div>

            {/* Entry Content */}
            <div className="p-4 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {entry.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ConversationTimeline;
