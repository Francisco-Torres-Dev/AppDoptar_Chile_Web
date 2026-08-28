import type { LoginResponse, User } from '../types';
import { apiClient, delay, USE_MOCK } from './apiClient';
import {
  generateId,
  getMockStore,
  hashOTP,
  hashPassword,
  saveMockStore,
  stripUser,
} from './mock/mockStore';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  region: string;
  commune: string;
}

export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

function createTokens(userId: string) {
  return {
    accessToken: `mock_access_${userId}_${Date.now()}`,
    refreshToken: `mock_refresh_${userId}_${Date.now()}`,
  };
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authService = {
  async register(data: RegisterData): Promise<{ user: User; message: string }> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      if (store.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('El correo ya está registrado');
      }
      const user = {
        id: generateId('user'),
        email: data.email.toLowerCase(),
        passwordHash: hashPassword(data.password),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        region: data.region,
        commune: data.commune,
        role: 'USER' as const,
        emailVerified: false,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      };
      store.users.push(user);
      store.emailVerificationTokens[`verify_${user.id}`] = {
        userId: user.id,
        expiresAt: Date.now() + 86400000,
      };
      saveMockStore(store);
      return {
        user: stripUser(user),
        message: 'Te enviamos un correo para verificar tu cuenta.',
      };
    }
    const { data: res } = await apiClient.post('/auth/register', data);
    return res;
  },

  async login(data: LoginData): Promise<LoginResponse> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const user = store.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
      if (!user || user.passwordHash !== hashPassword(data.password)) {
        throw new Error('Credenciales incorrectas');
      }
      if (user.twoFactorEnabled) {
        const code = generateOTP();
        store.twoFactorCodes[user.id] = {
          codeHash: hashOTP(code),
          expiresAt: Date.now() + 300000,
        };
        saveMockStore(store);
        console.info('[Mock 2FA] Código OTP:', code);
        return {
          user: stripUser(user),
          tokens: createTokens(user.id),
          requires2FA: true,
          tempToken: `temp_${user.id}`,
        };
      }
      const tokens = createTokens(user.id);
      if (data.remember) {
        sessionStorage.setItem('accessToken', tokens.accessToken);
        sessionStorage.setItem('refreshToken', tokens.refreshToken);
      } else {
        sessionStorage.setItem('accessToken', tokens.accessToken);
      }
      return { user: stripUser(user), tokens };
    }
    const { data: res } = await apiClient.post<LoginResponse>('/auth/login', data);
    sessionStorage.setItem('accessToken', res.tokens.accessToken);
    return res;
  },

  async verify2FA(tempToken: string, code: string): Promise<LoginResponse> {
    if (USE_MOCK) {
      await delay();
      const userId = tempToken.replace('temp_', '');
      const store = getMockStore();
      const otpRecord = store.twoFactorCodes[userId];
      if (!otpRecord || otpRecord.expiresAt < Date.now()) {
        throw new Error('Código expirado');
      }
      if (otpRecord.codeHash !== hashOTP(code)) {
        throw new Error('Código incorrecto');
      }
      delete store.twoFactorCodes[userId];
      saveMockStore(store);
      const user = store.users.find((u) => u.id === userId);
      if (!user) throw new Error('Usuario no encontrado');
      const tokens = createTokens(user.id);
      sessionStorage.setItem('accessToken', tokens.accessToken);
      return { user: stripUser(user), tokens };
    }
    const { data: res } = await apiClient.post<LoginResponse>('/auth/verify-2fa', { tempToken, code });
    sessionStorage.setItem('accessToken', res.tokens.accessToken);
    return res;
  },

  async verifyEmail(token: string): Promise<void> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const record = store.emailVerificationTokens[token];
      if (!record || record.expiresAt < Date.now()) {
        throw new Error('Token inválido o expirado');
      }
      const user = store.users.find((u) => u.id === record.userId);
      if (user) user.emailVerified = true;
      delete store.emailVerificationTokens[token];
      saveMockStore(store);
      return;
    }
    await apiClient.post('/auth/verify-email', { token });
  },

  async forgotPassword(email: string): Promise<{ message: string; token?: string }> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { message: 'Si el correo existe, recibirás instrucciones.' };
      }
      const token = `reset_${user.id}_${Date.now()}`;
      store.passwordResetTokens[token] = { userId: user.id, expiresAt: Date.now() + 3600000 };
      saveMockStore(store);
      console.info('[Mock Reset] Token:', token);
      return { message: 'Si el correo existe, recibirás instrucciones.', token };
    }
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token: string, password: string): Promise<void> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const record = store.passwordResetTokens[token];
      if (!record || record.expiresAt < Date.now()) {
        throw new Error('Token inválido o expirado');
      }
      const user = store.users.find((u) => u.id === record.userId);
      if (user) user.passwordHash = hashPassword(password);
      delete store.passwordResetTokens[token];
      saveMockStore(store);
      return;
    }
    await apiClient.post('/auth/reset-password', { token, password });
  },

  async loginWithGoogle(): Promise<LoginResponse> {
    if (USE_MOCK) {
      await delay(500);
      const store = getMockStore();
      let user = store.users.find((u) => u.email === 'google.user@appdoptar.cl');
      if (!user) {
        user = {
          id: generateId('user'),
          email: 'google.user@appdoptar.cl',
          passwordHash: hashPassword('google_oauth'),
          firstName: 'Usuario',
          lastName: 'Google',
          phone: '',
          region: 'Metropolitana',
          commune: 'Santiago',
          role: 'USER',
          emailVerified: true,
          twoFactorEnabled: false,
          createdAt: new Date().toISOString(),
        };
        store.users.push(user);
        saveMockStore(store);
      }
      const tokens = createTokens(user.id);
      sessionStorage.setItem('accessToken', tokens.accessToken);
      return { user: stripUser(user), tokens };
    }
    const { data } = await apiClient.post<LoginResponse>('/auth/google');
    sessionStorage.setItem('accessToken', data.tokens.accessToken);
    return data;
  },

  logout(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  },

  getCurrentUserFromToken(): string | null {
    const token = sessionStorage.getItem('accessToken');
    if (!token || !token.startsWith('mock_access_')) return null;
    const parts = token.split('_');
    return parts[2] || null;
  },
};
