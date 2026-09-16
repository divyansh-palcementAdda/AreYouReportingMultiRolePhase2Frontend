import { useState, useEffect } from "react";
import { addUser, updateUser } from "../../../Services/userService";
import { toast } from "react-toastify";

const AddAndEditUserModal = ({ isOpen, onClose, userToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    departmentIds: [],
    subDepartmentIds: [],
    roleAssignments: [],
  });

  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const dataScopeTypes = ["ALL", "DEPARTMENT", "SUB_DEPARTMENT", "CUSTOM"];

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        username: userToEdit.username || "",
        email: userToEdit.email || "",
        password: "",
        fullName: userToEdit.fullName || "",
        phoneNumber: userToEdit.phoneNumber || "",
        departmentIds: userToEdit.departmentIds || [],
        subDepartmentIds: userToEdit.subDepartmentIds || [],
        roleAssignments: userToEdit.roleAssignments || [],
      });
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        departmentIds: [],
        subDepartmentIds: [],
        roleAssignments: [],
      });
    }
  }, [userToEdit, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

  const handleRoleAssignmentChange = (index, field, value) => {
    const updatedRoleAssignments = [...formData.roleAssignments];
    updatedRoleAssignments[index] = {
      ...updatedRoleAssignments[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      roleAssignments: updatedRoleAssignments,
    });
  };

  const handleRoleMultiSelect = (roleIndex, field, value) => {
    const updatedRoleAssignments = [...formData.roleAssignments];
    const currentValues = updatedRoleAssignments[roleIndex][field] || [];
    
    if (currentValues.includes(value)) {
      updatedRoleAssignments[roleIndex] = {
        ...updatedRoleAssignments[roleIndex],
        [field]: currentValues.filter((item) => item !== value),
      };
    } else {
      updatedRoleAssignments[roleIndex] = {
        ...updatedRoleAssignments[roleIndex],
        [field]: [...currentValues, value],
      };
    }
    
    setFormData({
      ...formData,
      roleAssignments: updatedRoleAssignments,
    });
  };

  const addRoleAssignment = () => {
    setFormData({
      ...formData,
      roleAssignments: [
        ...formData.roleAssignments,
        {
          roleId: "",
          departmentId: "",
          subDepartmentId: "",
          dataScopeType: "ALL",
          customDepartmentIds: [],
          customSubDepartmentIds: [],
        },
      ],
    });
  };

  const removeRoleAssignment = (index) => {
    setFormData({
      ...formData,
      roleAssignments: formData.roleAssignments.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        // Only include password if it's a new user or password is provided
        ...(userToEdit && !formData.password ? { password: undefined } : {}),
      };

      if (userToEdit) {
        await updateUser(userToEdit.id, submitData);
        toast.success("User updated successfully!");
      } else {
        await addUser(submitData);
        toast.success("User added successfully!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(error.response?.data?.message || "Failed to save user");
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
            {userToEdit ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password {!userToEdit && "*"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!userToEdit}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={userToEdit ? "Leave blank to keep current" : "Enter password"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter full name"
            />
          </div>

          {/* Department and Sub-Department IDs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departments
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <label key={dept.id} className="flex items-center mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.departmentIds.includes(dept.id)}
                        onChange={() => handleMultiSelect("departmentIds", dept.id)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Departments
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                {subDepartments.length > 0 ? (
                  subDepartments.map((subDept) => (
                    <label key={subDept.id} className="flex items-center mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.subDepartmentIds.includes(subDept.id)}
                        onChange={() => handleMultiSelect("subDepartmentIds", subDept.id)}
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
          </div>

          {/* Role Assignments */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Role Assignments
              </label>
              <button
                type="button"
                onClick={addRoleAssignment}
                disabled={loading}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Role
              </button>
            </div>

            {formData.roleAssignments.length === 0 ? (
              <p className="text-sm text-gray-500 mb-4">No role assignments added</p>
            ) : (
              <div className="space-y-4">
                {formData.roleAssignments.map((roleAssignment, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Role Assignment {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeRoleAssignment(index)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Role *
                        </label>
                        <select
                          value={roleAssignment.roleId}
                          onChange={(e) => handleRoleAssignmentChange(index, "roleId", e.target.value)}
                          disabled={loading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <option value="">Select a role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Department
                        </label>
                        <select
                          value={roleAssignment.departmentId}
                          onChange={(e) => handleRoleAssignmentChange(index, "departmentId", e.target.value)}
                          disabled={loading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <option value="">Select a department</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Sub-Department
                        </label>
                        <select
                          value={roleAssignment.subDepartmentId}
                          onChange={(e) => handleRoleAssignmentChange(index, "subDepartmentId", e.target.value)}
                          disabled={loading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <option value="">Select a sub-department</option>
                          {subDepartments.map((subDept) => (
                            <option key={subDept.id} value={subDept.id}>
                              {subDept.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Data Scope Type *
                        </label>
                        <select
                          value={roleAssignment.dataScopeType}
                          onChange={(e) => handleRoleAssignmentChange(index, "dataScopeType", e.target.value)}
                          disabled={loading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {dataScopeTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {roleAssignment.dataScopeType === "CUSTOM" && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Custom Departments
                          </label>
                          <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                            {departments.map((dept) => (
                              <label key={dept.id} className="flex items-center mb-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={(roleAssignment.customDepartmentIds || []).includes(dept.id)}
                                  onChange={() => handleRoleMultiSelect(index, "customDepartmentIds", dept.id)}
                                  disabled={loading}
                                  className="mr-2 h-3 w-3 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <span className="text-xs text-gray-700">{dept.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Custom Sub-Departments
                          </label>
                          <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                            {subDepartments.map((subDept) => (
                              <label key={subDept.id} className="flex items-center mb-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={(roleAssignment.customSubDepartmentIds || []).includes(subDept.id)}
                                  onChange={() => handleRoleMultiSelect(index, "customSubDepartmentIds", subDept.id)}
                                  disabled={loading}
                                  className="mr-2 h-3 w-3 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <span className="text-xs text-gray-700">{subDept.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
              ) : userToEdit ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAndEditUserModal;
