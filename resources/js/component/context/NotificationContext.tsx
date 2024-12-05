import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Pusher from 'pusher-js';
import apiService from '../services/apiService';
import { useAuth } from './AuthContext';

interface Notification {
  id: number;
  request_id: number;
  content: string;
  created_at: string;
  status: string;
  user_id: number;
  target_user_id: number;
  price: string;
  request_content: string;
  user_role: number; 
  target_user_role: number; 
}

interface NotificationContextProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  acceptNotification: (notificationId: number, requestId: number) => Promise<void>;
  declineNotification: (notificationId: number, requestId: number) => Promise<void>;
  userAccept: (notificationId: number, requestId: number) => Promise<void>;
  userDecline: (notificationId: number, requestId: number) => Promise<void>;
  selectedNotification: Notification | null;
  setSelectedNotification: (id: number | null) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotificationData] = useState<Notification | null>(null);

  useEffect(() => {
    if (!user) {
      console.log('User not logged in, skipping notification fetch.');
      return;
    }

    const fetchNotifications = async () => {
      try {
        console.log('Fetching notifications...');
        const response = await apiService.get('/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        console.log('Response from /notifications:', response.data);

        if (response.data && response.data.notifications) {
          console.log('Notifications data:', response.data.notifications);
          setNotifications(response.data.notifications);
        } else {
          console.warn('No notifications found in response.');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    const pusher = new Pusher('087ae63043c8feb92728', {
      cluster: 'ap1',
      forceTLS: true,
    });

    const channel = pusher.subscribe('notifications');

    channel.bind('new-notification', (data: any) => {
      console.log('New notification received:', data.notification);
      setNotifications((prevNotifications) => [...prevNotifications, data.notification]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user]);

  // Accept notification (method updated for user-specific routes)
  const acceptNotification = async (notificationId: number, requestId: number) => {
    try {
      const response = await apiService.post(`/requests/${requestId}/accept/${notificationId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const updatedNotification = response.data.notification;

      // Update the notifications state with the accepted status and timing data
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, ...updatedNotification } : notification
        )
      );
    } catch (error) {
      console.error('Error accepting notification:', error);
    }
  };

  // Decline notification (method updated for user-specific routes)
  const declineNotification = async (notificationId: number, requestId: number) => {
    try {
      await apiService.post(`/requests/${requestId}/decline/${notificationId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      console.log(`Notification ${notificationId} declined.`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, status: 'declined' } : notification
        )
      );
    } catch (error) {
      console.error('Error declining notification:', error);
    }
  };

  const userAccept = async (notificationId: number, requestId: number) => {
    try {
        const response = await apiService.post(`/user/accept/${requestId}/${notificationId}`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        const updatedNotification = response.data.notification;
        const checkoutUrl = response.data.checkout_url;

        // Log the updated notification to check the data
        console.log('Updated Notification:', updatedNotification);

        // Update the notifications state with the accepted status and timing data
        setNotifications((prevNotifications) => {
            // Log previous notifications for debugging
            console.log('Previous Notifications:', prevNotifications);

            return prevNotifications.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, ...updatedNotification, status: 'accepted' }
                    : notification
            );
        });

        // Open the PayMongo checkout URL in a new window
        if (checkoutUrl) {
            window.open(checkoutUrl, '_blank');
        }
    } catch (error) {
        console.error('Error accepting user notification:', error);
    }
};


  // User decline request (method updated to match route)
  const userDecline = async (notificationId: number, requestId: number) => {
    try {
      await apiService.post(`/user/decline/${requestId}/${notificationId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      console.log(`User Notification ${notificationId} declined.`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, status: 'declined' } : notification
        )
      );
    } catch (error) {
      console.error('Error declining user notification:', error);
    }
  };

  // Set selected notification
  const setSelectedNotification = (id: number | null) => {
    const notification = notifications.find((n) => n.request_id === id) || null;
    console.log('Setting selected notification:', notification);
    setSelectedNotificationData(notification);
  };

  return (
    <NotificationContext.Provider
      value={{
        setNotifications,
        notifications,
        acceptNotification,
        declineNotification,
        userAccept,
        userDecline,
        selectedNotification,
        setSelectedNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
