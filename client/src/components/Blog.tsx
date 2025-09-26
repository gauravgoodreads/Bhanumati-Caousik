import BlogCard from './BlogCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import meetingImage from '@assets/stock_images/professional_modern__08068abf.jpg';
import trainingImage from '@assets/stock_images/corporate_training_s_097a608b.jpg';
import growthImage from '@assets/stock_images/young_professional_w_8e3fdcc0.jpg';
import leadershipImage from '@assets/stock_images/business_leadership__cfb12b36.jpg';

export default function Blog() {
  // TODO: Remove mock functionality - integrate with actual blog system
  const handleBlogClick = (title: string) => {
    console.log(`Blog clicked: ${title}`);
    alert(`Blog post "${title}" would open here. This will be replaced with actual blog functionality.`);
  };

  const handleViewAllBlogs = () => {
    console.log('View all blogs clicked');
    alert('This will navigate to a dedicated blog page with all articles.');
  };

  const blogPosts = [
    {
      title: '5 Skills You Need in the Modern Workplace',
      excerpt: 'Discover the essential skills that will set you apart in today\'s competitive job market and help you thrive in the digital age.',
      image: meetingImage,
      date: 'Dec 15, 2024',
      readTime: '5 min read'
    },
    {
      title: 'How to Choose the Right Career Path',
      excerpt: 'A comprehensive guide to making informed career decisions that align with your values, strengths, and long-term goals.',
      image: trainingImage,
      date: 'Dec 10, 2024',
      readTime: '7 min read'
    },
    {
      title: 'The Art of Effective Sales Leadership',
      excerpt: 'Learn the key principles of sales leadership that drive team performance and create sustainable business growth.',
      image: leadershipImage,
      date: 'Dec 5, 2024',
      readTime: '6 min read'
    },
    {
      title: 'Building Resilience in Your Career Journey',
      excerpt: 'Strategies for developing mental resilience and adaptability to navigate career challenges and opportunities successfully.',
      image: growthImage,
      date: 'Nov 28, 2024',
      readTime: '4 min read'
    }
  ];

  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full filter blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" 
            data-testid="blog-title"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Insights & Articles
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Stay updated with the latest trends, tips, and strategies for career development and professional growth.
          </motion.p>
        </motion.div>

        {/* Blog Grid - Show only 3 on homepage */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {blogPosts.slice(0, 3).map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
              whileHover={{ y: -8 }}
            >
              <BlogCard
                title={post.title}
                excerpt={post.excerpt}
                image={post.image}
                date={post.date}
                readTime={post.readTime}
                onClick={() => handleBlogClick(post.title)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleViewAllBlogs}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl font-semibold backdrop-blur-sm bg-white/80"
              data-testid="button-view-all-blogs"
            >
              View All Articles
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}