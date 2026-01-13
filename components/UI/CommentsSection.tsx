import React, { useState, useEffect } from 'react';
import { commentService } from '../../services/supabase';
import { Trash2, Edit2, Check, X } from 'lucide-react';

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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userEmails, setUserEmails] = useState<Set<string>>(new Set()); // Store all emails user has used

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Load user's emails from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('commentUserEmail');
    const savedEmails = localStorage.getItem('commentUserEmails'); // Store multiple emails
    
    if (savedEmail) {
      console.log('📧 Loaded saved email from localStorage:', savedEmail);
      setUserEmail(savedEmail);
      const emailsSet = new Set([savedEmail.toLowerCase().trim()]);
      if (savedEmails) {
        try {
          const emailsArray = JSON.parse(savedEmails);
          emailsArray.forEach((e: string) => emailsSet.add(e.toLowerCase().trim()));
        } catch (e) {
          console.error('Error parsing saved emails:', e);
        }
      }
      setUserEmails(emailsSet);
      console.log('📧 All user emails:', Array.from(emailsSet));
    } else {
      console.log('📧 No saved email found in localStorage');
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
  const shouldShowEmailError = (emailTouched || submitAttempted) && email.trim() !== '' && !isEmailValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitAttempted(true);
    
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
        
        // Save user's email to localStorage for future comment deletion/editing
        const userEmailToSave = email.trim().toLowerCase();
        setUserEmail(userEmailToSave);
        
        // Add to emails set
        const updatedEmails = new Set(userEmails);
        updatedEmails.add(userEmailToSave);
        setUserEmails(updatedEmails);
        
        // Save to localStorage
        localStorage.setItem('commentUserEmail', userEmailToSave);
        localStorage.setItem('commentUserEmails', JSON.stringify(Array.from(updatedEmails)));
        console.log('📧 Email saved for delete/edit functionality:', userEmailToSave);
        console.log('📧 All user emails:', Array.from(updatedEmails));
        
        // Reset form and validation states
        setName('');
        setEmail('');
        setComment('');
        setEmailTouched(false);
        setSubmitAttempted(false);
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
    if (!canModifyComment(commentEmail)) {
      const currentUserEmail = userEmail || email.trim().toLowerCase();
      const commentEmailLower = commentEmail.toLowerCase().trim();
      
      if (!currentUserEmail && userEmails.size === 0) {
        setDeleteError('Please enter your email address in the form below to delete comments.');
      } else {
        setDeleteError(`You can only delete your own comments. Email mismatch detected.`);
      }
      return;
    }

    const currentUserEmail = userEmail || email.trim().toLowerCase();
    const commentEmailLower = commentEmail.toLowerCase().trim();
    
    console.log('🗑️ Delete attempt:', {
      currentUserEmail,
      commentEmail: commentEmailLower,
      allUserEmails: Array.from(userEmails),
      match: canModifyComment(commentEmail)
    });

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
        console.log('✅ Comment deleted successfully from UI');
      } else {
        console.error('❌ Delete failed:', result.error);
        setDeleteError(result.error || 'Failed to delete comment. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error deleting comment:', error);
      setDeleteError('An unexpected error occurred. Please try again later.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Check if user owns a comment (can delete/edit)
  const canModifyComment = (commentEmail: string): boolean => {
    const commentEmailLower = commentEmail.toLowerCase().trim();
    
    // Check if comment email matches any of the user's emails
    const currentUserEmail = userEmail || email.trim().toLowerCase();
    const allUserEmails = new Set([
      ...Array.from(userEmails),
      ...(currentUserEmail ? [currentUserEmail] : []),
      ...(email.trim() ? [email.trim().toLowerCase()] : [])
    ]);
    
    const canModify = allUserEmails.has(commentEmailLower);
    
    // Debug logging
    console.log('🔍 Checking modify permission:', {
      commentEmail: commentEmailLower,
      allUserEmails: Array.from(allUserEmails),
      canModify,
      userEmailFromState: userEmail,
      emailFromForm: email.trim().toLowerCase(),
      storedEmails: Array.from(userEmails)
    });
    
    return canModify;
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setUpdateError(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
    setUpdateError(null);
  };

  const handleSaveEdit = async (commentId: string, commentEmail: string) => {
    if (!editContent.trim()) {
      setUpdateError('Comment cannot be empty.');
      return;
    }

    const currentUserEmail = userEmail || email.trim().toLowerCase();
    if (!currentUserEmail) {
      setUpdateError('Please enter your email address to edit comments.');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const result = await commentService.updateComment(commentId, currentUserEmail, editContent.trim());

      if (result.success && result.data) {
        // Update comment in local state
        setComments(comments.map(c => 
          c.id === commentId 
            ? {
                ...c,
                content: result.data!.content,
              }
            : c
        ));
        setEditingCommentId(null);
        setEditContent('');
        console.log('✅ Comment updated successfully in UI');
      } else {
        setUpdateError(result.error || 'Failed to update comment. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error updating comment:', error);
      setUpdateError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsUpdating(false);
    }
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
            const canModify = canModifyComment(item.email);
            const isDeleting = deletingCommentId === item.id;
            const isEditing = editingCommentId === item.id;
            
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
                    {canModify && !isEditing && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 dark:text-blue-400 transition-colors"
                          title="Edit your comment"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            console.log('🗑️ Delete button clicked for comment:', item.id);
                            handleDelete(item.id, item.email);
                          }}
                          disabled={isDeleting}
                          className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Delete your comment"
                        >
                          {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-custom-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-y text-sm"
                        disabled={isUpdating}
                      />
                      {updateError && (
                        <p className="text-xs text-red-500 dark:text-red-400">
                          {updateError}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveEdit(item.id, item.email)}
                          disabled={isUpdating || !editContent.trim()}
                          className="px-3 py-1.5 rounded-md bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                        >
                          {isUpdating ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              Save
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="px-3 py-1.5 rounded-md bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-300 dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-custom-black dark:text-gray-300 leading-relaxed">
                        {item.content}
                      </p>
                      {deleteError && deletingCommentId === item.id && (
                        <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                          {deleteError}
                        </p>
                      )}
                    </>
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
              onFocus={() => setEmailTouched(false)}
              onBlur={() => setEmailTouched(true)}
              onChange={(e) => {
                const newEmail = e.target.value;
                setEmail(newEmail);
                // Update userEmail in real-time so users can delete/edit their comments
                const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim());
                if (newEmail.trim() && emailValid) {
                  const emailToSave = newEmail.trim().toLowerCase();
                  setUserEmail(emailToSave);
                  
                  // Add to emails set
                  const updatedEmails = new Set(userEmails);
                  updatedEmails.add(emailToSave);
                  setUserEmails(updatedEmails);
                  
                  // Save to localStorage
                  localStorage.setItem('commentUserEmail', emailToSave);
                  localStorage.setItem('commentUserEmails', JSON.stringify(Array.from(updatedEmails)));
                  console.log('📧 Email saved for delete/edit functionality:', emailToSave);
                }
              }}
              className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-black/20 border ${
                shouldShowEmailError
                  ? 'border-red-300 dark:border-red-800'
                  : 'border-gray-200 dark:border-white/10'
              } text-custom-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200`}
            />
            {shouldShowEmailError && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                Please enter a valid email address
              </p>
            )}
            {email && isEmailValid && !shouldShowEmailError && (
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

