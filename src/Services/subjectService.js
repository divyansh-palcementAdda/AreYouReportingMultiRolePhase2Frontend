import axiosInstance from "../axiosInstance/axios";
import apiAllRoutes from "../apiRoutes/apiRoutes";

// ------------------------------------
// Get All Subjects Service
// Retrieves all subjects
// Query param: activeOnly (boolean, default: empty)
// ------------------------------------
export const getAllSubjects = async (params) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.subject.getAllSubjects, {
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Add Subject Service
// Creates a new subject with the following fields:
// - name: string (required)
// - code: string (required)
// - description: string (required)
// - isActive: boolean (default: true)
// ------------------------------------
export const addSubject = async (subjectData) => {
  try {
    const response = await axiosInstance.post(apiAllRoutes.subject.addSubject, subjectData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Update Subject Service
// Updates subject details by ID
// Path param: id (string, UUID)
// Request body:
// - name: string
// - code: string
// - description: string
// - isActive: boolean
// ------------------------------------
export const updateSubject = async (id, subjectData) => {
  try {
    const response = await axiosInstance.put(apiAllRoutes.subject.updateSubject.replace("{id}", id), subjectData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Delete Subject Service
// Deletes a subject by ID
// Path param: id (string, UUID)
// ------------------------------------
export const deleteSubject = async (id) => {
  try {
    const response = await axiosInstance.delete(apiAllRoutes.subject.deleteSubject.replace("{id}", id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------
// Get Subject by ID Service
// Retrieves subject details by ID
// Path param: id (string, UUID)
// ------------------------------------
export const getSubjectById = async (id) => {
  try {
    const response = await axiosInstance.get(apiAllRoutes.subject.getSubjectById.replace("{id}", id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
