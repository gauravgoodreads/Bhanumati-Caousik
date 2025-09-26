import BlogCard from './BlogCard';
import { Button } from '@/components/ui/button';
import meetingImage from '@assets/generated_images/Career_development_meeting_scene_17468336.png';
import trainingImage from '@assets/generated_images/Workplace_skills_training_session_4847f3fc.png';
import growthImage from '@assets/generated_images/Career_growth_concept_image_310471a8.png';
import leadershipImage from '@assets/generated_images/Sales_leadership_collaboration_scene_c4fd1d54.png';

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
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="blog-title">
            Insights & Articles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and strategies for career development and professional growth.
          </p>
        </div>

        {/* Blog Grid - Show only 3 on homepage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.slice(0, 3).map((post, index) => (
            <BlogCard
              key={index}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              date={post.date}
              readTime={post.readTime}
              onClick={() => handleBlogClick(post.title)}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleViewAllBlogs}
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            data-testid="button-view-all-blogs"
          >
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
}