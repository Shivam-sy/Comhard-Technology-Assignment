import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout';
import StaffLayout from './components/layout/StaffLayout';
import RoleGuard from './components/auth/RoleGuard';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerTickets from './pages/customer/CustomerTickets';
import CreateTicket from './pages/customer/CreateTicket';
import CustomerTicketDetails from './pages/customer/CustomerTicketDetails';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import AllTickets from './pages/staff/AllTickets';
import AssignedTickets from './pages/staff/AssignedTickets';
import StaffTicketDetails from './pages/staff/StaffTicketDetails';
import AgentManagement from './pages/staff/AgentManagement';

import NotFound from './pages/NotFound';

function RootRedirect() {
  const { role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage text="Initializing support desk..." />;
  }

  if (role === 'ADMIN' || role === 'AGENT') {
    return <Navigate to="/staff/dashboard" replace />;
  }

  return <Navigate to="/portal/dashboard" replace />;
}

export function App() {
  return (
    <Routes>
      {/* Root redirect based on active user role */}
      <Route path="/" element={<RootRedirect />} />

      {/* Customer Portal Routes */}
      <Route path="/portal" element={<CustomerLayout />}>
        <Route index element={<Navigate to="/portal/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="tickets" element={<CustomerTickets />} />
        <Route path="tickets/new" element={<CreateTicket />} />
        <Route path="tickets/:id" element={<CustomerTicketDetails />} />
      </Route>

      {/* Staff Workspace Routes (Agent & Admin) */}
      <Route
        path="/staff"
        element={
          <RoleGuard allowedRoles={['AGENT', 'ADMIN']}>
            <StaffLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="tickets" element={<AllTickets />} />
        <Route path="assigned" element={<AssignedTickets />} />
        <Route path="tickets/:id" element={<StaffTicketDetails />} />
        {/* Admin only */}
        <Route
          path="agents"
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AgentManagement />
            </RoleGuard>
          }
        />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
