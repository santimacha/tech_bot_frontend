import { createContext, useContext } from "react";
import type { LoginResponse } from "@/shared/interfaces/login.interface";

export interface AuthUser {
  user_id: number;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  accessToken: string | null;
  user: AuthUser | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
