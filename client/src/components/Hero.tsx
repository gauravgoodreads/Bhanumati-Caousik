import { Button } from '@/components/ui/button';
import { Award, Users, TrendingUp, ChevronRight } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 text-sm font-medium mb-8" data-testid="hero-badge">
            Future-proofing careers in the age of digital transformation
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6" data-testid="hero-headline">
            Empowering Growth for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              36+ Years
            </span>
            <br />
            From Corporate Leadership to Career Clarity
          </h1>

          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-gray-800 mb-4" data-testid="hero-subheadline">
            Your Partner in Professional & Personal Development
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto" data-testid="hero-description">
            Expert guidance for Students, Parents, Schools, and Corporates in Sales, Service, Training, and Career Development.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              onClick={() => scrollToSection('services')}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:scale-105 transition-transform text-lg px-8 py-3"
              data-testid="button-discover-path"
            >
              Discover My Path
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('contact')}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
              data-testid="button-free-clarity-call"
            >
              Book a Free Clarity Call
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow" data-testid="stat-experience">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">36+ Years</h3>
              <p className="text-gray-600">Professional Expertise</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow" data-testid="stat-banking">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">22 Years</h3>
              <p className="text-gray-600">Banking Sector Experience</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow" data-testid="stat-certified">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-green-600 rounded-lg mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">COPC & NLP</h3>
              <p className="text-gray-600">Certified Professional</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}