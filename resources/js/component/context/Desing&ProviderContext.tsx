import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import apiService from '../services/apiService';
import { useAuth, User } from '../context/AuthContext';

interface Image {
  image_id: number;
  image_path: string;
}

interface PersonalInformation {
  firstname: string;
  lastname: string;
  profilepicture: string;
  coverphoto: string;
  zipcode: string;
}

interface Rating {
  rating: number; // Assuming rating is a number from 1 to 5
}

interface Tag {
  id: number;
  name: string;
}


interface Post {
  post_id: number;
  title: string;
  content: string;
  user_id: number;
  images: Image[];
  price: string;
  created_at: string;
  updated_at: string;
  user: {
    username: string;
    role: {
      rolename: string;
    };
    personal_information: PersonalInformation;
  };
  average_rating?: number; // Add an optional property for average rating
  tags: Tag[];
}

interface DesignerProviderContextType {
  fetchDesignerPosts: () => Promise<Post[]>;
  fetchProviderPosts: () => Promise<Post[]>;
  user: User | null;
}

const DesignerProviderContext = createContext<DesignerProviderContextType | undefined>(undefined);

export const DesignerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const fetchDesignerPosts = useCallback(async () => {
    try {
      const response = await apiService.get<{ posts: Post[] }>(
        `/designerposts`, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
  
      console.log("Designer Posts Response:", response.data);
  
      // Fetch ratings for each post and calculate average rating
      const fetchedPosts = await Promise.all(response.data.posts.map(async (post) => {
        // Fetch ratings for the post
        const ratingsResponse = await apiService.get<Rating[]>(`/ratings/${post.user_id}`);
        const ratings = ratingsResponse.data;
  
        // Calculate average rating if ratings exist
        const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length : 0;
  
        return {
          ...post,
          average_rating: averageRating, // Add the average rating to the post
          images: post.images || [],
          tags: post.tags || [], // Directly use the tags from the post object
          user: {
            ...post.user,
            personal_information: post.user.personal_information || {
              firstname: "Unknown",
              lastname: "Unknown",
              profilepicture: "default.png",
              coverphoto: "default.jpg",
              zipcode: "00000",
            },
          },
        };
      }));
  
      return fetchedPosts;
    } catch (error) {
      console.error('Error fetching designer posts:', error);
      return [];
    }
  }, []);
  
  
  const fetchProviderPosts = useCallback(async () => {
    try {
      const response = await apiService.get<{ posts: Post[] }>(
        `/providerposts`, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
  
      // Fetch ratings for each post and calculate average rating
      const fetchedPosts = await Promise.all(response.data.posts.map(async (post) => {
        // Fetch ratings for the post
        const ratingsResponse = await apiService.get<Rating[]>(`/ratings/${post.user_id}`);
        const ratings = ratingsResponse.data;
  
        // Calculate average rating if ratings exist
        const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length : 0;
  
        return {
          ...post,
          average_rating: averageRating, // Add the average rating to the post
          images: post.images || [],
          tags: post.tags || [], // Directly use the tags from the post object
          user: {
            ...post.user,
            personal_information: post.user.personal_information || {
              firstname: "Unknown",
              lastname: "Unknown",
              profilepicture: "default.png",
              coverphoto: "default.jpg",
              zipcode: "00000",
            },
          },
        };
      }));
  
      return fetchedPosts;
    } catch (error) {
      console.error('Error fetching provider posts:', error);
      return [];
    }
  }, []);
  
  
  return (
    <DesignerProviderContext.Provider value={{ fetchDesignerPosts, fetchProviderPosts, user }}>
      {children}
    </DesignerProviderContext.Provider>
  );
};

export const useDesignerProviderContext = () => {
  const context = useContext(DesignerProviderContext);
  if (!context) {
    throw new Error('useDesignerProviderContext must be used within a DesignerProvider');
  }
  return context;
};
