import axiosInstance from "../axiosInstance/axios";
import apiAllRoutes from "../apiRoutes/apiRoutes";

// ------------------------------------
// Get All Task Templates Service
// Retrieves all task templates with optional filters
// Query params:
// - activeOnly: boolean (optional)
// - search: string (optional)
// - pageable: object (optional) - { page: number, size: number, sort: string[] }
// ------------------------------------
export const getAllTaskTemplates = async (params) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.taskTemplate.getAllTaskTemplates, {
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Add Task Template Service
// Creates a new task template with the following fields:
// - name: string (required)
// - description: string (optional)
// - defaultPriority: string (optional)
// - defaultDurationDays: number (optional)
// - defaultTargetCount: number (optional)
// - defaultTargetPercentage: number (optional)
// - isActive: boolean (default: true)
// - applicableDepartmentIds: array of strings (optional)
// - applicableSubDepartmentIds: array of strings (optional)
// - proofRequirements: array of objects (optional)
// ------------------------------------
export const addTaskTemplate = async (taskTemplateData) => {
  try {
    const response = await axiosInstance.post(apiAllRoutes.taskTemplate.addTaskTemplate, taskTemplateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Update Task Template Service
// Updates task template details by ID
// Path param: id (string, UUID)
// Request body:
// - name: string
// - description: string
// - defaultPriority: string
// - defaultDurationDays: number
// - defaultTargetCount: number
// - defaultTargetPercentage: number
// - isActive: boolean
// - applicableDepartmentIds: array of strings
// - applicableSubDepartmentIds: array of strings
// - proofRequirements: array of objects
// ------------------------------------
export const updateTaskTemplate = async (id, taskTemplateData) => {
  try {
    const response = await axiosInstance.put(apiAllRoutes.taskTemplate.updateTaskTemplate.replace("{id}", id), taskTemplateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Delete Task Template Service
// Deletes a task template by ID
// Path param: id (string, UUID)
// ------------------------------------
export const deleteTaskTemplate = async (id) => {
  try {
    const response = await axiosInstance.delete(apiAllRoutes.taskTemplate.deleteTaskTemplate.replace("{id}", id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
