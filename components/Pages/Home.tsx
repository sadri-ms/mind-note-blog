
import React, { useEffect, useState } from 'react';
import { Hero } from '../Sections/Hero';
import { FeaturedArticles } from '../Sections/FeaturedArticles';
import { Categories } from '../Sections/Categories';
import { LatestPosts } from '../Sections/LatestPosts';
import { Newsletter } from '../Sections/Newsletter';
import { BlogPost } from '../../types';
import * as sanity from '../../services/sanity';

export const Home: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, latest] = await Promise.all([
          sanity.getFeaturedPosts(),
          sanity.getLatestPosts()
        ]);
        setFeaturedPosts(featured);
        setLatestPosts(latest);
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Hero />
      <FeaturedArticles 
        posts={featuredPosts} 
        loading={loading} 
      />
      <Categories />
      <LatestPosts 
        posts={latestPosts} 
        loading={loading} 
      />
      <Newsletter />
    </>
  );
};
