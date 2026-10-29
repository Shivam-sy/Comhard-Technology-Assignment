import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Lock,
  Clock,
  User,
  Shield,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Send,
  LifeBuoy,
} from 'lucide-react';
import { StatusBadge, PriorityBadge, OverdueBadge } from '../common/Badge';

export function InteractiveDeskPreview() {
  const [activeTab, setActiveTab] = useState('staff'); // 'staff' | 'customer'
  const [composerMode, setComposerMode] = useState('PUBLIC_REPLY'); // 'PUBLIC_REPLY' | 'INTERNAL_NOTE'
  const [ticketStatus, setTicketStatus] = useState('IN_PROGRESS');
  const [ticketPriority, setTicketPriority] = useState('URGENT');
  const [ticketAssignee, setTicketAssignee] = useState('Jane Agent');

  const [notes, setNotes] = useState([
    {
      id: 1,
      author: 'Alice Cooper',
      role: 'CUSTOMER',
      type: 'PUBLIC_REPLY',
      time: '10:15 AM',
      content: 'Our SAML SSO endpoint returned 403 Forbidden after rotating certificates this morning.',
    },
    {
      id: 2,
      author: 'Jane Agent',
      role: 'AGENT',
      type: 'INTERNAL_NOTE',
      time: '10:22 AM',
      content: 'Private Note: The IdP certificate assertion mismatch in Okta. Updating trusted x509 cert thumbprint.',
    },
    {
      id: 3,
      author: 'Jane Agent',
      role: 'AGENT',
      type: 'PUBLIC_REPLY',
      time: '10:30 AM',
      content: 'Hello Alice, we identified an expired IdP thumbprint assertion and are refreshing the trusted keys now.',
    },
  ]);

  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: activeTab === 'customer' ? 'Alice Cooper' : 'Jane Agent',
        role: activeTab === 'customer' ? 'CUSTOMER' : 'AGENT',
        type: activeTab === 'customer' ? 'PUBLIC_REPLY' : composerMode,
        time: 'Just now',
        content: newComment.trim(),
      },
    ]);
    setNewComment('');
  };

  // Filter notes for customer (Internal notes NEVER visible to customer)
  const visibleNotes = activeTab === 'customer'
    ? notes.filter((n) => n.type === 'PUBLIC_REPLY')
    : notes;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-200/50 overflow-hidden text-left">
      {/* Top Preview Control Header */}
      <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Window dots */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="w-3 h-3 rounded-full bg-slate-300" />
          </div>
          <span className="text-xs font-semibold text-slate-500 pl-2 border-l border-slate-200">
            Interactive System Preview
          </span>
        </div>

        {/* Perspective Switcher */}
        <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1 rounded text-xs font-semibold transition ${
              activeTab === 'staff'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Support Staff Workspace
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`px-3 py-1 rounded text-xs font-semibold transition ${
              activeTab === 'customer'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Self-Service View
          </button>
        </div>
      </div>

      {/* Ticket Workspace Header */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-xs font-semibold text-slate-400">#TK-89421</span>
            <StatusBadge status={ticketStatus} />
            <PriorityBadge priority={ticketPriority} />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              SLA Compliant (2h left)
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-950">
            SAML SSO Login fails with assertion error 403
          </h3>
        </div>

        <div className="text-xs text-slate-500">
          <span className="block font-medium">Customer: Alice Cooper</span>
          <span className="text-slate-400">Enterprise Cloud Tier</span>
        </div>
      </div>

      {/* Main Two-Column Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
        {/* Left Column: Conversation & Composer */}
        <div className="md:col-span-8 p-5 border-r border-slate-100 flex flex-col justify-between space-y-4">
          {/* Conversation history */}
          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2">
            {visibleNotes.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  item.type === 'INTERNAL_NOTE'
                    ? 'bg-amber-50/80 border-amber-200 ring-1 ring-amber-300/40 text-amber-950'
                    : 'bg-slate-50/60 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">{item.author}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/80 border border-slate-200 text-slate-600">
                      {item.role}
                    </span>
                    {item.type === 'INTERNAL_NOTE' && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded">
                        <Lock className="w-2.5 h-2.5" />
                        Private Note
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{item.time}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{item.content}</p>
              </div>
            ))}
          </div>

          {/* Composer */}
          <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-100 space-y-2">
            {activeTab === 'staff' && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setComposerMode('PUBLIC_REPLY')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    composerMode === 'PUBLIC_REPLY'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Public Reply
                </button>
                <button
                  type="button"
                  onClick={() => setComposerMode('INTERNAL_NOTE')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    composerMode === 'INTERNAL_NOTE'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Lock className="w-3 h-3 inline mr-1" />
                  Internal Note
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  activeTab === 'customer'
                    ? 'Write a reply to support...'
                    : composerMode === 'INTERNAL_NOTE'
                    ? 'Write a private internal note for the support team...'
                    : 'Write a public reply to Alice...'
                }
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-950 text-white hover:bg-slate-800 transition shadow-xs flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Properties Panel */}
        <div className="md:col-span-4 p-5 bg-slate-50/50 space-y-4 text-xs">
          <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Ticket Properties
          </h4>

          {/* Status Dropdown */}
          <div className="space-y-1">
            <label className="text-slate-600 font-medium">Status</label>
            <select
              value={ticketStatus}
              onChange={(e) => setTicketStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_ON_CUSTOMER">Waiting on Customer</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="space-y-1">
            <label className="text-slate-600 font-medium">Priority</label>
            <select
              value={ticketPriority}
              onChange={(e) => setTicketPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Assignee */}
          <div className="space-y-1">
            <label className="text-slate-600 font-medium">Assigned Agent</label>
            <select
              value={ticketAssignee}
              onChange={(e) => setTicketAssignee(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="Jane Agent">Jane Agent (Assigned)</option>
              <option value="System Admin">System Admin</option>
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>

          {/* Live Security Guarantee Card */}
          <div className="p-3 bg-white rounded-lg border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Role Privacy Barrier
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {activeTab === 'customer'
                ? 'Internal notes are strictly filtered at the database level. Customers never receive staff notes.'
                : 'Staff members have full access to internal notes and complete audit history.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveDeskPreview;
