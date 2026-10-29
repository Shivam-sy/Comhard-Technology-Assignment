import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConversationTimeline from '../../components/tickets/ConversationTimeline';
import ReplyComposer from '../../components/tickets/ReplyComposer';
import PropertiesPanel from '../../components/tickets/PropertiesPanel';
import { StatusBadge, PriorityBadge, OverdueBadge } from '../../components/common/Badge';
import { ArrowLeft, User, Clock, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/card';

export function StaffTicketDetails() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [entries, setEntries] = useState([]);
  const [history, setHistory] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [error, setError] = useState(null);

  const loadTicketData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ticketData, entriesData, historyData, agentsData] = await Promise.all([
        apiClient.getTicket(id),
        apiClient.getTicketEntries(id),
        apiClient.getTicketHistory(id),
        apiClient.listAgents(),
      ]);
      setTicket(ticketData);
      setEntries(entriesData);
      setHistory(historyData);
      setAgents(agentsData);
    } catch (err) {
      setError(err.message || 'Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTicketData();
  }, [loadTicketData]);

  const handlePostReply = async ({ content, type }) => {
    setSubmittingReply(true);
    try {
      await apiClient.createTicketEntry(id, { content, type });
      await loadTicketData();
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleUpdateProperties = async (updates) => {
    try {
      const updatedTicket = await apiClient.updateTicket(id, updates);
      setTicket(updatedTicket);
      // Reload history to reflect the changes
      const historyData = await apiClient.getTicketHistory(id);
      setHistory(historyData);
    } catch (err) {
      alert(`Failed to update properties: ${err.message}`);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading ticket workspace..." />;

  if (error || !ticket) {
    return (
      <div className="p-8 text-center bg-card rounded-xl border border-border shadow-2xs font-sans">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="font-semibold text-foreground">Error Loading Ticket</h3>
        <p className="text-xs text-muted-foreground mt-1 mb-4">{error || 'Ticket not found.'}</p>
        <Link to="/staff/tickets" className="text-xs text-primary font-medium hover:underline">
          &larr; Return to All Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/staff/tickets"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Ticket Queue</span>
        </Link>
      </div>

      {/* Ticket Header */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">#{ticket.id.slice(0, 8)}</span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            {ticket.isOverdue && <OverdueBadge isOverdue={true} />}
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{ticket.subject}</h1>
        </div>

        <div className="text-xs text-muted-foreground text-left md:text-right font-mono">
          <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
          <p className="mt-0.5">Updated: {new Date(ticket.updatedAt).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer Description, Timeline, Reply Composer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer Submitter & Original Description */}
          <div className="bg-card rounded-xl border border-border shadow-2xs overflow-hidden">
            <div className="px-5 py-3 bg-muted/30 border-b border-border flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Submitted by {ticket.customer?.name} ({ticket.customer?.email})
              </span>
              <span className="text-muted-foreground font-mono text-[11px]">
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="p-5 text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Conversation Stream */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Conversation History &amp; Notes ({entries.length})
              </h3>
            </div>
            <ConversationTimeline entries={entries} />
          </div>

          {/* Tabbed Reply & Internal Note Composer */}
          <div>
            <ReplyComposer
              onSubmit={handlePostReply}
              isStaff={true}
              isLoading={submittingReply}
            />
          </div>
        </div>

        {/* Right Column: Properties Panel */}
        <div className="lg:col-span-4 sticky top-20">
          <PropertiesPanel
            ticket={ticket}
            agents={agents}
            isStaff={true}
            isAdmin={isAdmin}
            onUpdateProperties={handleUpdateProperties}
            history={history}
          />
        </div>
      </div>
    </div>
  );
}

export default StaffTicketDetails;
