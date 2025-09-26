import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, Building, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TargetAudience() {
  const audiences = [
    {
      icon: GraduationCap,
      title: 'Students & Parents',
      description: 'Navigating educational and career choices with confidence. Get personalized guidance for academic paths, skill development, and future planning.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Users,
      title: 'Schools',
      description: 'Collaborating to build future-ready students. Comprehensive programs for career counseling, skill assessment, and educational excellence.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Building,
      title: 'Corporates',
      description: 'Driving growth through bespoke training and coaching. Customized solutions for sales training, leadership development, and organizational excellence.',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      icon: Briefcase,
      title: 'Working Professionals',
      description: 'Accelerating career trajectory and leadership skills. Personal coaching for career transitions, skill enhancement, and professional growth.',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <section id="target-audience" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/50 to-green-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-teal-400 to-green-400 rounded-full filter blur-3xl" />
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
            data-testid="audience-title"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Tailored <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Guidance</span> for Every Stage
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Whether you're a student exploring options, a professional seeking growth, or an organization building excellence, we have specialized solutions for you.
          </motion.p>
        </motion.div>

        {/* Audience Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="group border-0 bg-white/95 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden relative" data-testid={`audience-card-${audience.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start space-x-6">
                      <motion.div 
                        className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-r ${audience.color} shadow-lg`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{audience.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{audience.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}