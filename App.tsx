import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white dark:bg-custom-darkBg font-sans text-custom-black dark:text-custom-darkText selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-custom-blue">
      <Header />
      
      <main key={location.pathname} className="animate-fade-in">
        <Routes>
          <Route 
            path="/" 
            element={<Home />} 
          />
          <Route 
            path="/blog" 
            element={<Blog />} 
          />
          <Route 
            path="/blogs" 
            element={<Blog />} 
          />
          <Route 
            path="/blogs/:postId" 
            element={<BlogPost />} 
          />
          <Route 
            path="/topics" 
            element={<Topics />} 
          />
          <Route 
            path="/saved" 
            element={<Saved />} 
          />
          <Route 
            path="/about" 
            element={<About />} 
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
      <CookieConsent />
      <Footer />
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
