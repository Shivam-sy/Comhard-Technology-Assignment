import React, { useState } from 'react';
import { StatusBadge, PriorityBadge, OverdueBadge } from '../common/Badge';
import Button from '../common/Button';
import {
  AlertCircle,
  Calendar,
  Clock,
  User,
  History,
  CheckCircle2,
  Tag,
  ShieldAlert,
} from 'lucide-react';

export function PropertiesPanel({
  ticket,
  agents = [],
  isStaff = false,
  isAdmin = false,
  onUpdateProperties,
  history = [],
}) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [assigneeId, setAssigneeId] = useState(ticket.assigneeId || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const hasChanges =
    status !== ticket.status ||
    priority !== ticket.priority ||
    (assigneeId || null) !== (ticket.assigneeId || null);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await onUpdateProperties({
        status,
        priority,
        assigneeId: assigneeId === '' ? null : assigneeId,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-5">
      {/* Overdue Alert Banner */}
      {ticket.isOverdue && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-semibold text-rose-800">SLA Overdue Warning</h5>
            <p className="text-rose-700 mt-0.5">
              This ticket has remained unresolved for more than 24 hours since creation.
            </p>
          </div>
        </div>
      )}

      {/* Ticket Properties Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
          Ticket Properties
        </h4>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Status</label>
          {isStaff ? (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-freshdesk-500 font-medium"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_ON_CUSTOMER">Waiting on Customer</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          ) : (
            <div>
              <StatusBadge status={ticket.status} />
            </div>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Priority</label>
          {isStaff ? (
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-freshdesk-500 font-medium"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          ) : (
            <div>
              <PriorityBadge priority={ticket.priority} />
            </div>
          )}
        </div>

        {/* Assignee */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Assignee</label>
          {isStaff ? (
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-freshdesk-500 font-medium"
            >
              <option value="">Unassigned</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.role})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-slate-600 font-medium">
              {ticket.assignee ? ticket.assignee.name : 'Unassigned'}
            </div>
          )}
        </div>

        {/* Save Properties Button */}
        {isStaff && hasChanges && (
          <div className="pt-2">
            <Button
              onClick={handleSave}
              isLoading={isUpdating}
              size="sm"
              className="w-full"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Customer Information Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          Customer Information
        </h4>

        <div className="text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Name:</span>
            <span className="font-semibold text-slate-800">{ticket.customer?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email:</span>
            <span className="font-medium text-slate-700 truncate max-w-[150px]">{ticket.customer?.email}</span>
          </div>
        </div>
      </div>

      {/* Timestamp Metadata */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Created:
          </span>
          <span className="font-medium text-slate-700">{formatDate(ticket.createdAt)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600 pt-1.5 border-t border-slate-100">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Last Updated:
          </span>
          <span className="font-medium text-slate-700">{formatDate(ticket.updatedAt)}</span>
        </div>
      </div>

      {/* Activity History Toggle */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <span className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-freshdesk-600" />
            Activity History ({history.length})
          </span>
          <span className="text-slate-400">{showHistory ? 'Hide' : 'View'}</span>
        </button>

        {showHistory && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 max-h-72 overflow-y-auto space-y-2.5">
            {history.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic text-center py-2">No history recorded.</p>
            ) : (
              history.map((log) => (
                <div key={log.id} className="text-[11px] bg-white p-2.5 rounded border border-slate-200 shadow-2xs space-y-0.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {log.oldValue && log.newValue && (
                    <p className="text-slate-600">
                      <span className="line-through text-slate-400">{log.oldValue}</span> &rarr;{' '}
                      <span className="font-medium text-freshdesk-700">{log.newValue}</span>
                    </p>
                  )}
                  {log.actor && (
                    <p className="text-[10px] text-slate-400">by {log.actor.name}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertiesPanel;
