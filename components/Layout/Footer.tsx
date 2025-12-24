
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Twitter, Github, Linkedin, ArrowUpRight, Mail } from 'lucide-react';
import { Page } from '../../types';

interface FooterProps {
  onNavigate: (page: Page, category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  return (
    <footer className="bg-white dark:bg-custom-darkBg border-t border-custom-border dark:border-custom-borderDark pt-20 pb-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          
          <div className="max-w-sm">
             <button onClick={() => onNavigate('home')} className="text-2xl font-bold tracking-tighter text-custom-black dark:text-white mb-6 block text-left">
              Mind<span className="font-light text-custom-mediumGray">Note</span>.
            </button>
            <p className="text-custom-mediumGray dark:text-custom-darkTextMuted text-sm leading-relaxed mb-6">
              Crafting clarity from complexity. We believe in an AI future that is accessible, ethical, and profoundly human.
            </p>
          </div>

          <div className="flex flex-wrap gap-16">
            <div>
              <h4 className="font-medium text-custom-black dark:text-white mb-6">Read</h4>
              <ul className="space-y-4 text-sm text-custom-mediumGray dark:text-custom-darkTextMuted">
                <li><button onClick={() => onNavigate('blog')} className="block w-full text-left hover:text-custom-black dark:hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => onNavigate('blog', 'Tutorials')} className="block w-full text-left hover:text-custom-black dark:hover:text-white transition-colors">Tutorials</button></li>
                <li><button onClick={() => onNavigate('blog', 'AI News')} className="block w-full text-left hover:text-custom-black dark:hover:text-white transition-colors">News</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-custom-black dark:text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-custom-mediumGray dark:text-custom-darkTextMuted">
                <li><button onClick={() => onNavigate('about')} className="block w-full text-left hover:text-custom-black dark:hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => onNavigate('privacy')} className="block w-full text-left hover:text-custom-black dark:hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => onNavigate('terms')} className="block w-full text-left hover:text-custom-black dark:hover:text-white transition-colors">Terms & Conditions</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-custom-black dark:text-white mb-6">Social</h4>
              <div className="flex gap-4">
                 <a 
                   href="https://x.com/MahshidSadri50" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-custom-mediumGray hover:text-custom-black dark:hover:text-white transition-colors"
                   aria-label="X (Twitter)"
                  >
                   <Twitter size={20} />
                 </a>
                 <a 
                   href="https://github.com/mahshid-sadri" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-custom-mediumGray hover:text-custom-black dark:hover:text-white transition-colors"
                   aria-label="GitHub"
                  >
                   <Github size={20} />
                 </a>
                 <a 
                   href="https://www.linkedin.com/in/mahshid-sadri-6b551335a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-custom-mediumGray hover:text-custom-black dark:hover:text-white transition-colors"
                   aria-label="LinkedIn"
                  >
                   <Linkedin size={20} />
                 </a>
                 <a 
                   href="mailto:mahshidsadri50@gmail.com?subject=Inquiry%20from%20MindNote" 
                   className="text-custom-mediumGray hover:text-custom-black dark:hover:text-white transition-colors"
                   aria-label="Email"
                  >
                   <Mail size={20} />
                 </a>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-custom-border dark:border-custom-borderDark flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © {new Date().getFullYear()} MindNote. All rights reserved.
          </p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs font-medium text-custom-black dark:text-white flex items-center gap-1 hover:opacity-70 transition-opacity">
            Back to Top <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
};
