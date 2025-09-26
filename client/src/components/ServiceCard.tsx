import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export default function ServiceCard({ icon: Icon, title, description, gradient }: ServiceCardProps) {
  return (
    <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm" data-testid={`service-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-8 text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${gradient} group-hover:scale-110 transition-transform`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}