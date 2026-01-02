import React, { useState } from 'react';

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
  // Mock data - in real implementation, this would come from props or API
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      authorName: 'Alex Chen',
      email: 'alex@example.com',
      content: 'This was an incredible read! The explanation of transformer architecture was crystal clear.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      authorName: 'Sarah Jones',
      email: 'sarah@example.com',
      content: 'I firmly believe we need more regulation before deploying these models in critical infrastructure.',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
  ]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !isEmailValid) return;

    // In a real implementation, this would make an API call
    // For now, just add to local state
    const newComment: Comment = {
      id: Date.now().toString(),
      authorName: name.trim(),
      email: email.trim(),
      content: comment.trim(),
      createdAt: new Date(),
    };

    setComments([newComment, ...comments]);
    setName('');
    setEmail('');
    setComment('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 pt-12 border-t border-gray-100 dark:border-white/5">
      {/* Section Title */}
      <h2 className="text-2xl font-semibold text-custom-black dark:text-white mb-8">
        Comments ({comments.length})
      </h2>

      {/* Comments List */}
      {comments.length > 0 ? (
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
              disabled={!isFormValid || !isEmailValid}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isFormValid && isEmailValid
                  ? 'bg-custom-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-custom-darkBg'
                  : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

