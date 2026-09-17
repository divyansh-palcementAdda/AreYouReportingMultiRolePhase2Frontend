import React, { useState, useEffect } from 'react'
import { Edit, Trash2, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { getAllRoles, getAllPermissions, getPermissionsByRole, deleteRole, updateRolePermissions } from '../../Services/roleandpermissionService'
import RoleAddAndEditModal from '../../components/Models/RoleandPermissions/roleAddandEdit'
import DeleteModal from '../../components/reusable/deleteModel.jsx'

const rolesAndPermissions = () => {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const [rolePermissions, setRolePermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [roleToEdit, setRoleToEdit] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState([])

  useEffect(() => {
    fetchRolesAndPermissions()
  }, [])

  const fetchRolesAndPermissions = async () => {
    try {
      setLoading(true)
      const [rolesData, permissionsData] = await Promise.all([
        getAllRoles(),
        getAllPermissions()
      ])
      setRoles(rolesData)
      setPermissions(permissionsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleClick = async (role) => {
    setSelectedRole(role)
    setSelectedPermissions([])
    setSelectAll(false)
    setSearchQuery('')
    try {
      const permissionsData = await getPermissionsByRole(role.id)
      console.log('Role permissions data:', permissionsData)
      setRolePermissions(permissionsData)
    } catch (error) {
      console.error('Error fetching role permissions:', error)
      setRolePermissions([])
    }
  }

  const handleEditRole = (e, role) => {
    e.stopPropagation()
    setRoleToEdit(role)
    setIsModalOpen(true)
  }

  const handleDeleteRole = (e, role) => {
    e.stopPropagation()
    setRoleToDelete(role)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (roleToDelete) {
      try {
        await deleteRole(roleToDelete.id)
        fetchRolesAndPermissions()
        if (selectedRole?.id === roleToDelete.id) {
          setSelectedRole(null)
          setRolePermissions([])
        }
      } catch (error) {
        console.error('Error deleting role:', error)
        throw error
      }
    }
  }

  const handleAddRole = () => {
    setRoleToEdit(null)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setRoleToEdit(null)
  }

  const handleModalSuccess = () => {
    fetchRolesAndPermissions()
  }

  const isPermissionChecked = (permission) => {
    // Check if permission is in selectedPermissions
    if (selectedPermissions.includes(permission.id)) {
      return true
    }
    
    // Also check if it was already granted from rolePermissions
    if (!rolePermissions || !Array.isArray(rolePermissions)) {
      return false
    }
    
    for (const resourceGroup of rolePermissions) {
      if (resourceGroup.permissions && Array.isArray(resourceGroup.permissions)) {
        const foundPermission = resourceGroup.permissions.find(
          rp => rp.authority === permission.authority && rp.granted === true
        )
        if (foundPermission) {
          return true
        }
      }
    }
    return false
  }

  const filteredPermissions = permissions.filter(permission => {
    const query = searchQuery.toLowerCase()
    return (
      permission.authority?.toLowerCase().includes(query) ||
      permission.description?.toLowerCase().includes(query)
    )
  })

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    
    if (newSelectAll) {
      // Select all permissions
      setSelectedPermissions(permissions.map(p => p.id))
    } else {
      // Deselect all
      setSelectedPermissions([])
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handlePermissionToggle = (permission) => {
    const permissionId = permission.id
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId)
      } else {
        return [...prev, permissionId]
      }
    })
  }

  const handleSavePermissions = async () => {
    if (!selectedRole) return
    
    try {
      await updateRolePermissions(selectedRole.id, selectedPermissions)
      toast.success('Permissions updated successfully')
      // Refresh the role permissions
      const permissionsData = await getPermissionsByRole(selectedRole.id)
      setRolePermissions(permissionsData)
      setSelectedPermissions([])
      setSelectAll(false)
    } catch (error) {
      console.error('Error updating permissions:', error)
      toast.error('Failed to update permissions')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Roles and Permissions</h1>
      
      <div className="flex gap-6">
        {/* Roles Section - Left Side */}
        <div className="w-1/3">
          <div className="bg-white shadow-md rounded-xl overflow-hidden sticky top-6">
            <div className="bg-gradient-to-r from-green-800 to-green-700 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">All Roles</h2>
                <button
                  onClick={handleAddRole}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Role
                </button>
              </div>
            </div>
            <div className="p-4">
              {roles.length > 0 ? (
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => handleRoleClick(role)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                        selectedRole?.id === role.id
                          ? 'bg-green-50 border-green-500 shadow-md'
                          : 'bg-gray-50 border-gray-200 hover:bg-green-50 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-800">
                          {role.name || role.roleName}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleEditRole(e, role)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Edit Role"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteRole(e, role)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete Role"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {role.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {role.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No roles available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Permissions Section - Right Side */}
        <div className="w-2/3">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-800 to-green-700 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {selectedRole ? `Permissions for ${selectedRole.name || selectedRole.roleName}` : 'All Permissions'}
                </h2>
                {selectedRole && (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-8 pr-4 py-1.5 text-sm rounded-lg border-0 focus:outline-none w-48 bg-white text-gray-700 placeholder-gray-400"
                      />
                      <svg
                        className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded focus:ring-green-300 accent-green-600"
                      />
                      Select All
                    </label>
                    <button
                      onClick={handleSavePermissions}
                      className="px-3 py-1.5 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide">
              {selectedRole ? (
                <div className="space-y-3">
                  {filteredPermissions.length > 0 ? (
                    filteredPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isPermissionChecked(permission)}
                          onChange={() => handlePermissionToggle(permission)}
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer accent-green-600 mt-1"
                        />
                        <div className="ml-3 flex flex-col">
                          <span className="text-gray-700 font-medium">
                            {permission.authority}
                          </span>
                          {permission.description && (
                            <span className="text-sm text-gray-500 mt-1">
                              {permission.description}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      {searchQuery ? 'No permissions match your search' : 'No permissions available'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Select a role to view its permissions
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Role Add/Edit Modal */}
      <RoleAddAndEditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        roleToEdit={roleToEdit}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setRoleToDelete(null)
        }}
        onDelete={handleConfirmDelete}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${roleToDelete?.name || roleToDelete?.roleName}"? This action cannot be undone.`}
      />
    </div>
  )
}

export default rolesAndPermissions