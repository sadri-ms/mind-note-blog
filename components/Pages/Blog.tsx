import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../constants';
import { sanityService } from '../../services/sanity';
import { BlogPost } from '../../types';
import { BlogCard } from '../UI/BlogCard';
import { Search, LayoutGrid, List, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, X, RotateCcw, Filter, Check, Loader2 } from 'lucide-react';
import { Newsletter } from '../Sections/Newsletter';

interface BlogProps {
  onPostClick: (postId: string) => void;
}

type SortOrder = 'newest' | 'oldest';
type ViewMode = 'grid' | 'list';
type ReadTimeFilter = 'All' | 'short' | 'medium' | 'long';

const POSTS_PER_PAGE = 6;

export const Blog: React.FC<BlogProps> = ({ onPostClick }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // --- STATE INITIALIZATION (with LocalStorage) ---
  
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get category from URL params, fallback to localStorage, then 'All'
  const categoryFromUrl = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (categoryFromUrl) {
      return decodeURIComponent(categoryFromUrl);
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blog_activeCategory');
      return saved && saved !== 'null' && saved !== 'undefined' ? saved : 'All';
    }
    return 'All';
  });

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blog_searchQuery');
      return saved && saved !== 'null' && saved !== 'undefined' ? saved : '';
    }
    return '';
  });

  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blog_sortOrder');
      return (saved === 'newest' || saved === 'oldest') ? (saved as SortOrder) : 'newest';
    }
    return 'newest';
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blog_viewMode');
      return (saved === 'grid' || saved === 'list') ? (saved as ViewMode) : 'grid';
    }
    return 'grid';
  });

  const [yearFilter, setYearFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blog_yearFilter');
      return saved && saved !== 'null' ? saved : 'All';
    }
    return 'All';
  });

  const [readTimeFilter, setReadTimeFilter] = useState<ReadTimeFilter>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blog_readTimeFilter');
      return (saved === 'short' || saved === 'medium' || saved === 'long') ? (saved as ReadTimeFilter) : 'All';
    }
    return 'All';
  });

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // --- EFFECTS ---

  // 1. Fetch Posts on Mount
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const posts = await sanityService.getAllPosts();
        setAllPosts(posts);
      } catch (error) {
        console.error("Failed to load blog posts", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Update category when URL param changes
  useEffect(() => {
    if (categoryFromUrl) {
      const decodedCategory = decodeURIComponent(categoryFromUrl);
      setActiveCategory(decodedCategory);
      localStorage.setItem('blog_activeCategory', decodedCategory);
    }
  }, [categoryFromUrl]);

  useEffect(() => localStorage.setItem('blog_activeCategory', activeCategory), [activeCategory]);
  useEffect(() => localStorage.setItem('blog_searchQuery', searchQuery), [searchQuery]);
  useEffect(() => localStorage.setItem('blog_sortOrder', sortOrder), [sortOrder]);
  useEffect(() => localStorage.setItem('blog_viewMode', viewMode), [viewMode]);
  useEffect(() => localStorage.setItem('blog_yearFilter', yearFilter), [yearFilter]);
  useEffect(() => localStorage.setItem('blog_readTimeFilter', readTimeFilter), [readTimeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, yearFilter, readTimeFilter]);

  // --- LOGIC ---

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSortOrder('newest');
    setYearFilter('All');
    setReadTimeFilter('All');
    setCurrentPage(1);
    
    localStorage.removeItem('blog_activeCategory');
    localStorage.removeItem('blog_searchQuery');
    localStorage.removeItem('blog_sortOrder');
    localStorage.removeItem('blog_yearFilter');
    localStorage.removeItem('blog_readTimeFilter');
  };

  const availableYears = useMemo(() => {
    const years = new Set(allPosts.map(post => new Date(post.date).getFullYear()));
    return Array.from(years).sort((a: number, b: number) => b - a);
  }, [allPosts]);

  const processedPosts = useMemo(() => {
    // 1. Filter
    let posts = allPosts.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchQuery || 
                            post.title.toLowerCase().includes(searchLower) || 
                            post.excerpt.toLowerCase().includes(searchLower) ||
                            post.category.toLowerCase().includes(searchLower);

      const postYear = new Date(post.date).getFullYear().toString();
      const matchesYear = yearFilter === 'All' || postYear === yearFilter;

      // Extract minutes from "X min read" format
      const minutesMatch = post.readTime.match(/(\d+)/);
      const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 5; // Default to 5 if parsing fails
      let matchesReadTime = true;
      if (readTimeFilter === 'short') matchesReadTime = minutes < 5;
      else if (readTimeFilter === 'medium') matchesReadTime = minutes >= 5 && minutes <= 10;
      else if (readTimeFilter === 'long') matchesReadTime = minutes > 10;

      return matchesCategory && matchesSearch && matchesYear && matchesReadTime;
    });

    // 2. Sort
    posts = posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return posts;
  }, [allPosts, activeCategory, searchQuery, sortOrder, yearFilter, readTimeFilter]);

  const totalItems = processedPosts.length;
  const totalPages = Math.ceil(totalItems / POSTS_PER_PAGE);
  const paginatedPosts = processedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * POSTS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * POSTS_PER_PAGE, totalItems);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = activeCategory !== 'All' || searchQuery !== '' || sortOrder !== 'newest' || yearFilter !== 'All' || readTimeFilter !== 'All';

  return (
    <div className="animate-fade-in">
      <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <h1 className="text-5xl md:text-6xl font-semibold text-custom-black dark:text-white tracking-tight">
            The Journal
          </h1>
          <p className="text-lg text-custom-mediumGray dark:text-custom-darkTextMuted max-w-2xl font-light">
            Thoughts, tutorials, and insights on the future of artificial intelligence.
          </p>
        </div>

        {/* Controls Container */}
        <div className="mb-12 space-y-8">
          
          {/* Top Row: Search & Categories */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
             
             {/* Search Bar */}
             <div className="w-full md:w-1/3 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-custom-black dark:group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-10 py-3 rounded-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-gray-200 dark:focus:border-gray-700 outline-none text-custom-black dark:text-white placeholder-gray-400 transition-all duration-300 focus:shadow-lg focus:bg-white dark:focus:bg-black"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-custom-black dark:hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
             </div>

            {/* Categories */}
            <div className="w-full md:w-2/3 flex overflow-x-auto pb-2 no-scrollbar items-center gap-2 md:justify-end px-1">
              <button
                onClick={() => setActiveCategory('All')}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === 'All'
                    ? 'bg-custom-black text-white dark:bg-white dark:text-black shadow-md'
                    : 'bg-transparent text-custom-mediumGray dark:text-custom-darkTextMuted hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeCategory === cat.name
                      ? 'bg-custom-black text-white dark:bg-white dark:text-black shadow-md'
                      : 'bg-transparent text-custom-mediumGray dark:text-custom-darkTextMuted hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-b border-gray-100 dark:border-white/5 py-4 gap-4">
            <div className="flex items-center gap-4 order-2 sm:order-1 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-sm text-custom-mediumGray dark:text-custom-darkTextMuted">
                {isLoading 
                  ? 'Loading articles...' 
                  : (totalItems > 0 
                      ? `Showing ${startItem}-${endItem} of ${totalItems} articles` 
                      : 'Showing 0 articles')}
              </span>
              {hasActiveFilters && (
                <button 
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <RotateCcw size={12} /> Reset filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2 w-full sm:w-auto justify-end">
              
              {/* Extra Filters Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  disabled={isLoading}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 px-3 py-1.5 rounded-lg ${
                    (yearFilter !== 'All' || readTimeFilter !== 'All') 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300' 
                    : 'text-custom-black dark:text-white'
                  }`}
                >
                  <Filter size={14} />
                  <span>Filter</span>
                  <ChevronDown size={14} className={`transform transition-transform ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-custom-darkCard rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-4 z-20 space-y-4 animate-fade-in-up">
                      
                      {/* Read Time */}
                      <div>
                        <h4 className="text-xs font-semibold text-custom-mediumGray dark:text-custom-darkTextMuted uppercase tracking-wider mb-2">Read Time</h4>
                        <div className="space-y-1">
                          {[
                            { label: 'Any time', value: 'All' },
                            { label: 'Under 5 min', value: 'short' },
                            { label: '5 - 10 min', value: 'medium' },
                            { label: 'Over 10 min', value: 'long' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => setReadTimeFilter(opt.value as ReadTimeFilter)}
                              className={`w-full text-left px-2 py-1.5 text-sm rounded-lg flex justify-between items-center transition-colors ${readTimeFilter === opt.value ? 'bg-gray-50 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-custom-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
                            >
                              {opt.label}
                              {readTimeFilter === opt.value && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <hr className="border-gray-100 dark:border-white/5" />

                      {/* Year */}
                      <div>
                        <h4 className="text-xs font-semibold text-custom-mediumGray dark:text-custom-darkTextMuted uppercase tracking-wider mb-2">Year</h4>
                        <div className="grid grid-cols-2 gap-2">
                           <button
                              onClick={() => setYearFilter('All')}
                              className={`px-2 py-1.5 text-sm rounded-lg text-center transition-colors ${yearFilter === 'All' ? 'bg-gray-100 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-custom-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5'}`}
                            >
                              All
                            </button>
                          {availableYears.map(year => (
                            <button
                              key={year}
                              onClick={() => setYearFilter(year.toString())}
                              className={`px-2 py-1.5 text-sm rounded-lg text-center transition-colors ${yearFilter === year.toString() ? 'bg-gray-100 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-custom-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5'}`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-sm font-medium text-custom-black dark:text-white hover:opacity-70 transition-opacity"
                >
                  <ArrowUpDown size={14} />
                  <span className="hidden sm:inline">Sort:</span>
                  <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
                  <ChevronDown size={14} className={`transform transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-custom-darkCard rounded-xl shadow-xl border border-gray-100 dark:border-white/10 py-1 z-20 overflow-hidden">
                      <button 
                        onClick={() => { setSortOrder('newest'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${sortOrder === 'newest' ? 'bg-gray-50 dark:bg-white/5 text-custom-black dark:text-white font-medium' : 'text-custom-mediumGray dark:text-custom-darkTextMuted hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      >
                        Newest first
                      </button>
                      <button 
                        onClick={() => { setSortOrder('oldest'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${sortOrder === 'oldest' ? 'bg-gray-50 dark:bg-white/5 text-custom-black dark:text-white font-medium' : 'text-custom-mediumGray dark:text-custom-darkTextMuted hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      >
                        Oldest first
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="w-px h-4 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

              {/* View Layout Toggle */}
              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-300 ${viewMode === 'grid' ? 'bg-white dark:bg-custom-darkBg text-custom-black dark:text-white shadow-sm' : 'text-custom-mediumGray dark:text-custom-darkTextMuted hover:text-custom-black dark:hover:text-white'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-300 ${viewMode === 'list' ? 'bg-white dark:bg-custom-darkBg text-custom-black dark:text-white shadow-sm' : 'text-custom-mediumGray dark:text-custom-darkTextMuted hover:text-custom-black dark:hover:text-white'}`}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Content */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16' 
              : 'flex flex-col gap-6 max-w-3xl mx-auto'} 
            min-h-[400px]
          `}>
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <div key={post.id} className="animate-fade-in-up">
                  <BlogCard 
                    post={post} 
                    onClick={onPostClick} 
                    minimal={viewMode === 'list'}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-custom-mediumGray dark:text-custom-darkTextMuted text-lg mb-4">
                  No articles found matching your criteria.
                </p>
                <button 
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-custom-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-4 animate-fade-in">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-full border border-gray-200 dark:border-white/10 transition-colors ${
                currentPage === 1 
                  ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' 
                  : 'text-custom-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'bg-custom-black text-white dark:bg-white dark:text-black shadow-md'
                      : 'text-custom-mediumGray dark:text-custom-darkTextMuted hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full border border-gray-200 dark:border-white/10 transition-colors ${
                currentPage === totalPages 
                  ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' 
                  : 'text-custom-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
      
      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};