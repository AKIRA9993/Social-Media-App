import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

/**
 * Custom hook to protect actions - redirects to login if user is not authenticated
 * Use this when a user tries to perform an action like creating a post or commenting
 * 
 * Usage:
 * const requireLogin = useAuthRedirect();
 * 
 * In your handler:
 * const handleCreatePost = () => {
 *   if (!requireLogin()) return; // Will redirect if not logged in
 *   // ... rest of your code
 * }
 */
export function useAuthRedirect() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  return () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return false;
    }
    return true;
  };
}
