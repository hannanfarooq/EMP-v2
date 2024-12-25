import React, { createContext, useContext, useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Login } from "src/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userData, setUserData] = useState();

  const login = async (email, password) => {
    const id = toast.loading("Logging in...");
    //do something else
    const isValidUser = await Login(email, password);
    console.log("isValidUser", isValidUser);
    if (!isValidUser.error) {
      // Perform your login logic here
      setUserData(isValidUser.data.data);
      localStorage.setItem(
        "currentUser",
        JSON.stringify(isValidUser.data.data)
      );
      setIsAuthenticated(true);
      toast.update(id, {
        render: "Logged in",
        type: "success",
        autoClose: 2000,
        isLoading: false,
        closeButton: true,
      });
    } else {
      toast.update(id, {
        render:
          isValidUser.status == 200
            ? "Invalid email or password"
            : "Error Connecting server",
        type: "error",
        autoClose: 2000,
        isLoading: false,
        closeButton: true,
      });
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
