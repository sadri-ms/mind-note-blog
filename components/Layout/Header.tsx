
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '../UI/Button';
import { Page } from '../../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page, category?: string) => void;
  onSubscribe: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onSubscribe }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: 'Home', page: 'home' as const },
    { name: 'Blog', page: 'blog' as const },
    { name: 'Topics', page: 'topics' as const },
    { name: 'About', page: 'about' as const },
    { name: 'Saved', page: 'saved' as const },
  ];

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    // Scroll handled by ScrollToTop component, but smooth scroll here for immediate feedback
    if (location.pathname !== (page === 'home' ? '/' : `/${page}`)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubscribeClick = () => {
    onSubscribe();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-white/80 dark:bg-custom-darkBg/80 backdrop-blur-md border-custom-border/50 dark:border-custom-borderDark/50 py-3' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center z-50 cursor-pointer group" onClick={() => handleNavClick('home')}>
              <span className="text-xl font-bold tracking-tighter text-custom-black dark:text-white transition-colors group-hover:opacity-80">
                Mind<span className="font-light text-custom-mediumGray group-hover:text-custom-black dark:group-hover:text-white transition-colors">Note</span>.
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-10 items-center">
              {navLinks.map((link, index) => (
                <button
                  key={`${link.name}-${index}`}
                  onClick={() => handleNavClick(link.page)}
                  className={`text-sm font-medium transition-all duration-300 relative group ${
                    currentPage === link.page
                    ? 'text-custom-black dark:text-white'
                    : 'text-custom-mediumGray dark:text-custom-darkTextMuted hover:text-custom-black dark:hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full ${currentPage === link.page ? 'w-full' : ''}`}></span>
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 text-custom-mediumGray hover:text-custom-black dark:text-custom-darkTextMuted dark:hover:text-white transition-colors active:scale-95 transform duration-200"
                aria-label="Toggle dark mode"
              >
                <div className={`transform transition-transform duration-500 ${isDarkMode ? 'rotate-180' : 'rotate-0'}`}>
                   {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </div>
              </button>

              <div className="hidden md:block">
                <Button variant="primary" className="!px-5 !py-2 !text-xs" onClick={handleSubscribeClick}>Subscribe</Button>
              </div>
              
              <button
                className="md:hidden p-2 text-custom-black dark:text-white z-50 active:scale-90 transition-transform"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white dark:bg-custom-darkBg transition-opacity duration-300 md:hidden flex flex-col justify-center items-center space-y-8 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {navLinks.map((link, index) => (
          <button
            key={`${link.name}-${index}-mobile`}
            onClick={() => handleNavClick(link.page)}
            className="text-2xl font-light text-custom-black dark:text-white active:scale-95 transition-transform"
          >
            {link.name}
          </button>
        ))}
        <Button variant="primary" onClick={handleSubscribeClick}>Subscribe Now</Button>
      </div>
    </>
  );
};
