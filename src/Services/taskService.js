import axiosInstance from "../axiosInstance/axios";
import apiAllRoutes from "../apiRoutes/apiRoutes";

// ------------------------------------
// Get All Tasks Service
// ------------------------------------
export const getAllTasks = async (params) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.task.getAllTask, {
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Add Task Service
// ------------------------------------
export const addTask = async (taskData) => {
  try {
    const response = await axiosInstance.post(apiAllRoutes.task.addTask, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Update Task Service
// ------------------------------------
export const updateTask = async (id, taskData) => {
  try {
    const response = await axiosInstance.put(apiAllRoutes.task.updateTask.replace("{id}", id), taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Delete Task Service
// ------------------------------------
export const deleteTask = async (id) => {
  try {
    const response = await axiosInstance.delete(apiAllRoutes.task.deleteTask.replace("{id}", id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Get Task By ID Service
// ------------------------------------
export const getTaskById = async (id) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.task.getTaskById.replace("{id}", id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
