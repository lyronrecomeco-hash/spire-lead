import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  tokenName: string | null;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('genesis_token');
    const savedTokenName = localStorage.getItem('genesis_token_name');
    if (savedToken) {
      setToken(savedToken);
      setTokenName(savedTokenName);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (inputToken: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('access_tokens')
      .select('*')
      .eq('token', inputToken)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    // Update last used
    await supabase
      .from('access_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);

    localStorage.setItem('genesis_token', inputToken);
    localStorage.setItem('genesis_token_name', data.name);
    setToken(inputToken);
    setTokenName(data.name);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('genesis_token');
    localStorage.removeItem('genesis_token_name');
    setToken(null);
    setTokenName(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, tokenName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
