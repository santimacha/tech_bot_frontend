import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthUser } from "./AuthContext";
import type { LoginResponse } from "@/shared/interfaces/login.interface";

function decodeJwtPayload(token: string): { sub: number; role: string } | null {
  try {
    const base64Payload = token.split(".")[1];
    const decoded = JSON.parse(atob(base64Payload));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem("access_token")
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data: LoginResponse) => {
    sessionStorage.setItem("access_token", data.accessToken);

    const payload = decodeJwtPayload(data.accessToken);
    const authUser: AuthUser = {
      user_id: payload?.sub ?? 0,
      email: "",
    };

    sessionStorage.setItem("auth_user", JSON.stringify(authUser));
    setToken(data.accessToken);
    setUser(authUser);
  };

  const logout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        accessToken: token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}