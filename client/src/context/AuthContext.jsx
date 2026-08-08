import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios.js';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    

    const initializeAuth = async () => {
      // await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay
      try {
        const response = await apiClient.get('/profile', {
          skipAuthRedirect: true,
        });
        const currentUser = response.data?.data?.user;

        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
          return;
        }
      } catch (error) {
        console.error('Error loading user from auth storage:', error);
        const status = error.response?.status;

        if (status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setUser(null);
          return;
        }

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (parseError) {
            console.error('Error parsing cached user from localStorage:', parseError);
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    
    // Also call your backend's logout endpoint
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}