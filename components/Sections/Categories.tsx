import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../constants';
import { Newspaper, Wrench, Cpu, BookOpen, TrendingUp, BrainCircuit, ArrowRight } from 'lucide-react';

const iconMap = {
  'newspaper': Newspaper,
  'wrench': Wrench,
  'cpu': Cpu,
  'book-open': BookOpen,
  'trending-up': TrendingUp,
  'brain-circuit': BrainCircuit,
};

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section id="topics" className="py-24 bg-custom-lightGray dark:bg-[#0E0E10] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-2xl font-medium text-custom-black dark:text-white tracking-tight mb-2">Explore Topics</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => {
            const Icon = iconMap[category.iconName];
            return (
              <button 
                key={category.id} 
                onClick={() => navigate(`/blogs?category=${encodeURIComponent(category.name)}`)}
                className="group relative flex items-start p-8 bg-white dark:bg-white/5 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 hover:-translate-y-1 w-full text-left"
              >
                <div className="flex-1">
                  <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/10 text-custom-black dark:text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon strokeWidth={1.5} className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-medium text-custom-black dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-custom-mediumGray dark:text-custom-darkTextMuted opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Discover {category.name.toLowerCase()} trends &rarr;
                  </p>
                </div>
                
                <div className="absolute top-8 right-8 text-custom-border dark:text-custom-borderDark group-hover:text-custom-black dark:group-hover:text-white transition-colors duration-300">
                   <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};