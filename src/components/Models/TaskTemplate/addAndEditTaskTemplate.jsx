import { useState, useEffect } from "react";
import { addTaskTemplate, updateTaskTemplate } from "../../../Services/taskTemplateService";
import { getDepartmentsDropdown, getSubDepartmentsDropdown } from "../../../Services/dropdownService";
import { toast } from "react-toastify";

const AddAndEditTaskTemplateModal = ({ isOpen, onClose, taskTemplateToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultPriority: "",
    defaultDurationDays: "",
    defaultTargetCount: "",
    defaultTargetPercentage: "",
    isActive: true,
    applicableDepartmentIds: [],
    applicableSubDepartmentIds: [],
    proofRequirements: [],
  });

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [subDepartmentDropdownOpen, setSubDepartmentDropdownOpen] = useState(false);

  useEffect(() => {
    if (taskTemplateToEdit) {
      setFormData({
        name: taskTemplateToEdit.name || "",
        description: taskTemplateToEdit.description || "",
        defaultPriority: taskTemplateToEdit.defaultPriority || "",
        defaultDurationDays: taskTemplateToEdit.defaultDurationDays || "",
        defaultTargetCount: taskTemplateToEdit.defaultTargetCount || "",
        defaultTargetPercentage: taskTemplateToEdit.defaultTargetPercentage || "",
        isActive: taskTemplateToEdit.active !== undefined ? taskTemplateToEdit.active : (taskTemplateToEdit.isActive !== undefined ? taskTemplateToEdit.isActive : true),
        applicableDepartmentIds: taskTemplateToEdit.applicableDepartmentIds || [],
        applicableSubDepartmentIds: taskTemplateToEdit.applicableSubDepartmentIds || [],
        proofRequirements: taskTemplateToEdit.proofRequirements || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        defaultPriority: "",
        defaultDurationDays: "",
        defaultTargetCount: "",
        defaultTargetPercentage: "",
        isActive: true,
        applicableDepartmentIds: [],
        applicableSubDepartmentIds: [],
        proofRequirements: [],
      });
    }
  }, [taskTemplateToEdit, isOpen]);

  useEffect(() => {
    const loadDropdowns = async () => {
      if (isOpen) {
        setDropdownLoading(true);
        try {
          const [departmentsData, subDepartmentsData] = await Promise.all([
            getDepartmentsDropdown({ pageable: { page: 0, size: 100, sort: [] } }),
            getSubDepartmentsDropdown({ pageable: { page: 0, size: 100, sort: [] } })
          ]);
          
          // Handle API response structure: { success: true, data: { content: [...] } }
          const departmentsArray = Array.isArray(departmentsData?.data?.content) 
            ? departmentsData.data.content 
            : Array.isArray(departmentsData?.content) 
              ? departmentsData.content 
              : Array.isArray(departmentsData) 
                ? departmentsData 
                : [];
          
          const subDepartmentsArray = Array.isArray(subDepartmentsData?.data?.content) 
            ? subDepartmentsData.data.content 
            : Array.isArray(subDepartmentsData?.content) 
              ? subDepartmentsData.content 
              : Array.isArray(subDepartmentsData) 
                ? subDepartmentsData 
                : [];
          
          setDepartments(departmentsArray);
          setSubDepartments(subDepartmentsArray);
        } catch (error) {
          console.error("Error loading dropdowns:", error);
          toast.error("Failed to load departments and sub-departments");
          setDepartments([]);
          setSubDepartments([]);
        } finally {
          setDropdownLoading(false);
        }
      }
    };

    loadDropdowns();
  }, [isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDepartmentDropdownOpen(false);
        setSubDepartmentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDepartmentChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({
      ...formData,
      applicableDepartmentIds: selectedOptions
    });
  };

  const handleSubDepartmentChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({
      ...formData,
      applicableSubDepartmentIds: selectedOptions
    });
  };

  const handleDepartmentCheckboxChange = (deptId) => {
    const currentIds = formData.applicableDepartmentIds;
    if (currentIds.includes(deptId)) {
      setFormData({
        ...formData,
        applicableDepartmentIds: currentIds.filter(id => id !== deptId)
      });
    } else {
      setFormData({
        ...formData,
        applicableDepartmentIds: [...currentIds, deptId]
      });
    }
  };

  const handleSubDepartmentCheckboxChange = (subDeptId) => {
    const currentIds = formData.applicableSubDepartmentIds;
    if (currentIds.includes(subDeptId)) {
      setFormData({
        ...formData,
        applicableSubDepartmentIds: currentIds.filter(id => id !== subDeptId)
      });
    } else {
      setFormData({
        ...formData,
        applicableSubDepartmentIds: [...currentIds, subDeptId]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        defaultDurationDays: formData.defaultDurationDays ? parseInt(formData.defaultDurationDays) : null,
        defaultTargetCount: formData.defaultTargetCount ? parseInt(formData.defaultTargetCount) : null,
        defaultTargetPercentage: formData.defaultTargetPercentage ? parseFloat(formData.defaultTargetPercentage) : null,
      };

      if (taskTemplateToEdit) {
        await updateTaskTemplate(taskTemplateToEdit.id, dataToSubmit);
        toast.success("Task template updated successfully!");
      } else {
        await addTaskTemplate(dataToSubmit);
        toast.success("Task template added successfully!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving task template:", error);
      toast.error(error.response?.data?.message || "Failed to save task template");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-white/5">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 ${loading ? 'pointer-events-none' : ''}`}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {taskTemplateToEdit ? "Edit Task Template" : "Add New Task Template"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter task template name"
            />
          </div>

          {/* Description */}
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
              placeholder="Enter task template description"
            />
          </div>

          {/* Default Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Priority
              </label>
              <input
                type="text"
                name="defaultPriority"
                value={formData.defaultPriority}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g., High, Medium, Low"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Duration (Days)
              </label>
              <input
                type="number"
                name="defaultDurationDays"
                value={formData.defaultDurationDays}
                onChange={handleInputChange}
                min="0"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter duration in days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Target Count
              </label>
              <input
                type="number"
                name="defaultTargetCount"
                value={formData.defaultTargetCount}
                onChange={handleInputChange}
                min="0"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter target count"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Target Percentage (%)
              </label>
              <input
                type="number"
                name="defaultTargetPercentage"
                value={formData.defaultTargetPercentage}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.1"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter target percentage"
              />
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                disabled={loading}
                className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                Active Template
              </label>
            </div>
          </div>

          {/* Department and Sub-department IDs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable Department IDs
              </label>
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => setDepartmentDropdownOpen(!departmentDropdownOpen)}
                  disabled={loading || dropdownLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-left bg-white flex justify-between items-center"
                >
                  <span>
                    {formData.applicableDepartmentIds.length === 0 
                      ? "Select departments" 
                      : `${formData.applicableDepartmentIds.length} department(s) selected`}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {departmentDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {dropdownLoading ? (
                      <div className="p-3 text-gray-500">Loading departments...</div>
                    ) : departments.length === 0 ? (
                      <div className="p-3 text-gray-500">No departments available</div>
                    ) : (
                      departments.map((dept) => (
                        <label
                          key={dept.id}
                          className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.applicableDepartmentIds.includes(dept.id)}
                            onChange={() => handleDepartmentCheckboxChange(dept.id)}
                            disabled={loading}
                            className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{dept.name || dept.id}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable Sub-department IDs
              </label>
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => setSubDepartmentDropdownOpen(!subDepartmentDropdownOpen)}
                  disabled={loading || dropdownLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-left bg-white flex justify-between items-center"
                >
                  <span>
                    {formData.applicableSubDepartmentIds.length === 0 
                      ? "Select sub-departments" 
                      : `${formData.applicableSubDepartmentIds.length} sub-department(s) selected`}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {subDepartmentDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {dropdownLoading ? (
                      <div className="p-3 text-gray-500">Loading sub-departments...</div>
                    ) : subDepartments.length === 0 ? (
                      <div className="p-3 text-gray-500">No sub-departments available</div>
                    ) : (
                      subDepartments.map((subDept) => (
                        <label
                          key={subDept.id}
                          className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.applicableSubDepartmentIds.includes(subDept.id)}
                            onChange={() => handleSubDepartmentCheckboxChange(subDept.id)}
                            disabled={loading}
                            className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{subDept.name || subDept.id}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
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
              ) : taskTemplateToEdit ? "Update Task Template" : "Add Task Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAndEditTaskTemplateModal;
