import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Pusher from 'pusher-js';
import apiService from '../services/apiService';

export interface Message {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  created_at: string;
}

export interface ChatUser {
  id: number;
  username: string;
  profilepicture: string;
  online: boolean;
}

interface ChatContextProps {
  messages: Message[];
  userChatList: ChatUser[];
  fetchMessages: () => Promise<void>;
  fetchUserChatList: () => Promise<void>;
  sendMessage: (content: string, receiverId: number) => Promise<boolean>;
  loading: boolean;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userChatList, setUserChatList] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize Pusher and subscribe to the public channel
  useEffect(() => {
    const pusher = new Pusher('087ae63043c8feb92728', {
      cluster: 'ap1',
    });

    const channel = pusher.subscribe('public-chat-channel'); // Use a public channel name
    channel.bind('message.sent', (data: { chat: Message }) => {
      setMessages((prevMessages) => [...prevMessages, data.chat]);
    });

    return () => {
      pusher.unsubscribe('public-chat-channel');
    };
  }, []);

  const fetchMessages = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiService.get('/chats', {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add Bearer token here
        }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserChatList = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiService.get('/user-chat-list', {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add Bearer token here
        }
      });
      setUserChatList(response.data);
    } catch (error) {
      console.error('Error fetching user chat list:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, receiverId: number): Promise<boolean> => {
    try {
      const response = await apiService.post(
        '/send-message',
        { content, receiver_id: receiverId },
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add Bearer token here
          }
        }
      );
      setMessages((prevMessages) => [...prevMessages, response.data]);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  // Fetch messages and user chat list on component mount
  useEffect(() => {
    fetchMessages();
    fetchUserChatList();
  }, []);

  return (
    <ChatContext.Provider value={{ messages, userChatList, fetchMessages, fetchUserChatList, sendMessage, loading }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
