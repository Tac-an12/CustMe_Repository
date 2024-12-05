import React, { createContext, useContext, useState, ReactNode } from 'react';
import apiService from '../services/apiService';

interface PaymentContextProps {
  initiatePayment: (requestId: number, amount: number, payerId: number) => Promise<string | null>;
  loading: boolean;
}


const PaymentContext = createContext<PaymentContextProps | undefined>(undefined);

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (requestId: number, amount: number): Promise<string | null> => {
    try {
      setLoading(true);
      const response = await apiService.post('/initiate-payment', { request_id: requestId, amount }, { withCredentials: true });
      setLoading(false);

      if (response.data.checkout_url) {
        return response.data.checkout_url; // Return the URL for payment gateway redirection
      }
      return null;
    } catch (error) {
      setLoading(false);
      console.error("Failed to initiate payment:", error);
      return null;
    }
  };

  return (
    <PaymentContext.Provider value={{ initiatePayment, loading }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = (): PaymentContextProps => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
