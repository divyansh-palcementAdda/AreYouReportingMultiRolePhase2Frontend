import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getSubjectById } from "../../../Services/subjectService"
import { ArrowLeft, Book, CheckCircle, XCircle, Calendar, FileText } from "lucide-react"

const SubjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSubjectDetails()
  }, [id])

  const fetchSubjectDetails = async () => {
    setLoading(true)
    try {
      const response = await getSubjectById(id)
      setSubject(response.data)
    } catch (error) {
      console.error("Error fetching subject details:", error)
      setError("Failed to load subject details")
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
        <div className="text-gray-600">Loading subject details...</div>
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

  if (!subject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Subject not found</div>
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subject Details</h1>
          <p className="text-sm text-gray-600 mt-1">View subject information and details</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Subject Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject Header Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{subject.name}</h2>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                subject.isActive 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-red-100 text-red-800 border-red-200"
              }`}>
                {subject.isActive ? (
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
            <p className="text-gray-600 mb-4">{subject.description || "No description provided"}</p>
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Subject Code</p>
                <p className="font-medium text-gray-800">{subject.code || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Subject ID</p>
                <p className="font-medium text-gray-800 text-xs">{subject.id || "N/A"}</p>
              </div>
            </div>
          </div>
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
                <p className="font-medium text-gray-800">{formatDate(subject.createdAt)}</p>
              </div>
              {subject.updatedAt && (
                <div className="text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <p className="font-medium text-gray-800">{formatDate(subject.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Book size={20} className="text-[#2b7818]" />
              Additional Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${subject.isActive ? "text-green-600" : "text-red-600"}`}>
                  {subject.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectDetails
