import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken, logout as logoutService } from "./AuthServices.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await verifyToken(navigate);
        setUser(data.user);
      } catch (error) {
        //console.error("Token verification failed:", error);
        //await logoutService(navigate);
        setUser(null);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    //console.log(userData);
    setUser(userData);
    //console.log(userData);
    navigate("/dashboard/" + userData.userInfo.id, { replace: true });
  };
  const logout = async () => {
    await logoutService();
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
