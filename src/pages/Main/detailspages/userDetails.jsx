import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../../Services/userService";
import { ArrowLeft, User, Mail, Phone, Building2, Shield, Key, CheckCircle, XCircle } from "lucide-react";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);
        setUser(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading user details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">User not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-2">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-[#2b7818]" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium text-gray-800">{user.username || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-800">{user.fullName || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  {user.email || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  {user.phoneNumber || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                  user.active 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-red-100 text-red-800 border-red-200"
                }`}>
                  {user.active ? (
                    <>
                      <CheckCircle size={14} />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle size={14} />
                      Inactive
                    </>
                  )}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-medium text-gray-800 text-xs">{user.id || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Departments Cards */}
          {user.departments && user.departments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 size={20} className="text-[#2b7818]" />
                Departments
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.departments.map((dept) => (
                  <div key={dept.id} className="px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg border border-gray-200">
                    {dept.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Departments Cards */}
          {user.subDepartments && user.subDepartments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 size={20} className="text-[#2b7818]" />
                Sub-Departments
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.subDepartments.map((subDept) => (
                  <div key={subDept.id} className="px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg border border-gray-200">
                    {subDept.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Roles & Permissions */}
        <div className="space-y-6">
          {/* Role Assignments Card */}
          {user.roleAssignments && user.roleAssignments.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-[#2b7818]" />
                Role Assignments ({user.roleAssignments.length})
              </h3>
              <div className="space-y-3">
                {user.roleAssignments.map((role) => (
                  <div key={role.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-800">{role.roleName}</p>
                        <p className="text-sm text-gray-600">Scope: {role.dataScopeType}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        role.active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {role.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      {role.departmentName && (
                        <p className="text-gray-600">
                          <span className="text-gray-500">Department:</span> {role.departmentName}
                        </p>
                      )}
                      {role.subDepartmentName && (
                        <p className="text-gray-600">
                          <span className="text-gray-500">Sub-Department:</span> {role.subDepartmentName}
                        </p>
                      )}
                    </div>
                    
                    {role.customDepartments && role.customDepartments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Custom Departments</p>
                        <div className="space-y-1">
                          {role.customDepartments.map((customDept) => (
                            <div key={customDept.id} className="text-xs p-2 bg-white rounded border border-gray-200">
                              <p className="font-medium text-gray-800">{customDept.name}</p>
                              <p className="text-gray-600">Code: {customDept.code}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {role.customSubDepartments && role.customSubDepartments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Custom Sub-Departments</p>
                        <div className="space-y-1">
                          {role.customSubDepartments.map((customSubDept) => (
                            <div key={customSubDept.id} className="text-xs p-2 bg-white rounded border border-gray-200">
                              <p className="font-medium text-gray-800">{customSubDept.name}</p>
                              <p className="text-gray-600">Code: {customSubDept.code}</p>
                              <p className="text-gray-600">Dept: {customSubDept.departmentName}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        
        </div>
      </div>
    </div>
  );
};

export default UserDetails;