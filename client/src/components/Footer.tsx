import { Linkedin, Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import logoUrl from '@assets/logo_1758885211143.png';

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4" data-testid="footer-logo">
              <img src={logoUrl} alt="Learningpartners1inc" className="h-10 w-auto" />
              <div className="ml-3">
                <h3 className="font-logo text-lg font-bold">Learningpartners1inc</h3>
                <p className="text-sm text-gray-400">By Bhanumathi Cousik</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6" data-testid="footer-mission">
              Empowering individuals and organizations to achieve their highest potential through strategic guidance, coaching, and professional development.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-social-linkedin">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-social-facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-social-instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-social-twitter">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4" data-testid="footer-services-title">Services</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="footer-link-career-guidance"
                >
                  Career Guidance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="footer-link-corporate-training"
                >
                  Corporate Training
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="footer-link-leadership-coaching"
                >
                  Leadership Coaching
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="footer-link-facilitation"
                >
                  Facilitation
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4" data-testid="footer-links-title">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="footer-link-about"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('packages')}
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="footer-link-packages"
                >
                  Packages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('blog')}
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="footer-link-blog"
                >
                  Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="footer-link-contact"
                >
                  Contact
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-privacy">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4" data-testid="footer-contact-title">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3" data-testid="footer-contact-email">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">learningpartners1inc@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3" data-testid="footer-contact-phone">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">+91-9710906655</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400" data-testid="footer-copyright">
            © {currentYear} Learningpartners1inc. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2" data-testid="footer-partnership">
            In partnership with Mentoria for enhanced career guidance services.
          </p>
        </div>
      </div>
    </footer>
  );
}