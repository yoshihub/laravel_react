import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log('API_BASE_URL:', API_BASE_URL);

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // トークンをlocalStorageから読み込み
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      // ユーザー情報を取得
      fetchUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // ユーザー情報取得
  const fetchUser = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
      // トークンが無効な場合は削除
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ログイン
  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Login attempt to:', `${API_BASE_URL}/login`);
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      console.log('AuthContext: Login response:', response.data);
      const { user: userData, token: authToken } = response.data.data;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('auth_token', authToken);
      console.log('AuthContext: Login successful, user set');
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        throw new Error(error.response.data.message || 'ログインに失敗しました');
      }
      throw error;
    }
  };

  // ユーザー登録
  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('AuthContext: Register attempt to:', `${API_BASE_URL}/register`);
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password,
      });

      console.log('AuthContext: Register response:', response.data);
      const { user: userData, token: authToken } = response.data.data;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('auth_token', authToken);
      console.log('AuthContext: Register successful, user set');
    } catch (error) {
      console.error('AuthContext: Register error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        throw new Error(error.response.data.message || 'ユーザー登録に失敗しました');
      }
      throw error;
    }
  };

  // ログアウト
  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
