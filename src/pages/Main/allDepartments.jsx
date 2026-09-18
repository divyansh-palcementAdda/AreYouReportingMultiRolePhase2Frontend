import { useState, useEffect } from "react"
import Table from "../../components/reusable/table"
import { getAllDepartments, deleteDepartment, getSubDepartmentsByDepartmentId, deactivateSubDepartment } from "../../Services/departmentService"
import AddAndEditDepartmentModal from "../../components/Models/Department/addAndeditDepartment"
import AddAndEditSubDepartmentModal from "../../components/Models/subDepartment/addAndEditSub"
import DeleteModal from "../../components/reusable/deleteModel"
import { Plus, Building2, ChevronRight, Edit, Trash2 } from "lucide-react"
import { toast } from "react-toastify"

const AllDepartments = () => {
  const [departments, setDepartments] = useState([])
  const [subDepartments, setSubDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [subDepartmentsLoading, setSubDepartmentsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [departmentToEdit, setDepartmentToEdit] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(10)
  const [isSubModalOpen, setIsSubModalOpen] = useState(false)
  const [subDepartmentToEdit, setSubDepartmentToEdit] = useState(null)
  const [isSubDeleteModalOpen, setIsSubDeleteModalOpen] = useState(false)
  const [subDepartmentToDelete, setSubDepartmentToDelete] = useState(null)

  const subDepartmentColumns = [
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
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditSubDepartment(row)}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Edit Sub-Department"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteSubDepartment(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Sub-Department"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ]

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await getAllDepartments()
      const departmentData = response.data || []
      setDepartments(departmentData)
      // Set default selected department to the first one only if not already set
      if (departmentData.length > 0 && !selectedDepartment) {
        setSelectedDepartment(departmentData[0])
        // Fetch sub-departments for the first department
        await fetchSubDepartments(departmentData[0].id)
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubDepartments = async (deptId) => {
    setSubDepartmentsLoading(true)
    try {
      const response = await getSubDepartmentsByDepartmentId(deptId)
      setSubDepartments(response.data || [])
    } catch (error) {
      console.error("Error fetching sub-departments:", error)
    } finally {
      setSubDepartmentsLoading(false)
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
    setSelectedDepartment(department)
  }

  const handleDepartmentClick = async (department) => {
    setSelectedDepartment(department)
    setCurrentPage(0)
    await fetchSubDepartments(department.id)
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
        // Reset selected department if it was the deleted one
        if (selectedDepartment?.id === departmentToDelete.id) {
          setSelectedDepartment(null)
          setSubDepartments([])
          setCurrentPage(0)
        }
        handleSuccess()
      } catch (error) {
        throw error
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

  const handleAddSubDepartment = () => {
    if (!selectedDepartment) {
      toast.error("Please select a department first")
      return
    }
    setSubDepartmentToEdit(null)
    setIsSubModalOpen(true)
  }

  const handleSubModalClose = () => {
    setIsSubModalOpen(false)
    setSubDepartmentToEdit(null)
  }

  const handleEditSubDepartment = (subDepartment) => {
    setSubDepartmentToEdit(subDepartment)
    setIsSubModalOpen(true)
  }

  const handleDeleteSubDepartment = (subDepartment) => {
    setSubDepartmentToDelete(subDepartment)
    setIsSubDeleteModalOpen(true)
  }

  const handleConfirmSubDelete = async () => {
    if (subDepartmentToDelete) {
      try {
        await deactivateSubDepartment(subDepartmentToDelete.id)
        toast.success("Sub-department deleted successfully!")
        setIsSubDeleteModalOpen(false)
        setSubDepartmentToDelete(null)
        handleSuccess()
      } catch (error) {
        throw error
      }
    }
  }

  const handleSubDeleteModalClose = () => {
    setIsSubDeleteModalOpen(false)
    setSubDepartmentToDelete(null)
  }

  const handleSuccess = async () => {
    await fetchDepartments()
    // If there's a selected department, refresh its sub-departments
    if (selectedDepartment) {
      await fetchSubDepartments(selectedDepartment.id)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Client-side pagination for sub-departments
  const totalPages = Math.ceil(subDepartments.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSubDepartments = subDepartments.slice(startIndex, endIndex)

  const pagination = {
    pageNumber: currentPage,
    pageSize: itemsPerPage,
    totalElements: subDepartments.length,
    totalPages: totalPages,
    last: currentPage === totalPages - 1 || totalPages === 0
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">All Departments</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddDepartment}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <Plus size={20} />
            Add Department
          </button>
          <button
            onClick={handleAddSubDepartment}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <Plus size={20} />
            Add Sub Department
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : (
        <>
          {/* Department Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {departments.map((department) => (
              <div
                key={department.id}
                onClick={() => handleDepartmentClick(department)}
                className={`cursor-pointer p-3 rounded-xl border-2 transition-all hover:shadow-lg ${
                  selectedDepartment?.id === department.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-green-600" />
                    <h3 className="font-semibold text-gray-800">{department.name}</h3>
                  </div>
                  {selectedDepartment?.id === department.id && (
                    <ChevronRight size={18} className="text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sub-department Table */}
          {selectedDepartment && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Sub-departments for {selectedDepartment.name}
                </h2>
                {/* <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditDepartment(selectedDepartment)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Edit Department"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(selectedDepartment)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Department"
                  >
                    <Trash2 size={18} />
                  </button>
                </div> */}
              </div>
              {subDepartmentsLoading ? (
                <div className="text-center py-8 text-gray-600">Loading sub-departments...</div>
              ) : (
                <Table 
                  columns={subDepartmentColumns} 
                  data={paginatedSubDepartments} 
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}
        </>
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

      <AddAndEditSubDepartmentModal
        isOpen={isSubModalOpen}
        onClose={handleSubModalClose}
        subDepartmentToEdit={subDepartmentToEdit}
        deptId={selectedDepartment?.id}
        onSuccess={handleSuccess}
      />

      <DeleteModal
        isOpen={isSubDeleteModalOpen}
        onClose={handleSubDeleteModalClose}
        onDelete={handleConfirmSubDelete}
        title="Delete Sub-Department"
        message={`Are you sure you want to delete ${subDepartmentToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  )
}

export default AllDepartments