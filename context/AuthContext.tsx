import React from "react";
import axios, { AxiosInstance } from "axios";

const BASE_URL = "https://whereisparty-backend.herokuapp.com/";

export const axiosJson = axios.create({
  headers: { "Content-Type": "application/json" },
  baseURL: BASE_URL,
});
export const axiosForm = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "multipart/form-data" },
});

export type AuthObject = { accessToken: string | null; refreshToken: string | null };
export type AuthContext = {
  auth: AuthObject;
  setAuth: React.Dispatch<React.SetStateAction<AuthObject>>;
};

export const AuthContext = React.createContext<AuthContext | null>(null);

type AuthProviderProps = { children: React.ReactElement };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = React.useState<AuthObject>({ accessToken: null, refreshToken: null });

  React.useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken && refreshToken) {
      setAuth((old) => ({ ...old, accessToken: accessToken, refreshToken: refreshToken }));
    }
  }, []);

  React.useEffect(() => {
    if (auth.accessToken && auth.refreshToken) {
      localStorage.setItem("access_token", auth.accessToken);
      localStorage.setItem("refresh_token", auth.refreshToken);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }, [auth.accessToken, auth.refreshToken]);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return React.useContext(AuthContext);
}
