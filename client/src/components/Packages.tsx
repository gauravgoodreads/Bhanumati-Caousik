import PricingCard from './PricingCard';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { Package } from '@shared/schema';

export default function Packages() {
  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });

  const handlePayment = (packageTitle: string, amount: string) => {
    // TODO: Integrate with Razorpay
    console.log(`Payment initiated for ${packageTitle}: ₹${amount}`);
    alert(`Payment integration would be triggered here for ${packageTitle} - ₹${amount}`);
  };

  const handleInquiry = (packageId: string, packageTitle: string) => {
    // TODO: Create inquiry form
    console.log(`Inquiry for package: ${packageTitle}`);
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section id="packages" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-80 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-lg animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-4 w-32"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 w-40"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-200 rounded mt-8"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Transform packages data for the component
  const transformedPackages = packages.map(pkg => ({
    title: pkg.title,
    price: `₹${parseFloat(pkg.price).toLocaleString('en-IN')}`,
    description: pkg.description,
    features: pkg.features,
    buttonText: pkg.category === 'corporate' ? 'Request Inquiry' : 'Get Started',
    isPopular: pkg.isPopular,
    onButtonClick: pkg.category === 'corporate' 
      ? () => handleInquiry(pkg.id, pkg.title)
      : () => handlePayment(pkg.title, pkg.price)
  }));

  return (
    <section id="packages" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <motion.h2 
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" 
            data-testid="packages-title"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Transformation</span> Journey
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Flexible packages designed to meet your unique needs, whether you're an individual seeking growth or an organization building excellence.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {transformedPackages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <PricingCard
                title={pkg.title}
                price={pkg.price}
                description={pkg.description}
                features={pkg.features}
                buttonText={pkg.buttonText}
                onButtonClick={pkg.onButtonClick}
                isPopular={pkg.isPopular}
                data-testid={`package-card-${index}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}