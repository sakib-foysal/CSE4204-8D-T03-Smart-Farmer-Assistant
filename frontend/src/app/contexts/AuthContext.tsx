import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, UserProfile } from "../lib/api";

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<UserProfile>;
  register: (payload: Record<string, unknown>) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "smart_farmer_token";
const USER_KEY = "smart_farmer_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUserState] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(Boolean(token));

  const persistSession = (nextToken: string, nextUser: UserProfile) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUserState(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUserState(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    const profile = await api.profile(token);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUserState(profile);
  };

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .profile(token)
      .then((profile) => {
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
        setUserState(profile);
      })
      .catch(clearSession)
      .finally(() => setIsLoading(false));
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login: async (identifier, password) => {
        const response = await api.login(identifier, password);
        persistSession(response.access_token, response.user);
        return response.user;
      },
      register: async (payload) => {
        const response = await api.register(payload);
        persistSession(response.access_token, response.user);
        return response.user;
      },
      logout: async () => {
        if (token) {
          try {
            await api.logout(token);
          } catch {
            // Local logout still protects the UI if the token is already invalid.
          }
        }
        clearSession();
      },
      refreshProfile,
      setUser: (nextUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
        setUserState(nextUser);
      },
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
