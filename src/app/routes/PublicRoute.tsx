import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import type { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/subject" replace />;
  }

  return <>{children}</>;
}
