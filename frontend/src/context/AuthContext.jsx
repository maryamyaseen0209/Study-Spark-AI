import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api, getApiErrorMessage, getStoredTokens, storeTokens } from '../api/client.js';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'studySparkAI.user';

function getStoredUser() {
  try {
    const stored = sessionStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

function storeUser(user) {
  if (user) sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  else sessionStorage.removeItem(USER_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        storeUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
        storeUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async register(payload) {
      try {
        const res = await api.post('/auth/register', payload);
        setUser(res.data.user);
        storeUser(res.data.user);
        storeTokens({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
        toast.success(res.data.message);
        return res.data;
      } catch (error) {
        toast.error(getApiErrorMessage(error));
        throw error;
      }
    },
    async login(payload) {
      try {
        const res = await api.post('/auth/login', payload);
        setUser(res.data.user);
        storeUser(res.data.user);
        storeTokens({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
        toast.success(res.data.message || 'Welcome back');
        return res.data;
      } catch (error) {
        toast.error(getApiErrorMessage(error));
        throw error;
      }
    },
    async logout() {
      const tokens = getStoredTokens();
      await api.post('/auth/logout', { refreshToken: tokens?.refreshToken });
      setUser(null);
      storeUser(null);
      storeTokens(null);
      toast.success('Logged out');
    },
    async forgotPassword(email) {
      try {
        const res = await api.post('/auth/forgot-password', { email });
        toast.success(res.data.message);
        return res.data;
      } catch (error) {
        toast.error(getApiErrorMessage(error));
        throw error;
      }
    },
    async resetPassword(token, password) {
      try {
        const res = await api.post('/auth/reset-password', { token, password });
        toast.success(res.data.message);
        return res.data;
      } catch (error) {
        toast.error(getApiErrorMessage(error));
        throw error;
      }
    },
    async updateProfile(payload) {
      try {
        const res = await api.patch('/auth/profile', payload);
        setUser(res.data.user);
        storeUser(res.data.user);
        toast.success(res.data.message || 'Profile updated');
        return res.data;
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Unable to update profile.'));
        throw error;
      }
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
