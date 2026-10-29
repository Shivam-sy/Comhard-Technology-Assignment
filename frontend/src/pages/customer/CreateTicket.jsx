import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Send, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CreateTicket() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
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
      navigate(`/portal/tickets/${created.id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit ticket. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link
          to="/portal/tickets"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to My Tickets
        </Link>
      </div>

      <Card title="Submit a Support Ticket" subtitle="Fill in details to open a ticket with our support engineering team.">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Subject */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue (e.g. Cannot log in to dashboard)"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-freshdesk-500"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-freshdesk-500 font-medium"
            >
              <option value="LOW">Low (General inquiry)</option>
              <option value="MEDIUM">Medium (Standard issue)</option>
              <option value="HIGH">High (Impacts work)</option>
              <option value="URGENT">Urgent (Critical blocker / Outage)</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide full details: What happened? Steps to reproduce? Error messages seen?"
              className="w-full p-3 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-freshdesk-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Link to="/portal/tickets">
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </Link>

            <Button type="submit" size="sm" isLoading={isLoading} icon={Send}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateTicket;
