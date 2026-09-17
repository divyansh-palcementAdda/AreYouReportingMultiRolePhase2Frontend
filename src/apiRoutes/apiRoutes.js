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
  },
  user :{
    getAllUsers :"/api/v1/users",
    addUser :"/api/v1/users",
    updateUser :"/api/v1/users/{id}",
    deleteUser :"/api/v1/users/{id}",
  },
  department:{
    getAllDepartments :"/api/v1/departments",
    addDepartment :"/api/v1/departments",
    updateDepartment :"/api/v1/departments/{id}",
    deleteDepartment :"/api/v1/departments/{id}",
    //sub department 
    getAllSubDepartment:"/api/v1/departments/{deptId}/sub-departments",
    addSubDepartment:"/api/v1/departments/{deptId}/sub-departments",
    updateSubDepartment:"/api/v1/departments/sub-departments/{subDeptId}",
    deleteSubdepartment :"/api/v1/departments/sub-departments/{subDeptId}"
  },
  dropdown:{
    getEligibleAssignees:"/api/v1/dropdowns/users/eligible-assignees",
    getDepartments:"/api/v1/dropdowns/departments",
    getSubDepartments:"/api/v1/dropdowns/sub-departments",
    getTaskTemplates:"/api/v1/dropdowns/task-templates"
  },

}

export default apiAllRoutes;