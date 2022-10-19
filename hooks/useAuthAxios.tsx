import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import React from "react";
import { AuthContext, useAuth } from "../context/AuthContext";

const BASE_URL = "https://whereisparty-backend.herokuapp.com/";

export type AxiosAuthHookProps = { type?: string };

export default function useAxiosAuth({ type = "json" }: AxiosAuthHookProps) {
  const { auth } = useAuth() as AuthContext;
  const axiosInstanceRef = React.useRef<AxiosInstance>(
    axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": type === "json" ? "application/json" : "multipart/form-data" },
    })
  );

  React.useEffect(() => {
    const axiosInstance = axiosInstanceRef.current;

    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        if (auth.accessToken) {
          const token = `Bearer ${auth.accessToken}`;
          if (config.headers) config.headers["Authorization"] = token;
          else config.headers = { Authorization: token };
        }
        return config;
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [auth.accessToken]);

  return axiosInstanceRef.current;
}
