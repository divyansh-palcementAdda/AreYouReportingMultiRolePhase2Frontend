import axiosInstance from "../axiosInstance/axios";
import apiAllRoutes from "../apiRoutes/apiRoutes";

// ------------------------------------
// Get All Departments Service
// Retrieves all departments with child sub-departments
// Query param: activeOnly (boolean, default: empty)
// ------------------------------------
export const getAllDepartments = async (params) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.department.getAllDepartments, {
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Add Department Service
// Creates a new department with the following fields:
// - name: string (required)
// - code: string (required)
// - description: string (required)
// - isActive: boolean (default: true)
// ------------------------------------
export const addDepartment = async (departmentData) => {
  try {
    const response = await axiosInstance.post(apiAllRoutes.department.addDepartment, departmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Update Department Service
// Updates department details by ID
// Path param: id (string, UUID)
// Request body:
// - name: string
// - code: string
// - description: string
// - isActive: boolean
// ------------------------------------
export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await axiosInstance.put(apiAllRoutes.department.updateDepartment.replace("{id}", id), departmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Delete Department Service
// Deletes a department by ID
// Path param: id (string, UUID)
// ------------------------------------
export const deleteDepartment = async (id) => {
  try {
    const response = await axiosInstance.delete(apiAllRoutes.department.deleteDepartment.replace("{id}", id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Get Sub-departments by Department ID Service
// Retrieves all sub-departments belonging to a department
// Path param: deptId (string, UUID)
// Query param: activeOnly (boolean, default: empty)
// ------------------------------------
export const getSubDepartmentsByDepartmentId = async (deptId, params) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.department.getAllSubDepartment.replace("{deptId}", deptId), {
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Add Sub-department Service
// Creates a child sub-department under a parent department
// Path param: deptId (string, UUID)
// Request body:
// - name: string (required)
// - code: string (required)
// - description: string (required)
// - isActive: boolean (default: true)
// ------------------------------------
export const addSubDepartment = async (deptId, subDepartmentData) => {
  try {
    const response = await axiosInstance.post(apiAllRoutes.department.addSubDepartment.replace("{deptId}", deptId), subDepartmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Update Sub-department Service
// Updates sub-department details by ID
// Path param: subDeptId (string, UUID)
// Request body:
// - name: string
// - code: string
// - description: string
// - isActive: boolean
// ------------------------------------
export const updateSubDepartment = async (subDeptId, subDepartmentData) => {
  try {
    const response = await axiosInstance.put(apiAllRoutes.department.updateSubDepartment.replace("{subDeptId}", subDeptId), subDepartmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

