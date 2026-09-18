import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getTaskById } from "../../../Services/taskService"
import { ArrowLeft, Calendar, User, Users, FileText, Clock, AlertCircle, CheckCircle, Circle } from "lucide-react"

const TaskDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTaskDetails()
  }, [id])

  const fetchTaskDetails = async () => {
    setLoading(true)
    try {
      const response = await getTaskById(id)
      setTask(response.data)
    } catch (error) {
      console.error("Error fetching task details:", error)
      setError("Failed to load task details")
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

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
        <div className="text-gray-600">Loading task details...</div>
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

  if (!task) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Task not found</div>
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
        <h1 className="text-2xl font-bold text-gray-800">Task Details</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Header Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{task.description || "No description provided"}</p>
            
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium text-gray-800">{formatDate(task.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium text-gray-800">{formatDate(task.dueDate)}</span>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#2b7818]" />
              Target Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Count Progress</span>
                  <span className="font-medium text-gray-800">{task.currentCount} / {task.targetCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-600 to-green-800 h-2 rounded-full transition-all"
                    style={{ width: `${(task.currentCount / task.targetCount) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Percentage Progress</span>
                  <span className="font-medium text-gray-800">{task.currentPercentage}% / {task.targetPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-600 to-green-800 h-2 rounded-full transition-all"
                    style={{ width: `${(task.currentPercentage / task.targetPercentage) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Template Info */}
          {task.template && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Template Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Template Name:</span>
                  <span className="font-medium text-gray-800">{task.template.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Default Duration:</span>
                  <span className="font-medium text-gray-800">{task.template.defaultDurationDays} days</span>
                </div>
                {task.template.proofRequirements && task.template.proofRequirements.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Proof Requirements:</p>
                    <div className="space-y-1">
                      {task.template.proofRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {req.isRequired ? (
                            <CheckCircle size={14} className="text-green-600" />
                          ) : (
                            <Circle size={14} className="text-gray-400" />
                          )}
                          <span className="text-gray-600">{req.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Proofs Section */}
          {task.proofs && task.proofs.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-[#2b7818]" />
                Submitted Proofs ({task.proofs.length})
              </h3>
              <div className="space-y-3">
                {task.proofs.map((proof, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{proof.proofRequirementName}</p>
                        <p className="text-sm text-gray-600">{proof.fileName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded by {proof.uploadedBy?.fullName || "Unknown"} on {formatDate(proof.uploadedAt)}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {proof.proofType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requests Section */}
          {task.requests && task.requests.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-[#2b7818]" />
                Requests ({task.requests.length})
              </h3>
              <div className="space-y-3">
                {task.requests.map((request, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-800">{request.requestType.replace(/_/g, " ")}</p>
                        <p className="text-sm text-gray-600">{request.reason}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created on {formatDate(request.createdAt)} by {request.createdBy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - People & Metadata */}
        <div className="space-y-6">
          {/* Creator Info */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-[#2b7818]" />
              Creator
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-800">{task.creator?.fullName || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-800">{task.creator?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Username:</span>
                <span className="font-medium text-gray-800">{task.creator?.username || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Assignees */}
          {task.assignees && task.assignees.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={20} className="text-[#2b7818]" />
                Assignees ({task.assignees.length})
              </h3>
              <div className="space-y-3">
                {task.assignees.map((assignee, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{assignee.fullName}</p>
                    <p className="text-sm text-gray-600">{assignee.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Departments */}
          {task.assignedDepartments && task.assignedDepartments.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Departments</h3>
              <div className="space-y-2">
                {task.assignedDepartments.map((dept, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{dept.name}</p>
                    <p className="text-sm text-gray-600">{dept.code}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task Timeline */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-[#2b7818]" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600">Created:</span>
                <p className="font-medium text-gray-800">{formatDate(task.createdAt)}</p>
              </div>
              {task.startedAt && (
                <div className="text-sm">
                  <span className="text-gray-600">Started:</span>
                  <p className="font-medium text-gray-800">{formatDate(task.startedAt)}</p>
                  <p className="text-xs text-gray-500">by {task.startedBy?.fullName}</p>
                </div>
              )}
              {task.closedAt && (
                <div className="text-sm">
                  <span className="text-gray-600">Closed:</span>
                  <p className="font-medium text-gray-800">{formatDate(task.closedAt)}</p>
                  <p className="text-xs text-gray-500">by {task.closedBy?.fullName}</p>
                </div>
              )}
              {task.extendedAt && (
                <div className="text-sm">
                  <span className="text-gray-600">Last Extended:</span>
                  <p className="font-medium text-gray-800">{formatDate(task.extendedAt)}</p>
                  <p className="text-xs text-gray-500">by {task.extendedBy?.fullName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-[#2b7818]" />
              Additional Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Self Task:</span>
                <span className={`font-medium ${task.selfTask ? "text-green-600" : "text-gray-800"}`}>
                  {task.selfTask ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed After Delay:</span>
                <span className={`font-medium ${task.completedAfterDelay ? "text-orange-600" : "text-gray-800"}`}>
                  {task.completedAfterDelay ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed After Extension:</span>
                <span className={`font-medium ${task.completedAfterExtension ? "text-orange-600" : "text-gray-800"}`}>
                  {task.completedAfterExtension ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Extension Count:</span>
                <span className="font-medium text-gray-800">{task.extensionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Outcome:</span>
                <span className="font-medium text-gray-800">{task.completionOutcome || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails