import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Home } from './components/Pages/Home';
import { Blog } from './components/Pages/Blog';
import { Topics } from './components/Pages/Topics';
import { BlogPost } from './components/Pages/BlogPost';
import { About } from './components/Pages/About';
import { Saved } from './components/Pages/Saved';
import { Privacy } from './components/Pages/Privacy';
import { Terms } from './components/Pages/Terms';
import { Footer } from './components/Layout/Footer';
import { ScrollToTop } from './components/UI/ScrollToTop';
import { ScrollToTopButton } from './components/UI/ScrollToTopButton';
import { CookieConsent } from './components/UI/CookieConsent';
import { Chatbot } from './components/UI/Chatbot';
import { Page } from './types';

// Helper component to determine current page from location
const useCurrentPage = (): Page => {
  const location = useLocation();
  const pathname = location.pathname;
  
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/blog/post/')) return 'blog';
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname === '/topics') return 'topics';
  if (pathname === '/about') return 'about';
  if (pathname === '/saved') return 'saved';
  if (pathname === '/privacy') return 'privacy';
  if (pathname === '/terms') return 'terms';
  return 'home';
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = useCurrentPage();

  const handleNavigate = (page: Page, category?: string) => {
    // Always scroll to top when navigating
    window.scrollTo(0, 0);
    
    if (page === 'blog' && category) {
      // URL encode the category for the URL
      const encodedCategory = encodeURIComponent(category);
      navigate(`/blog?category=${encodedCategory}`);
    } else if (page === 'home') {
      navigate('/');
    } else {
      navigate(`/${page}`);
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/blog/post/${postId}`);
  };

  const handleSubscribe = () => {
    // If not on home page, go to home page first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for route change to complete then scroll
      setTimeout(() => {
        const newsletterSection = document.getElementById('newsletter');
        if (newsletterSection) {
          newsletterSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page
      const newsletterSection = document.getElementById('newsletter');
      if (newsletterSection) {
        newsletterSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-custom-darkBg font-sans text-custom-black dark:text-custom-darkText selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-custom-blue">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onSubscribe={handleSubscribe}
      />
      
      <main key={location.pathname} className="animate-fade-in">
        <Routes>
          <Route 
            path="/" 
            element={<Home onNavigate={handleNavigate} onPostClick={handlePostClick} />} 
          />
          <Route 
            path="/blog" 
            element={<Blog onPostClick={handlePostClick} />} 
          />
          <Route 
            path="/blog/post/:postId" 
            element={<BlogPost onPostClick={handlePostClick} />} 
          />
          <Route 
            path="/topics" 
            element={<Topics onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/saved" 
            element={<Saved onPostClick={handlePostClick} onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/about" 
            element={<About onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/privacy" 
            element={<Privacy />} 
          />
          <Route 
            path="/terms" 
            element={<Terms />} 
          />
        </Routes>
      </main>
      
      <ScrollToTopButton />
      <Chatbot />
      <CookieConsent />
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <AppContent />
    </>
  );
};

export default App;
