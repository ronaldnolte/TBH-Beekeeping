import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to get current user information
 * This is now a wrapper around useAuth for backwards compatibility
 * @deprecated Consider using useAuth() directly from AuthContext
 */
export function useCurrentUser() {
    return useAuth();
}
