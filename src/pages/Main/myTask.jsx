import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Search } from "lucide-react"
import Table from "../../components/reusable/table"
import DeleteModal from "../../components/reusable/deleteModel"
import { getAllTasks, deleteTask } from "../../Services/taskService"

const MyTask = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
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

  const fetchMyTasks = async (page = 0, search = "") => {
    setLoading(true)
    try {
      const params = {
        isSelfTask: true,
        pageable: {
          page: page,
          size: 10,
          sort: ["createdAt,desc"]
        }
      }
      if (search) {
        params.search = search
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
      console.error("Error fetching my tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyTasks(0, searchTerm)
  }, [])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchMyTasks(page, searchTerm)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setCurrentPage(0)
    fetchMyTasks(0, value)
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
      fetchMyTasks(currentPage)
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Task</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage your assigned tasks</p>
        </div>
        <button
          onClick={() => navigate("/create-task")}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
        >
          Add Task
        </button>
      </div>

      <div className="mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="mt-6">
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

export default MyTask
