import React, { useCallback, useState } from 'react';
import Cookies from 'js-cookie';

import * as auth from '@/api/endpoints/auth';
import type { User } from '@/types/auth';

import { AuthContext } from './auth-context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = Cookies.get('user_data');
    const token = Cookies.get('token');

    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ensure both _id and id are present for compatibility
        if (parsedUser.id && !parsedUser._id) parsedUser._id = parsedUser.id;
        if (parsedUser._id && !parsedUser.id) parsedUser.id = parsedUser._id;
        return parsedUser;
      } catch (error) {
        console.error('Failed to parse saved user data', error);
        Cookies.remove('user_data', { path: '/' });
        Cookies.remove('token', { path: '/' });
      }
    }
    return null;
  });

  const isLoading = false;

  const login = useCallback((token: string, userData: User) => {
    // Ensure both _id and id are present
    const normalizedUser = { ...userData };
    if (normalizedUser.id && !normalizedUser._id) normalizedUser._id = normalizedUser.id;
    if (normalizedUser._id && !normalizedUser.id) normalizedUser.id = normalizedUser._id;

    Cookies.set('token', token, { expires: 7, path: '/' });
    Cookies.set('user_data', JSON.stringify(normalizedUser), { expires: 7, path: '/' });
    setUser(normalizedUser);
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      Cookies.set('user_data', JSON.stringify(updated), { expires: 7, path: '/' });
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
