import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConversationTimeline from '../../components/tickets/ConversationTimeline';
import ReplyComposer from '../../components/tickets/ReplyComposer';
import PropertiesPanel from '../../components/tickets/PropertiesPanel';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { ArrowLeft, Clock, User, AlertCircle } from 'lucide-react';

export function CustomerTicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [entries, setEntries] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [error, setError] = useState(null);

  const loadTicketData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ticketData, entriesData, historyData] = await Promise.all([
        apiClient.getTicket(id),
        apiClient.getTicketEntries(id),
        apiClient.getTicketHistory(id),
      ]);
      setTicket(ticketData);
      setEntries(entriesData);
      setHistory(historyData);
    } catch (err) {
      setError(err.message || 'Failed to load ticket.');
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

  if (loading) return <LoadingSpinner fullPage text="Loading ticket details..." />;

  if (error || !ticket) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-slate-800">Unable to view ticket</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">{error || 'Ticket not found or access denied.'}</p>
        <Link to="/portal/tickets" className="text-xs text-freshdesk-600 font-semibold hover:underline">
          &larr; Back to My Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/portal/tickets"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to My Tickets
        </Link>
      </div>

      {/* Ticket Header */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs text-slate-400">#{ticket.id.slice(0, 8)}</span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">{ticket.subject}</h1>
        </div>

        <div className="text-xs text-slate-500 text-left md:text-right">
          <p>Created on {new Date(ticket.createdAt).toLocaleDateString()}</p>
          <p className="text-slate-400 mt-0.5">Last updated {new Date(ticket.updatedAt).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Two Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Original Description + Conversation Timeline + Reply Composer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Original Inquiry Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-freshdesk-600" />
                Original Ticket Submission
              </span>
              <span className="text-slate-400">
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="p-5 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Conversation Entries */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Conversation with Support ({entries.length})
            </h3>
            <ConversationTimeline entries={entries} />
          </div>

          {/* Customer Reply Composer */}
          <div>
            <ReplyComposer
              onSubmit={handlePostReply}
              isStaff={false}
              isLoading={submittingReply}
            />
          </div>
        </div>

        {/* Right Column: Properties Panel (Read-only for customer) */}
        <div className="lg:col-span-4">
          <PropertiesPanel
            ticket={ticket}
            isStaff={false}
            isAdmin={false}
            history={history}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerTicketDetails;
