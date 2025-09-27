import { storage } from './storage';
import { AdminUser } from '@shared/schema';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await storage.createAdminUser({
      email: 'admin@learningpartners1inc.com',
      password: hashedPassword,
      name: 'Bhanumathi Cousik',
      role: 'super_admin'
    });
    console.log('✓ Admin user created');

    // Seed Services
    const services = [
      {
        title: 'Leadership Development',
        description: 'Transform your leadership style with personalized coaching sessions designed to enhance decision-making, team management, and strategic thinking capabilities.',
        icon: 'Crown',
        color: 'blue',
        features: [
          'Executive coaching sessions',
          'Leadership assessment tools',
          '360-degree feedback analysis',
          'Custom development plans'
        ],
        sortOrder: 1
      },
      {
        title: 'Career Transition Coaching',
        description: 'Navigate career changes with confidence through strategic guidance, skill assessment, and tailored transition planning for your next professional chapter.',
        icon: 'TrendingUp',
        color: 'green',
        features: [
          'Career path analysis',
          'Resume and LinkedIn optimization',
          'Interview preparation',
          'Industry insights and networking'
        ],
        sortOrder: 2
      },
      {
        title: 'Corporate Training',
        description: 'Elevate your organization\'s performance through customized training programs in sales excellence, customer service, and team development.',
        icon: 'Users',
        color: 'purple',
        features: [
          'Sales and service training',
          'Team building workshops',
          'Communication skills development',
          'Performance improvement programs'
        ],
        sortOrder: 3
      },
      {
        title: 'NLP Coaching',
        description: 'Unlock your potential through Neuro-Linguistic Programming techniques that reshape thinking patterns and accelerate personal growth.',
        icon: 'Brain',
        color: 'teal',
        features: [
          'Behavioral pattern analysis',
          'Goal-setting and achievement strategies',
          'Mindset transformation',
          'Communication enhancement'
        ],
        sortOrder: 4
      }
    ];

    for (const service of services) {
      await storage.createService(service);
    }
    console.log('✓ Services seeded');

    // Seed Packages
    const packages = [
      {
        title: 'Executive Coaching Premium',
        description: 'Comprehensive leadership development program with personalized coaching, assessments, and strategic planning.',
        price: '75000.00',
        duration: '3 months',
        category: 'individual',
        isPopular: true,
        features: [
          '12 one-on-one coaching sessions',
          'Leadership assessment and 360-degree feedback',
          'Personalized development plan',
          'Monthly progress reviews',
          'Email support between sessions'
        ],
        sortOrder: 1
      },
      {
        title: 'Career Transition Accelerator',
        description: 'Complete career change support with strategic planning, skill development, and job search assistance.',
        price: '45000.00',
        duration: '2 months',
        category: 'individual',
        features: [
          '8 coaching sessions',
          'Career assessment and planning',
          'Resume and LinkedIn makeover',
          'Interview coaching',
          'Networking strategy'
        ],
        sortOrder: 2
      },
      {
        title: 'Corporate Excellence Program',
        description: 'Organization-wide transformation through customized training modules and team development initiatives.',
        price: '150000.00',
        duration: '6 months',
        category: 'corporate',
        features: [
          'Team assessment and analysis',
          'Customized training modules',
          'Leadership development workshops',
          'Performance tracking system',
          'Ongoing support and consultation'
        ],
        sortOrder: 3
      }
    ];

    for (const pkg of packages) {
      await storage.createPackage(pkg);
    }
    console.log('✓ Packages seeded');

    // Seed Testimonials
    const testimonials = [
      {
        name: 'Rajesh Kumar',
        role: 'Senior Manager',
        company: 'Tech Solutions Inc.',
        content: 'Bhanumathi\'s coaching transformed my leadership approach completely. Her insights into behavioral patterns and strategic thinking have made me a more effective leader.',
        rating: 5,
        sortOrder: 1
      },
      {
        name: 'Priya Sharma',
        role: 'HR Director',
        company: 'Global Enterprises',
        content: 'The career transition program exceeded my expectations. The personalized guidance and practical strategies helped me secure my dream role in just 8 weeks.',
        rating: 5,
        sortOrder: 2
      },
      {
        name: 'Michael Chen',
        role: 'Sales Director',
        company: 'Innovation Corp',
        content: 'Our team\'s performance improved by 40% after the corporate training program. Bhanumathi\'s expertise in sales excellence is truly remarkable.',
        rating: 5,
        sortOrder: 3
      }
    ];

    for (const testimonial of testimonials) {
      await storage.createTestimonial(testimonial);
    }
    console.log('✓ Testimonials seeded');

    // Seed Blog Posts
    const blogPosts = [
      {
        title: 'The Future of Leadership in a Digital Age',
        excerpt: 'Exploring how modern leaders must adapt their approach to succeed in an increasingly digital and remote work environment.',
        content: 'Leadership in the digital age requires a fundamental shift in how we think about influence, communication, and team dynamics...',
        slug: 'future-of-leadership-digital-age',
        category: 'Leadership',
        tags: ['leadership', 'digital transformation', 'remote work'],
        isPublished: true,
        readTime: 8
      },
      {
        title: '5 Essential Skills for Career Advancement',
        excerpt: 'Discover the critical skills that successful professionals develop to accelerate their career growth and achieve their goals.',
        content: 'Career advancement isn\'t just about technical skills. The most successful professionals understand that soft skills...',
        slug: '5-essential-skills-career-advancement',
        category: 'Career Development',
        tags: ['career growth', 'professional development', 'skills'],
        isPublished: true,
        readTime: 6
      },
      {
        title: 'Building High-Performance Teams',
        excerpt: 'Learn the proven strategies for creating cohesive, motivated teams that consistently deliver exceptional results.',
        content: 'High-performance teams don\'t happen by accident. They are the result of intentional design, clear communication...',
        slug: 'building-high-performance-teams',
        category: 'Team Development',
        tags: ['team building', 'performance', 'management'],
        isPublished: true,
        readTime: 7
      }
    ];

    for (const post of blogPosts) {
      await storage.createBlogPost(post);
    }
    console.log('✓ Blog posts seeded');

    // Seed Workshops
    const workshops = [
      {
        title: 'Leadership Excellence Workshop',
        description: 'Intensive workshop focused on developing core leadership competencies and strategic thinking skills.',
        price: '12000.00',
        duration: 8,
        maxParticipants: 20,
        workshopDate: new Date('2024-02-15T09:00:00Z'),
        registrationDeadline: new Date('2024-02-10T23:59:59Z'),
        location: 'Online',
        category: 'Leadership',
        prerequisites: ['Management experience', 'Basic leadership training'],
        learningOutcomes: [
          'Master advanced leadership techniques',
          'Develop strategic thinking skills',
          'Learn effective communication strategies',
          'Build high-performance teams'
        ]
      },
      {
        title: 'Career Transformation Bootcamp',
        description: 'Comprehensive workshop covering career planning, personal branding, and job search strategies.',
        price: '8000.00',
        duration: 6,
        maxParticipants: 15,
        workshopDate: new Date('2024-02-22T14:00:00Z'),
        registrationDeadline: new Date('2024-02-18T23:59:59Z'),
        location: 'Online',
        category: 'Career Development',
        prerequisites: [],
        learningOutcomes: [
          'Create compelling personal brand',
          'Develop job search strategies',
          'Master interview techniques',
          'Build professional network'
        ]
      }
    ];

    for (const workshop of workshops) {
      await storage.createWorkshop(workshop);
    }
    console.log('✓ Workshops seeded');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };