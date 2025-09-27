import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogCardProps {
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
  readTime: string;
  category?: string;
  slug?: string;
  onClick?: () => void;
}

export default function BlogCard({ title, excerpt, image, date, readTime, category, slug, onClick }: BlogCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (slug) {
      // TODO: Navigate to blog post detail page
      console.log(`Navigate to /blog/${slug}`);
    }
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white overflow-hidden rounded-2xl" onClick={handleClick} data-testid={`blog-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="aspect-video overflow-hidden relative">
        {image ? (
          <motion.img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 flex items-center justify-center">
            <div className="text-blue-600 text-4xl font-bold">
              {title.charAt(0)}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          {category && (
            <>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                {category}
              </span>
              <span className="mx-3 text-blue-300">•</span>
            </>
          )}
          {date && (
            <>
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">{date}</span>
              <span className="mx-3 text-blue-300">•</span>
            </>
          )}
          <span className="font-medium">{readTime}</span>
        </div>
        <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        <motion.div 
          className="flex items-center text-blue-600 font-medium group-hover:text-blue-700"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.15 }}
        >
          <span>Read More</span>
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="h-4 w-4 ml-2" />
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}