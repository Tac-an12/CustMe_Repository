import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/apiService';

export interface Role {
  rolename: string;
}

export interface PersonalInformation {
  profilepicture: string;
  coverphoto: string;
}
export interface Certificate {
  id: number;
  file_path: string;
  file_name: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface Portfolio {
  id: number;
  file_path: string;
  file_name: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  verified: boolean;
  personal_information: PersonalInformation;
  certificates?: Certificate[];  // Optional property for certificates
  portfolios?: Portfolio[];  
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchAllUsers: (page: number) => Promise<{ data: User[]; last_page: number }>;
  acceptUser: (userId: number, verified: boolean) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiService.get('/current-user', { withCredentials: true });
        setUser(response.data.user);
        console.log("current user: ", response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.post('/login', { email, password }, { withCredentials: true });
      apiService.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      localStorage.setItem('authToken', response.data.token);

      const user = response.data.user;
      if (!user.personal_information) {
        const personalInfoResponse = await apiService.get(`/users/${user.id}/personal_information`, { withCredentials: true });
        user.personal_information = personalInfoResponse.data.personal_information;
      }

      setUser(user); 
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.post('/logout', {}, { withCredentials: true });
      setUser(null);
      delete apiService.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchAllUsers = async (page: number): Promise<{ data: User[], last_page: number }> => {
    try {
      const response = await apiService.get(`/users?page=${page}`, { withCredentials: true });
  
      return {
        data: response.data.users.data.map((user: User) => ({
          ...user,
          certificates: user.certificates || [],  // Assumes certificates are included in user data
          portfolios: user.portfolios || [],      // Assumes portfolios are included in user data
        })),
        last_page: response.data.users.last_page,
      };
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return { data: [], last_page: 1 };
    }
  };
  

  const acceptUser = async (userId: number, verified: boolean): Promise<boolean> => {
    try {
      const response = await apiService.post(`/updateUsers/${userId}`, { verified }, { withCredentials: true });
      return response.status === 200;
    } catch (error) {
      console.error("Error accepting user:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchAllUsers, acceptUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
