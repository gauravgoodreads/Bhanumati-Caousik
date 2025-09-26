import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, CheckCircle } from 'lucide-react';

export default function About() {
  const credentials = [
    'COPC Certified (Singapore)',
    'NLP Practitioner',
    'International Trainers Academy (ITA) Accredited',
    'Mentoria Counsellorpreneur'
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative" data-testid="about-image-container">
            <div className="relative w-full max-w-md mx-auto">
              {/* Placeholder for profile image */}
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 p-8 shadow-2xl">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Award className="h-12 w-12 text-blue-600" />
                    </div>
                    <p className="text-gray-600 font-medium">Professional Portrait</p>
                    <p className="text-sm text-gray-500">Bhanumathi Cousik</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20"></div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="about-title">
              Meet Bhanumathi Cousik
            </h2>
            <h3 className="font-heading text-xl font-semibold text-blue-600 mb-6" data-testid="about-subtitle">
              Your Trusted Career Architect & Corporate Trainer
            </h3>

            <div className="space-y-4 mb-8">
              <p className="text-gray-600 leading-relaxed" data-testid="about-bio-1">
                With over 36 years of comprehensive professional experience, including 22 distinguished years in the banking sector, Bhanumathi brings unparalleled expertise in career development, sales excellence, and organizational transformation.
              </p>
              <p className="text-gray-600 leading-relaxed" data-testid="about-bio-2">
                As a certified COPC professional from Singapore and NLP Practitioner, she specializes in empowering individuals and organizations to achieve their highest potential through strategic guidance, behavioral transformation, and results-driven coaching methodologies.
              </p>
              <p className="text-gray-600 leading-relaxed" data-testid="about-bio-3">
                Her approach combines deep industry knowledge with compassionate mentoring, creating sustainable pathways for growth across diverse sectors and career stages.
              </p>
            </div>

            {/* Quote */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-l-blue-500 mb-8">
              <CardContent className="p-6">
                <blockquote className="text-gray-700 italic text-lg" data-testid="about-quote">
                  "As a consultant, I empower executives and teams to excel in Sales and Service, fostering alignment, growth, and behavioral transformation."
                </blockquote>
              </CardContent>
            </Card>

            {/* Credentials */}
            <div>
              <h4 className="font-heading text-lg font-semibold text-gray-900 mb-4 flex items-center" data-testid="credentials-title">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                Professional Credentials
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {credentials.map((credential, index) => (
                  <div key={index} className="flex items-center space-x-2" data-testid={`credential-${index}`}>
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <Badge variant="secondary" className="text-sm">
                      {credential}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}