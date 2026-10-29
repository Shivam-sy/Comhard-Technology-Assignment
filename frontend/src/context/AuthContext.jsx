import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const PRESET_USERS = [
  { id: 'user_admin_seed', name: 'System Admin', email: 'admin@supportdesk.internal', role: 'ADMIN' },
  { id: 'user_agent_seed', name: 'Jane Agent', email: 'jane.support@supportdesk.internal', role: 'AGENT' },
  { id: 'user_alice_seed', name: 'Alice Cooper', email: 'alice@example.com', role: 'CUSTOMER' },
  { id: 'user_bob_seed', name: 'Bob Vance', email: 'bob@example.com', role: 'CUSTOMER' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getMe();
      setUser(data);
    } catch (err) {
      console.error('[AuthContext] Failed to load user profile:', err);
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const switchUser = async (userId) => {
    apiClient.setDevUser(userId);
    await fetchProfile();
  };

  const logout = () => {
    // For demo or dev switcher, reset to default customer or clear
    apiClient.setDevUser('');
    setUser(null);
  };

  const role = user?.role || 'CUSTOMER';
  const isCustomer = role === 'CUSTOMER';
  const isStaff = role === 'AGENT' || role === 'ADMIN';
  const isAdmin = role === 'ADMIN';
  const isAgent = role === 'AGENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isCustomer,
        isStaff,
        isAdmin,
        isAgent,
        loading,
        error,
        refreshUser: fetchProfile,
        switchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
