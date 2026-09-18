import React, { useState, useEffect } from "react"
import { Clock, CheckCircle, XCircle } from "lucide-react"
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
    approved: 0,
    rejected: 0
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

      // Fetch approved count
      const approvedResponse = await getAllTasks({ statuses: ["APPROVED"], pageable: { page: 0, size: 1 } })
      setCounts(prev => ({ ...prev, approved: approvedResponse.data?.totalElements || 0 }))

      // Fetch rejected count
      const rejectedResponse = await getAllTasks({ statuses: ["REJECTED"], pageable: { page: 0, size: 1 } })
      setCounts(prev => ({ ...prev, rejected: rejectedResponse.data?.totalElements || 0 }))
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
  }, [])

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Pending Card */}
        <div 
          onClick={() => handleCardClick("PENDING")}
          className={`bg-white rounded-lg border-2 p-2 hover:shadow-lg transition-all cursor-pointer ${
            selectedStatus === "PENDING" 
              ? "border-yellow-400 bg-yellow-50" 
              : "border-gray-200 hover:border-yellow-400 hover:bg-yellow-50"
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mb-1">
              <Clock size={16} className="text-yellow-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-0.5">Pending</h3>
            <p className="text-gray-600 text-xs">Awaiting approval</p>
            <div className="mt-1 text-lg font-bold text-yellow-600">{counts.pending}</div>
          </div>
        </div>

        {/* Approved Card */}
        <div 
          onClick={() => handleCardClick("APPROVED")}
          className={`bg-white rounded-lg border-2 p-2 hover:shadow-lg transition-all cursor-pointer ${
            selectedStatus === "APPROVED" 
              ? "border-green-500 bg-green-50" 
              : "border-gray-200 hover:border-green-500 hover:bg-green-50"
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-0.5">Approved</h3>
            <p className="text-gray-600 text-xs">Successfully approved</p>
            <div className="mt-1 text-lg font-bold text-green-600">{counts.approved}</div>
          </div>
        </div>

        {/* Rejected Card */}
        <div 
          onClick={() => handleCardClick("REJECTED")}
          className={`bg-white rounded-lg border-2 p-2 hover:shadow-lg transition-all cursor-pointer ${
            selectedStatus === "REJECTED" 
              ? "border-red-500 bg-red-50" 
              : "border-gray-200 hover:border-red-500 hover:bg-red-50"
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-1">
              <XCircle size={16} className="text-red-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-0.5">Rejected</h3>
            <p className="text-gray-600 text-xs">Declined requests</p>
            <div className="mt-1 text-lg font-bold text-red-600">{counts.rejected}</div>
          </div>
        </div>
      </div>

      {/* Table for selected status */}
      {selectedStatus && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {selectedStatus === "PENDING" && "Pending Tasks"}
            {selectedStatus === "APPROVED" && "Approved Tasks"}
            {selectedStatus === "REJECTED" && "Rejected Tasks"}
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