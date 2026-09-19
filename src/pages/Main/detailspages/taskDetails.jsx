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
      <div className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-[#2b7818]" />
              Basic Information
            </h3>
            <div className="space-y-4">
              {/* Task Title and Status */}
              <div className="flex items-start justify-between">
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

              {/* Description */}
              <p className="text-gray-600">{task.description || "No description provided"}</p>

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

              {/* Creator */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Creator</p>
                <div className="space-y-1">
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
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Assignees ({task.assignees.length})</p>
                  <div className="space-y-2">
                    {task.assignees.map((assignee, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-800">{assignee.fullName}</span>
                        <span className="text-gray-600">{assignee.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Departments */}
              {task.assignedDepartments && task.assignedDepartments.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Departments ({task.assignedDepartments.length})</p>
                  <div className="space-y-2">
                    {task.assignedDepartments.map((dept, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-800">{dept.name}</span>
                        <span className="text-gray-600">{dept.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

      </div>
    </div>
  )
}

export default TaskDetails