import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import type { AdminUser } from '@shared/schema';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [, setLocation] = useLocation();

  // Check if user is authenticated
  const { data: adminUser, isLoading, error } = useQuery<{ admin: AdminUser }>({
    queryKey: ['/api/auth/me'],
    retry: false
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && (error || !adminUser)) {
      setLocation('/admin/login');
    }
  }, [isLoading, error, adminUser, setLocation]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Verifying authentication...</div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!adminUser) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}