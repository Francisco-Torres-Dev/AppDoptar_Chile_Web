import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<{ requires2FA?: boolean; tempToken?: string }>;
  loginGoogle: () => Promise<void>;
  verify2FA: (tempToken: string, code: string) => Promise<void>;
  register: (data: Parameters<typeof authService.register>[0]) => Promise<string>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (...roles: User['role'][]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const userId = authService.getCurrentUserFromToken();
    if (!userId) {
      setUser(null);
      return;
    }
    const u = await userService.getById(userId);
    setUser(u);
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string, remember?: boolean) => {
    const res = await authService.login({ email, password, remember });
    if (!res.requires2FA) setUser(res.user);
    return { requires2FA: res.requires2FA, tempToken: res.tempToken };
  }, []);

  const verify2FA = useCallback(async (tempToken: string, code: string) => {
    const res = await authService.verify2FA(tempToken, code);
    setUser(res.user);
  }, []);

  const loginGoogle = useCallback(async () => {
    const res = await authService.loginWithGoogle();
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: Parameters<typeof authService.register>[0]) => {
    const res = await authService.register(data);
    return res.message;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const hasRole = useCallback((...roles: User['role'][]) => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  const value = useMemo(
    () => ({ user, loading, login, loginGoogle, verify2FA, register, logout, refreshUser, hasRole }),
    [user, loading, login, loginGoogle, verify2FA, register, logout, refreshUser, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
