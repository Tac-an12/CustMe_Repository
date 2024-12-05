import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';

// Define an interface for the request payload
interface RequestPayload {
  user_id: number;
  target_user_id: number;
  post_id: number;
  content: string;
  request_content: string; // This is for the request content
  duration_days?: number; // Optional field for duration days
  duration_minutes?: number; // Optional field for duration minutes
  completion_deadline?: string; // Optional field for completion deadline

}

interface RequestContextProps {
  handleRequest: (
    postId: number,
    postUserId: number,
    requestContent: string, // Added to accept request content
  
    durationDays?: number,   // Added to accept duration days
    durationMinutes?: number  // Added to accept duration minutes
  ) => Promise<void>;
}

const RequestContext = createContext<RequestContextProps | undefined>(undefined);

interface RequestProviderProps {
  children: ReactNode;
}

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const handleRequest = async (
    postId: number,
    postUserId: number,
    requestContent: string, // Accept request content
   
    durationDays?: number,   // Accept duration days
    durationMinutes?: number // Accept duration minutes
  ) => {
    if (user) {
      try {
        // Calculate completion deadline
        const completionDeadline = calculateCompletionDeadline(durationDays, durationMinutes);

        const requestPayload: RequestPayload = {
          user_id: user.id,
          target_user_id: postUserId,
          post_id: postId,
          content: `User ${user.username} has requested for your product.`,
          request_content: requestContent, // Include request content
          duration_days: durationDays,      // Include duration days
          duration_minutes: durationMinutes, // Include duration minutes
          completion_deadline: completionDeadline, // Include completion deadline
        
        };

        // Log the payload before sending
        console.log('Sending request with payload:', requestPayload);

        await apiService.post('/requests', requestPayload); // Use the defined payload
      } catch (error) {
        console.error('Failed to send request', error);
      }
    } else {
      console.error('User not authenticated');
    }
  };

  // Function to calculate completion deadline
  const calculateCompletionDeadline = (days?: number, minutes?: number) => {
    const now = new Date();
    if (days) {
      now.setDate(now.getDate() + days);
    }
    if (minutes) {
      now.setMinutes(now.getMinutes() + minutes);
    }
    return now.toISOString(); // Return as ISO string or format as needed
  };

  return (
    <RequestContext.Provider value={{ handleRequest }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = (): RequestContextProps => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
};
