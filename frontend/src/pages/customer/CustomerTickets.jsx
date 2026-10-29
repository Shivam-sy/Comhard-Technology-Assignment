import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/client';
import TicketList from '../../components/tickets/TicketList';
import TicketFilters from '../../components/tickets/TicketFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CustomerTickets() {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    isOverdue: '',
  });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.listTickets(filters);
      setTickets(res.tickets || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch customer tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'ALL',
      priority: 'ALL',
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      isOverdue: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Support Tickets</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {tickets.length} of {total} tickets submitted by your account.
          </p>
        </div>

        <Link to="/portal/tickets/new">
          <Button size="sm" icon={PlusCircle}>New Ticket</Button>
        </Link>
      </div>

      <TicketFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        isStaff={false}
      />

      {loading ? (
        <LoadingSpinner text="Loading tickets..." />
      ) : (
        <TicketList
          tickets={tickets}
          baseUrl="/portal/tickets"
          emptyTitle="No tickets found"
          emptyAction={{
            label: 'Submit a New Ticket',
            onClick: () => (window.location.href = '/portal/tickets/new'),
          }}
        />
      )}
    </div>
  );
}

export default CustomerTickets;
