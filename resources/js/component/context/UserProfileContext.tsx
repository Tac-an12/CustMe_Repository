import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';

interface ArtistProvider {
  id: number;
  name: string;
  profilePicture: string | null;
  roleName?: string;
  bio?: string;
}

interface PersonalInformation {
  firstname: string;
  lastname: string;
  profilepicture: string | null;
  coverphoto: string | null;
  zipcode: string;
  artistPrintingProviders?: ArtistProvider[];
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  verified: boolean;
  roleName?: string;
  personalInformation: PersonalInformation | null;
  location?: {
    latitude: number;
    longitude: number;
  } | null;
  aboutMe?: string;
  printingSkills?: string[];
  userSkills?: string[];
}

interface UserProfileContextProps {
  userProfile: UserProfile | null;
  fetchUserProfile: () => Promise<void>;
  fetchUserProfileById: (userId: number) => Promise<UserProfile | null>;
  updateUserProfile: (updatedProfile: Partial<PersonalInformation & { aboutMe?: string; printingSkills?: string[]; userSkills?: string[]; }>) => Promise<void>;
  artistAndPrintingProviders: UserProfile[] | null;
  fetchArtistAndPrintingProviders: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [artistAndPrintingProviders, setArtistAndPrintingProviders] = useState<UserProfile[] | null>(null);
  const { user } = useAuth();

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;

    try {
      const response = await apiService.get(`/users/${user.id}/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const fetchedData = response.data;

      if (fetchedData && fetchedData.user) {
        const location = fetchedData.user.stores.length > 0 ? fetchedData.user.stores[0].location : null;

        const profileData: UserProfile = {
          id: fetchedData.user.id,
          username: fetchedData.user.username,
          email: fetchedData.user.email,
          verified: fetchedData.user.verified === 1,
          roleName: fetchedData.user.role_name,
          personalInformation: {
            firstname: fetchedData.user.personal_information.firstname,
            lastname: fetchedData.user.personal_information.lastname,
            profilepicture: fetchedData.user.personal_information.profilepicture || null,
            coverphoto: fetchedData.user.personal_information.coverphoto || null,
            zipcode: fetchedData.user.personal_information.zipcode,
          },
          location: location || null,
          aboutMe: fetchedData.user.about_me || '',
          printingSkills: fetchedData.user.printing_skills || [],
          userSkills: fetchedData.user.user_skills || [],
        };

        setUserProfile(profileData);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUserProfile(null);
    }
  }, [user]);

  const fetchUserProfileById = useCallback(async (userId: number) => {
    try {
      const response = await apiService.get(`/users/${userId}/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const fetchedData = response.data;

      if (fetchedData && fetchedData.user) {
        const profileData: UserProfile = {
          id: fetchedData.user.id,
          username: fetchedData.user.username,
          email: fetchedData.user.email,
          verified: fetchedData.user.verified === 1,
          roleName: fetchedData.user.role_name,
          personalInformation: {
            firstname: fetchedData.user.personal_information.firstname,
            lastname: fetchedData.user.personal_information.lastname,
            profilepicture: fetchedData.user.personal_information.profilepicture || null,
            coverphoto: fetchedData.user.personal_information.coverphoto || null,
            zipcode: fetchedData.user.personal_information.zipcode,
          },
          location: null,
          aboutMe: fetchedData.user.about_me || '',
          printingSkills: fetchedData.user.printing_skills || [],
          userSkills: fetchedData.user.user_skills || [],
        };

        return profileData;
      }
    } catch (error) {
      console.error('Failed to fetch user profile by ID:', error);
    }
    return null;
  }, []);

  const updateUserProfile = useCallback(async (updatedProfile: Partial<PersonalInformation & { aboutMe?: string; printingSkills?: string[]; userSkills?: string[]; }>) => {
    if (!user) return;

    try {
      const response = await apiService.put(`/users/${user.id}/profile`, updatedProfile, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      setUserProfile((prevProfile) => {
        if (prevProfile) {
          return {
            ...prevProfile,
            personalInformation: {
              ...prevProfile.personalInformation,
              ...updatedProfile,
            } as PersonalInformation,
            aboutMe: updatedProfile.aboutMe !== undefined ? updatedProfile.aboutMe : prevProfile.aboutMe,
            printingSkills: updatedProfile.printingSkills !== undefined ? updatedProfile.printingSkills : prevProfile.printingSkills,
            userSkills: updatedProfile.userSkills !== undefined ? updatedProfile.userSkills : prevProfile.userSkills,
          };
        }
        return prevProfile;
      });
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  }, [user]);

  const fetchArtistAndPrintingProviders = useCallback(async () => {
    try {
      const response = await apiService.get('/users/artist-and-printing-provider', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const providersData = response.data.users;

      setArtistAndPrintingProviders(providersData);
    } catch (error) {
      console.error('Failed to fetch artist and printing providers:', error);
      setArtistAndPrintingProviders(null);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchArtistAndPrintingProviders();
  }, [fetchUserProfile, fetchArtistAndPrintingProviders]);

  return (
    <UserProfileContext.Provider value={{ userProfile, fetchUserProfile, fetchUserProfileById, updateUserProfile, artistAndPrintingProviders, fetchArtistAndPrintingProviders }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextProps => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
