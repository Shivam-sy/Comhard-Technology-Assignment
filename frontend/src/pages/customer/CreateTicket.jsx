import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { Send, AlertCircle, ArrowLeft, CheckCircle2, Ticket } from 'lucide-react';

export function CreateTicket() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subject.trim().length < 3) {
      setError('Subject must be at least 3 characters long.');
      return;
    }
    if (description.trim().length < 5) {
      setError('Description must be at least 5 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const created = await apiClient.createTicket({
        subject: subject.trim(),
        priority,
        description: description.trim(),
      });

      const displayId = created.id ? `DF-${created.id.slice(0, 8).toUpperCase()}` : 'New Ticket';
      setSuccessInfo({ id: created.id, displayId });

      try {
        const cached = JSON.parse(localStorage.getItem('support_desk_customer_tickets') || '[]');
        cached.unshift(created);
        localStorage.setItem('support_desk_customer_tickets', JSON.stringify(cached));
      } catch (e) {}

      // Navigate after brief confirmation
      setTimeout(() => {
        navigate(`/portal/tickets/${created.id}`);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to submit ticket. Please check your inputs.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <div className="flex items-center gap-2">
        <Link
          to="/portal/tickets"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Tickets</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>Support Request</span>
          </div>
          <h1 className="text-2xl font-black text-neutral-950 tracking-tight">
            Raise a Support Ticket
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Fill in details to open a ticket with our support engineering team.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successInfo && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Ticket created successfully!</p>
              <p className="text-emerald-700 mt-0.5">
                Ticket ID: <strong className="font-mono">{successInfo.displayId}</strong>. Redirecting to your ticket details...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue (e.g. Cannot connect WhatsApp webhook)"
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-neutral-200 rounded-xl bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium text-neutral-900"
            >
              <option value="LOW">Low (General inquiry)</option>
              <option value="MEDIUM">Medium (Standard issue)</option>
              <option value="HIGH">High (Impacts work)</option>
              <option value="URGENT">Urgent (Critical blocker / Outage)</option>
            </select>
            <p className="text-[11px] text-neutral-400">
              Initial assignment will be handled autonomously or by an on-duty Administrator.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide full details: What happened? Steps to reproduce? Error messages seen?"
              className="w-full p-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 leading-relaxed text-neutral-900 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Link to="/portal/tickets">
              <button
                type="button"
                className="px-4 py-2 text-xs font-medium rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              disabled={isLoading || Boolean(successInfo)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Submitting ticket...' : 'Submit Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;