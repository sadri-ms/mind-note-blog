import { BlogPost, Category } from '../types';
import { ALL_POSTS, CATEGORIES } from '../constants';

// Simple blog service using example data
export const blogService = {
  // Fetch all posts
  getAllPosts: async (): Promise<BlogPost[]> => {
    // Simulate async behavior but return example data immediately
    return Promise.resolve(ALL_POSTS);
  },

  // Fetch a single post by ID
  getPostById: async (id: string): Promise<BlogPost | undefined> => {
    const post = ALL_POSTS.find(post => post.id === id);
    return Promise.resolve(post);
  },

  // Fetch Featured Posts (Top 3)
  getFeaturedPosts: async (): Promise<BlogPost[]> => {
    return Promise.resolve(ALL_POSTS.slice(0, 3));
  },

  // Fetch Latest Posts (Offset by 3)
  getLatestPosts: async (): Promise<BlogPost[]> => {
    return Promise.resolve(ALL_POSTS.slice(3, 6));
  },

  // Get Categories
  getCategories: async (): Promise<Category[]> => {
    return Promise.resolve(CATEGORIES);
  }
};


