// UserBalanceContext.tsx
import React, { ReactNode } from 'react';
import apiService from '../services/apiService';

interface UserBalanceData {
  id: number;
  user_id: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface UserBalanceContextType {
  balance: number;
  loading: boolean;
  error: string | null;
  fetchBalance: () => void;
  updateBalance: (amount: number) => void;
}

const UserBalanceContext = React.createContext<UserBalanceContextType | undefined>(undefined);

export const UserBalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch the user's balance
  const fetchBalance = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<{ data: UserBalanceData }>('/user/balance');
      setBalance(response.data.data.balance);
      setError(null);
    } catch (err) {
      setError('Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  // Update the user's balance (this can be used after successful transactions or admin approvals)
  const updateBalance = (amount: number) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  React.useEffect(() => {
    fetchBalance(); // Initial fetch when the component mounts
  }, []);

  return (
    <UserBalanceContext.Provider value={{ balance, loading, error, fetchBalance, updateBalance }}>
      {children}
    </UserBalanceContext.Provider>
  );
};

export const useUserBalanceContext = () => {
  const context = React.useContext(UserBalanceContext);
  if (!context) {
    throw new Error('useUserBalanceContext must be used within a UserBalanceProvider');
  }

  return context;
};
