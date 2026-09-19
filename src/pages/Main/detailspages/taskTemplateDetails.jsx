import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getTaskTemplateById } from "../../../Services/taskTemplateService"
import { ArrowLeft, Building2, CheckCircle, XCircle, Clock, Target, FileText, AlertCircle } from "lucide-react"

const TaskTemplateDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTemplateDetails()
  }, [id])

  const fetchTemplateDetails = async () => {
    setLoading(true)
    try {
      const response = await getTaskTemplateById(id)
      setTemplate(response.data)
    } catch (error) {
      console.error("Error fetching task template details:", error)
      setError("Failed to load task template details")
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200"
      case "MEDIUM":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading task template details...</div>
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

  if (!template) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Task template not found</div>
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
        <h1 className="text-2xl font-bold text-gray-800">Task Template Details</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Template Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Header Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{template.name}</h2>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(template.defaultPriority)}`}>
                  {template.defaultPriority}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                  template.active 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-red-100 text-red-800 border-red-200"
                }`}>
                  {template.active ? (
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
            </div>
            <p className="text-gray-600 mb-4">{template.description || "No description provided"}</p>
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Template ID</p>
                <p className="font-medium text-gray-800 text-xs">{template.id || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Default Duration</p>
                <p className="font-medium text-gray-800">{template.defaultDurationDays || 0} days</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Default Target Count</p>
                <p className="font-medium text-gray-800">{template.defaultTargetCount || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Default Target Percentage</p>
                <p className="font-medium text-gray-800">{template.defaultTargetPercentage || 0}%</p>
              </div>
            </div>
          </div>

          {/* Applicable Departments Section */}
          {template.applicableDepartments && template.applicableDepartments.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-[#2b7818]" />
                Applicable Departments ({template.applicableDepartments.length})
              </h3>
              <div className="space-y-4">
                {template.applicableDepartments.map((dept) => (
                  <div key={dept.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-800">{dept.name}</p>
                        <p className="text-sm text-gray-600">{dept.code}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        dept.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {dept.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {dept.description && (
                      <p className="text-sm text-gray-600 mt-2">{dept.description}</p>
                    )}
                    {dept.subDepartments && dept.subDepartments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Sub-Departments:</p>
                        <div className="flex flex-wrap gap-2">
                          {dept.subDepartments.map((subDept) => (
                            <span key={subDept.id} className="px-2 py-1 bg-white border border-gray-200 text-xs rounded text-gray-700">
                              {subDept.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applicable Sub-Departments Section */}
          {template.applicableSubDepartments && template.applicableSubDepartments.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-[#2b7818]" />
                Applicable Sub-Departments ({template.applicableSubDepartments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {template.applicableSubDepartments.map((subDept) => (
                  <div key={subDept.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-800">{subDept.name}</p>
                        <p className="text-sm text-gray-600">{subDept.code}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        subDept.active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {subDept.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Department: {subDept.departmentName}</p>
                    {subDept.description && (
                      <p className="text-sm text-gray-600 mt-2">{subDept.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proof Requirements Section */}
          {template.proofRequirements && template.proofRequirements.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-[#2b7818]" />
                Proof Requirements ({template.proofRequirements.length})
              </h3>
              <div className="space-y-3">
                {template.proofRequirements
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((req) => (
                  <div key={req.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {req.isRequired ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <AlertCircle size={16} className="text-gray-400" />
                        )}
                        <p className="font-medium text-gray-800">{req.name}</p>
                      </div>
                      <span className="text-xs text-gray-500">Order: {req.displayOrder}</span>
                    </div>
                    {req.description && (
                      <p className="text-sm text-gray-600 mt-2">{req.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Min Count:</span>
                        <span className="font-medium text-gray-800">{req.minCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Accepted Types:</span>
                        <span className="font-medium text-gray-800">{req.acceptedProofTypes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Target Settings Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target size={20} className="text-[#2b7818]" />
              Target Settings
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Default Duration:</span>
                <span className="font-medium text-gray-800">{template.defaultDurationDays || 0} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target Count:</span>
                <span className="font-medium text-gray-800">{template.defaultTargetCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target Percentage:</span>
                <span className="font-medium text-gray-800">{template.defaultTargetPercentage || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Default Priority:</span>
                <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(template.defaultPriority)}`}>
                  {template.defaultPriority}
                </span>
              </div>
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
                <span className="text-sm text-gray-600">Total Departments:</span>
                <span className="font-medium text-gray-800">
                  {template.applicableDepartments?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sub-Departments:</span>
                <span className="font-medium text-gray-800">
                  {template.applicableSubDepartments?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Proof Requirements:</span>
                <span className="font-medium text-gray-800">
                  {template.proofRequirements?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Required Proofs:</span>
                <span className="font-medium text-gray-800">
                  {template.proofRequirements?.filter(req => req.isRequired).length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-[#2b7818]" />
              Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Active:</span>
                <span className={`font-medium ${template.active ? "text-green-600" : "text-red-600"}`}>
                  {template.active ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskTemplateDetails