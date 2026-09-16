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
  }
}

export default apiAllRoutes;