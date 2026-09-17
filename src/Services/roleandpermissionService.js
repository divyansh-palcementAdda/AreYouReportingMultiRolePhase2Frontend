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

// ------------------------------------
// Create Role Service
// ------------------------------------
export const createRole = async (roleData) => {
  try {
    const response = await axiosInstance.post(
      apiAllRoutes.rolesAndPermissions.createRole,
      roleData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Update Role Service
// ------------------------------------
export const updateRole = async (id, roleData) => {
  try {
    const response = await axiosInstance.put(
      apiAllRoutes.rolesAndPermissions.updateRole.replace("{id}", id),
      roleData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Delete Role Service
// ------------------------------------
export const deleteRole = async (id) => {
  try {
    const response = await axiosInstance.delete(
      apiAllRoutes.rolesAndPermissions.deleteRole.replace("{id}", id)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Update Role Permissions Service
// ------------------------------------
export const updateRolePermissions = async (roleId, permissionIds) => {
  try {
    const response = await axiosInstance.put(
      apiAllRoutes.rolesAndPermissions.updateRolePermissions.replace("{id}", roleId),
      { permissionIds }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

