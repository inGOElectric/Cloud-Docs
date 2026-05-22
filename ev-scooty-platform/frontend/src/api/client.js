import axios from "axios";
import { jwtDecode } from "jwt-decode";

const client = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return null;
  }

  const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
    refresh: refreshToken,
  });

  localStorage.setItem("accessToken", response.data.access);
  return response.data.access;
}

function tokenExpiresSoon(token) {
  try {
    const decoded = jwtDecode(token);
    const expiresAt = decoded.exp * 1000;
    return expiresAt - Date.now() < 60 * 1000;
  } catch {
    return true;
  }
}

function clearTokensAndGoToLogin() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}

client.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");
  let usableToken = token;

  if (usableToken && tokenExpiresSoon(usableToken)) {
    try {
      usableToken = await refreshAccessToken();
    } catch (error) {
      clearTokensAndGoToLogin();
      return Promise.reject(error);
    }
  }

  if (usableToken) {
    config.headers.Authorization = `Bearer ${usableToken}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearTokensAndGoToLogin();
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return client(originalRequest);
    } catch (refreshError) {
      clearTokensAndGoToLogin();
      return Promise.reject(refreshError);
    }
  }
);

export default client;
