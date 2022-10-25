import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import React from "react";
import { AuthContext, useAuth } from "../context/AuthContext";

const BASE_URL = "https://whereisparty-backend.herokuapp.com/";

export type AxiosAuthHookProps = { type?: string };

export default function useAxiosAuth({ type = "json" }: AxiosAuthHookProps) {
  const { auth, setAuth } = useAuth() as AuthContext;
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
      async (error) => {
        if ((error.response.status === 422 || error.response.status === 401) && auth.refreshToken) {
          const request = error.config as AxiosRequestConfig;

          const refreshResponse = await axios.get(`${BASE_URL}token/refresh`, {
            headers: {
              Authorization: `Bearer ${auth.refreshToken}`,
            },
          });

          const data = refreshResponse.data;

          if (data.access_token && typeof data.access_token === "string") {
            const accessToken: string = data.access_token;
            setAuth((old) => ({ ...old, accessToken }));

            const headerToken = `Bearer ${accessToken}`;
            if (request.headers) request.headers["Authorization"] = headerToken;
            else request.headers = { Authorization: headerToken };
            //Retry the request
            return axiosInstance(request);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [auth.accessToken, auth.refreshToken, setAuth]);

  return axiosInstanceRef.current;
}
