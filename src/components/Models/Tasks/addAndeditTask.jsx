import { useState, useEffect } from "react";
import { addTask, updateTask } from "../../../Services/taskService";
import { getDepartmentsDropdown, getSubDepartmentsDropdown, getEligibleAssignees, getTaskTemplatesDropdown } from "../../../Services/dropdownService";
import { toast } from "react-toastify";

const AddAndEditTaskModal = ({ isOpen, onClose, taskToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "LOW",
    startDate: "",
    dueDate: "",
    assignedDepartmentIds: [],
    assignedSubDepartmentIds: [],
    assigneeIds: [],
    templateId: "",
    targetCount: 0,
    targetPercentage: 0,
  });

  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "LOW",
        startDate: taskToEdit.startDate ? taskToEdit.startDate.slice(0, 16) : "",
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.slice(0, 16) : "",
        assignedDepartmentIds: taskToEdit.assignedDepartmentIds || [],
        assignedSubDepartmentIds: taskToEdit.assignedSubDepartmentIds || [],
        assigneeIds: taskToEdit.assigneeIds || [],
        templateId: taskToEdit.templateId || "",
        targetCount: taskToEdit.targetCount || 0,
        targetPercentage: taskToEdit.targetPercentage || 0,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "LOW",
        startDate: "",
        dueDate: "",
        assignedDepartmentIds: [],
        assignedSubDepartmentIds: [],
        assigneeIds: [],
        templateId: "",
        targetCount: 0,
        targetPercentage: 0,
      });
    }
  }, [taskToEdit, isOpen]);

  // Fetch dropdown data when modal opens
  useEffect(() => {
    const fetchDropdownData = async () => {
      if (!isOpen) return;

      try {
        // Fetch departments
        const departmentsParams = {
          pageable: { page: 0, size: 100, sort: ["name"] }
        };
        const departmentsResponse = await getDepartmentsDropdown(departmentsParams);
        setDepartments(departmentsResponse?.data?.content || departmentsResponse?.content || []);

        // Fetch sub-departments
        const subDepartmentsParams = {
          pageable: { page: 0, size: 100, sort: ["name"] }
        };
        const subDepartmentsResponse = await getSubDepartmentsDropdown(subDepartmentsParams);
        setSubDepartments(subDepartmentsResponse?.data?.content || subDepartmentsResponse?.content || []);

        // Fetch eligible assignees
        const assigneesParams = {
          pageable: { page: 0, size: 100, sort: ["name"] }
        };
        const assigneesResponse = await getEligibleAssignees(assigneesParams);
        setAssignees(assigneesResponse?.data?.content || assigneesResponse?.content || []);

        // Fetch task templates
        const templatesParams = {
          pageable: { page: 0, size: 100, sort: ["name"] }
        };
        const templatesResponse = await getTaskTemplatesDropdown(templatesParams);
        setTemplates(templatesResponse?.data?.content || templatesResponse?.content || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load dropdown data");
      }
    };

    fetchDropdownData();
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = formData[field];
    if (currentValues.includes(value)) {
      setFormData({
        ...formData,
        [field]: currentValues.filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentValues, value],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };

      if (taskToEdit) {
        await updateTask(taskToEdit.id, submitData);
        toast.success("Task updated successfully!");
      } else {
        await addTask(submitData);
        toast.success("Task added successfully!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(error.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-white/5">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 ${loading ? 'pointer-events-none' : ''}`}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {taskToEdit ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter task description"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Department IDs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Departments
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <label key={dept.id} className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.assignedDepartmentIds.includes(dept.id)}
                      onChange={() => handleMultiSelect("assignedDepartmentIds", dept.id)}
                      disabled={loading}
                      className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-700">{dept.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No departments available</p>
              )}
            </div>
          </div>

          {/* Sub-Department IDs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Sub-Departments
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
              {subDepartments.length > 0 ? (
                subDepartments.map((subDept) => (
                  <label key={subDept.id} className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.assignedSubDepartmentIds.includes(subDept.id)}
                      onChange={() => handleMultiSelect("assignedSubDepartmentIds", subDept.id)}
                      disabled={loading}
                      className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-700">{subDept.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No sub-departments available</p>
              )}
            </div>
          </div>

          {/* Assignee IDs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignees
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
              {assignees.length > 0 ? (
                assignees.map((assignee) => (
                  <label key={assignee.id} className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.assigneeIds.includes(assignee.id)}
                      onChange={() => handleMultiSelect("assigneeIds", assignee.id)}
                      disabled={loading}
                      className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-700">{assignee.name || assignee.email}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No assignees available</p>
              )}
            </div>
          </div>

          {/* Template ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template
            </label>
            <select
              name="templateId"
              value={formData.templateId}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a template</option>
              {Array.isArray(templates) && templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Count and Percentage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Count
              </label>
              <input
                type="number"
                name="targetCount"
                value={formData.targetCount}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter target count"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Percentage
              </label>
              <input
                type="number"
                name="targetPercentage"
                value={formData.targetPercentage}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="100"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter target percentage"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : taskToEdit ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAndEditTaskModal;