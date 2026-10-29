const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.tokenGetter = null;
    this.devUserId = localStorage.getItem('support_desk_dev_user_id') || 'user_admin_seed';
  }

  setTokenGetter(getter) {
    this.tokenGetter = getter;
  }

  setDevUser(userId) {
    this.devUserId = userId;
    if (userId) {
      localStorage.setItem('support_desk_dev_user_id', userId);
    } else {
      localStorage.removeItem('support_desk_dev_user_id');
    }
  }

  getDevUser() {
    return this.devUserId;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Attach Clerk token if configured
    if (this.tokenGetter) {
      try {
        const token = await this.tokenGetter();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn('Failed to retrieve Clerk token:', e);
      }
    }

    // Attach dev identity header for testing or demo mode
    if (this.devUserId && !headers['Authorization']) {
      headers['x-dev-user-id'] = this.devUserId;
    }

    const config = {
      ...options,
      headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, config);

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (err) {
        errorData = { error: res.statusText || 'Network request failed' };
      }
      const error = new Error(errorData.error || 'API request failed');
      error.status = res.status;
      error.details = errorData.details;
      throw error;
    }

    if (res.status === 204) {
      return null;
    }

    return res.json();
  }

  // Users & Auth
  async getMe() {
    return this.request('/users/me');
  }

  async listUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  async updateUserRole(userId, role) {
    return this.request(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  // Agents
  async listAgents() {
    return this.request('/agents');
  }

  // Tickets
  async listTickets(params = {}) {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    const query = new URLSearchParams(cleanParams).toString();
    return this.request(`/tickets${query ? `?${query}` : ''}`);
  }

  async getTicket(id) {
    return this.request(`/tickets/${id}`);
  }

  async createTicket(data) {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTicket(id, data) {
    return this.request(`/tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Conversation Entries & Notes
  async getTicketEntries(ticketId) {
    return this.request(`/tickets/${ticketId}/entries`);
  }

  async createTicketEntry(ticketId, data) {
    return this.request(`/tickets/${ticketId}/entries`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Activity History
  async getTicketHistory(ticketId) {
    return this.request(`/tickets/${ticketId}/history`);
  }

  // Dashboard Metrics
  async getDashboard() {
    return this.request('/dashboard');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
