import PricingCard from './PricingCard';

export default function Packages() {
  const handlePayment = (packageName: string, amount: number) => {
    // TODO: Remove mock functionality - integrate with Razorpay
    console.log(`Payment initiated for ${packageName}: ₹${amount}`);
    alert(`Payment integration would be triggered here for ${packageName} - ₹${amount}`);
  };

  const handleQuoteRequest = () => {
    // TODO: Remove mock functionality - integrate with contact form
    console.log('Quote request initiated');
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const packages = [
    {
      title: 'Student Kickstarter',
      price: '₹7,999',
      description: 'Perfect for students starting their career journey',
      features: [
        'Psychometric Assessment',
        '2 One-on-One Coaching Sessions',
        'CV Review & Optimization',
        'Career Path Guidance',
        'Skills Assessment Report'
      ],
      buttonText: 'Pay Now',
      onButtonClick: () => handlePayment('Student Kickstarter', 7999)
    },
    {
      title: 'Professional Pivot',
      price: '₹14,999',
      description: 'Comprehensive package for career transformation',
      features: [
        'In-depth Career Audit',
        '4 One-on-One Coaching Sessions',
        'LinkedIn Profile Optimization',
        'Resume & Cover Letter Review',
        'Interview Preparation',
        '30-day Follow-up Support'
      ],
      buttonText: 'Pay Now',
      isPopular: true,
      onButtonClick: () => handlePayment('Professional Pivot', 14999)
    },
    {
      title: 'Corporate Workshop',
      price: 'Custom Quote',
      description: 'Tailored solutions for organizations and teams',
      features: [
        'Custom Training Modules',
        'Team Assessment & Analysis',
        'Leadership Development Programs',
        'Sales & Service Excellence Training',
        'Process Improvement Consultation',
        'Ongoing Support & Monitoring'
      ],
      buttonText: 'Request a Quote',
      onButtonClick: handleQuoteRequest
    }
  ];

  return (
    <section id="packages" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="packages-title">
            Choose Your Transformation Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Flexible packages designed to meet your unique needs, whether you're an individual seeking growth or an organization building excellence.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <PricingCard
              key={index}
              title={pkg.title}
              price={pkg.price}
              description={pkg.description}
              features={pkg.features}
              buttonText={pkg.buttonText}
              isPopular={pkg.isPopular}
              onButtonClick={pkg.onButtonClick}
            />
          ))}
        </div>

        {/* Payment Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            All packages include comprehensive support and follow-up. Corporate packages are customized based on specific requirements.
          </p>
        </div>
      </div>
    </section>
  );
}