import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/navbar/add-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setUser(res.data.data);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      // If 401, maybe clear token? For now just set error.
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    fetchUser // Expose if manual refresh needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
