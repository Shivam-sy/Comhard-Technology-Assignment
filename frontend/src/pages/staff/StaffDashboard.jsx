import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TicketList from '../../components/tickets/TicketList';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  UserCheck,
  LifeBuoy,
  ChevronRight,
} from 'lucide-react';

export function StaffDashboard() {
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

  if (loading) return <LoadingSpinner fullPage text="Loading helpdesk dashboard metrics..." />;

  const { metrics, recentTickets = [], userRole } = data || {};

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Helpdesk Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time operations metrics aggregated from PostgreSQL support database.
          </p>
        </div>

        <Link
          to="/staff/tickets"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
        >
          View All Tickets
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* SLA Alert banner if overdue tickets exist */}
      {metrics?.overdue > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                {metrics.overdue} SLA Overdue {metrics.overdue === 1 ? 'Ticket' : 'Tickets'} Detected
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Tickets older than 24 hours requiring prompt resolution by support agents.
              </p>
            </div>
          </div>

          <Link
            to="/staff/tickets?isOverdue=true"
            className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
          >
            Review Overdue Tickets
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Queue</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{metrics?.total || 0}</p>
        </div>

        {/* Open */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 uppercase">Open</span>
          <p className="text-2xl font-bold text-blue-700 mt-1">{metrics?.open || 0}</p>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-600 uppercase">In Progress</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">{metrics?.inProgress || 0}</p>
        </div>

        {/* Waiting on Customer */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-purple-600 uppercase">Waiting</span>
          <p className="text-2xl font-bold text-purple-700 mt-1">{metrics?.waitingOnCustomer || 0}</p>
        </div>

        {/* Resolved */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase">Resolved</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{metrics?.resolved || 0}</p>
        </div>

        {/* Urgent */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-orange-600 uppercase">Urgent</span>
          <p className="text-2xl font-bold text-orange-700 mt-1">{metrics?.urgent || 0}</p>
        </div>

        {/* Overdue */}
        <div className="bg-white p-4 rounded-lg border border-rose-200 bg-rose-50/30 shadow-sm">
          <span className="text-[11px] font-bold text-rose-700 uppercase">Overdue (&gt;24h)</span>
          <p className="text-2xl font-bold text-rose-700 mt-1">{metrics?.overdue || 0}</p>
        </div>
      </div>

      {/* Recent Workspace Tickets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recently Updated Tickets</h2>
          <Link to="/staff/tickets" className="text-xs text-freshdesk-600 hover:underline font-semibold">
            View All Tickets &rarr;
          </Link>
        </div>

        <TicketList
          tickets={recentTickets}
          baseUrl="/staff/tickets"
          emptyTitle="No recent tickets found"
        />
      </div>
    </div>
  );
}

export default StaffDashboard;
