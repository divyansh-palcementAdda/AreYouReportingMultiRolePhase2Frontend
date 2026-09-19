import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Table from "../../components/reusable/table"
import { getAllTaskTemplates, deleteTaskTemplate } from "../../Services/taskTemplateService"
import AddAndEditTaskTemplateModal from "../../components/Models/TaskTemplate/addAndEditTaskTemplate"
import DeleteModal from "../../components/reusable/deleteModel"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "react-toastify"

const TaskTemplate = () => {
  const navigate = useNavigate()
  const [taskTemplates, setTaskTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskTemplateToEdit, setTaskTemplateToEdit] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskTemplateToDelete, setTaskTemplateToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(10)

  const columns = [
    { 
      key: "sno", 
      label: "S.No", 
      render: (value, row, index) => (currentPage * itemsPerPage) + index + 1 
    },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "defaultPriority", label: "Default Priority" },
    { key: "defaultDurationDays", label: "Duration (Days)" },
    { key: "defaultTargetCount", label: "Target Count" },
    { key: "defaultTargetPercentage", label: "Target (%)" },
    { key: "active", label: "Status", render: (value, row) => {
      const status = row.active !== undefined ? row.active : (row.isActive !== undefined ? row.isActive : true);
      return status ? "Active" : "Inactive";
    }},
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewTaskTemplate(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Task Template"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEditTaskTemplate(row)}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Edit Task Template"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteTaskTemplate(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Task Template"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ]

  const fetchTaskTemplates = async () => {
    setLoading(true)
    try {
      const response = await getAllTaskTemplates()
      const taskTemplateData = response.data || []
      setTaskTemplates(taskTemplateData)
    } catch (error) {
      console.error("Error fetching task templates:", error)
      toast.error("Failed to fetch task templates")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTaskTemplates()
  }, [])

  const handleAddTaskTemplate = () => {
    setTaskTemplateToEdit(null)
    setIsModalOpen(true)
  }

  const handleViewTaskTemplate = (taskTemplate) => {
    navigate(`/task-template-details/${taskTemplate.id}`)
  }

  const handleEditTaskTemplate = (taskTemplate) => {
    setTaskTemplateToEdit(taskTemplate)
    setIsModalOpen(true)
  }

  const handleDeleteTaskTemplate = (taskTemplate) => {
    setTaskTemplateToDelete(taskTemplate)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (taskTemplateToDelete) {
      try {
        await deleteTaskTemplate(taskTemplateToDelete.id)
        toast.success("Task template deleted successfully!")
        setIsDeleteModalOpen(false)
        setTaskTemplateToDelete(null)
        handleSuccess()
      } catch (error) {
        console.error("Error deleting task template:", error)
        toast.error(error.response?.data?.message || "Failed to delete task template")
      }
    }
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setTaskTemplateToDelete(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setTaskTemplateToEdit(null)
  }

  const handleSuccess = async () => {
    await fetchTaskTemplates()
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Client-side pagination
  const totalPages = Math.ceil(taskTemplates.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTaskTemplates = taskTemplates.slice(startIndex, endIndex)

  const pagination = {
    pageNumber: currentPage,
    pageSize: itemsPerPage,
    totalElements: taskTemplates.length,
    totalPages: totalPages,
    last: currentPage === totalPages - 1 || totalPages === 0
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Task Templates</h1>
        <button
          onClick={handleAddTaskTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <Plus size={20} />
          Add Task Template
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : (
        <Table 
          columns={columns} 
          data={paginatedTaskTemplates} 
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      <AddAndEditTaskTemplateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        taskTemplateToEdit={taskTemplateToEdit}
        onSuccess={handleSuccess}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleConfirmDelete}
        title="Delete Task Template"
        message={`Are you sure you want to delete ${taskTemplateToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  )
}

export default TaskTemplate
