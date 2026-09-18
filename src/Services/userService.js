import axiosInstance from "../axiosInstance/axios";
import apiAllRoutes from "../apiRoutes/apiRoutes";

// ------------------------------------
// Add User Service
// Create user with department/sub-department mappings and role assignments
// ------------------------------------
export const addUser = async (userData) => {
  try {
    const response = await axiosInstance.post(apiAllRoutes.user.addUser, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Get All Users Service
// ------------------------------------
export const getAllUsers = async (params) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.user.getAllUsers, {
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Update User Service
// ------------------------------------
export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(apiAllRoutes.user.updateUser.replace("{id}", id), userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Delete User Service
// ------------------------------------
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(apiAllRoutes.user.deleteUser.replace("{id}", id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Get User By ID Service
// ------------------------------------
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.user.getUserById.replace("{id}", id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
