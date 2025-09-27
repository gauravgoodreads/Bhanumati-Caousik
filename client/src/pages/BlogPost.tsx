import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@shared/schema';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;

  const { data: blogPost, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog/slug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Blog post not found');
      }
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-32"></div>
            <div className="h-12 bg-gray-200 rounded mb-6 w-full"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 w-48"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(blogPost.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-8 text-blue-600 hover:text-blue-800"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                {blogPost.category}
              </span>
              <span className="mx-3 text-blue-300">•</span>
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              <span>{formattedDate}</span>
              <span className="mx-3 text-blue-300">•</span>
              <span>{blogPost.readTime} min read</span>
            </div>
            
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blogPost.title}
            </h1>
            
            {blogPost.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {blogPost.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {blogPost.imageUrl && (
            <motion.div 
              className="mb-12 rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={blogPost.imageUrl}
                alt={blogPost.title}
                className="w-full h-64 md:h-80 lg:h-96 object-cover"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div 
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div 
              className="text-gray-700 leading-relaxed"
              style={{ whiteSpace: 'pre-line' }}
              data-testid="blog-content"
            >
              {blogPost.content}
            </div>
          </motion.div>

          {/* Tags */}
          {blogPost.tags && blogPost.tags.length > 0 && (
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </article>
      
      <Footer />
    </div>
  );
}