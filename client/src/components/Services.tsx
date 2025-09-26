import ServiceCard from './ServiceCard';
import { Compass, Users, Target, Presentation, Star, Settings } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Compass,
      title: 'Career Guidance',
      description: 'For students and professionals seeking direction in their career journey with expert mentorship.',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Corporate Training',
      description: 'Empowering teams in Sales and Service with cutting-edge training methodologies.',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-600'
    },
    {
      icon: Target,
      title: 'Leadership Coaching',
      description: 'Nurturing executive talent and change-adaptive teams for organizational excellence.',
      gradient: 'bg-gradient-to-r from-teal-500 to-cyan-600'
    },
    {
      icon: Presentation,
      title: 'Facilitation',
      description: 'Expert facilitation for workshops, seminars, and process improvement initiatives.',
      gradient: 'bg-gradient-to-r from-indigo-500 to-blue-600'
    },
    {
      icon: Star,
      title: 'Service Standards',
      description: 'Setting benchmarks for customer experience excellence and service quality.',
      gradient: 'bg-gradient-to-r from-purple-500 to-indigo-600'
    },
    {
      icon: Settings,
      title: 'Process Improvements',
      description: 'Streamlining operations for efficiency, impact, and sustainable growth.',
      gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600'
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="services-title">
            Our Core Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions for personal and professional growth across all stages of your career journey.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              gradient={service.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}