import { useState, useEffect } from "react"
import Table from "../../components/reusable/table"
import { getAllDepartments, deleteDepartment } from "../../Services/departmentService"
import AddAndEditDepartmentModal from "../../components/Models/Department/addAndeditDepartment"
import DeleteModal from "../../components/reusable/deleteModel"
import { Plus } from "lucide-react"
import { toast } from "react-toastify"

const AllDepartments = () => {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [departmentToEdit, setDepartmentToEdit] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(10)

  const columns = [
    { 
      key: "sno", 
      label: "S.No", 
      render: (value, row, index) => (currentPage * itemsPerPage) + index + 1 
    },
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
    { key: "active", label: "Status", render: (value, row) => {
      const status = row.active !== undefined ? row.active : (row.isActive !== undefined ? row.isActive : true);
      return status ? "Active" : "Inactive";
    }},
  ]

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await getAllDepartments()
      setDepartments(response.data || [])
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleAddDepartment = () => {
    setDepartmentToEdit(null)
    setIsModalOpen(true)
  }

  const handleEditDepartment = (department) => {
    setDepartmentToEdit(department)
    setIsModalOpen(true)
  }

  const handleViewDepartment = (department) => {
    console.log("View department:", department)
    // TODO: Navigate to details page
  }

  const handleDeleteDepartment = (department) => {
    setDepartmentToDelete(department)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (departmentToDelete) {
      try {
        await deleteDepartment(departmentToDelete.id)
        toast.success("Department deleted successfully!")
        handleSuccess()
      } catch (error) {
        if (error.response?.status === 403) {
          toast.error(error.response?.data?.message || "You do not have permission to delete this department.");
        } else if (error.response?.status === 404) {
          toast.error("Department not found. The list has been refreshed.");
          handleSuccess();
        } else {
          toast.error(error.response?.data?.message || "Failed to delete department");
        }
      }
    }
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setDepartmentToDelete(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setDepartmentToEdit(null)
  }

  const handleSuccess = () => {
    fetchDepartments()
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Client-side pagination
  const totalPages = Math.ceil(departments.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDepartments = departments.slice(startIndex, endIndex)

  const pagination = {
    pageNumber: currentPage,
    pageSize: itemsPerPage,
    totalElements: departments.length,
    totalPages: totalPages,
    last: currentPage === totalPages - 1 || totalPages === 0
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">All Departments</h1>
        <button
          onClick={handleAddDepartment}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <Plus size={20} />
          Add Department
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : (
        <Table 
          columns={columns} 
          data={paginatedDepartments} 
          onEdit={handleEditDepartment}
          onView={handleViewDepartment}
          onDelete={handleDeleteDepartment}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      <AddAndEditDepartmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        departmentToEdit={departmentToEdit}
        onSuccess={handleSuccess}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleConfirmDelete}
        title="Delete Department"
        message={`Are you sure you want to delete ${departmentToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  )
}

export default AllDepartments