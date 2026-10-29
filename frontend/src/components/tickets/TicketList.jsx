import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge, OverdueBadge } from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { Clock, User, MessageSquare } from 'lucide-react';

export function TicketList({
  tickets = [],
  baseUrl = '/staff/tickets',
  emptyTitle = 'No tickets match your filters',
  emptyAction,
}) {
  const navigate = useNavigate();

  if (tickets.length === 0) {
    return <EmptyState title={emptyTitle} actionLabel={emptyAction?.label} onAction={emptyAction?.onClick} />;
  }

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.round((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Subject & Customer</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Assignee</th>
              <th className="py-3 px-4 text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => navigate(`${baseUrl}/${ticket.id}`)}
                className="hover:bg-freshdesk-50/50 cursor-pointer transition-colors"
              >
                {/* Subject & Customer */}
                <td className="py-3.5 px-4 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm hover:text-freshdesk-600 transition truncate">
                      {ticket.subject}
                    </span>
                    {ticket.isOverdue && <OverdueBadge isOverdue={true} />}
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 mt-1">
                    <span className="font-mono text-[11px] text-slate-400">
                      #{ticket.id.slice(0, 8)}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <User className="w-3 h-3 text-slate-400" />
                      {ticket.customer?.name || 'Customer'}
                    </span>
                    {ticket._count?.entries !== undefined && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MessageSquare className="w-3 h-3" />
                        {ticket._count.entries}
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <StatusBadge status={ticket.status} />
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>

                {/* Assignee */}
                <td className="py-3.5 px-4 text-slate-600">
                  {ticket.assignee ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      {ticket.assignee.name}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Unassigned</span>
                  )}
                </td>

                {/* Updated timestamp */}
                <td className="py-3.5 px-4 text-right text-slate-500 whitespace-nowrap">
                  <span className="flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatRelativeTime(ticket.updatedAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketList;
