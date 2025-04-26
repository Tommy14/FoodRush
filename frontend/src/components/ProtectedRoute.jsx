import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    // Redirect to login page with return URL
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // User doesn't have the required role, redirect to home
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has required role (if specified)
  return children;
};

export default ProtectedRoute;