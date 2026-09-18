import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Table from "../../components/reusable/table"
import { getAllUsers, deleteUser } from "../../Services/userService"
import AddAndEditUserModal from "../../components/Models/User/addAndeditusers"
import DeleteModal from "../../components/reusable/deleteModel"
import { Plus, Edit, Trash2, User } from "lucide-react"
import { toast } from "react-toastify"

const AllUsers = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(10)
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true
  })

  const userColumns = [
    { 
      key: "sno", 
      label: "S.No", 
      render: (value, row, index) => (pagination.pageNumber * pagination.pageSize) + index + 1 
    },
    { key: "username", label: "Username" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { 
      key: "roleAssignments", 
      label: "Roles", 
      render: (value) => {
        if (!value || value.length === 0) return "-"
        return value.map(ra => ra.roleName || ra.roleId).join(", ")
      }
    },
    { 
      key: "departments", 
      label: "Departments", 
      render: (value) => {
        if (!value || value.length === 0) return "-"
        return value.map(dept => dept.name).join(", ")
      }
    },
    {
      key: "active",
      label: "Status",
      render: (value) => value ? "Active" : "Inactive"
    }
  ]

  const fetchUsers = async (page = 0) => {
    setLoading(true)
    try {
      const response = await getAllUsers({ page: page, size: itemsPerPage })
      // Handle the actual API response structure
      const userData = response?.data?.content || []
      setUsers(userData)
      
      // Update pagination from API response
      if (response?.data) {
        setPagination({
          pageNumber: response.data.pageNumber || 0,
          pageSize: response.data.pageSize || itemsPerPage,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0,
          last: response.data.last || true
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAddUser = () => {
    setUserToEdit(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user) => {
    setUserToEdit(user)
    setIsModalOpen(true)
  }

  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const handleViewUser = (user) => {
    navigate(`/user-details/${user.id}`)
  }

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id)
        toast.success("User deleted successfully!")
        handleSuccess()
      } catch (error) {
        throw error
      }
    }
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setUserToEdit(null)
  }

  const handleSuccess = async () => {
    await fetchUsers(currentPage)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchUsers(page)
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading users...</div>
      ) : (
        <Table 
          columns={userColumns} 
          data={users} 
          pagination={pagination}
          onPageChange={handlePageChange}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onView={handleViewUser}
          emptyMessage="No users found"
        />
      )}

      <AddAndEditUserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userToEdit={userToEdit}
        onSuccess={handleSuccess}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.fullName || userToDelete?.username}? This action cannot be undone.`}
      />
    </div>
  )
}

export default AllUsers

