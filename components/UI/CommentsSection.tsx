import React, { useState, useEffect } from 'react';
import { commentService, Comment as SupabaseComment } from '../../services/supabase';

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
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  // Convert Supabase comment to component format
  const convertComment = (supabaseComment: SupabaseComment): Comment => ({
    id: supabaseComment.id,
    authorName: supabaseComment.author_name,
    email: supabaseComment.author_email,
    content: supabaseComment.content,
    createdAt: new Date(supabaseComment.created_at),
  });

  // Fetch comments on mount and when postId changes
  useEffect(() => {
    if (!postId) {
      setIsLoading(false);
      return;
    }

    const loadComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const supabaseComments = await commentService.getCommentsByPostId(postId);
        const convertedComments = supabaseComments.map(convertComment);
        setComments(convertedComments);
      } catch (err) {
        console.error('Error loading comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();

    // Subscribe to real-time updates
    const unsubscribe = commentService.subscribeToComments(postId, (newComment) => {
      setComments((prev) => [convertComment(newComment), ...prev]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
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
    
    if (!isFormValid || !isEmailValid || !postId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newComment = await commentService.addComment(
        postId,
        name.trim(),
        email.trim(),
        comment.trim()
      );

      if (newComment) {
        // Comment will be added via real-time subscription, but we can also add it immediately
        setComments((prev) => [convertComment(newComment), ...prev]);
        setName('');
        setEmail('');
        setComment('');
      } else {
        setError('Failed to post comment. Please try again.');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 pt-12 border-t border-gray-100 dark:border-white/5">
      {/* Section Title */}
      <h2 className="text-2xl font-semibold text-custom-black dark:text-white mb-8">
        Comments ({comments.length})
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="mb-12 py-12 text-center">
          <p className="text-custom-mediumGray dark:text-custom-darkTextMuted text-base">
            Loading comments...
          </p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-8 mb-12">
          {comments.map((item) => (
            <div key={item.id} className="flex gap-4 animate-fade-in">
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-custom-black dark:text-white">
                    {item.authorName}
                  </span>
                  <span className="text-xs text-custom-mediumGray dark:text-custom-darkTextMuted">
                    {getRelativeTime(item.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-custom-black dark:text-gray-300 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
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
              onChange={(e) => setEmail(e.target.value)}
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

