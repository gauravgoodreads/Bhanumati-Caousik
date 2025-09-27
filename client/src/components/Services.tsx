import ServiceCard from './ServiceCard';
import { Compass, Users, Target, Presentation, Star, Settings, Crown, TrendingUp, Brain, Award, Lightbulb, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { Service } from '@shared/schema';

// Icon mapping for services
const iconMap = {
  Compass,
  Users,
  Target,
  Presentation,
  Star,
  Settings,
  Crown,
  TrendingUp,
  Brain,
  Award,
  Lightbulb,
  Zap
};

// Gradient mapping for services
const gradientMap = {
  blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
  green: 'bg-gradient-to-r from-green-500 to-emerald-600',
  purple: 'bg-gradient-to-r from-purple-500 to-indigo-600',
  teal: 'bg-gradient-to-r from-teal-500 to-cyan-600',
  indigo: 'bg-gradient-to-r from-indigo-500 to-blue-600',
  emerald: 'bg-gradient-to-r from-emerald-500 to-teal-600'
};

export default function Services() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-64 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Convert database services to component format
  const mappedServices = services.map(service => {
    const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users;
    const gradient = gradientMap[service.color as keyof typeof gradientMap] || gradientMap.blue;
    
    return {
      icon: IconComponent,
      title: service.title,
      description: service.description,
      gradient
    };
  });

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
            data-testid="services-subtitle"
          >
            Comprehensive professional development solutions tailored to empower individuals and organizations
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
          {mappedServices.map((service, index) => (
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
                data-testid={`service-card-${index}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}