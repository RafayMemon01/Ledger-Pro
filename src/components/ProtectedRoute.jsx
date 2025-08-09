import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

export default function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { user, loading, isInitialized } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while auth is initializing
  if (!isInitialized || loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Render protected content if authenticated
  return children;
}
