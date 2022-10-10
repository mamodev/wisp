import axios from "../api/axios";
import { AuthContext, useAuth } from "../context/AuthContext";

export function useRefreshToken() {
  const { setAuth } = useAuth() as AuthContext;

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });

    setAuth((prev) => {
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
}
