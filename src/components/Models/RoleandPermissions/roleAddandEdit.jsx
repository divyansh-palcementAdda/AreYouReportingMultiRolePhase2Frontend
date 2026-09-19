import { useState, useEffect } from "react";
import { createRole, updateRole, getAllPermissions } from "../../../Services/roleandpermissionService";
import { toast } from "react-toastify";

const RoleAddAndEditModal = ({ isOpen, onClose, roleToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultDataScope: "GLOBAL",
    permissionIds: [],
  });

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPermissions, setFetchingPermissions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchPermissions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (roleToEdit) {
      setFormData({
        name: roleToEdit.name || "",
        description: roleToEdit.description || "",
        defaultDataScope: roleToEdit.defaultDataScope || "GLOBAL",
        permissionIds: roleToEdit.permissionIds || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        defaultDataScope: "GLOBAL",
        permissionIds: [],
      });
    }
  }, [roleToEdit, isOpen]);

  const fetchPermissions = async () => {
    try {
      setFetchingPermissions(true);
      const permissionsData = await getAllPermissions();
      setPermissions(permissionsData);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast.error("Failed to load permissions");
    } finally {
      setFetchingPermissions(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  };

  const handleSelectAll = () => {
    const allPermissionIds = permissions.map((p) => p.id);
    setFormData((prev) => ({
      ...prev,
      permissionIds: allPermissionIds,
    }));
  };

  const handleDeselectAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: [],
    }));
  };

  const filteredPermissions = permissions.filter((permission) =>
    permission.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (permission.description && permission.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
      };

      if (roleToEdit) {
        await updateRole(roleToEdit.id, dataToSubmit);
        toast.success("Role updated successfully!");
      } else {
        await createRole(dataToSubmit);
        toast.success("Role added successfully!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error(error.response?.data?.message || "Failed to save role");
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
            {roleToEdit ? "Edit Role" : "Add New Role"}
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
              Role Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter role name"
            />
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
              rows="3"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter role description"
            />
          </div>

          {/* Default Data Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Data Scope *
            </label>
            <select
              name="defaultDataScope"
              value={formData.defaultDataScope}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="GLOBAL">GLOBAL</option>
              <option value="DEPARTMENT">DEPARTMENT</option>
              <option value="SUB_DEPARTMENT">SUB_DEPARTMENT</option>
              <option value="SELF">SELF</option>
            </select>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions *
            </label>
            {fetchingPermissions ? (
              <div className="text-gray-500">Loading permissions...</div>
            ) : (
              <>
                {/* Search Box */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Select All / Deselect All Buttons */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Deselect All
                  </button>
                </div>

                {/* Permissions List */}
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {filteredPermissions.length > 0 ? (
                    filteredPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          id={`permission-${permission.id}`}
                          checked={formData.permissionIds.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          disabled={loading}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="ml-3 flex flex-col cursor-pointer"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {permission.authority}
                          </span>
                          {permission.description && (
                            <span className="text-xs text-gray-500 mt-1">
                              {permission.description}
                            </span>
                          )}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      {searchQuery ? "No permissions match your search" : "No permissions available"}
                    </div>
                  )}
                </div>
              </>
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
              disabled={loading || formData.permissionIds.length === 0}
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
              ) : roleToEdit ? "Update Role" : "Add Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleAddAndEditModal;