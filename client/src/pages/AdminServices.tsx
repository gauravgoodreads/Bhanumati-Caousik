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
  ChevronUp,
  ChevronDown,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Service } from '@shared/schema';
import { insertServiceSchema } from '@shared/schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ICON_OPTIONS = [
  'Users', 'Target', 'TrendingUp', 'Brain', 'Lightbulb', 'MessageCircle', 
  'BookOpen', 'Award', 'Star', 'Zap', 'Heart', 'Shield'
];

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Red' },
  { value: 'teal', label: 'Teal' }
];

// Form schema with extended validation
const serviceFormSchema = insertServiceSchema.extend({
  features: z.array(z.string().min(1, 'Feature cannot be empty')).min(1, 'At least one feature is required')
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

export default function AdminServices() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: 'Users',
      color: 'blue',
      features: [''],
      isActive: true,
      sortOrder: 0
    }
  });

  // Fetch services
  const { data: services = [], isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/admin/services']
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<InsertService, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiRequest('POST', '/api/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Service created",
        description: "The service has been successfully created.",
      });
      setShowDialog(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<InsertService> }) => 
      apiRequest('PUT', `/api/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Service updated",
        description: "The service has been successfully updated.",
      });
      setShowDialog(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Service deleted",
        description: "The service has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    form.reset({
      title: '',
      description: '',
      icon: 'Users',
      color: 'blue',
      features: [''],
      isActive: true,
      sortOrder: 0
    });
    setEditingService(null);
  };

  const openCreateDialog = () => {
    resetForm();
    form.reset({
      title: '',
      description: '',
      icon: 'Users',
      color: 'blue',
      features: [''],
      isActive: true,
      sortOrder: services.length
    });
    setShowDialog(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    form.reset({
      title: service.title,
      description: service.description,
      icon: service.icon,
      color: service.color,
      features: service.features.length > 0 ? service.features : [''],
      isActive: service.isActive,
      sortOrder: service.sortOrder
    });
    setShowDialog(true);
  };

  const onSubmit = (data: ServiceFormData) => {
    const cleanFeatures = data.features.filter(f => f.trim() !== '');
    const submitData = {
      ...data,
      features: cleanFeatures
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: submitData });
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

  const handleDelete = (service: Service) => {
    if (window.confirm(`Are you sure you want to delete "${service.title}"?`)) {
      deleteMutation.mutate(service.id);
    }
  };

  const toggleActive = (service: Service) => {
    updateMutation.mutate({ 
      id: service.id, 
      data: { isActive: !service.isActive } 
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load services</p>
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
                  Manage Services
                </h1>
                <p className="text-sm text-gray-600">
                  Add, edit, and organize your services
                </p>
              </div>
            </div>
            <Button
              onClick={openCreateDialog}
              disabled={createMutation.isPending}
              data-testid="button-create-service"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg h-48 shadow-lg"></div>
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
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r from-${service.color}-500 to-${service.color}-600 rounded-lg flex items-center justify-center text-white font-bold`}>
                          {service.icon.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold" data-testid={`service-title-${service.id}`}>
                            {service.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={service.isActive ? "default" : "secondary"} className="text-xs">
                              {service.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Order: {service.sortOrder}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive(service)}
                          disabled={updateMutation.isPending}
                          data-testid={`button-toggle-${service.id}`}
                        >
                          {service.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(service)}
                          data-testid={`button-edit-${service.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(service)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                          data-testid={`button-delete-${service.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4" data-testid={`service-description-${service.id}`}>
                      {service.description}
                    </p>
                    {service.features.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Features:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                          {service.features.length > 3 && (
                            <li className="text-gray-500">+{service.features.length - 3} more</li>
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

      {/* Service Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Create New Service'}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-icon">
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ICON_OPTIONS.map(icon => (
                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-color">
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COLOR_OPTIONS.map(color => (
                            <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
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
                name="features"
                render={({ field }) => (
                  <FormItem>
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
                      {field.value.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder="Feature description"
                            data-testid={`input-feature-${index}`}
                          />
                          {field.value.length > 1 && (
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingService ? 'Update' : 'Create'} Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}