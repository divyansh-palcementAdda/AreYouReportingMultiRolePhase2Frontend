import { useState, useEffect } from "react"
import Table from "../../components/reusable/table"
import { getAllTasks } from "../../Services/taskService"
import AddAndEditTaskModal from "../../components/Models/Tasks/addAndeditTask"
import { Plus } from "lucide-react"

const AllTask = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "assignee", label: "Assignee" },
  ]

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const params = {
        pageable: {
          page: 0,
          size: 10,
          sort: ["createdAt,desc"]
        }
      }
      const response = await getAllTasks(params)
      setTasks(response.data || response.content || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
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
    fetchTasks()
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
        <Table columns={columns} data={tasks} onEdit={handleEditTask} />
      )}

      <AddAndEditTaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        taskToEdit={taskToEdit}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

export default AllTask