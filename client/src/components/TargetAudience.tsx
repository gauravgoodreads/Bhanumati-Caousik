import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, Building, Briefcase } from 'lucide-react';

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
    <section id="target-audience" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="audience-title">
            Tailored Guidance for Every Stage
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're a student exploring options, a professional seeking growth, or an organization building excellence, we have specialized solutions for you.
          </p>
        </div>

        {/* Audience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <Card key={index} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm" data-testid={`audience-card-${audience.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-r ${audience.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">{audience.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{audience.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}