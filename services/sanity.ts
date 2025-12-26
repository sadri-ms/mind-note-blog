import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { BlogPost, Category } from "../types";
import { ALL_POSTS, CATEGORIES } from "../constants"; // Fallback data

// Sanity Client Configuration
export const client = createClient({
  projectId: "j6b4ehw6",
  dataset: "production",
  apiVersion: "2025-12-01",
  useCdn: false, // false to get freshest data
});

// Image URL Builder
const builder = imageUrlBuilder(client);

function urlFor(source: any): string {
  if (!source) return "https://picsum.photos/800/600"; // Fallback image
  return builder.image(source).url() || "https://picsum.photos/800/600";
}

// Helper to format date
function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

// Helper to extract excerpt from Portable Text
function extractExcerpt(body: any[]): string {
  if (!body || !Array.isArray(body)) return "";
  
  // Get first block of text
  const firstBlock = body.find((block: any) => block._type === "block" && block.children);
  if (!firstBlock) return "";
  
  const text = firstBlock.children
    .map((child: any) => child.text || "")
    .join(" ");
  
  // Return first 150 characters
  return text.length > 150 ? text.substring(0, 150) + "..." : text;
}

// Helper to estimate read time from Portable Text
function estimateReadTime(body: any[]): string {
  if (!body || !Array.isArray(body)) return "5 min read";
  
  let wordCount = 0;
  body.forEach((block: any) => {
    if (block._type === "block" && block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          wordCount += child.text.split(/\s+/).length;
        }
      });
    }
  });
  
  // Average reading speed: 200 words per minute
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

// Sanity Service Implementation
export const sanityService = {
  // Fetch all posts from Sanity
  getAllPosts: async (): Promise<BlogPost[]> => {
    try {
      const query = `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        image,
        body,
        excerpt,
        category,
        isEditorsChoice
      }`;

      const sanityPosts = await client.fetch(query);

      // If no posts in Sanity, return fallback data
      if (!sanityPosts || sanityPosts.length === 0) {
        console.warn("No posts found in Sanity. Using fallback data.");
        return ALL_POSTS;
      }

      // Map Sanity data to BlogPost interface
      return sanityPosts.map((p: any) => ({
        id: p._id || p.slug?.current || "",
        title: p.title || "Untitled",
        excerpt: p.excerpt || extractExcerpt(p.body) || "No excerpt available.",
        category: p.category || "Uncategorized",
        date: formatDate(p.publishedAt) || new Date().toLocaleDateString(),
        imageUrl: urlFor(p.image) || "https://picsum.photos/800/600",
        readTime: estimateReadTime(p.body) || "5 min read",
        featured: p.isEditorsChoice || false,
        content: p.body ? JSON.stringify(p.body) : undefined, // Store Portable Text as JSON string
      }));
    } catch (error) {
      console.error("Sanity Fetch Error:", error);
      // Return fallback data on error
      return ALL_POSTS;
    }
  },

  // Fetch a single post by ID
  getPostById: async (id: string): Promise<BlogPost | undefined> => {
    try {
      // Try fetching by _id first, then by slug
      const query = `*[_type == "post" && (_id == $id || slug.current == $id)][0] {
        _id,
        title,
        slug,
        publishedAt,
        image,
        body,
        excerpt,
        category,
        isEditorsChoice
      }`;

      const p = await client.fetch(query, { id });

      if (!p) {
        // Fallback to example data
        return ALL_POSTS.find((post) => post.id === id);
      }

      return {
        id: p._id || p.slug?.current || id,
        title: p.title || "Untitled",
        excerpt: p.excerpt || extractExcerpt(p.body) || "No excerpt available.",
        category: p.category || "Uncategorized",
        date: formatDate(p.publishedAt) || new Date().toLocaleDateString(),
        imageUrl: urlFor(p.image) || "https://picsum.photos/800/600",
        readTime: estimateReadTime(p.body) || "5 min read",
        featured: p.isEditorsChoice || false,
        content: JSON.stringify(p.body),
      };
    } catch (error) {
      console.error("Sanity Fetch Error (Single Post):", error);
      // Fallback to example data
      return ALL_POSTS.find((post) => post.id === id);
    }
  },

  // Fetch Featured Posts (Editor's Choice)
  getFeaturedPosts: async (): Promise<BlogPost[]> => {
    try {
      const query = `*[_type == "post" && isEditorsChoice == true] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        publishedAt,
        image,
        body,
        excerpt,
        category,
        isEditorsChoice
      }`;

      const sanityPosts = await client.fetch(query);

      if (!sanityPosts || sanityPosts.length === 0) {
        // Fallback: get latest 3 posts
        const all = await sanityService.getAllPosts();
        return all.slice(0, 3);
      }

      return sanityPosts.map((p: any) => ({
        id: p._id || p.slug?.current || "",
        title: p.title || "Untitled",
        excerpt: p.excerpt || extractExcerpt(p.body) || "No excerpt available.",
        category: p.category || "Uncategorized",
        date: formatDate(p.publishedAt) || new Date().toLocaleDateString(),
        imageUrl: urlFor(p.image) || "https://picsum.photos/800/600",
        readTime: estimateReadTime(p.body) || "5 min read",
        featured: true,
        content: JSON.stringify(p.body),
      }));
    } catch (error) {
      console.error("Sanity Fetch Error (Featured Posts):", error);
      return ALL_POSTS.slice(0, 3);
    }
  },

  // Fetch Latest Posts (excluding featured)
  getLatestPosts: async (): Promise<BlogPost[]> => {
    try {
      const all = await sanityService.getAllPosts();
      // Return posts 3-6 (skip first 3 which are featured)
      return all.slice(3, 6);
    } catch (error) {
      console.error("Sanity Fetch Error (Latest Posts):", error);
      return ALL_POSTS.slice(3, 6);
    }
  },

  // Get Categories (currently using constants, but can be fetched from Sanity)
  getCategories: async (): Promise<Category[]> => {
    // TODO: Add category schema to Sanity and fetch from there
    return Promise.resolve(CATEGORIES);
  },
};

// Export individual functions for Home.tsx compatibility
export const getFeaturedPosts = sanityService.getFeaturedPosts;
export const getLatestPosts = sanityService.getLatestPosts;
