import React from "react";
import axios, { AxiosInstance } from "axios";

const BASE_URL = "https://audomia.it:8888/";

export const axiosJson = axios.create({
  headers: { "Content-Type": "application/json" },
  baseURL: BASE_URL,
});
export const axiosForm = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "multipart/form-data" },
});

export type AuthObject = {
  accessToken: string | null;
  refreshToken: string | null;
};
export type AuthContext = {
  auth: AuthObject;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContext | null>(null);

type AuthProviderProps = { children: React.ReactElement };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = React.useState<AuthObject>({
    accessToken: null,
    refreshToken: null,
  });

  React.useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken && refreshToken) {
      setAuth((old) => ({
        ...old,
        accessToken: accessToken,
        refreshToken: refreshToken,
      }));
    }
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    setAuth((oldAuth) => {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      return { accessToken, refreshToken };
    });
  };

  const logout = () => {
    setAuth(() => {
      console.log("logging out");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return { accessToken: null, refreshToken: null };
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return React.useContext(AuthContext);
}
