import React, { useState } from 'react';
import Button from '../common/Button';
import { Send, Lock, MessageSquare, AlertTriangle } from 'lucide-react';

export function ReplyComposer({ onSubmit, isStaff = false, isLoading = false }) {
  const [content, setContent] = useState('');
  const [type, setType] = useState('PUBLIC_REPLY'); // 'PUBLIC_REPLY' | 'INTERNAL_NOTE'
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Message content cannot be empty.');
      return;
    }
    setError('');

    try {
      await onSubmit({ content: content.trim(), type });
      setContent('');
    } catch (err) {
      setError(err.message || 'Failed to send message.');
    }
  };

  const isInternalNote = type === 'INTERNAL_NOTE';

  return (
    <div className={`rounded-lg border shadow-sm transition-colors ${
      isInternalNote
        ? 'bg-amber-50/70 border-amber-300'
        : 'bg-white border-slate-200'
    }`}>
      {/* Tabs */}
      {isStaff ? (
        <div className="flex items-center border-b border-slate-200 bg-slate-50/60 px-4 py-2 gap-2 rounded-t-lg">
          <button
            type="button"
            onClick={() => setType('PUBLIC_REPLY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              type === 'PUBLIC_REPLY'
                ? 'bg-white text-freshdesk-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Public Reply
          </button>

          <button
            type="button"
            onClick={() => setType('INTERNAL_NOTE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              type === 'INTERNAL_NOTE'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300 ring-1 ring-amber-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            Internal Note
          </button>
        </div>
      ) : (
        <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 rounded-t-lg">
          <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-freshdesk-600" />
            Send a Public Reply to Support
          </h4>
        </div>
      )}

      {/* Internal note privacy banner */}
      {isInternalNote && (
        <div className="bg-amber-100/80 px-4 py-2 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-900 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>This note is private. It will only be visible to support staff and never shown to the customer.</span>
        </div>
      )}

      {/* Composer form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        {error && (
          <div className="p-2.5 text-xs rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium">
            {error}
          </div>
        )}

        <textarea
          rows={4}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError('');
          }}
          placeholder={
            isInternalNote
              ? 'Add an internal note for your support team (e.g., reproduction steps, logs, escalation)...'
              : 'Write your response to the customer...'
          }
          className={`w-full p-3 text-xs rounded-md border focus:outline-none focus:ring-1 text-slate-800 ${
            isInternalNote
              ? 'bg-white border-amber-300 focus:ring-amber-500'
              : 'bg-white border-slate-300 focus:ring-freshdesk-500'
          }`}
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            {isInternalNote ? 'Confidential Team Note' : 'Visible to customer'}
          </span>

          <Button
            type="submit"
            size="sm"
            isLoading={isLoading}
            variant={isInternalNote ? 'secondary' : 'primary'}
            className={isInternalNote ? 'bg-amber-600 hover:bg-amber-700 text-white border-none' : ''}
            icon={isInternalNote ? Lock : Send}
          >
            {isInternalNote ? 'Add Internal Note' : 'Send Reply'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ReplyComposer;
