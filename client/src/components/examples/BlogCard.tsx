import BlogCard from '../BlogCard';
import meetingImage from '@assets/generated_images/Career_development_meeting_scene_17468336.png';

export default function BlogCardExample() {
  const handleClick = () => {
    console.log('Blog card clicked');
  };

  return (
    <div className="p-8 bg-gray-50">
      <BlogCard
        title="5 Skills You Need in the Modern Workplace"
        excerpt="Discover the essential skills that will set you apart in today's competitive job market and help you thrive in the digital age."
        image={meetingImage}
        date="Dec 15, 2024"
        readTime="5 min read"
        onClick={handleClick}
      />
    </div>
  );
}