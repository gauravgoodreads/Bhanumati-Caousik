import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Star,
  DollarSign,
  Clock,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Package, InsertPackage } from '@shared/schema';
import { insertPackageSchema } from '@shared/schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CATEGORY_OPTIONS = [
  'individual', 'corporate', 'group', 'premium', 'basic', 'advanced'
];

// Form schema with extended validation
const packageFormSchema = insertPackageSchema.extend({
  features: z.array(z.string().min(1, 'Feature cannot be empty')).min(1, 'At least one feature is required'),
  price: z.string().min(1, 'Price is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Price must be a positive number')
});

type PackageFormData = z.infer<typeof packageFormSchema>;

export default function AdminPackages() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  
  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      duration: '',
      features: [''],
      isPopular: false,
      isActive: true,
      category: 'individual',
      sortOrder: 0
    }
  });

  // Fetch packages
  const { data: packages = [], isLoading, error } = useQuery<Package[]>({
    queryKey: ['/api/admin/packages']
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<InsertPackage, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiRequest('POST', '/api/packages', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/packages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      toast({
        title: "Package created",
        description: "The package has been successfully created.",
      });
      setShowDialog(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create package. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<InsertPackage> }) => 
      apiRequest('PUT', `/api/packages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/packages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      toast({
        title: "Package updated",
        description: "The package has been successfully updated.",
      });
      setShowDialog(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update package. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/packages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/packages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      toast({
        title: "Package deleted",
        description: "The package has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete package. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    form.reset({
      title: '',
      description: '',
      price: '',
      duration: '',
      features: [''],
      isPopular: false,
      isActive: true,
      category: 'individual',
      sortOrder: 0
    });
    setEditingPackage(null);
  };

  const openCreateDialog = () => {
    resetForm();
    form.reset({
      title: '',
      description: '',
      price: '',
      duration: '',
      features: [''],
      isPopular: false,
      isActive: true,
      category: 'individual',
      sortOrder: packages.length
    });
    setShowDialog(true);
  };

  const openEditDialog = (pkg: Package) => {
    setEditingPackage(pkg);
    form.reset({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration,
      features: pkg.features.length > 0 ? pkg.features : [''],
      isPopular: pkg.isPopular,
      isActive: pkg.isActive,
      category: pkg.category,
      sortOrder: pkg.sortOrder
    });
    setShowDialog(true);
  };

  const onSubmit = (data: PackageFormData) => {
    const cleanFeatures = data.features.filter(f => f.trim() !== '');
    const submitData = {
      ...data,
      features: cleanFeatures
    };

    if (editingPackage) {
      updateMutation.mutate({ id: editingPackage.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const currentFeatures = form.getValues('features');
    const newFeatures = [...currentFeatures];
    newFeatures[index] = value;
    form.setValue('features', newFeatures);
  };

  const addFeature = () => {
    const currentFeatures = form.getValues('features');
    form.setValue('features', [...currentFeatures, '']);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features');
    if (currentFeatures.length > 1) {
      const newFeatures = currentFeatures.filter((_, i) => i !== index);
      form.setValue('features', newFeatures);
    }
  };

  const handleDelete = (pkg: Package) => {
    if (window.confirm(`Are you sure you want to delete "${pkg.title}"?`)) {
      deleteMutation.mutate(pkg.id);
    }
  };

  const toggleActive = (pkg: Package) => {
    updateMutation.mutate({ 
      id: pkg.id, 
      data: { isActive: !pkg.isActive } 
    });
  };

  const togglePopular = (pkg: Package) => {
    updateMutation.mutate({ 
      id: pkg.id, 
      data: { isPopular: !pkg.isPopular } 
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load packages</p>
          <Button onClick={() => setLocation('/admin')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/admin')}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900" data-testid="page-title">
                  Manage Packages
                </h1>
                <p className="text-sm text-gray-600">
                  Create and manage coaching packages
                </p>
              </div>
            </div>
            <Button
              onClick={openCreateDialog}
              disabled={createMutation.isPending}
              data-testid="button-create-package"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg h-64 shadow-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group relative ${
                  pkg.isPopular ? 'ring-2 ring-yellow-400' : ''
                }`}>
                  {pkg.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-yellow-500 text-white px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-2" data-testid={`package-title-${pkg.id}`}>
                          {pkg.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center text-green-600 font-bold">
                            <DollarSign className="h-4 w-4" />
                            ₹{parseFloat(pkg.price).toLocaleString()}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {pkg.duration}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={pkg.isActive ? "default" : "secondary"} className="text-xs">
                            {pkg.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {pkg.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            #{pkg.sortOrder}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePopular(pkg)}
                          disabled={updateMutation.isPending}
                          className={pkg.isPopular ? 'text-yellow-600' : 'text-gray-400'}
                          data-testid={`button-star-${pkg.id}`}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive(pkg)}
                          disabled={updateMutation.isPending}
                          data-testid={`button-toggle-${pkg.id}`}
                        >
                          {pkg.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(pkg)}
                          data-testid={`button-edit-${pkg.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(pkg)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                          data-testid={`button-delete-${pkg.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4" data-testid={`package-description-${pkg.id}`}>
                      {pkg.description}
                    </p>
                    {pkg.features.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Features:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {pkg.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                          {pkg.features.length > 3 && (
                            <li className="text-gray-500">+{pkg.features.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Package Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? 'Edit Package' : 'Create New Package'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="number"
                          step="0.01"
                          data-testid="input-price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="e.g., 3 months, 6 sessions"
                          data-testid="input-duration"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        rows={3}
                        data-testid="textarea-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div>
              <div className="flex justify-between items-center mb-2">
                <FormLabel>Features</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  data-testid="button-add-feature"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                {form.watch('features').map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Feature description"
                      data-testid={`input-feature-${index}`}
                    />
                    {form.watch('features').length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        data-testid={`button-remove-feature-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="number"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-sort-order"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center space-x-6 pt-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-active"
                          />
                        </FormControl>
                        <FormLabel>Active</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isPopular"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-popular"
                          />
                        </FormControl>
                        <FormLabel>Popular</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
          </form>
          </Form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingPackage ? 'Update' : 'Create'} Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}