import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  onButtonClick: () => void;
}

export default function PricingCard({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  isPopular = false,
  onButtonClick 
}: PricingCardProps) {
  return (
    <Card className={`relative hover:shadow-xl transition-all duration-300 ${
      isPopular 
        ? 'border-2 border-blue-500 shadow-lg scale-105' 
        : 'border border-gray-200 hover:-translate-y-1'
    }`} data-testid={`pricing-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3" data-testid={`feature-${index}`}>
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={onButtonClick}
          className={`w-full ${
            isPopular 
              ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:scale-105' 
              : 'bg-gray-900 hover:bg-gray-800'
          } transition-transform`}
          data-testid={`button-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}