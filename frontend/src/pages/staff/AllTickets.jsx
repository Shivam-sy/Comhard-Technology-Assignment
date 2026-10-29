import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../../api/client';
import TicketList from '../../components/tickets/TicketList';
import TicketFilters from '../../components/tickets/TicketFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export function AllTickets() {
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'ALL',
    priority: searchParams.get('priority') || 'ALL',
    assigneeId: searchParams.get('assigneeId') || '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    isOverdue: searchParams.get('isOverdue') || '',
  });

  // Load agents for filter dropdown
  useEffect(() => {
    async function fetchAgents() {
      try {
        const list = await apiClient.listAgents();
        setAgents(list);
      } catch (err) {
        console.error('Failed to load agents list:', err);
      }
    }
    fetchAgents();
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.listTickets(filters);
      setTickets(res.tickets || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to load staff tickets:', err);
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
      assigneeId: '',
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      isOverdue: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">All Support Tickets</h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {tickets.length} of {total} total tickets in the support operations queue.
          </p>
        </div>
      </div>

      <TicketFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        agents={agents}
        isStaff={true}
      />

      {loading ? (
        <LoadingSpinner text="Filtering tickets from database..." />
      ) : (
        <TicketList
          tickets={tickets}
          baseUrl="/staff/tickets"
          emptyTitle="No tickets found matching current criteria"
        />
      )}
    </div>
  );
}

export default AllTickets;
