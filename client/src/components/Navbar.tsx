import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoUrl from '@assets/logo_1758885211143.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const isHome = location === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isHome) {
      window.location.href = `${import.meta.env.BASE_URL}${id === 'about' ? '' : `#${id}`}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navItems = [
    { label: 'About', section: 'about', testId: 'nav-about', href: '/#about' },
    { label: 'Services', section: 'services', testId: 'nav-services', href: '/#services' },
    { label: 'Pricing', section: 'pricing', testId: 'nav-pricing', href: '/pricing', isRoute: true },
    { label: 'Blog', section: 'blog', testId: 'nav-blog', href: '/blog', isRoute: true },
    { label: 'Contact', section: 'contact', testId: 'nav-contact', href: '/#contact' },
  ];

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-white/20' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0 flex items-center" 
            data-testid="logo-container"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.img 
              src={logoUrl} 
              alt="Learningpartners1inc" 
              className="h-12 w-auto"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <div className="ml-3 hidden sm:block">
              <h1 className="font-logo text-xl font-bold text-gray-900">Learningpartners1inc</h1>
              <p className="text-xs text-gray-600 font-medium">By Bhanumathi Cousik</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              item.isRoute ? (
                <Link key={item.section} href={item.href}>
                  <motion.span
                    className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 relative cursor-pointer inline-block"
                    data-testid={item.testId}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              ) : (
                <motion.button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 relative"
                  data-testid={item.testId}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {item.label}
                </motion.button>
              )
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
                data-testid="button-book-consultation"
              >
                Book a Consultation
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="ml-2 h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden bg-white/95 backdrop-blur-xl border-t shadow-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item, index) => (
                  item.isRoute ? (
                    <Link key={item.section} href={item.href}>
                      <span
                        className="block w-full text-left px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 rounded-lg font-medium"
                        data-testid={`mobile-${item.testId}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <motion.button
                      key={item.section}
                      onClick={() => scrollToSection(item.section)}
                      className="block w-full text-left px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 rounded-lg font-medium"
                      data-testid={`mobile-${item.testId}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      {item.label}
                    </motion.button>
                  )
                ))}
                <motion.div 
                  className="px-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.25 }}
                >
                  <Button 
                    onClick={() => scrollToSection('contact')}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:shadow-xl transition-all duration-300 py-3 rounded-xl font-semibold"
                    data-testid="mobile-button-book-consultation"
                  >
                    Book a Consultation
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}