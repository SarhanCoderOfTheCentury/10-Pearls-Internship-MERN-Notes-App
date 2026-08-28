import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login, register, logout } from "../services/auth.service";
import { getCurrentUser, updateCurrentUser } from "../services/user.service";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";

//creating authcontext
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //loading user
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token"); //would return token value from localstorage

    //if there is no token return
    if (!token) {
      setLoading(false);
      return null;
    }

    //getting the user data for the logged in user
    try {
      const response = await getCurrentUser();
      setUser(response);
      return response;
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userId, userData) => {
    const updated = await updateCurrentUser(userId, userData);
    await loadUser();
    toast?.success?.("Profile updated successfully");
    return updated;
  }, [loadUser]); // toast excluded: it's recreated every render, creating an unstable dep loop

  // Returns the already-loaded user without hitting the API again.
  // Previously called loadUser() here which triggered setUser(newObj) on
  // every ProfilePage mount — a key contributor to the infinite render loop.
  const getProfile = useCallback(() => {
    return user;
  }, [user]);


  //checking if user is authenticated
  const isAuthenticated = !!user;

  //loading user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const loginUser = async (credentials) => {
    try {
      await login(credentials.email, credentials.password);
      await loadUser();
      navigate("/dashboard", { replace: true });
      toast?.success?.("Login successful");
      return true; // signal success to LoginPage
    } catch (error) {
      toast?.error?.(error.message);
      return false;
    }
  };

  const registerUser = async (credentials) => {
    try {
      await register(credentials.name, credentials.email, credentials.password);
      toast?.success?.("User registered successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast?.error?.(error.message);
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login", { replace: true });
      toast?.success?.("Logout successful");
    } catch (error) {
      toast?.error?.(error.message);
    }
  };

  const value = {
    user,
    loading,
    loginUser,
    registerUser,
    logoutUser,
    updateProfile,
    getProfile,
    isAuthenticated
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
