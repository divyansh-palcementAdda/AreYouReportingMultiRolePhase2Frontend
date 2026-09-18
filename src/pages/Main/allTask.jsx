import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Table from "../../components/reusable/table"
import { getAllTasks, deleteTask } from "../../Services/taskService"
import AddAndEditTaskModal from "../../components/Models/Tasks/addAndeditTask"
import DeleteModal from "../../components/reusable/deleteModel"
import { Plus } from "lucide-react"

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

  const columns = [
    { key: "serialNo", label: "S.No" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "assignee", label: "Assignee" },
  ]

  const fetchTasks = async (page = 0) => {
    setLoading(true)
    try {
      const params = {
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
    fetchTasks(page)
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