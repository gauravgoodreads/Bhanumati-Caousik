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
import type { AdminUser, Service, Package as PackageType, BlogPost, Testimonial } from '@shared/schema';

interface DashboardStats {
  services: number;
  packages: number;
  blogPosts: number;
  testimonials: number;
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
    testimonials: testimonials.length
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

        {/* Recent Activity Placeholder */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Activity tracking will be implemented in the next phase</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}