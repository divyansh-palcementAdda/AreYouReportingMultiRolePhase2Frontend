import React, { useState, useEffect } from "react"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Table from "../../components/reusable/table"
import DeleteModal from "../../components/reusable/deleteModel"
import { getAllTasks, deleteTask } from "../../Services/taskService"

const PendingApprove = () => {
  const navigate = useNavigate()
  const [selectedStatus, setSelectedStatus] = useState("PENDING")
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [counts, setCounts] = useState({
    pending: 0,
    closed: 0,
    delayed: 0
  })
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    task: null
  })

  const columns = [
    { key: "serialNo", label: "S.No", render: (value, row, index) => (currentPage * 10) + index + 1 },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "assignee", label: "Assignee" },
  ]

  const fetchTasksByStatus = async (status, page = 0) => {
    setLoading(true)
    try {
      const params = {
        statuses: [status],
        pageable: {
          page: page,
          size: 10,
          sort: ["createdAt,desc"]
        }
      }
      const response = await getAllTasks(params)
      setTasks(response.data?.content || response.content || [])
      setPagination(response.data || {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        last: true
      })
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllCounts = async () => {
    try {
      // Fetch pending count
      const pendingResponse = await getAllTasks({ statuses: ["PENDING"], pageable: { page: 0, size: 1 } })
      setCounts(prev => ({ ...prev, pending: pendingResponse.data?.totalElements || 0 }))

      // Fetch closed count
      const closedResponse = await getAllTasks({ statuses: ["CLOSED"], pageable: { page: 0, size: 1 } })
      setCounts(prev => ({ ...prev, closed: closedResponse.data?.totalElements || 0 }))

      // Fetch delayed count
      const delayedResponse = await getAllTasks({ statuses: ["DELAYED"], pageable: { page: 0, size: 1 } })
      setCounts(prev => ({ ...prev, delayed: delayedResponse.data?.totalElements || 0 }))
    } catch (error) {
      console.error("Error fetching counts:", error)
    }
  }

  useEffect(() => {
    fetchAllCounts()
  }, [])

  useEffect(() => {
    if (selectedStatus) {
      fetchTasksByStatus(selectedStatus, 0)
    }
  }, [selectedStatus])

  const handleCardClick = (status) => {
    setSelectedStatus(status)
    setCurrentPage(0)
    fetchTasksByStatus(status, 0)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (selectedStatus) {
      fetchTasksByStatus(selectedStatus, page)
    }
  }

  const handleView = (task) => {
    navigate(`/task-details/${task.id}`)
  }

  const handleDeleteClick = (task) => {
    setDeleteModal({
      isOpen: true,
      task: task
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.task) return
    
    try {
      await deleteTask(deleteModal.task.id)
      toast.success("Task deleted successfully")
      setDeleteModal({ isOpen: false, task: null })
      // Refresh the task list
      fetchTasksByStatus(selectedStatus, currentPage)
      // Refresh counts
      fetchAllCounts()
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  }

  const handleDeleteModalClose = () => {
    setDeleteModal({ isOpen: false, task: null })
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pending Approvals</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PENDING Card */}
        <div 
          onClick={() => handleCardClick("PENDING")}
          className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
            selectedStatus === "PENDING" ? "border-orange-400" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-orange-500 mb-1">PENDING</h3>
              <p className="text-2xl font-bold text-orange-600">{counts.pending}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-orange-600" />
            </div>
          </div>
        </div>

        {/* CLOSED Card */}
        <div 
          onClick={() => handleCardClick("CLOSED")}
          className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
            selectedStatus === "CLOSED" ? "border-green-400" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-green-500 mb-1">CLOSED</h3>
              <p className="text-2xl font-bold text-green-600">{counts.closed}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* DELAYED Card */}
        <div 
          onClick={() => handleCardClick("DELAYED")}
          className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
            selectedStatus === "DELAYED" ? "border-red-400" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-red-500 mb-1">DELAYED</h3>
              <p className="text-2xl font-bold text-red-600">{counts.delayed}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table for selected status */}
      {selectedStatus && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {selectedStatus === "PENDING" && "Pending Tasks"}
            {selectedStatus === "CLOSED" && "Closed Tasks"}
            {selectedStatus === "DELAYED" && "Delayed Tasks"}
          </h2>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading...</div>
          ) : (
            <Table 
              columns={columns} 
              data={tasks} 
              pagination={pagination}
              onPageChange={handlePageChange}
              onView={handleView}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete the task "${deleteModal.task?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}

export default PendingApprove