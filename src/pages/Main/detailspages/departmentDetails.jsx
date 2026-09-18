import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getDepartmentById } from "../../../Services/departmentService"
import { ArrowLeft, Building2, CheckCircle, XCircle, Users, Calendar, FileText } from "lucide-react"

const DepartmentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDepartmentDetails()
  }, [id])

  const fetchDepartmentDetails = async () => {
    setLoading(true)
    try {
      const response = await getDepartmentById(id)
      setDepartment(response.data)
    } catch (error) {
      console.error("Error fetching department details:", error)
      setError("Failed to load department details")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading department details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Department not found</div>
      </div>
    )
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
        <h1 className="text-2xl font-bold text-gray-800">Department Details</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Department Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Header Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{department.name}</h2>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                department.isActive 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-red-100 text-red-800 border-red-200"
              }`}>
                {department.isActive ? (
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
            <p className="text-gray-600 mb-4">{department.description || "No description provided"}</p>
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Department Code</p>
                <p className="font-medium text-gray-800">{department.code || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Department ID</p>
                <p className="font-medium text-gray-800 text-xs">{department.id || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Sub-Departments Section */}
          {department.subDepartments && department.subDepartments.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-[#2b7818]" />
                Sub-Departments ({department.subDepartments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {department.subDepartments.map((subDept) => (
                  <div key={subDept.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-800">{subDept.name}</p>
                        <p className="text-sm text-gray-600">{subDept.code}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        subDept.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {subDept.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {subDept.description && (
                      <p className="text-sm text-gray-600 mt-2">{subDept.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users in Department Section */}
          {department.users && department.users.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={20} className="text-[#2b7818]" />
                Users in Department ({department.users.length})
              </h3>
              <div className="space-y-3">
                {department.users.map((user) => (
                  <div key={user.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{user.fullName}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Username: {user.username}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        user.active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Timeline Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-[#2b7818]" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600">Created:</span>
                <p className="font-medium text-gray-800">{formatDate(department.createdAt)}</p>
              </div>
              {department.updatedAt && (
                <div className="text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <p className="font-medium text-gray-800">{formatDate(department.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#2b7818]" />
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sub-Departments:</span>
                <span className="font-medium text-gray-800">
                  {department.subDepartments?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users:</span>
                <span className="font-medium text-gray-800">
                  {department.users?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Sub-Departments:</span>
                <span className="font-medium text-gray-800">
                  {department.subDepartments?.filter(sub => sub.isActive).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users:</span>
                <span className="font-medium text-gray-800">
                  {department.users?.filter(user => user.active).length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-[#2b7818]" />
              Additional Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${department.isActive ? "text-green-600" : "text-red-600"}`}>
                  {department.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepartmentDetails