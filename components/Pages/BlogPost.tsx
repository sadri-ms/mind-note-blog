
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Bookmark, Check, Twitter, Linkedin, Link as LinkIcon, Share, Loader2 } from 'lucide-react';
import { BlogPost as BlogPostType } from '../../types';
import { sanityService } from '../../services/sanity';
import { Button } from '../UI/Button';
import { BlogCard } from '../UI/BlogCard';
import { Newsletter } from '../Sections/Newsletter';

interface BlogPostProps {
  onPostClick: (postId: string) => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ onPostClick }) => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  if (!postId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-custom-darkBg">
        <h2 className="text-2xl font-semibold mb-4 text-custom-black dark:text-white">Post ID is required</h2>
        <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
      </div>
    );
  }

  const handleBack = () => {
    window.scrollTo(0, 0);
    navigate('/blog');
  };
  const [post, setPost] = useState<BlogPostType | undefined>(undefined);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [shareText, setShareText] = useState('Copy Link');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [postId]);

  // Fetch Post and Related Data
  useEffect(() => {
    const loadPostData = async () => {
      setIsLoading(true);
      try {
        const fetchedPost = await sanityService.getPostById(postId);
        setPost(fetchedPost);

        if (fetchedPost) {
          // In a real Sanity app, you'd write a groq query for related posts.
          // Here we mock it by fetching all and filtering.
          const all = await sanityService.getAllPosts();
          let related = all.filter(p => p.category === fetchedPost.category && p.id !== fetchedPost.id);
          if (related.length < 3) {
             const others = all.filter(p => p.id !== fetchedPost.id && !related.find(r => r.id === p.id));
             related = [...related, ...others];
          }
          setRelatedPosts(related.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching post", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostData();
  }, [postId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    setIsSaved(savedPosts.includes(postId));
  }, [postId]);

  const toggleSave = () => {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    let newSavedPosts;
    
    if (isSaved) {
      newSavedPosts = savedPosts.filter((id: string) => id !== postId);
    } else {
      newSavedPosts = [...savedPosts, postId];
    }
    
    localStorage.setItem('savedPosts', JSON.stringify(newSavedPosts));
    setIsSaved(!isSaved);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText('Copied!');
    setTimeout(() => {
      setShareText('Copy Link');
      setShowShareMenu(false);
    }, 1000);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTextContent = post ? `Check out "${post.title}" on MindNote` : '';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-custom-darkBg">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-custom-darkBg">
        <h2 className="text-2xl font-semibold mb-4 text-custom-black dark:text-white">Post not found</h2>
        <Button onClick={handleBack}>Back to Blog</Button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white dark:bg-custom-darkBg animate-fade-in relative transition-colors duration-500">
      
      {/* Top Container with Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 mb-8">
         <button 
          onClick={handleBack}
          className="group inline-flex items-center gap-2 text-custom-mediumGray hover:text-custom-black dark:text-custom-darkTextMuted dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-base font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left">
          <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-custom-mediumGray dark:text-custom-darkTextMuted text-xs font-medium">
              <Calendar size={12} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1 text-custom-mediumGray dark:text-custom-darkTextMuted text-xs font-medium">
              <Clock size={12} />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-custom-black dark:text-white tracking-tight leading-[1.1] mb-8">
            {post.title}
          </h1>

          <p className="text-xl md:text-2xl text-custom-mediumGray dark:text-custom-darkTextMuted font-light leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl mb-10 shadow-lg bg-gray-100 dark:bg-gray-800">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[1.5s] ease-out"
          />
        </div>

        {/* Author Bio Section */}
        <div className="max-w-2xl mx-auto flex items-center gap-4 mb-12 border-b border-gray-100 dark:border-gray-800 pb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-sm flex-shrink-0">
             <img src="https://picsum.photos/seed/mahshid/400/500" alt="Mahshid Sadri" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-custom-black dark:text-white">Mahshid Sadri</p>
             <p className="text-xs text-custom-mediumGray dark:text-custom-darkTextMuted leading-relaxed max-w-sm">
               Automation Expert & AI Enthusiast. Passionate about streamlining complex workflows and the future of human-AI collaboration.
             </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-2xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500">
          <p className="lead text-xl text-custom-black dark:text-gray-200 font-medium mb-8">
            This is a placeholder for the full article content. In a real application, this would be populated from a CMS or a markdown file. 
            The design focuses on readability, with generous line height and optimal characters per line.
          </p>

          <h2 className="text-3xl font-semibold mt-12 mb-6 text-custom-black dark:text-white">Introduction</h2>
          <p className="text-custom-mediumGray dark:text-gray-400 mb-6 leading-relaxed">
            Artificial Intelligence has evolved rapidly over the past decade. From simple rule-based systems to complex neural networks capable of 
            understanding context and generating creative content, the landscape is shifting beneath our feet.
          </p>
          <p className="text-custom-mediumGray dark:text-gray-400 mb-6 leading-relaxed">
            In this article, we explore the underlying mechanisms that make this possible. We'll look at the architecture of modern transformers, 
            understand the importance of data quality, and discuss the ethical implications of deploying these models in production environments.
          </p>

          <h2 className="text-3xl font-semibold mt-12 mb-6 text-custom-black dark:text-white">The Core Concepts</h2>
          <p className="text-custom-mediumGray dark:text-gray-400 mb-6 leading-relaxed">
            At the heart of every modern AI system lies the concept of a "Model". A model is essentially a mathematical representation of a real-world process. 
            By feeding it vast amounts of data, the model learns to recognize patterns that are often too complex for human programmers to define explicitly.
          </p>
          
          <blockquote className="border-l-4 border-blue-500 pl-6 italic my-10 text-xl text-gray-700 dark:text-gray-300">
            "The future belongs to those who understand the harmony between human intuition and machine precision."
          </blockquote>

          <p className="text-custom-mediumGray dark:text-gray-400 mb-6 leading-relaxed">
            However, power comes with responsibility. As we integrate these systems into healthcare, finance, and law, we must ensure they remain transparent 
            and fair. The "Black Box" problem remains one of the biggest challenges in the field today.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-custom-black dark:text-white">Looking Ahead</h3>
          <p className="text-custom-mediumGray dark:text-gray-400 mb-6 leading-relaxed">
            As we move forward, the collaboration between different modalities—text, image, audio—will create even more immersive experiences. 
            We are just scratching the surface of what is possible.
          </p>
        </div>

        {/* Footer / Share & Save */}
        <div className="max-w-2xl mx-auto mt-16 pt-8 border-t border-custom-border dark:border-custom-borderDark flex justify-between items-center gap-6 relative">
          
          {/* Share Menu */}
          <div className="relative" ref={shareMenuRef}>
            <button 
               onClick={() => setShowShareMenu(!showShareMenu)}
               className="flex items-center gap-2 text-sm font-medium text-custom-mediumGray hover:text-custom-black dark:text-custom-darkTextMuted dark:hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
             >
               <Share size={18} />
               <span>Share</span>
             </button>

             {/* Popup Menu */}
             {showShareMenu && (
               <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-custom-darkCard rounded-xl shadow-xl border border-gray-100 dark:border-white/10 p-2 z-20 animate-fade-in-up">
                 <a 
                   href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextContent)}&url=${encodeURIComponent(shareUrl)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-3 w-full px-3 py-2 text-sm text-custom-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg transition-colors"
                   onClick={() => setShowShareMenu(false)}
                 >
                   <Twitter size={16} /> Twitter (X)
                 </a>
                 <a 
                   href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-3 w-full px-3 py-2 text-sm text-custom-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg transition-colors"
                   onClick={() => setShowShareMenu(false)}
                 >
                   <Linkedin size={16} /> LinkedIn
                 </a>
                 <button 
                   onClick={handleCopyLink}
                   className="flex items-center gap-3 w-full px-3 py-2 text-sm text-custom-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg transition-colors"
                 >
                   {shareText === 'Copied!' ? <Check size={16} className="text-green-500" /> : <LinkIcon size={16} />} 
                   {shareText}
                 </button>
               </div>
             )}
          </div>

          <div>
            <button 
              onClick={toggleSave}
              className={`flex items-center gap-2 text-sm font-medium transition-colors px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 ${isSaved ? 'text-blue-600 dark:text-blue-400' : 'text-custom-mediumGray hover:text-custom-black dark:text-custom-darkTextMuted dark:hover:text-white'}`}
            >
               <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} /> 
               {isSaved ? 'Saved' : 'Save'}
             </button>
          </div>
        </div>

      </div>

      {/* Related Posts Section */}
      <div className="max-w-7xl mx-auto mt-24 pt-12 pb-24 border-t border-custom-border dark:border-custom-borderDark px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline mb-10">
           <h3 className="text-2xl font-semibold text-custom-black dark:text-white">Read Next</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPosts.map(relatedPost => (
            <BlogCard 
              key={relatedPost.id} 
              post={relatedPost} 
              onClick={onPostClick} 
            />
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </article>
  );
};
