import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { Loader2, Check, AlertCircle } from 'lucide-react';

// ⚙️ CONFIGURATION: Substack publication name
// Your Substack: https://mahshidsadri1.substack.com
const SUBSTACK_PUBLICATION = 'mahshidsadri1';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // We use mode: 'no-cors' to bypass the browser's CORS restriction.
      // This sends the request to Substack, but returns an "opaque" response that we cannot read.
      // We assume if the fetch completes without throwing a network error, the submission was received.
      const substackUrl = `https://${SUBSTACK_PUBLICATION}.substack.com/api/v1/free`;
      console.log('📧 Subscribing to Substack:', substackUrl);
      
      await fetch(substackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}`,
        mode: 'no-cors',
      });

      // With no-cors, response.ok is not accessible/always false.
      // We treat the completion of the promise as success.
      setStatus('success');
      setMessage('Thanks! You are subscribed.');
      setEmail('');
      
      // Reset state after a delay
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage('Subscription failed. Please check your connection and try again.');
    }
  };

  return (
    <section id="newsletter" className="py-32 bg-custom-lightGray dark:bg-custom-darkBg transition-colors duration-500 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-gray-200/30 via-gray-100/30 to-transparent dark:from-white/5 dark:via-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-custom-black dark:text-white tracking-tight mb-6">
          Stay Ahead of the Curve.
        </h2>
        
        <p className="text-lg text-custom-mediumGray dark:text-custom-darkTextMuted mb-12 max-w-xl mx-auto font-light">
          Join 15,000+ designers and developers. A weekly digest of the best AI tools and thoughts, directly to your inbox.
        </p>

        <form className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto relative" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <input 
              type="email" 
              placeholder="email@example.com" 
              className={`w-full px-6 py-4 rounded-full bg-white dark:bg-white/5 border outline-none text-custom-black dark:text-white placeholder-gray-400 shadow-sm focus:shadow-lg transition-all duration-300 text-center sm:text-left ${
                status === 'error' 
                  ? 'border-red-500 focus:border-red-500' 
                  : status === 'success'
                  ? 'border-green-500 focus:border-green-500'
                  : 'border-transparent focus:border-gray-200 dark:focus:border-gray-700'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full sm:w-auto py-4 px-8 shadow-xl min-w-[140px]"
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : status === 'success' ? (
              <span className="flex items-center gap-2">Joined <Check size={18} /></span>
            ) : (
              'Join Now'
            )}
          </Button>
        </form>
        
        {/* Status Message */}
        <div className={`mt-6 h-6 transition-all duration-300 ${status === 'idle' ? 'opacity-0' : 'opacity-100'}`}>
           {status === 'success' && (
             <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
               <Check size={14} /> {message}
             </p>
           )}
           {status === 'error' && (
             <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
               <AlertCircle size={14} /> {message}
             </p>
           )}
        </div>
        
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-600 uppercase tracking-widest">
          No Spam. Unsubscribe Anytime.
        </p>
      </div>
    </section>
  );
};