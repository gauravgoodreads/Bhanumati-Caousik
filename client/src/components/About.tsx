import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import profileImage from '@assets/logo_1758965840288.png';

export default function About() {
  const credentials = [
    'COPC Certified (Singapore)',
    'NLP Practitioner',
    'International Trainers Academy (ITA) Accredited',
    'Mentoria Counsellorpreneur'
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white via-blue-50/20 to-green-50/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-green-400 to-teal-400 rounded-full filter blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Image Side */}
          <motion.div 
            className="relative" 
            data-testid="about-image-container"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Enhanced placeholder for profile image */}
              <motion.div 
                className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 p-8 shadow-2xl border border-white/50 backdrop-blur-sm"
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <motion.img
                    src={profileImage}
                    alt="Bhanumathi Cousik - Professional Portrait"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    data-testid="profile-image"
                  />
                  {/* Elegant overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  {/* Floating elements */}
                  <motion.div
                    className="absolute top-4 right-4 text-white/70"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 left-4 text-white/70"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                </div>
              </motion.div>
              {/* Enhanced decorative elements */}
              <motion.div 
                className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full opacity-30 filter blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-25 filter blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.25, 0.4, 0.25]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
              />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.h2 
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" 
              data-testid="about-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Meet <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Bhanumathi Cousik</span>
            </motion.h2>
            <motion.h3 
              className="font-heading text-xl font-semibold text-blue-600 mb-8" 
              data-testid="about-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              Your Trusted Career Architect & Corporate Trainer
            </motion.h3>

            <motion.div 
              className="space-y-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <p className="text-gray-600 leading-relaxed text-lg" data-testid="about-bio-1">
                With over 36 years of comprehensive professional experience, including 22 distinguished years in the banking sector, Bhanumathi brings unparalleled expertise in career development, sales excellence, and organizational transformation.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg" data-testid="about-bio-2">
                As a certified COPC professional from Singapore and NLP Practitioner, she specializes in empowering individuals and organizations to achieve their highest potential through strategic guidance, behavioral transformation, and results-driven coaching methodologies.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg" data-testid="about-bio-3">
                Her approach combines deep industry knowledge with compassionate mentoring, creating sustainable pathways for growth across diverse sectors and career stages.
              </p>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 via-purple-50/50 to-green-50 border-l-4 border-l-blue-500 mb-8 shadow-lg">
                <CardContent className="p-8">
                  <blockquote className="text-gray-700 italic text-lg font-medium" data-testid="about-quote">
                    "As a consultant, I empower executives and teams to excel in Sales and Service, fostering alignment, growth, and behavioral transformation."
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>

            {/* Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <h4 className="font-heading text-lg font-semibold text-gray-900 mb-6 flex items-center" data-testid="credentials-title">
                <Award className="h-6 w-6 mr-3 text-blue-600" />
                Professional Credentials
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {credentials.map((credential, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-md transition-shadow duration-300" 
                    data-testid={`credential-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <Badge variant="secondary" className="text-sm font-medium">
                      {credential}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}