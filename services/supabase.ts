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
      console.log('🔍 Fetching comments for postId:', postId);
      
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching comments:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        if (error.code === 'PGRST116') {
          console.error('❌ Table might not exist. Check your Supabase setup.');
        } else if (error.code === '42501') {
          console.error('❌ Permission denied. Check your RLS policies.');
        }
        
        return [];
      }

      console.log('✅ Fetched comments:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Exception fetching comments:', error);
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
      const insertData = {
        post_id: postId,
        author_name: authorName,
        author_email: authorEmail,
        content: content,
      };
      
      console.log('🔍 Attempting to insert comment:', insertData);
      
      const { data, error } = await supabase
        .from('comments')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding comment:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Attempted to insert:', insertData);
        
        // Provide more helpful error messages
        if (error.code === 'PGRST116') {
          console.error('❌ This error usually means the table or column doesn\'t exist. Please run the SQL fix script.');
        } else if (error.code === '42501') {
          console.error('❌ Permission denied. Check your RLS policies in Supabase.');
        } else if (error.message?.includes('column') && error.message?.includes('does not exist')) {
          console.error('❌ Column missing! Please run the SQL fix script to add the content column.');
        }
        
        return null;
      }

      console.log('✅ Comment inserted successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Exception adding comment:', error);
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

