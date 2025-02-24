import React, { createContext, useContext, useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Login } from "src/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userData, setUserData] = useState();

  const login = async (email, password) => {
    try {
     
      
      const isValidUser = await Login(email, password);
     
      if (!isValidUser.error) {
        toast.success("Logged in");
       
        
        setUserData(isValidUser.data.data);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(isValidUser.data.data)
        );
        setIsAuthenticated(true);
      } else {

        if (isValidUser.status === 200)
        {
          toast.error("Invalid email or password");
        }
        else
        {
          toast.error("Error connecting to server");
          
        }
       
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUserData(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
      setUserData(storedUserData);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
