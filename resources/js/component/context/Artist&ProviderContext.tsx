import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import apiService from '../services/apiService';

interface PersonalInformation {
  id: number;
  firstname: string;
  lastname: string;
  profilepicture: string | null;
  coverphoto: string | null;
  zipcode: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

interface ArtistAndProviderProfile {
  id: number;
  username: string;
  email: string;
  verified: number;
  role_name: string;
  personal_information: PersonalInformation;
}

interface ArtistAndProviderContextProps {
  profiles: ArtistAndProviderProfile[] | null;
  fetchArtistAndProviderProfiles: () => Promise<void>;
  loading: boolean;
}

const ArtistAndProviderContext = createContext<ArtistAndProviderContextProps | undefined>(undefined);

interface ArtistAndProviderProviderProps {
  children: ReactNode;
}

export const ArtistAndProviderProvider: React.FC<ArtistAndProviderProviderProps> = ({ children }) => {
  const [profiles, setProfiles] = useState<ArtistAndProviderProfile[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchArtistAndProviderProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/users/artist-and-printing-provider');
      
      if (Array.isArray(response.data.users)) {
        const fetchedProfiles: ArtistAndProviderProfile[] = response.data.users.map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          verified: user.verified,
          role_name: user.role_name,
          personal_information: user.personal_information,
        }));
        setProfiles(fetchedProfiles);
        console.log('Fetched artist and printing provider profiles:', fetchedProfiles);
      } else {
        console.error('Unexpected response format:', response.data);
        setProfiles([]);
      }
    } catch (error) {
      console.error('Error fetching artist and printing provider profiles:', error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty array ensures this function is stable and does not change on re-renders.

  return (
    <ArtistAndProviderContext.Provider value={{ profiles, fetchArtistAndProviderProfiles, loading }}>
      {children}
    </ArtistAndProviderContext.Provider>
  );
};

// Custom hook to use the ArtistAndProviderContext
export const useArtistAndProvider = (): ArtistAndProviderContextProps => {
  const context = useContext(ArtistAndProviderContext);
  if (!context) {
    throw new Error('useArtistAndProvider must be used within an ArtistAndProviderProvider');
  }
  return context;
};
