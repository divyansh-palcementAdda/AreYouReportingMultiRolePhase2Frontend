import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/login"
import AdminDashboard from "../pages/Dashboard/adminDashboard"
import AllTask from "../pages/Main/allTask"
import MainLayout from "../layouts/mainLayout"
import AllUsers from "../pages/Main/allUsers"
import AllDepartments from "../pages/Main/allDepartments"

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin-dashboard" element={<MainLayout><AdminDashboard /></MainLayout>} />
                <Route path="/all-task" element={<MainLayout><AllTask /></MainLayout>} />
                <Route path="/all-users" element={<MainLayout><AllUsers /></MainLayout>} />
                <Route path="/all-departments" element={<MainLayout><AllDepartments /></MainLayout>} />
            </Routes>
        </BrowserRouter>
    )
}