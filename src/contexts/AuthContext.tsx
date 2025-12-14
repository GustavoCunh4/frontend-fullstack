import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { loginRequest } from '../api/auth';
import type { LoginPayload } from '../api/auth';
import { decodeExpiration } from '../utils/jwt';
import { toastWithLink } from '../utils/toast';

const STORAGE_KEY = 'fsmp-auth';

interface AuthState {
  token: string | null;
  email: string | null;
  expiresAt: number | null;
  initializing: boolean;
}

type LogoutReason = 'manual' | 'expired' | 'unauthorized';

interface LogoutOptions {
  reason?: LogoutReason;
  silent?: boolean;
  message?: string;
}

interface AuthContextValue {
  token: string | null;
  email: string | null;
  expiresAt: number | null;
  initializing: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: (options?: LogoutOptions) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const initialState: AuthState = {
  token: null,
  email: null,
  expiresAt: null,
  initializing: true
};

function persistAuth(state: AuthState) {
  if (state.token) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: state.token,
        email: state.email,
        expiresAt: state.expiresAt
      })
    );
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function readPersistedState(): AuthState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...initialState, initializing: false };
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed.expiresAt && parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return { ...initialState, initializing: false };
    }
    return {
      token: parsed.token ?? null,
      email: parsed.email ?? null,
      expiresAt: parsed.expiresAt ?? null,
      initializing: false
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { ...initialState, initializing: false };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    setState(readPersistedState());
  }, []);

  const logout = useCallback((options?: LogoutOptions) => {
    setState({
      token: null,
      email: null,
      expiresAt: null,
      initializing: false
    });
    localStorage.removeItem(STORAGE_KEY);

    if (options?.silent) return;
    const message =
      options?.message ||
      (options?.reason === 'expired'
        ? 'Sessão expirada. Faça login novamente.'
        : options?.reason === 'unauthorized'
          ? 'Autenticação necessária. Entre novamente.'
          : 'Logout realizado com sucesso.');
    const tone = options?.reason === 'manual' ? 'success' : 'error';
    toastWithLink(tone, message);
  }, []);

  useEffect(() => {
    if (!state.token || !state.expiresAt) return;
    const timeout = state.expiresAt - Date.now();
    if (timeout <= 0) {
      logout({ reason: 'expired', silent: true });
      toastWithLink('error', 'Sessão expirada. Faça login novamente.');
      return;
    }
    const timer = window.setTimeout(() => {
      logout({ reason: 'expired', silent: true });
      toastWithLink('error', 'Sessão expirada. Faça login novamente.');
    }, timeout);

    return () => window.clearTimeout(timer);
  }, [state.token, state.expiresAt, logout]);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await loginRequest(payload);
    const expiresAt = decodeExpiration(response.token);
    const nextState: AuthState = {
      token: response.token,
      email: payload.email,
      expiresAt,
      initializing: false
    };
    setState(nextState);
    persistAuth(nextState);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: state.token,
      email: state.email,
      expiresAt: state.expiresAt,
      initializing: state.initializing,
      isAuthenticated: Boolean(state.token),
      login,
      logout
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
