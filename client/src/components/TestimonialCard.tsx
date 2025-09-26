import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  rating: number;
}

export default function TestimonialCard({ quote, name, title, company, rating }: TestimonialCardProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg h-full" data-testid={`testimonial-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-8">
        {/* Stars */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed italic">
          "{quote}"
        </blockquote>

        {/* Author */}
        <div className="border-t pt-4">
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-blue-600 font-medium">{title}</div>
          <div className="text-gray-500 text-sm">{company}</div>
        </div>
      </CardContent>
    </Card>
  );
}