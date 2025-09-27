import PricingCard from './PricingCard';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { Package } from '@shared/schema';
import { initiatePayment } from '@/lib/payment';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const customerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

export default function Packages() {
  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });
  const { toast } = useToast();
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    id: string;
    title: string;
    amount: string;
  } | null>(null);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const handlePayment = (packageId: string, packageTitle: string, amount: string) => {
    console.log('Payment button clicked for package:', packageId);
    setSelectedPackage({ id: packageId, title: packageTitle, amount });
    setShowCustomerForm(true);
  };

  const onSubmitCustomerForm = async (data: CustomerFormData) => {
    if (!selectedPackage) return;
    
    setPaymentLoading(selectedPackage.id);
    setShowCustomerForm(false);
    
    try {
      console.log('Starting payment flow with customer details');
      
      await initiatePayment({
        amount: parseFloat(selectedPackage.amount),
        itemId: selectedPackage.id,
        itemTitle: selectedPackage.title,
        type: 'package',
        customerData: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
        onSuccess: (response) => {
          console.log('Payment successful:', response);
          setPaymentLoading(null);
          setSelectedPackage(null);
          form.reset();
          toast({
            title: "Payment Successful!",
            description: `Thank you for purchasing ${selectedPackage.title}. We'll contact you shortly to schedule your sessions.`,
          });
        },
        onError: (error) => {
          console.error('Payment error:', error);
          setPaymentLoading(null);
          setSelectedPackage(null);
          toast({
            title: "Payment Failed",
            description: "There was an error processing your payment. Please try again.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error('Payment handler error:', error);
      setPaymentLoading(null);
      setSelectedPackage(null);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCloseModal = () => {
    setShowCustomerForm(false);
    setSelectedPackage(null);
    form.reset();
  };

  const handleInquiry = (packageId: string, packageTitle: string) => {
    // TODO: Create inquiry form
    // For now, scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter only active packages and transform data
  const activePackages = packages.filter(pkg => pkg.isActive);
  
  const transformedPackages = activePackages.map(pkg => ({
    title: pkg.title,
    price: `₹${pkg.price}`,
    description: pkg.description,
    features: pkg.features,
    isPopular: pkg.isPopular,
    buttonText: pkg.category === 'corporate' ? 'Request Inquiry' : 'Get Started',
    onButtonClick: () => {
      if (pkg.category === 'corporate') {
        handleInquiry(pkg.id, pkg.title);
      } else {
        handlePayment(pkg.id, pkg.title, pkg.price);
      }
    }
  }));

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading packages...</p>
          </div>
        </div>
      </section>
    );
  }

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
      
      {/* Customer Details Form Modal */}
      <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCustomerForm)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your full name"
                        data-testid="input-customer-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        placeholder="Enter your email address"
                        data-testid="input-customer-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel"
                        placeholder="Enter your phone number"
                        data-testid="input-customer-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  data-testid="button-cancel-payment"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-testid="button-proceed-payment"
                  disabled={paymentLoading === selectedPackage?.id}
                >
                  {paymentLoading === selectedPackage?.id ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
}