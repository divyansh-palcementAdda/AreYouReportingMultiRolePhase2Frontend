import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Table from "../../components/reusable/table"
import { getAllDepartments, deleteDepartment, getSubDepartmentsByDepartmentId, deactivateSubDepartment } from "../../Services/departmentService"
import { getAllUsers, deleteUser } from "../../Services/userService"
import { getAllTasks, deleteTask } from "../../Services/taskService"
import AddAndEditDepartmentModal from "../../components/Models/Department/addAndeditDepartment"
import AddAndEditSubDepartmentModal from "../../components/Models/subDepartment/addAndEditSub"
import AddAndEditUserModal from "../../components/Models/User/addAndeditusers"
import AddAndEditTaskModal from "../../components/Models/Tasks/addAndeditTask"
import DeleteModal from "../../components/reusable/deleteModel"
import { Plus, Building2, ChevronRight, Edit, Trash2, Eye, Users, ClipboardList, Circle, CheckCircle2 } from "lucide-react"
import { toast } from "react-toastify"

// ─── Tab IDs ────────────────────────────────────────────────────────────────
const TABS = {
  DEPARTMENTS: "departments",
  USERS: "users",
  TASKS: "tasks",
}

const AllWorks = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(TABS.DEPARTMENTS)

  // ── Department state ──────────────────────────────────────────────────────
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

  // ── User state ────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState(null)
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [userCurrentPage, setUserCurrentPage] = useState(0)
  const [userPagination, setUserPagination] = useState({
    pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0, last: true,
  })

  // ── Task state ────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [isTaskDeleteModalOpen, setIsTaskDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [taskCurrentPage, setTaskCurrentPage] = useState(0)
  const [taskPagination, setTaskPagination] = useState(null)
  const [taskSearchQuery, setTaskSearchQuery] = useState("")
  const [taskStatusFilter, setTaskStatusFilter] = useState("")
  const [isTaskSearching, setIsTaskSearching] = useState(false)

  // ═════════════════════════════════════════════════════════════════════════
  // Department helpers
  // ═════════════════════════════════════════════════════════════════════════

  const subDepartmentColumns = [
    { key: "sno", label: "S.No", render: (value, row, index) => (currentPage * itemsPerPage) + index + 1 },
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
    {
      key: "active", label: "Status",
      render: (value, row) => {
        const status = row.active !== undefined ? row.active : (row.isActive !== undefined ? row.isActive : true)
        return status ? "Active" : "Inactive"
      }
    },
    {
      key: "actions", label: "Actions",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleViewSubDepartment(row)} className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="View">
            <Eye size={18} />
          </button>
          <button onClick={() => handleEditSubDepartment(row)} className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Edit">
            <Edit size={18} />
          </button>
          <button onClick={() => handleDeleteSubDepartment(row)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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
      if (departmentData.length > 0 && !selectedDepartment) {
        setSelectedDepartment(departmentData[0])
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

  useEffect(() => { fetchDepartments() }, [])

  const handleAddDepartment = () => { setDepartmentToEdit(null); setIsModalOpen(true) }
  const handleEditDepartment = (dept) => { setDepartmentToEdit(dept); setIsModalOpen(true) }
  const handleViewDepartment = (dept, e) => { e.stopPropagation(); navigate(`/department-details/${dept.id}`) }
  const handleDepartmentClick = async (dept) => {
    setSelectedDepartment(dept); setCurrentPage(0); await fetchSubDepartments(dept.id)
  }
  const handleDeleteDepartment = (dept) => { setDepartmentToDelete(dept); setIsDeleteModalOpen(true) }
  const handleConfirmDelete = async () => {
    if (departmentToDelete) {
      try {
        await deleteDepartment(departmentToDelete.id)
        toast.success("Department deleted successfully!")
        if (selectedDepartment?.id === departmentToDelete.id) { setSelectedDepartment(null); setSubDepartments([]); setCurrentPage(0) }
        await handleDeptSuccess()
      } catch (error) { throw error }
    }
  }
  const handleDeleteModalClose = () => { setIsDeleteModalOpen(false); setDepartmentToDelete(null) }
  const handleModalClose = () => { setIsModalOpen(false); setDepartmentToEdit(null) }
  const handleAddSubDepartment = () => {
    if (!selectedDepartment) { toast.error("Please select a department first"); return }
    setSubDepartmentToEdit(null); setIsSubModalOpen(true)
  }
  const handleSubModalClose = () => { setIsSubModalOpen(false); setSubDepartmentToEdit(null) }
  const handleEditSubDepartment = (sub) => { setSubDepartmentToEdit(sub); setIsSubModalOpen(true) }
  const handleViewSubDepartment = (sub) => { navigate(`/sub-department-details/${sub.id}`) }
  const handleDeleteSubDepartment = (sub) => { setSubDepartmentToDelete(sub); setIsSubDeleteModalOpen(true) }
  const handleConfirmSubDelete = async () => {
    if (subDepartmentToDelete) {
      try {
        await deactivateSubDepartment(subDepartmentToDelete.id)
        toast.success("Sub-department deleted successfully!")
        setIsSubDeleteModalOpen(false); setSubDepartmentToDelete(null)
        await handleDeptSuccess()
      } catch (error) { throw error }
    }
  }
  const handleSubDeleteModalClose = () => { setIsSubDeleteModalOpen(false); setSubDepartmentToDelete(null) }
  const handleDeptSuccess = async () => {
    await fetchDepartments()
    if (selectedDepartment) await fetchSubDepartments(selectedDepartment.id)
  }
  const handlePageChange = (page) => { setCurrentPage(page) }

  const totalPages = Math.ceil(subDepartments.length / itemsPerPage)
  const paginatedSubDepartments = subDepartments.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  const deptPagination = {
    pageNumber: currentPage, pageSize: itemsPerPage,
    totalElements: subDepartments.length, totalPages,
    last: currentPage === totalPages - 1 || totalPages === 0,
  }

  // ═════════════════════════════════════════════════════════════════════════
  // User helpers
  // ═════════════════════════════════════════════════════════════════════════

  const userColumns = [
    { key: "sno", label: "S.No", render: (value, row, index) => (userPagination.pageNumber * userPagination.pageSize) + index + 1 },
    { key: "username", label: "Username" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    {
      key: "roleAssignments", label: "Roles",
      render: (value) => {
        if (!value || value.length === 0) return "-"
        return value.slice(0, 2).map(ra => ra.roleName || ra.roleId).join(", ")
      }
    },
    {
      key: "departments", label: "Departments",
      render: (value) => {
        if (!value || value.length === 0) return "-"
        return value.slice(0, 2).map(d => d.name).join(", ")
      }
    },
    { key: "active", label: "Status", render: (value) => value ? "Active" : "Inactive" },
  ]

  const fetchUsers = async (page = 0) => {
    setUsersLoading(true)
    try {
      const response = await getAllUsers({ page, size: 10 })
      setUsers(response?.data?.content || [])
      if (response?.data) {
        setUserPagination({
          pageNumber: response.data.pageNumber || 0,
          pageSize: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0,
          last: response.data.last || true,
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    } finally {
      setUsersLoading(false)
    }
  }

  const handleAddUser = () => { setUserToEdit(null); setIsUserModalOpen(true) }
  const handleEditUser = (user) => { setUserToEdit(user); setIsUserModalOpen(true) }
  const handleDeleteUserClick = (user) => { setUserToDelete(user); setIsUserDeleteModalOpen(true) }
  const handleViewUser = (user) => { navigate(`/user-details/${user.id}`) }
  const handleConfirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id)
        toast.success("User deleted successfully!")
        await fetchUsers(userCurrentPage)
      } catch (error) { throw error }
    }
  }
  const handleUserDeleteModalClose = () => { setIsUserDeleteModalOpen(false); setUserToDelete(null) }
  const handleUserModalClose = () => { setIsUserModalOpen(false); setUserToEdit(null) }
  const handleUserPageChange = (page) => { setUserCurrentPage(page); fetchUsers(page) }

  // ═════════════════════════════════════════════════════════════════════════
  // Task helpers
  // ═════════════════════════════════════════════════════════════════════════

  const renderStatusBadge = (status) => {
    const map = {
      'PENDING':     { color: 'text-yellow-600', bg: 'bg-yellow-50' },
      'IN PROGRESS': { color: 'text-blue-600',   bg: 'bg-blue-50'   },
      'REVIEW':      { color: 'text-purple-600', bg: 'bg-purple-50' },
      'COMPLETED':   { color: 'text-green-600',  bg: 'bg-green-50'  },
      'OVERDUE':     { color: 'text-red-600',    bg: 'bg-red-50'    },
    }
    const cfg = map[status] || { color: 'text-gray-600', bg: 'bg-gray-50' }
    const Icon = status === 'COMPLETED' ? CheckCircle2 : Circle
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
        <Icon size={10} fill="currentColor" />
        {status}
      </span>
    )
  }

  const renderPriorityBadge = (priority) => {
    const map = {
      'High':   { color: 'text-yellow-600', bg: 'bg-yellow-50' },
      'Urgent': { color: 'text-red-600',    bg: 'bg-red-50'    },
      'Medium': { color: 'text-yellow-600', bg: 'bg-yellow-50' },
      'Low':    { color: 'text-green-600',  bg: 'bg-green-50'  },
    }
    const cfg = map[priority] || { color: 'text-gray-600', bg: 'bg-gray-50' }
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
        <Circle size={10} fill="currentColor" />
        {priority}
      </span>
    )
  }

  const taskColumns = [
    { key: "serialNo", label: "S.No" },
    { key: "title",    label: "Title" },
    { key: "status",   label: "Status",   render: renderStatusBadge },
    { key: "priority", label: "Priority", render: renderPriorityBadge },
    { key: "assignee", label: "Assignee" },
  ]

  const taskStatusFilterOptions = [
    { label: "Pending",     value: "PENDING"     },
    { label: "In Progress", value: "IN PROGRESS" },
    { label: "Review",      value: "REVIEW"      },
    { label: "Completed",   value: "COMPLETED"   },
    { label: "Overdue",     value: "OVERDUE"     },
  ]

  const fetchTasks = async (page = 0, query = "", filter = "") => {
    setTasksLoading(true)
    try {
      const params = { pageable: { page, size: 10, sort: ["createdAt,desc"] } }
      if (query?.trim()) params.search = query.trim()
      if (filter?.trim()) params.status = filter.trim()
      const response = await getAllTasks(params)
      setTasks(response.data?.content || response.content || [])
      setTaskPagination(response.data || { pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0, last: true })
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setTasksLoading(false)
      setIsTaskSearching(false)
    }
  }

  const handleAddTask = () => { setTaskToEdit(null); setIsTaskModalOpen(true) }
  const handleEditTask = (task) => { setTaskToEdit(task); setIsTaskModalOpen(true) }
  const handleDeleteTaskClick = (task) => { setTaskToDelete(task); setIsTaskDeleteModalOpen(true) }
  const handleViewTask = (task) => { navigate(`/task-details/${task.id}`) }
  const handleTaskModalClose = () => { setIsTaskModalOpen(false); setTaskToEdit(null) }
  const handleTaskDeleteModalClose = () => { setIsTaskDeleteModalOpen(false); setTaskToDelete(null) }
  const handleDeleteTaskConfirm = async () => { if (taskToDelete?.id) await deleteTask(taskToDelete.id) }
  const handleTaskPageChange = (page) => { setTaskCurrentPage(page); fetchTasks(page, taskSearchQuery, taskStatusFilter) }
  const handleTaskSearch = (query) => {
    setTaskSearchQuery(query); setTaskCurrentPage(0); setIsTaskSearching(true)
    fetchTasks(0, query, taskStatusFilter)
  }
  const handleTaskFilter = (filter) => {
    setTaskStatusFilter(filter); setTaskCurrentPage(0)
    fetchTasks(0, taskSearchQuery, filter)
  }

  // Load data when tab becomes active (lazy load)
  useEffect(() => {
    if (activeTab === TABS.USERS && users.length === 0) fetchUsers(0)
  }, [activeTab])

  useEffect(() => {
    if (activeTab === TABS.TASKS && tasks.length === 0) fetchTasks(0)
  }, [activeTab])

  // ═════════════════════════════════════════════════════════════════════════
  // Tab config
  // ═════════════════════════════════════════════════════════════════════════

  const tabs = [
    { id: TABS.DEPARTMENTS, label: "Departments", icon: Building2 },
    { id: TABS.USERS,       label: "All Users",   icon: Users },
    { id: TABS.TASKS,       label: "All Tasks",   icon: ClipboardList },
  ]

  // ═════════════════════════════════════════════════════════════════════════
  // Render
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <div className="mt-2">
      {/* Page header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Works</h1>
          <p className="text-sm text-gray-600 mt-1">Manage departments, users, and tasks</p>
        </div>

        {/* Action buttons per tab */}
        <div className="flex items-center gap-2">
          {activeTab === TABS.DEPARTMENTS && (
            <>
              <button onClick={handleAddDepartment} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                <Plus size={20} /> Add Department
              </button>
              <button onClick={handleAddSubDepartment} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                <Plus size={20} /> Add Sub Department
              </button>
            </>
          )}
          {activeTab === TABS.USERS && (
            <button onClick={handleAddUser} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              <Plus size={20} /> Add User
            </button>
          )}
          {activeTab === TABS.TASKS && (
            <button onClick={handleAddTask} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              <Plus size={20} /> Add Task
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px
              ${activeTab === id
                ? "border-green-600 text-green-700 bg-green-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Departments tab ─────────────────────────────────────────────── */}
      {activeTab === TABS.DEPARTMENTS && (
        loading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        ) : (
          <>
            {/* Department cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  onClick={() => handleDepartmentClick(dept)}
                  className={`cursor-pointer p-3 rounded-xl border-2 transition-all hover:shadow-lg ${
                    selectedDepartment?.id === dept.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 size={18} className="text-green-600" />
                      <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => handleViewDepartment(dept, e)} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="View">
                        <Eye size={16} />
                      </button>
                      {selectedDepartment?.id === dept.id && <ChevronRight size={18} className="text-green-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-department table */}
            {selectedDepartment && (
              <div className="mt-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Sub-departments for {selectedDepartment.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage sub-departments within this department</p>
                </div>
                {subDepartmentsLoading ? (
                  <div className="text-center py-8 text-gray-600">Loading sub-departments...</div>
                ) : (
                  <Table columns={subDepartmentColumns} data={paginatedSubDepartments} pagination={deptPagination} onPageChange={handlePageChange} />
                )}
              </div>
            )}
          </>
        )
      )}

      {/* ── Users tab ───────────────────────────────────────────────────── */}
      {activeTab === TABS.USERS && (
        usersLoading ? (
          <div className="text-center py-8 text-gray-600">Loading users...</div>
        ) : (
          <Table
            columns={userColumns}
            data={users}
            pagination={userPagination}
            onPageChange={handleUserPageChange}
            onEdit={handleEditUser}
            onDelete={handleDeleteUserClick}
            onView={handleViewUser}
            emptyMessage="No users found"
          />
        )
      )}

      {/* ── Tasks tab ───────────────────────────────────────────────────── */}
      {activeTab === TABS.TASKS && (
        tasksLoading ? (
          <div className="text-center py-8 text-gray-600">Loading tasks...</div>
        ) : (
          <Table
            columns={taskColumns}
            data={tasks.map((task, index) => ({ ...task, serialNo: taskCurrentPage * 10 + index + 1 }))}
            onEdit={handleEditTask}
            onView={handleViewTask}
            onDelete={handleDeleteTaskClick}
            pagination={taskPagination}
            onPageChange={handleTaskPageChange}
            enableSearch={true}
            enableFilter={true}
            onSearch={handleTaskSearch}
            onFilter={handleTaskFilter}
            filterOptions={taskStatusFilterOptions}
            isSearching={isTaskSearching}
          />
        )
      )}

      {/* ── Department modals ────────────────────────────────────────────── */}
      <AddAndEditDepartmentModal isOpen={isModalOpen} onClose={handleModalClose} departmentToEdit={departmentToEdit} onSuccess={handleDeptSuccess} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={handleDeleteModalClose} onDelete={handleConfirmDelete} title="Delete Department" message={`Are you sure you want to delete ${departmentToDelete?.name}? This action cannot be undone.`} />
      <AddAndEditSubDepartmentModal isOpen={isSubModalOpen} onClose={handleSubModalClose} subDepartmentToEdit={subDepartmentToEdit} deptId={selectedDepartment?.id} onSuccess={handleDeptSuccess} />
      <DeleteModal isOpen={isSubDeleteModalOpen} onClose={handleSubDeleteModalClose} onDelete={handleConfirmSubDelete} title="Delete Sub-Department" message={`Are you sure you want to delete ${subDepartmentToDelete?.name}? This action cannot be undone.`} />

      {/* ── User modals ──────────────────────────────────────────────────── */}
      <AddAndEditUserModal isOpen={isUserModalOpen} onClose={handleUserModalClose} userToEdit={userToEdit} onSuccess={() => fetchUsers(userCurrentPage)} />
      <DeleteModal isOpen={isUserDeleteModalOpen} onClose={handleUserDeleteModalClose} onDelete={handleConfirmDeleteUser} title="Delete User" message={`Are you sure you want to delete ${userToDelete?.fullName || userToDelete?.username}? This action cannot be undone.`} />

      {/* ── Task modals ──────────────────────────────────────────────────── */}
      <AddAndEditTaskModal isOpen={isTaskModalOpen} onClose={handleTaskModalClose} taskToEdit={taskToEdit} onSuccess={() => fetchTasks(taskCurrentPage)} />
      <DeleteModal isOpen={isTaskDeleteModalOpen} onClose={handleTaskDeleteModalClose} onDelete={handleDeleteTaskConfirm} title="Delete Task" message="Are you sure you want to delete this task? This action cannot be undone." />
    </div>
  )
}

export default AllWorks
