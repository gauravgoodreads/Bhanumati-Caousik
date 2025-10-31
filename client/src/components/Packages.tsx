import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { Package } from '@shared/schema';
import { initiatePayment } from '@/lib/payment';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Badge } from '@/components/ui/badge';

const customerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

interface PackageFeature {
  text: string;
  included: boolean;
}

const categories = [
  '8-9 STUDENTS',
  '10-12 STUDENTS',
  'COLLEGE GRADUATES',
  'WORKING PROFESSIONALS',
] as const;

export default function Packages() {
  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('8-9 STUDENTS');
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

  // Filter packages by selected category
  const activePackages = packages.filter(pkg => pkg.isActive && pkg.category === selectedCategory);
  
  // Separate STANDARD and PREMIUM packages
  const standardPackage = activePackages.find(pkg => pkg.tier === 'STANDARD');
  const premiumPackage = activePackages.find(pkg => pkg.tier === 'PREMIUM');

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
          className="text-center mb-12"
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
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Perfect Plan</span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Select your category and discover the right package to unlock your potential
          </motion.p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md'
              }`}
              data-testid={`tab-${category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          key={selectedCategory}
        >
          {/* Standard Package */}
          {standardPackage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <CardHeader className="text-center pb-6">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs font-semibold">
                      STANDARD
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900" data-testid={`package-name-${standardPackage.id}`}>
                    {standardPackage.planName}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-2">
                    {standardPackage.description}
                  </CardDescription>
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent" data-testid={`package-price-${standardPackage.id}`}>
                        ₹{parseFloat(standardPackage.price).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{standardPackage.duration}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {(standardPackage.features as PackageFeature[]).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          feature.included 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {feature.included ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          feature.included ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-6"
                    onClick={() => handlePayment(standardPackage.id, standardPackage.planName, standardPackage.price)}
                    disabled={paymentLoading === standardPackage.id}
                    data-testid={`button-buy-${standardPackage.id}`}
                  >
                    {paymentLoading === standardPackage.id ? 'Processing...' : 'BUY NOW'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Premium Package */}
          {premiumPackage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-300 shadow-2xl hover:shadow-3xl transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                {/* Popular Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold">
                    MOST POPULAR
                  </Badge>
                </div>
                
                <CardHeader className="text-center pb-6">
                  <div className="mb-2">
                    <Badge variant="default" className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-green-600">
                      PREMIUM
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900" data-testid={`package-name-${premiumPackage.id}`}>
                    {premiumPackage.planName}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-2">
                    {premiumPackage.description}
                  </CardDescription>
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent" data-testid={`package-price-${premiumPackage.id}`}>
                        ₹{parseFloat(premiumPackage.price).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{premiumPackage.duration}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {(premiumPackage.features as PackageFeature[]).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          feature.included 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {feature.included ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          feature.included ? 'text-gray-700 font-medium' : 'text-gray-500'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-6 shadow-lg"
                    onClick={() => handlePayment(premiumPackage.id, premiumPackage.planName, premiumPackage.price)}
                    disabled={paymentLoading === premiumPackage.id}
                    data-testid={`button-buy-${premiumPackage.id}`}
                  >
                    {paymentLoading === premiumPackage.id ? 'Processing...' : 'BUY NOW'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Customer Details Form Modal */}
      <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Please provide your contact details to proceed with your package purchase.
            </DialogDescription>
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
