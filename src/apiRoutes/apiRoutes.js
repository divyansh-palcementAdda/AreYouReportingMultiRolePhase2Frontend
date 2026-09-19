const apiAllRoutes = {
  auth: {
    login: "/api/v1/auth/login",
    // logout: "/api/auth/logout",
    refreshToken: "/api/v1/auth/refresh",
  },
  task:{
    getAllTask :"/api/v1/tasks",
    addTask :"/api/v1/tasks",
    updateTask :"/api/v1/tasks/{id}",
    deleteTask :"/api/v1/tasks/{id}",
    getTaskById :"/api/v1/tasks/{id}",
  },
  user :{
    getAllUsers :"/api/v1/users",
    addUser :"/api/v1/users",
    updateUser :"/api/v1/users/{id}",
    deleteUser :"/api/v1/users/{id}",
    getUsersByDepartment:"/api/v1/users/by-department/{departmentId}",
    getUserById:"/api/v1/users/{id}",
  },
  department:{
    getAllDepartments :"/api/v1/departments",
    addDepartment :"/api/v1/departments",
    updateDepartment :"/api/v1/departments/{id}",
    deleteDepartment :"/api/v1/departments/{id}",
    getDepartmentById:"/api/v1/departments/{id}",
    //sub department 
    getAllSubDepartment:"/api/v1/departments/{deptId}/sub-departments",
    addSubDepartment:"/api/v1/departments/{deptId}/sub-departments",
    getSubDepartmentById:"/api/v1/departments/sub-departments/{subDeptId}",
    updateSubDepartment:"/api/v1/departments/sub-departments/{subDeptId}",
    deleteSubdepartment :"/api/v1/departments/sub-departments/{subDeptId}"
  },
  dropdown:{
    getEligibleAssignees:"/api/v1/dropdowns/users/eligible-assignees",
    getDepartments:"/api/v1/dropdowns/departments",
    getSubDepartments:"/api/v1/dropdowns/sub-departments",
    getTaskTemplates:"/api/v1/dropdowns/task-templates"
  },
  rolesAndPermissions:{
    getAllRoles:"/api/v1/roles",
    getAllPermissions:"/api/v1/permissions",
    getpermissionByRoleId:"/api/v1/permissions/get-permissions-by-role",
    createRole:"/api/v1/roles",
    updateRole:"/api/v1/roles/{id}",
    deleteRole:"/api/v1/roles/{id}",
    updateRolePermissions:"/api/v1/roles/{id}/permissions"
  },
  taskTemplate:{
    getAllTaskTemplates:"/api/v1/task-templates",
    addTaskTemplate:"/api/v1/task-templates",
    updateTaskTemplate:"/api/v1/task-templates/{id}",
    deleteTaskTemplate:"/api/v1/task-templates/{id}",
    getTaskTemplateById:"/api/v1/task-templates/{id}"
  }

}

export default apiAllRoutes;