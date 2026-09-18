import { useState, useEffect } from "react"
import { getAllDepartments } from "../../Services/departmentService"
import { getUsersByDepartment } from "../../Services/userTaskAnalitices"
import Table from "../../components/reusable/table"
import { Building2, ChevronRight } from "lucide-react"

const UserTaskAnalitices = () => {
  const [departments, setDepartments] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  const userColumns = [
    { 
      key: "sno", 
      label: "S.No", 
      render: (value, row, index) => index + 1 
    },
    { key: "fullName", label: "Full Name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" }
  ]

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await getAllDepartments()
      const departmentData = response.data || []
      setDepartments(departmentData)
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsersByDepartment = async (departmentId) => {
    setUsersLoading(true)
    try {
      const response = await getUsersByDepartment(departmentId)
      const userData = response.data || []
      setUsers(userData)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setUsersLoading(false)
    }
  }

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department)
    fetchUsersByDepartment(department.id)
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    if (departments.length > 0 && !selectedDepartment) {
      const firstDepartment = departments[0]
      setSelectedDepartment(firstDepartment)
      fetchUsersByDepartment(firstDepartment.id)
    }
  }, [departments])

  return (
    <div className="mt-2">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">User Task Analytics</h1>

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {departments.map((department) => (
              <div
                key={department.id}
                onClick={() => handleDepartmentClick(department)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                  selectedDepartment?.id === department.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 size={20} className="text-green-600" />
                    <h3 className="font-semibold text-gray-800">{department.name}</h3>
                  </div>
                  {selectedDepartment?.id === department.id && (
                    <ChevronRight size={18} className="text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedDepartment && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Users in {selectedDepartment.name}
              </h2>
              {usersLoading ? (
                <div className="text-center py-8 text-gray-600">Loading users...</div>
              ) : (
                <Table 
                  columns={userColumns} 
                  data={users}
                  emptyMessage="No users found in this department"
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UserTaskAnalitices
