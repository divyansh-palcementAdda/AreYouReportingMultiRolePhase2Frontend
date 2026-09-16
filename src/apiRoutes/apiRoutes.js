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
  }
}

export default apiAllRoutes;