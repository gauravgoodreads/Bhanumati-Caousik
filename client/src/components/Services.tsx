import ServiceCard from './ServiceCard';
import { Compass, Users, Target, Presentation, Star, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <section id="services" className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-green-400 to-teal-400 rounded-full filter blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <motion.h2 
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" 
            data-testid="services-title"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Our Core <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Services</span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Comprehensive solutions for personal and professional growth across all stages of your career journey.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                gradient={service.gradient}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}