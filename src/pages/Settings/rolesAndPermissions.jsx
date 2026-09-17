import React, { useState, useEffect } from 'react'
import { Edit, Trash2, Plus } from 'lucide-react'
import { getAllRoles, getAllPermissions, getPermissionsByRole } from '../../Services/roleandpermissionService'

const rolesAndPermissions = () => {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const [rolePermissions, setRolePermissions] = useState([])
  const [loading, setLoading] = useState(true)

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
    console.log('Edit role:', role)
    // TODO: Add edit modal logic
  }

  const handleDeleteRole = (e, role) => {
    e.stopPropagation()
    console.log('Delete role:', role)
    // TODO: Add delete modal logic
  }

  const handleAddRole = () => {
    console.log('Add new role')
    // TODO: Add role modal logic
  }

  const isPermissionChecked = (permission) => {
    if (!rolePermissions || !Array.isArray(rolePermissions)) {
      console.log('No role permissions or not array')
      return false
    }
    
    console.log('Checking permission:', permission.authority)
    console.log('Role permissions:', rolePermissions)
    
    // Flatten the role permissions structure to find if permission is granted
    for (const resourceGroup of rolePermissions) {
      if (resourceGroup.permissions && Array.isArray(resourceGroup.permissions)) {
        const foundPermission = resourceGroup.permissions.find(
          rp => rp.authority === permission.authority && rp.granted === true
        )
        if (foundPermission) {
          console.log('Found granted permission:', foundPermission)
          return true
        }
      }
    }
    console.log('Permission not found or not granted')
    return false
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
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
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
              <h2 className="text-lg font-semibold text-white">
                {selectedRole ? `Permissions for ${selectedRole.name || selectedRole.roleName}` : 'All Permissions'}
              </h2>
            </div>
            <div className="p-4">
              {selectedRole ? (
                <div className="space-y-3">
                  {permissions.length > 0 ? (
                    permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isPermissionChecked(permission)}
                          readOnly
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
                      No permissions available
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
    </div>
  )
}

export default rolesAndPermissions