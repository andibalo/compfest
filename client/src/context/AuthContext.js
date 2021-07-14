/* eslint-disable prettier/prettier */
import React, { createContext, useState, useEffect } from 'react';
import { axiosInstance } from '../utils/axiosInstance';
import { setAuthToken } from '../utils/setAuthToken';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = axiosInstance.get('/api/user/me');

      console.log('USER', res.data);
    } catch (error) {
      console.log(error);
    }
  };

  function checkToken() {
    const token = localStorage.getItem('token');

    if (token) {
      console.log('TOKEN EXIST');

      setIsAuthenticated(true);
      fetchUser();
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        checkToken,
        fetchUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
