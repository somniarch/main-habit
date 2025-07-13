import { useState } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState("");

  const login = (userId: string, isAdmin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
    setUserId(userId);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserId("");
  };

  return {
    isLoggedIn,
    isAdmin,
    userId,
    login,
    logout,
  };
} 