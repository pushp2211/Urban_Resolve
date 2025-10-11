import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(()=>{
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return storedUser? storedUser : null
  }); 

  // useEffect(()=>{
  //   setUser(localStorage.getItem('user'));

  // },[])
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
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}