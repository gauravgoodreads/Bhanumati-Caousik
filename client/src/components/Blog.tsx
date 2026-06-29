import { motion } from 'framer-motion';
import { Link } from 'wouter';
import BlogCard from './BlogCard';
import { Button } from '@/components/ui/button';
import { useCms } from '@/hooks/useCms';
import { imageUrl } from '@/lib/sanity';

export default function Blog() {
  const { data } = useCms();
  const blogPosts = data?.blogPosts ?? [];
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-white via-purple-50/20 to-blue-50/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full filter blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <motion.h2 
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" 
            data-testid="blog-title"
          >
            Latest <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Insights</span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            data-testid="blog-subtitle"
          >
            Expert insights on leadership, career development, and professional growth to accelerate your journey
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {featuredPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <BlogCard
                title={post.title}
                excerpt={post.excerpt}
                category={post.featured ? 'Featured' : 'Article'}
                readTime="5 min read"
                slug={post.slug}
                image={post.image ? imageUrl(post.image, 600) : undefined}
                data-testid={`blog-card-${index}`}
              />
            </motion.div>
          ))}
        </motion.div>

        {blogPosts.length > 0 && (
          <motion.div className="text-center">
            <Link href="/blog">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                data-testid="blog-view-all"
              >
                View All Articles
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
