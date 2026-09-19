import { useState, useEffect } from "react";
import { addSubDepartment, updateSubDepartment } from "../../../Services/departmentService";
import { toast } from "react-toastify";

const AddAndEditSubDepartmentModal = ({ isOpen, onClose, subDepartmentToEdit, deptId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subDepartmentToEdit) {
      setFormData({
        name: subDepartmentToEdit.name || "",
        code: subDepartmentToEdit.code || "",
        description: subDepartmentToEdit.description || "",
        isActive: subDepartmentToEdit.active !== undefined ? subDepartmentToEdit.active : (subDepartmentToEdit.isActive !== undefined ? subDepartmentToEdit.isActive : true),
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
        isActive: true,
      });
    }
  }, [subDepartmentToEdit, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData
      }

      if (subDepartmentToEdit) {
        await updateSubDepartment(subDepartmentToEdit.id, dataToSubmit);
        toast.success("Sub-department updated successfully!");
      } else {
        await addSubDepartment(deptId, dataToSubmit);
        toast.success("Sub-department added successfully!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving sub-department:", error);
      toast.error(error.response?.data?.message || "Failed to save sub-department");
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
            {subDepartmentToEdit ? "Edit Sub-department" : "Add New Sub-department"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name and Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter sub-department name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter sub-department code"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter sub-department description"
            />
          </div>

          {/* isActive */}
          <div className="flex items-center">
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
              Active Sub-department
            </label>
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
              ) : subDepartmentToEdit ? "Update Sub-department" : "Add Sub-department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAndEditSubDepartmentModal;
