import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/apiService';

export interface Message {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  created_at: string;
  file_path?: string; // Add file_path to handle file uploads
}

export interface PersonalInformation {
  id: number;
  firstname: string;
  lastname: string;
  profilepicture: string;
  coverphoto?: string;
  zipcode?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface ChatUser {
  id: number;
  username: string;
  personal_information: PersonalInformation; // Nesting PersonalInformation
  online: boolean;
}

interface ChatContextProps {
  messages: Message[];
  userChatList: ChatUser[];
  fetchMessages: () => Promise<void>;
  fetchUserChatList: () => Promise<void>;
  sendMessage: (content: string, receiverId: number, file?: File) => Promise<boolean>; // Updated to include a file
  loading: boolean;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userChatList, setUserChatList] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Set loading to true initially

  const fetchMessages = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiService.get('/chats', {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setUserChatList(response.data);
    } catch (error) {
      console.error('Error fetching user chat list:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, receiverId: number, file?: File): Promise<boolean> => {
    const formData = new FormData();
    if (content) formData.append('content', content);
    formData.append('receiver_id', receiverId.toString());
    if (file) formData.append('file', file); // Append file if present

    try {
      const response = await apiService.post(
        '/send-message',
        formData,
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data', // Set content type for file upload
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

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchMessages(), fetchUserChatList()]);
    };
    fetchData();
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