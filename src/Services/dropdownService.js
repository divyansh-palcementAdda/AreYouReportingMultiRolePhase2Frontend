import axiosInstance from "../axiosInstance/axios";
import apiAllRoutes from "../apiRoutes/apiRoutes";

// ------------------------------------
// Get Eligible Assignees Service
// Retrieves selectable users who can be assigned tasks within a given department or sub-department context
// Query params:
// - departmentId: string (UUID)
// - subDepartmentId: string (UUID)
// - search: string
// - pageable: object (required) - { page: number, size: number, sort: string[] }
// ------------------------------------
export const getEligibleAssignees = async (params) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.dropdown.getEligibleAssignees, {
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Get Departments Dropdown Service
// Retrieves departments for dropdown selection
// Query params:
// - search: string
// - activeOnly: boolean
// - pageable: object (required) - { page: number, size: number, sort: string[] }
// ------------------------------------
export const getDepartmentsDropdown = async (params) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.dropdown.getDepartments, {
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Get Sub-departments Dropdown Service
// Retrieves sub-departments for dropdown selection
// Query params:
// - departmentId: string (UUID)
// - search: string
// - activeOnly: boolean (default: true)
// - pageable: object (required) - { page: number, size: number, sort: string[] }
// ------------------------------------
export const getSubDepartmentsDropdown = async (params) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.dropdown.getSubDepartments, {
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Get Task Templates Dropdown Service
// Retrieves lightweight task templates for dropdown selection
// Query params:
// - departmentId: string (UUID)
// - subDepartmentId: string (UUID)
// - search: string
// - activeOnly: boolean
// - pageable: object (required) - { page: number, size: number, sort: string[] }
// ------------------------------------
export const getTaskTemplatesDropdown = async (params) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.dropdown.getTaskTemplates, {
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
