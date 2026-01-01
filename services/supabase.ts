import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://srnkpvgvmcdmzdcsprev.supabase.co';
const supabaseAnonKey = 'sb_publishable_1HOC2SMajeBsvkv7vtBICg_2bcls0Y8';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Comment interface matching database schema
export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
}

// Comment service functions
export const commentService = {
  // Fetch all comments for a specific post
  getCommentsByPostId: async (postId: string): Promise<Comment[]> => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching comments:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  // Add a new comment
  addComment: async (
    postId: string,
    authorName: string,
    authorEmail: string,
    content: string
  ): Promise<Comment | null> => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            author_name: authorName,
            author_email: authorEmail,
            content: content,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding comment:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Attempted to insert:', { post_id: postId, author_name: authorName, author_email: authorEmail, content: content });
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  },

  // Subscribe to real-time comment updates
  subscribeToComments: (
    postId: string,
    callback: (comment: Comment) => void
  ) => {
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          callback(payload.new as Comment);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};

