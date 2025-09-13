import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Database } from '../types/supabase';

type AdminUser = Database['public']['Tables']['admin_users']['Row'];

interface AuthState {
  type: 'loading' | 'authenticated' | 'unauthenticated';
  user?: {
    id: string;
    username: string;
    displayName: string;
    role: string;
    avatarUrl?: string | null;
  };
}

interface AuthContextType {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({ type: 'loading' });

  useEffect(() => {
    // Check if user is logged in (stored in localStorage)
    const storedAuth = localStorage.getItem('crimson-phoenix-auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        // Verify the stored auth is still valid by checking if user exists
        verifyStoredAuth(parsed.user.id).then(isValid => {
          if (isValid) {
            setAuthState({
              type: 'authenticated',
              user: parsed.user
            });
          } else {
            localStorage.removeItem('crimson-phoenix-auth');
            setAuthState({ type: 'unauthenticated' });
          }
        });
      } catch {
        localStorage.removeItem('crimson-phoenix-auth');
        setAuthState({ type: 'unauthenticated' });
      }
    } else {
      setAuthState({ type: 'unauthenticated' });
    }
  }, []);

  const verifyStoredAuth = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      // Get user by username
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        throw new Error('Invalid username or password');
      }

      // For development/demo - simple password check
      // In production, you'd use Supabase Auth or implement proper hashing
      const isValidPassword = verifyPassword(password, user.role);
      
      if (!isValidPassword) {
        throw new Error('Invalid username or password');
      }

      const authUser = {
        id: user.id,
        username: user.username,
        displayName: user.username, // Using username as display name for now
        role: user.role,
        avatarUrl: null // No avatar field in current schema
      };

      // Store in localStorage
      localStorage.setItem('crimson-phoenix-auth', JSON.stringify({ user: authUser }));

      setAuthState({
        type: 'authenticated',
        user: authUser
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('crimson-phoenix-auth');
    setAuthState({ type: 'unauthenticated' });
  };

  // Simple password verification for demo purposes
  // Replace with proper authentication in production
  const verifyPassword = (password: string, role: string): boolean => {
    // Demo credentials - replace with proper auth
    if (role === 'admin' && password === 'admin123') {
      return true;
    }
    return false;
  };

  const value = {
    authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
