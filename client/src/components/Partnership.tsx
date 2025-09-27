import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, GraduationCap, Play, ExternalLink } from 'lucide-react';

export default function Partnership() {
  const stats = [
    {
      icon: Users,
      number: '3,50,000+',
      label: 'Students and Professionals Mentored',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Building2,
      number: '240+',
      label: 'Corporate Partners',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: GraduationCap,
      number: '350+',
      label: 'Schools and College Partners',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Play,
      number: '1000+',
      label: 'Hours of Career Webinars',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-green-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-green-400 to-teal-400 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            data-testid="partnership-title"
          >
            Powered by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mentoria's</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Career Discovery Platform</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            data-testid="partnership-description"
          >
            Every Leadcrest Consulting plan includes lifetime access to Mentoria: India's most trusted platform for 
            career discovery, mentorship, and lifelong upskilling.
          </motion.p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              data-testid={`stat-${index}`}
            >
              <Card className="text-center p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-0">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <motion.h3 
                    className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3"
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    {stat.number}
                  </motion.h3>
                  
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Mentoria Platform CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="inline-block bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm border border-white/50 shadow-2xl p-8 rounded-3xl">
            <CardContent className="p-0">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white font-bold text-lg">M</span>
                </motion.div>
                <div className="text-left">
                  <h4 className="font-heading text-xl font-bold text-gray-900">MENTORIA</h4>
                  <p className="text-blue-600 font-medium text-sm">Career Discovery Platform</p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </div>
              
              <p className="text-gray-600 mb-6 text-lg">
                Click to explore Mentoria's comprehensive career platform
              </p>
              
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="mentoria-platform-link"
                onClick={() => window.open('https://mentoria.com', '_blank')}
              >
                Explore Platform
                <ExternalLink className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}