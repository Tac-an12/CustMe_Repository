import React, { createContext, useState, ReactNode } from 'react';
import apiService from '../services/apiService';

interface BalanceRequestContextType {
  balance: number; // Updated to store the total balance
  balanceRequests: BalanceRequest[];
  loading: boolean;
  error: string | null;
  requestBalance: (userId: number, amount: number) => Promise<void>;
  fetchBalanceRequests: (userId: number) => void;
}

interface BalanceRequest {
  id: number;
  user_id: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

const BalanceRequestContext = createContext<BalanceRequestContextType | undefined>(undefined);

export const BalanceRequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0); // State to hold the balance
  const [balanceRequests, setBalanceRequests] = useState<BalanceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch balance requests and user balance for a specific user
  const fetchBalanceRequests = async (userId: number) => {
    setLoading(true);
    try {
      // Fetch the balance request
      const balanceResponse = await apiService.get(`/users/${userId}/balance-requests`);
      setBalance(balanceResponse.data.balance); // Update the balance

      // Fetch balance requests
      const requestResponse = await apiService.get(`/users/${userId}/balance-requests`);
      setBalanceRequests(requestResponse.data.data);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch balance requests');
    } finally {
      setLoading(false);
    }
  };

  // Request balance from admin
  const requestBalance = async (userId: number, amount: number) => {
    setLoading(true);
    try {
      await apiService.post('/balance/request', { user_id: userId, amount });
      fetchBalanceRequests(userId); // Refetch balance requests after submitting a new one
      setError(null);
    } catch (err) {
      setError('Failed to request balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BalanceRequestContext.Provider value={{ balance, balanceRequests, loading, error, requestBalance, fetchBalanceRequests }}>
      {children}
    </BalanceRequestContext.Provider>
  );
};

export const useBalanceRequestContext = () => {
  const context = React.useContext(BalanceRequestContext);
  if (!context) {
    throw new Error('useBalanceRequestContext must be used within a BalanceRequestProvider');
  }
  return context;
};
