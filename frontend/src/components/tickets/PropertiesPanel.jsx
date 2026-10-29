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
import { cn } from '@/lib/utils';

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
    <div className="space-y-4 font-sans">
      {/* Overdue Alert Banner */}
      {ticket.isOverdue && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-semibold text-rose-900 dark:text-rose-200">SLA Overdue Warning</h5>
            <p className="text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
              This ticket has remained unresolved for more than 24 hours since creation.
            </p>
          </div>
        </div>
      )}

      {/* Ticket Properties Card */}
      <div className="bg-card rounded-xl border border-border shadow-2xs p-4 space-y-4">
        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
          Ticket Properties
        </h4>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-foreground">Status</label>
          {isStaff ? (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-medium"
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
          <label className="block text-xs font-medium text-foreground">Priority</label>
          {isStaff ? (
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-medium"
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
          <label className="block text-xs font-medium text-foreground">Assignee</label>
          {isStaff ? (
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-medium"
            >
              <option value="">Unassigned</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.role})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-foreground font-medium">
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
              className="w-full font-semibold shadow-xs"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Customer Information Card */}
      <div className="bg-card rounded-xl border border-border shadow-2xs p-4 space-y-3">
        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-2 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          Customer Information
        </h4>

        <div className="text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-semibold text-foreground">{ticket.customer?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-mono text-[11px] text-foreground truncate max-w-[150px]">{ticket.customer?.email}</span>
          </div>
        </div>
      </div>

      {/* Timestamp Metadata */}
      <div className="bg-card rounded-xl border border-border shadow-2xs p-4 space-y-2 text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            Created:
          </span>
          <span className="font-medium text-foreground">{formatDate(ticket.createdAt)}</span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground pt-1.5 border-t border-border">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            Last Updated:
          </span>
          <span className="font-medium text-foreground">{formatDate(ticket.updatedAt)}</span>
        </div>
      </div>

      {/* Activity History Toggle */}
      <div className="bg-card rounded-xl border border-border shadow-2xs overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-muted-foreground" />
            Activity History ({history.length})
          </span>
          <span className="text-muted-foreground text-[11px]">{showHistory ? 'Hide' : 'View'}</span>
        </button>

        {showHistory && (
          <div className="p-3 border-t border-border bg-muted/20 max-h-72 overflow-y-auto space-y-2.5">
            {history.length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic text-center py-2">No history recorded.</p>
            ) : (
              history.map((log) => (
                <div key={log.id} className="text-[11px] bg-background p-2.5 rounded-lg border border-border shadow-2xs space-y-0.5">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-semibold text-foreground">{log.action}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {log.oldValue && log.newValue && (
                    <p className="text-muted-foreground">
                      <span className="line-through text-muted-foreground/60">{log.oldValue}</span> &rarr;{' '}
                      <span className="font-medium text-primary">{log.newValue}</span>
                    </p>
                  )}
                  {log.actor && (
                    <p className="text-[10px] text-muted-foreground">by {log.actor.name}</p>
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
