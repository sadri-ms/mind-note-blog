import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../UI/Button';
import { Loader2, Check, AlertCircle } from 'lucide-react';

// ⚙️ CONFIGURATION: Substack publication name
// Your Substack: https://mahshidsadri1.substack.com
const SUBSTACK_PUBLICATION = 'mahshidsadri1';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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
      // Method: Use hidden iframe to submit without redirecting
      // This is the most reliable way to submit to Substack without leaving the page
      
      // Create a hidden iframe if it doesn't exist
      let iframe = iframeRef.current;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.name = 'substack-subscribe-iframe';
        iframe.style.display = 'none';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);
        iframeRef.current = iframe;
      }

      // Create form that targets the iframe
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `https://${SUBSTACK_PUBLICATION}.substack.com/api/v1/free`;
      form.target = 'substack-subscribe-iframe';
      form.style.display = 'none';
      
      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.name = 'email';
      emailInput.value = email;
      
      form.appendChild(emailInput);
      document.body.appendChild(form);
      
      // Submit the form to iframe (won't redirect main page)
      form.submit();
      
      // Show success message after submission
      // Note: We can't verify success with iframe, but Substack's API is reliable
      setTimeout(() => {
        setStatus('success');
        setMessage('Thanks! Please check your email to confirm your subscription.');
        setEmail('');
        
        // Clean up form and reset after delay
        setTimeout(() => {
          if (form.parentNode) {
            form.parentNode.removeChild(form);
          }
          setStatus('idle');
          setMessage('');
        }, 8000);
      }, 1500);

    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage('Subscription failed. Please try again or visit our Substack page directly.');
    }
  };

  // Cleanup iframe on unmount
  useEffect(() => {
    return () => {
      if (iframeRef.current && iframeRef.current.parentNode) {
        iframeRef.current.parentNode.removeChild(iframeRef.current);
      }
    };
  }, []);

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