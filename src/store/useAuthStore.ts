import { create } from 'zustand';

const LS_TOKEN_KEY = 'genovax_auth_token';
const LS_USER_KEY = 'genovax_auth_user';

let onLogoutCallback: (() => void) | null = null;
export const registerLogoutCallback = (cb: () => void) => {
  onLogoutCallback = cb;
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  createdAt?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<void>;
  clearError: () => void;
  getAuthHeader: () => Record<string, string>;
}

function loadToken(): string | null {
  try {
    return localStorage.getItem(LS_TOKEN_KEY);
  } catch {
    return null;
  }
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem(LS_TOKEN_KEY, token);
  localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_USER_KEY);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: loadToken(),
  user: loadUser(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        set({ isLoading: false, error: data.message || 'Login failed.' });
        return false;
      }

      saveAuth(data.token, data.user);
      set({ token: data.token, user: data.user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Network error. Is the backend running?' });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        set({ isLoading: false, error: data.message || 'Registration failed.' });
        return false;
      }

      saveAuth(data.token, data.user);
      set({ token: data.token, user: data.user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Network error. Is the backend running?' });
      return false;
    }
  },

  logout: () => {
    clearAuth();
    // Clear project-related local storage caches
    localStorage.removeItem('genovax_projects_list');
    localStorage.removeItem('genovax_builder_pages');
    localStorage.removeItem('genovax_builder_active_page');
    
    // Clear builder store projects state
    try {
      if (onLogoutCallback) {
        onLogoutCallback();
      }
    } catch (e) {
      console.warn('Could not reset builder store state synchronously', e);
    }
    
    set({ token: null, user: null, error: null });
  },

  verifyToken: async () => {
    const token = get().token;
    if (!token) return;

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        // Token expired or invalid — log out
        clearAuth();
        set({ token: null, user: null });
        return;
      }

      // Refresh user data
      const user = data.user;
      localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
      set({ user });
    } catch {
      // Network error — keep user logged in with stale data
    }
  },

  clearError: () => set({ error: null }),

  getAuthHeader: () => {
    const token = get().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
}));
