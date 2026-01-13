import React, { useState, useEffect } from 'react';
import { commentService } from '../../services/supabase';
import { Trash2 } from 'lucide-react';

export interface Comment {
  id: string;
  authorName: string;
  email: string;
  content: string;
  createdAt: Date;
}

interface CommentsSectionProps {
  postId?: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  // Load user's email from localStorage or form
  useEffect(() => {
    const savedEmail = localStorage.getItem('commentUserEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  // Load comments from Supabase when component mounts or postId changes
  useEffect(() => {
    const loadComments = async () => {
      if (!postId) {
        console.warn('⚠️ CommentsSection: No postId provided');
        setIsLoading(false);
        return;
      }

      console.log('🔄 Loading comments for postId:', postId);
      setIsLoading(true);
      try {
        const supabaseComments = await commentService.getCommentsByPostId(postId);
        console.log('✅ Loaded comments from Supabase:', supabaseComments);
        
        // Transform Supabase format to component format
        const transformedComments: Comment[] = supabaseComments.map((c) => ({
          id: c.id,
          authorName: c.author_name,
          email: c.author_email,
          content: c.content,
          createdAt: new Date(c.created_at),
        }));
        
        console.log('✅ Transformed comments:', transformedComments);
        setComments(transformedComments);
      } catch (error) {
        console.error('❌ Error loading comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  // Get initials for avatar
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format relative time
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  };

  // Check if form is valid
  const isFormValid = name.trim() !== '' && email.trim() !== '' && comment.trim() !== '';
  const isEmailValid = email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !isEmailValid || !postId) {
      console.warn('⚠️ Form validation failed or missing postId:', { isFormValid, isEmailValid, postId });
      return;
    }

    console.log('📤 Submitting comment:', { postId, name: name.trim(), email: email.trim(), content: comment.trim() });
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await commentService.addComment(
        postId,
        name.trim(),
        email.trim(),
        comment.trim()
      );

      console.log('📥 Response from Supabase:', result);

      if (result.success && result.data) {
        // Transform and add to local state
        const transformedComment: Comment = {
          id: result.data.id,
          authorName: result.data.author_name,
          email: result.data.author_email,
          content: result.data.content,
          createdAt: new Date(result.data.created_at),
        };
        console.log('✅ Comment added successfully:', transformedComment);
        setComments([transformedComment, ...comments]);
        
        // Save user's email to localStorage for future comment deletion
        const userEmailToSave = email.trim().toLowerCase();
        setUserEmail(userEmailToSave);
        localStorage.setItem('commentUserEmail', userEmailToSave);
        
        setName('');
        setEmail('');
        setComment('');
      } else {
        // Show user-friendly error message
        setSubmitError(result.error || 'Failed to post comment. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error submitting comment:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string, commentEmail: string) => {
    // Check if user can delete this comment
    const currentUserEmail = userEmail || email.trim().toLowerCase();
    const commentEmailLower = commentEmail.toLowerCase();
    
    if (currentUserEmail !== commentEmailLower) {
      setDeleteError('You can only delete your own comments.');
      return;
    }

    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    setDeletingCommentId(commentId);
    setDeleteError(null);

    try {
      const result = await commentService.deleteComment(commentId, currentUserEmail);

      if (result.success) {
        // Remove comment from local state
        setComments(comments.filter(c => c.id !== commentId));
      } else {
        setDeleteError(result.error || 'Failed to delete comment. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error deleting comment:', error);
      setDeleteError('An unexpected error occurred. Please try again later.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Check if user can delete a comment
  const canDeleteComment = (commentEmail: string): boolean => {
    const currentUserEmail = userEmail || email.trim().toLowerCase();
    return currentUserEmail !== '' && currentUserEmail === commentEmail.toLowerCase();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 pt-12 border-t border-gray-100 dark:border-white/5">
      {/* Section Title */}
      <h2 className="text-2xl font-semibold text-custom-black dark:text-white mb-8">
        Comments ({comments.length})
      </h2>

      {/* Comments List */}
      {isLoading ? (
        <div className="mb-12 py-12 text-center">
          <p className="text-custom-mediumGray dark:text-custom-darkTextMuted text-base">
            Loading comments...
          </p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-8 mb-12">
          {comments.map((item) => {
            const canDelete = canDeleteComment(item.email);
            const isDeleting = deletingCommentId === item.id;
            
            return (
              <div key={item.id} className="flex gap-4 animate-fade-in group">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {getInitials(item.authorName)}
                    </span>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-custom-black dark:text-white">
                        {item.authorName}
                      </span>
                      <span className="text-xs text-custom-mediumGray dark:text-custom-darkTextMuted">
                        {getRelativeTime(item.createdAt)}
                      </span>
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(item.id, item.email)}
                        disabled={isDeleting}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete comment"
                      >
                        {isDeleting ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-custom-black dark:text-gray-300 leading-relaxed">
                    {item.content}
                  </p>
                  {deleteError && deletingCommentId === item.id && (
                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                      {deleteError}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-12 py-12 text-center">
          <p className="text-custom-mediumGray dark:text-custom-darkTextMuted text-base">
            No comments yet. Be the first one!
          </p>
        </div>
      )}

      {/* Comment Form */}
      <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-custom-black dark:text-white mb-6">
          Join the discussion
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-custom-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => {
                const newEmail = e.target.value;
                setEmail(newEmail);
                // Update userEmail in real-time so users can delete their comments
                const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim());
                if (newEmail.trim() && emailValid) {
                  setUserEmail(newEmail.trim().toLowerCase());
                }
              }}
              className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-black/20 border ${
                email && !isEmailValid
                  ? 'border-red-300 dark:border-red-800'
                  : 'border-gray-200 dark:border-white/10'
              } text-custom-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200`}
            />
            {email && !isEmailValid && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                Please enter a valid email address
              </p>
            )}
            {email && isEmailValid && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                You'll be able to delete your comments using this email
              </p>
            )}
          </div>

          {/* Comment Textarea */}
          <div>
            <textarea
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-custom-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-y"
            />
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid || !isEmailValid || isSubmitting || !postId}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isFormValid && isEmailValid && !isSubmitting && postId
                  ? 'bg-custom-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-custom-darkBg'
                  : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

