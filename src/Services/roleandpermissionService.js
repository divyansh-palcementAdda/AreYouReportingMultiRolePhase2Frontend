import axiosInstance from "../axiosInstance/axios";
import apiAllRoutes from "../apiRoutes/apiRoutes";

// ------------------------------------
// Get All Roles Service
// ------------------------------------
export const getAllRoles = async () => {
  try {
    const response = await axiosInstance.get(
      apiAllRoutes.rolesAndPermissions.getAllRoles
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Get All Permissions Service
// ------------------------------------
export const getAllPermissions = async () => {
  try {
    const response = await axiosInstance.get(
      apiAllRoutes.rolesAndPermissions.getAllPermissions
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Get Permissions by Role Service
// ------------------------------------
export const getPermissionsByRole = async (roleId) => {
  try {
    const response = await axiosInstance.get(
      apiAllRoutes.rolesAndPermissions.getpermissionByRoleId,
      {
        params: {
          roleId: roleId,
        },
      }
    );
    // This endpoint returns the array directly, not wrapped in data
    return response.data;
  } catch (error) {
    throw error;
  }
};

