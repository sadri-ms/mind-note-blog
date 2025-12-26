import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  minimal?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false, minimal = false }) => {
  if (minimal) {
    return (
      <Link to={`/blogs/${post.id}`} className="group cursor-pointer flex gap-6 items-start p-4 -mx-4 rounded-2xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5">
        <div className="w-24 h-24 sm:w-32 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
          />
        </div>
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-custom-mediumGray dark:text-custom-darkTextMuted">
              {post.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
            <span className="text-[10px] text-custom-mediumGray dark:text-custom-darkTextMuted">{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
            <span className="text-[10px] text-custom-mediumGray dark:text-custom-darkTextMuted">{post.readTime}</span>
          </div>
          <h3 className="text-base font-semibold text-custom-black dark:text-custom-darkText leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/blogs/${post.id}`} className={`group flex flex-col h-full cursor-pointer ${featured ? '' : ''}`}>
      <div className={`relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6 ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'} shadow-sm transition-all duration-500 hover:shadow-md`}>
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
        
        {/* Hover Overlay Icon */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md p-2 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <ArrowUpRight className="w-4 h-4 text-black dark:text-white" />
        </div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-widest bg-gray-100 dark:bg-white/10 text-custom-mediumGray dark:text-custom-darkTextMuted">
            {post.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-custom-mediumGray dark:text-custom-darkTextMuted font-medium">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <h3 className={`font-semibold text-custom-black dark:text-custom-darkText mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          {post.title}
        </h3>
        
        <p className="text-custom-mediumGray dark:text-custom-darkTextMuted text-sm leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
};