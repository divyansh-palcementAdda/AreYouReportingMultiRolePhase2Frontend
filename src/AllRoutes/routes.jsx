import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/login"
import AdminDashboard from "../pages/Dashboard/adminDashboard"
import AllTask from "../pages/Main/allTask"
import MainLayout from "../layouts/mainLayout"
import AllUsers from "../pages/Main/allUsers"
import AllDepartments from "../pages/Main/allDepartments"
import RoleandPermissions from "../pages/Settings/rolesAndPermissions"
import AllTaskTemplate from "../pages/Main/taskTemplate"
import UserTaskAnalitices from "../pages/Main/userTaskAnalitices"

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin-dashboard" element={<MainLayout><AdminDashboard /></MainLayout>} />
                <Route path="/all-task" element={<MainLayout><AllTask /></MainLayout>} />
                <Route path="/all-users" element={<MainLayout><AllUsers /></MainLayout>} />
                <Route path="/all-departments" element={<MainLayout><AllDepartments /></MainLayout>} />
                <Route path="/role-and-permission" element={<MainLayout><RoleandPermissions /></MainLayout>} />
                <Route path="/all-task-template" element={<MainLayout><AllTaskTemplate /></MainLayout>} />
                <Route path="/user-task-analitices" element={<MainLayout><UserTaskAnalitices /></MainLayout>} />
            </Routes>
        </BrowserRouter>
    )
}