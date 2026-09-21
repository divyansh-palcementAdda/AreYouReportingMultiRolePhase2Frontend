import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Table from "../../components/reusable/table"
import { getAllSubjects, deleteSubject } from "../../Services/subjectService"
import AddAndEditSubjectModal from "../../components/Models/Subject/addAndEditSubject"
import DeleteModal from "../../components/reusable/deleteModel"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "react-toastify"

const Subject = () => {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subjectToEdit, setSubjectToEdit] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

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
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewSubject(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Subject"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEditSubject(row)}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Edit Subject"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteSubject(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Subject"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ]

  const fetchSubjects = async (query = "") => {
    setLoading(true)
    try {
      const params = {}
      
      if (query && query.trim()) {
        params.search = query.trim()
      }
      
      const response = await getAllSubjects(params)
      const subjectData = response.data || []
      setSubjects(subjectData)
    } catch (error) {
      console.error("Error fetching subjects:", error)
      toast.error("Failed to fetch subjects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch subjects when debounced search query changes
  useEffect(() => {
    setCurrentPage(0)
    fetchSubjects(debouncedSearchQuery)
  }, [debouncedSearchQuery])

  const handleAddSubject = () => {
    setSubjectToEdit(null)
    setIsModalOpen(true)
  }

  const handleViewSubject = (subject) => {
    navigate(`/subject-details/${subject.id}`)
  }

  const handleEditSubject = (subject) => {
    setSubjectToEdit(subject)
    setIsModalOpen(true)
  }

  const handleDeleteSubject = (subject) => {
    setSubjectToDelete(subject)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (subjectToDelete) {
      try {
        await deleteSubject(subjectToDelete.id)
        toast.success("Subject deleted successfully!")
        setIsDeleteModalOpen(false)
        setSubjectToDelete(null)
        handleSuccess()
      } catch (error) {
        console.error("Error deleting subject:", error)
        toast.error(error.response?.data?.message || "Failed to delete subject")
      }
    }
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSubjectToDelete(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSubjectToEdit(null)
  }

  const handleSuccess = async () => {
    await fetchSubjects(debouncedSearchQuery)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Client-side pagination
  const totalPages = Math.ceil(subjects.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSubjects = subjects.slice(startIndex, endIndex)

  const pagination = {
    pageNumber: currentPage,
    pageSize: itemsPerPage,
    totalElements: subjects.length,
    totalPages: totalPages,
    last: currentPage === totalPages - 1 || totalPages === 0
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">All Subjects</h1>
        <button
          onClick={handleAddSubject}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <Plus size={20} />
          Add Subject
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : (
        <Table 
          columns={columns} 
          data={paginatedSubjects} 
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      <AddAndEditSubjectModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        subjectToEdit={subjectToEdit}
        onSuccess={handleSuccess}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleConfirmDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete ${subjectToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  )
}

export default Subject
