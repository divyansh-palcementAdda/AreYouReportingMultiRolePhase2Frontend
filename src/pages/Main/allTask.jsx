import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Table from "../../components/reusable/table"
import { getAllTasks, deleteTask } from "../../Services/taskService"
import AddAndEditTaskModal from "../../components/Models/Tasks/addAndeditTask"
import DeleteModal from "../../components/reusable/deleteModel"
import { Plus, Search, Circle, CheckCircle2 } from "lucide-react"

const AllTask = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  // Status badge rendering
  const renderStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Circle },
      'IN PROGRESS': { color: 'text-blue-600', bg: 'bg-blue-50', icon: Circle },
      'REVIEW': { color: 'text-purple-600', bg: 'bg-purple-50', icon: Circle },
      'COMPLETED': { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
      'OVERDUE': { color: 'text-red-600', bg: 'bg-red-50', icon: Circle },
    }

    const config = statusConfig[status] || { color: 'text-gray-600', bg: 'bg-gray-50', icon: Circle }
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        <Icon size={10} fill="currentColor" />
        {status}
      </span>
    )
  }

  // Priority badge rendering
  const renderPriorityBadge = (priority) => {
    const priorityConfig = {
      'High': { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Circle },
      'Urgent': { color: 'text-red-600', bg: 'bg-red-50', icon: Circle },
      'Medium': { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Circle },
      'Low': { color: 'text-green-600', bg: 'bg-green-50', icon: Circle },
    }

    const config = priorityConfig[priority] || { color: 'text-gray-600', bg: 'bg-gray-50', icon: Circle }
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        <Icon size={10} fill="currentColor" />
        {priority}
      </span>
    )
  }

  const columns = [
    { key: "serialNo", label: "S.No" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status", render: renderStatusBadge },
    { key: "priority", label: "Priority", render: renderPriorityBadge },
    { key: "assignee", label: "Assignee" },
  ]

  const fetchTasks = async (page = 0, query = "") => {
    setLoading(true)
    try {
      const params = {
        pageable: {
          page: page,
          size: 10,
          sort: ["createdAt,desc"]
        }
      }
      
      if (query && query.trim()) {
        params.search = query.trim()
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

  useEffect(() => {
    fetchTasks(0)
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch tasks when debounced search query changes
  useEffect(() => {
    setCurrentPage(0)
    fetchTasks(0, debouncedSearchQuery)
  }, [debouncedSearchQuery])

  const handleAddTask = () => {
    setTaskToEdit(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setTaskToEdit(task)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setTaskToEdit(null)
  }

  const handleSuccess = () => {
    fetchTasks(currentPage)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchTasks(page, debouncedSearchQuery)
  }

  const handleDeleteClick = (task) => {
    setTaskToDelete(task)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setTaskToDelete(null)
  }

  const handleDeleteTask = async () => {
    if (taskToDelete?.id) {
      await deleteTask(taskToDelete.id)
    }
  }

  const handleViewTask = (task) => {
    navigate(`/task-details/${task.id}`)
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">All Tasks</h1>
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table 
          columns={columns} 
          data={tasks.map((task, index) => ({
            ...task,
            serialNo: currentPage * 10 + index + 1
          }))} 
          onEdit={handleEditTask}
          onView={handleViewTask}
          onDelete={handleDeleteClick}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      <AddAndEditTaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        taskToEdit={taskToEdit}
        onSuccess={handleSuccess}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  )
}

export default AllTask