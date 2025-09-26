import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export default function ServiceCard({ icon: Icon, title, description, gradient }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group border-0 bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden relative" data-testid={`service-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-8 text-center relative z-10">
          <motion.div 
            className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${gradient} shadow-lg relative`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-10 w-10 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}