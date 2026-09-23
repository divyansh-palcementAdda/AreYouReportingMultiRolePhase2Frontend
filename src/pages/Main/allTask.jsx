import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Table from "../../components/reusable/table"
import { getAllTasks, deleteTask } from "../../Services/taskService"
import AddAndEditTaskModal from "../../components/Models/Tasks/addAndeditTask"
import DeleteModal from "../../components/reusable/deleteModel"
import { Plus, Circle, CheckCircle2 } from "lucide-react"
import { TotalTasksCard, CompletedCard, PendingCard, InProgressCard, OverdueCard, ApprovalsCard } from "../../components/cards/cardsDesign"

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
  const [statusFilter, setStatusFilter] = useState("")
  const [isSearching, setIsSearching] = useState(false)

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

  const statusFilterOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN PROGRESS" },
    { label: "Review", value: "REVIEW" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Overdue", value: "OVERDUE" },
  ]

  const fetchTasks = async (page = 0, query = "", filter = "") => {
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

      if (filter && filter.trim()) {
        params.status = filter.trim()
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
      setIsSearching(false)
    }
  }

  useEffect(() => {
    fetchTasks(0)
  }, [])

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
    fetchTasks(page, searchQuery, statusFilter)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(0)
    setIsSearching(true)
    fetchTasks(0, query, statusFilter)
  }

  const handleFilter = (filter) => {
    setStatusFilter(filter)
    setCurrentPage(0)
    fetchTasks(0, searchQuery, filter)
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Tasks</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage all tasks across the organization</p>
        </div>
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <TotalTasksCard 
          number={tasks.length} 
          secondaryText="All tasks"
        />
        <CompletedCard 
          number={tasks.filter(t => t.status === 'COMPLETED').length} 
          secondaryText="Done"
        />
        <PendingCard 
          number={tasks.filter(t => t.status === 'PENDING').length} 
          secondaryText="Waiting"
        />
        <InProgressCard 
          number={tasks.filter(t => t.status === 'IN PROGRESS').length} 
          secondaryText="Active"
        />
        <OverdueCard 
          number={tasks.filter(t => t.status === 'OVERDUE').length} 
          secondaryText="Late"
        />
        <ApprovalsCard 
          number={tasks.filter(t => t.status === 'REVIEW').length} 
          secondaryText="Pending"
        />
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
          enableSearch={true}
          enableFilter={true}
          onSearch={handleSearch}
          onFilter={handleFilter}
          filterOptions={statusFilterOptions}
          isSearching={isSearching}
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