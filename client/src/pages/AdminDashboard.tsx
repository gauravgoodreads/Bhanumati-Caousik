import { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  BookOpen, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { AdminUser, Service, Package as PackageType, BlogPost, Testimonial, WorkshopBooking, PackageInquiry, PaymentOrder, ContactMessage } from '@shared/schema';

interface DashboardStats {
  services: number;
  packages: number;
  blogPosts: number;
  testimonials: number;
  workshopBookings: number;
  packageInquiries: number;
  totalRevenue: number;
  pendingPayments: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is authenticated
  const { data: adminUser, isLoading: authLoading, error: authError } = useQuery<{ admin: AdminUser }>({
    queryKey: ['/api/auth/me'],
    retry: false
  });

  // Get dashboard statistics
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/admin/services'],
    enabled: !!adminUser,
  });

  const { data: packages = [] } = useQuery<PackageType[]>({
    queryKey: ['/api/admin/packages'],
    enabled: !!adminUser,
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/admin/blog'],
    enabled: !!adminUser,
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['/api/admin/testimonials'],
    enabled: !!adminUser,
  });

  // Get booking and payment data for enhanced analytics
  const { data: workshopBookings = [] } = useQuery<WorkshopBooking[]>({
    queryKey: ['/api/admin/workshop-bookings'],
    enabled: !!adminUser,
  });

  const { data: packageInquiries = [] } = useQuery<PackageInquiry[]>({
    queryKey: ['/api/admin/package-inquiries'],
    enabled: !!adminUser,
  });

  const { data: paymentOrders = [] } = useQuery<PaymentOrder[]>({
    queryKey: ['/api/admin/payment-orders'],
    enabled: !!adminUser,
  });

  const { data: contactMessages = [] } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact-messages'],
    enabled: !!adminUser,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of the admin panel",
      });
      setLocation('/admin/login');
    }
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && (authError || !adminUser)) {
      setLocation('/admin/login');
    }
  }, [authLoading, authError, adminUser, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  const stats: DashboardStats = {
    services: services.length,
    packages: packages.length,
    blogPosts: blogPosts.length,
    testimonials: testimonials.length,
    workshopBookings: workshopBookings.length,
    packageInquiries: packageInquiries.length,
    totalRevenue: paymentOrders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + parseFloat(order.expectedAmount), 0),
    pendingPayments: paymentOrders.filter(order => order.status === 'pending').length
  };

  const statCards = [
    {
      title: 'Services',
      value: stats.services,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Active services'
    },
    {
      title: 'Packages',
      value: stats.packages,
      icon: Package,
      color: 'from-green-500 to-emerald-600',
      description: 'Available packages'
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: BookOpen,
      color: 'from-purple-500 to-indigo-600',
      description: 'Published articles'
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: MessageSquare,
      color: 'from-orange-500 to-red-600',
      description: 'Client testimonials'
    },
    {
      title: 'Workshop Bookings',
      value: stats.workshopBookings,
      icon: Calendar,
      color: 'from-cyan-500 to-teal-600',
      description: 'Total bookings'
    },
    {
      title: 'Package Inquiries',
      value: stats.packageInquiries,
      icon: MessageSquare,
      color: 'from-rose-500 to-pink-600',
      description: 'Customer inquiries'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-600',
      description: 'Completed payments'
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments,
      icon: Package,
      color: 'from-amber-500 to-orange-600',
      description: 'Awaiting payment'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Services',
      description: 'Add, edit, or remove services',
      icon: Users,
      action: () => setLocation('/admin/services')
    },
    {
      title: 'Manage Packages',
      description: 'Update pricing and package details',
      icon: Package,
      action: () => setLocation('/admin/packages')
    },
    {
      title: 'Blog Management',
      description: 'Create and publish blog posts',
      icon: BookOpen,
      action: () => setLocation('/admin/blog')
    },
    {
      title: 'Workshop Calendar',
      description: 'Schedule and manage workshops',
      icon: Calendar,
      action: () => setLocation('/admin/workshops')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900" data-testid="dashboard-title">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {adminUser.admin.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                data-testid="button-settings"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="flex items-center space-x-2"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className={`w-8 h-8 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900" data-testid={`stat-${card.title.toLowerCase()}`}>
                    {card.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <Card 
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={action.action}
                  data-testid={`action-${action.title.toLowerCase().replace(' ', '-')}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                        <action.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          {/* Recent Payments */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Recent Payments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentOrders.slice(0, 5).length > 0 ? (
                paymentOrders
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900" data-testid={`payment-customer-${payment.id}`}>
                        {(payment.customerData as any)?.name || 'Customer'}
                      </p>
                      <p className="text-sm text-gray-600">{(payment.customerData as any)?.email}</p>
                      <p className="text-xs text-gray-500">Order: {payment.razorpayOrderId.slice(-8)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">₹{payment.expectedAmount}</p>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {payment.status}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent payments</p>
                </div>
              )}
              {paymentOrders.length > 5 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => setLocation('/admin/payments')}
                  data-testid="button-view-all-payments"
                >
                  View all {paymentOrders.length} payments
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Contact Requests */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Recent Contact Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactMessages.slice(0, 5).length > 0 ? (
                contactMessages
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((message) => (
                  <div key={message.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900" data-testid={`contact-name-${message.id}`}>
                        {message.name}
                      </p>
                      <p className="text-sm text-gray-600">{message.email}</p>
                      <p className="text-sm text-gray-700 truncate max-w-48">{message.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                        message.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        message.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                        message.status === 'replied' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {message.status}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent contact requests</p>
                </div>
              )}
              {contactMessages.length > 5 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => setLocation('/admin/contacts')}
                  data-testid="button-view-all-contacts"
                >
                  View all {contactMessages.length} contact requests
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Legacy Workshop Bookings and Package Inquiries (moved below) */}
        <motion.div
          className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          {/* Recent Workshop Bookings */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Recent Workshop Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workshopBookings.slice(0, 3).length > 0 ? (
                workshopBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900" data-testid={`booking-customer-${booking.id}`}>
                        {booking.customerName}
                      </p>
                      <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">₹{booking.amount}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent workshop bookings</p>
                </div>
              )}
              {workshopBookings.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => setLocation('/admin/workshops')}
                  data-testid="button-view-all-bookings"
                >
                  View all {workshopBookings.length} bookings
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Package Inquiries */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Recent Package Inquiries</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {packageInquiries.slice(0, 3).length > 0 ? (
                packageInquiries.slice(0, 3).map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900" data-testid={`inquiry-customer-${inquiry.id}`}>
                        {inquiry.customerName}
                      </p>
                      <p className="text-sm text-gray-600">{inquiry.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent package inquiries</p>
                </div>
              )}
              {packageInquiries.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => setLocation('/admin/inquiries')}
                  data-testid="button-view-all-inquiries"
                >
                  View all {packageInquiries.length} inquiries
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Overview */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Payment Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600" data-testid="completed-payments-count">
                    {paymentOrders.filter(order => order.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Completed Payments</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600" data-testid="pending-payments-count">
                    {paymentOrders.filter(order => order.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600" data-testid="failed-payments-count">
                    {paymentOrders.filter(order => order.status === 'failed').length}
                  </p>
                  <p className="text-sm text-gray-600">Failed Payments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}