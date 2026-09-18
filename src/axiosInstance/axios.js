import axios from "axios";
import Cookies from 'js-cookie';

// ------------------------------------
// Axios Instance
// ------------------------------------
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required if refresh token is in HttpOnly cookie
});

// ------------------------------------
// Refresh State
// ------------------------------------
let isRefreshing = false;
let failedQueue = [];

// ------------------------------------
// Process Queued Requests
// ------------------------------------
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// ------------------------------------
// Get Access Token
// ------------------------------------
const getAccessToken = () => {
  return Cookies.get("accessToken");
};

// ------------------------------------
// Get Refresh Token
// ------------------------------------
const getRefreshToken = () => {
  return Cookies.get("refreshToken");
};

// ------------------------------------
// Save Access Token
// ------------------------------------
const setAccessToken = (token) => {
  Cookies.set("accessToken", token, { expires: 7 });
};

// ------------------------------------
// Save Refresh Token
// ------------------------------------
const setRefreshToken = (token) => {
  Cookies.set("refreshToken", token, { expires: 7 });
};

// ------------------------------------
// Clear Authentication
// ------------------------------------
const clearAuth = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");

  // Optional
  sessionStorage.clear();
};

// ------------------------------------
// Request Interceptor
// ------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------------
// Response Interceptor
// ------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // No response from server
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // ------------------------------------
    // Handle 401
    // ------------------------------------
    if (status === 401 && !originalRequest._retry) {
      // Don't refresh token for auth APIs
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/register")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // ------------------------------------
      // If refresh is already running
      // ------------------------------------
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      // ------------------------------------
      // Start Refresh
      // ------------------------------------
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}api/v1/auth/refresh`,
          {
            refreshToken: refreshToken
          },
          {
            withCredentials: true,
          }
        );

        const newAccessToken = response.data?.data?.accessToken;
        const newRefreshToken = response.data?.data?.refreshToken;

        if (!newAccessToken) {
          throw new Error("Access token not received");
        }

        // Save new tokens
        setAccessToken(newAccessToken);
        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }

        // Update default Authorization
        axiosInstance.defaults.headers.common.Authorization =
          `Bearer ${newAccessToken}`;

        // Resolve queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Reject queued requests
        processQueue(refreshError, null);

        // Remove authentication
        clearAuth();

        // Redirect to login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;