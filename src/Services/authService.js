import axiosInstance from "../axiosInstance/axios";
import apiAllRoutes from "../apiRoutes/apiRoutes";

// ------------------------------------
// Login Service
// ------------------------------------
export const login = async (usernameOrEmail, password) => {
  try {
    const response = await axiosInstance.post(apiAllRoutes.auth.login, {
      usernameOrEmail,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
