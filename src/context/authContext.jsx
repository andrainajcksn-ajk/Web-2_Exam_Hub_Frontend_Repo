import { createContext, useCallback, useState } from "react";
import * as authApi from "../api/authApi";
import { clearToken, getToken } from "../api/client";
export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authApi.getStoredUser());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    const userData = await authApi.login(email, password);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    authApi.clearUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
