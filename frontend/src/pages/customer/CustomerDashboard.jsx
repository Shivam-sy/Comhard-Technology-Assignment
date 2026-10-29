import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TicketList from '../../components/tickets/TicketList';
import Button from '../../components/common/Button';
import { PlusCircle, Ticket, CheckCircle2, Clock, Inbox } from 'lucide-react';

export function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.getDashboard();
        setData(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner fullPage text="Loading your support dashboard..." />;

  const { metrics, recentTickets = [] } = data || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Welcome to Customer Support</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your open support requests or submit a new inquiry to our team.
          </p>
        </div>

        <Link to="/portal/tickets/new">
          <Button icon={PlusCircle}>Submit a Ticket</Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">My Tickets</span>
            <Ticket className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{metrics?.total || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600 uppercase">Open</span>
            <Inbox className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-2">{metrics?.open || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 uppercase">In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{metrics?.inProgress || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 uppercase">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{metrics?.resolved || 0}</p>
        </div>
      </div>

      {/* Recent Tickets Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Support Tickets</h2>
          <Link to="/portal/tickets" className="text-xs text-freshdesk-600 hover:underline font-semibold">
            View All My Tickets &rarr;
          </Link>
        </div>

        <TicketList
          tickets={recentTickets}
          baseUrl="/portal/tickets"
          emptyTitle="You haven't submitted any tickets yet"
          emptyAction={{
            label: 'Submit Your First Ticket',
            onClick: () => (window.location.href = '/portal/tickets/new'),
          }}
        />
      </div>
    </div>
  );
}

export default CustomerDashboard;
