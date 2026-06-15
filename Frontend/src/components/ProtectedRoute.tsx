import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('client' | 'mistri' | 'admin')[];
  redirectTo?: string;
}

const ProtectedRoute = ({ children, allowedRoles, redirectTo = '/mistri-dashboard' }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // If no allowed roles specified, allow all authenticated users
  if (!allowedRoles) {
    return <>{children}</>;
  }

  // If user is not logged in, allow access to public pages
  if (!user) {
    return <>{children}</>;
  }

  // If user role is not in allowed roles, redirect to their appropriate page
  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'mistri') {
      return <Navigate to="/mistri-dashboard" replace />;
    } else if (user.role === 'client') {
      return <Navigate to="/gigs" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
