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
  ): Promise<{ success: boolean; data: Comment | null; error: string | null }> => {
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
        
        // Return user-friendly error messages
        let userMessage = 'Failed to post your comment. Please try again.';
        
        if (error.code === 'PGRST116') {
          userMessage = 'Database configuration error. Please contact support.';
        } else if (error.code === '42501') {
          userMessage = 'Permission denied. Please check your database settings.';
        } else if (error.message?.includes('column') && error.message?.includes('does not exist')) {
          userMessage = 'Database setup incomplete. Please contact the administrator.';
        } else if (error.message?.includes('violates check constraint')) {
          userMessage = 'Invalid email format. Please enter a valid email address.';
        } else if (error.message?.includes('violates not-null constraint')) {
          userMessage = 'Please fill in all required fields.';
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          userMessage = 'Network error. Please check your internet connection and try again.';
        }
        
        return { success: false, data: null, error: userMessage };
      }

      console.log('✅ Comment inserted successfully:', data);
      return { success: true, data, error: null };
    } catch (error: any) {
      console.error('❌ Exception adding comment:', error);
      const userMessage = error?.message?.includes('network') || error?.message?.includes('fetch')
        ? 'Network error. Please check your internet connection and try again.'
        : 'An unexpected error occurred. Please try again later.';
      return { success: false, data: null, error: userMessage };
    }
  },

  // Update a comment (users can only update their own comments by email)
  updateComment: async (
    commentId: string,
    userEmail: string,
    newContent: string
  ): Promise<{ success: boolean; data: Comment | null; error: string | null }> => {
    try {
      console.log('✏️ Attempting to update comment:', { commentId, userEmail, newContent });
      
      const { data, error } = await supabase
        .from('comments')
        .update({ content: newContent })
        .eq('id', commentId)
        .eq('author_email', userEmail)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating comment:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let userMessage = 'Failed to update comment. Please try again.';
        
        if (error.code === '42501') {
          userMessage = 'You don\'t have permission to update this comment.';
        } else if (error.message?.includes('violates row-level security')) {
          userMessage = 'You can only update your own comments.';
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          userMessage = 'Network error. Please check your internet connection and try again.';
        }
        
        return { success: false, data: null, error: userMessage };
      }

      console.log('✅ Comment updated successfully:', data);
      return { success: true, data, error: null };
    } catch (error: any) {
      console.error('❌ Exception updating comment:', error);
      const userMessage = error?.message?.includes('network') || error?.message?.includes('fetch')
        ? 'Network error. Please check your internet connection and try again.'
        : 'An unexpected error occurred. Please try again later.';
      return { success: false, data: null, error: userMessage };
    }
  },

  // Delete a comment (users can only delete their own comments by email)
  deleteComment: async (
    commentId: string,
    userEmail: string
  ): Promise<{ success: boolean; error: string | null }> => {
    try {
      console.log('🗑️ Attempting to delete comment:', { commentId, userEmail });
      
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('author_email', userEmail);

      if (error) {
        console.error('❌ Error deleting comment:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let userMessage = 'Failed to delete comment. Please try again.';
        
        if (error.code === '42501') {
          userMessage = 'You don\'t have permission to delete this comment.';
        } else if (error.message?.includes('violates row-level security')) {
          userMessage = 'You can only delete your own comments.';
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          userMessage = 'Network error. Please check your internet connection and try again.';
        }
        
        return { success: false, error: userMessage };
      }

      console.log('✅ Comment deleted successfully');
      return { success: true, error: null };
    } catch (error: any) {
      console.error('❌ Exception deleting comment:', error);
      const userMessage = error?.message?.includes('network') || error?.message?.includes('fetch')
        ? 'Network error. Please check your internet connection and try again.'
        : 'An unexpected error occurred. Please try again later.';
      return { success: false, error: userMessage };
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

