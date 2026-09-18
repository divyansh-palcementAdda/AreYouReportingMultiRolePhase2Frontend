import axiosInstance from "../axiosInstance/axios";
import apiAllRoutes from "../apiRoutes/apiRoutes";

// ------------------------------------
// Get Users by Department Service
// Retrieves all users belonging to a specific department
// Path param: departmentId (string, UUID)
// ------------------------------------
export const getUsersByDepartment = async (departmentId) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.user.getUsersByDepartment.replace("{departmentId}", departmentId));
    return response.data;
  } catch (error) {
    throw error;
  }
};
