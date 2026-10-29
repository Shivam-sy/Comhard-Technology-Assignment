import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TicketList from '../../components/tickets/TicketList';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/lib/utils';

function Stat({ label, value, to, alert }) {
  return (
    <Link to={to} className="px-5 py-4 hover:bg-muted/40 transition-colors">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-2xl font-semibold tabular-nums', alert && 'text-rose-600')}>{value}</p>
    </Link>
  );
}

export function StaffDashboard() {
  const { user } = useAuth();
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

  if (loading) return <LoadingSpinner fullPage text="Loading…" />;

  const { metrics, recentTickets = [] } = data || {};
  const overdue = metrics?.overdue || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hi{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {overdue > 0
            ? `${overdue} ${overdue === 1 ? 'ticket has' : 'tickets have'} been waiting over 24 hours.`
            : 'Here’s what’s happening in your queue.'}
        </p>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 rounded-lg border border-border divide-x divide-y md:divide-y-0 divide-border overflow-hidden">
        <Stat label="Open" value={metrics?.open || 0} to="/staff/tickets?status=OPEN" />
        <Stat label="In progress" value={metrics?.inProgress || 0} to="/staff/tickets?status=IN_PROGRESS" />
        <Stat label="Waiting on customer" value={metrics?.waitingOnCustomer || 0} to="/staff/tickets?status=WAITING_ON_CUSTOMER" />
        <Stat label="Overdue" value={overdue} to="/staff/tickets?isOverdue=true" alert={overdue > 0} />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Recent tickets</h2>
          <Link to="/staff/tickets" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <TicketList tickets={recentTickets} baseUrl="/staff/tickets" emptyTitle="No tickets yet" />
      </section>
    </div>
  );
}

export default StaffDashboard;
