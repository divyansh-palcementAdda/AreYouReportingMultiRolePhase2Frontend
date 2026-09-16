import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/login"
import AdminDashboard from "../pages/Dashboard/adminDashboard"
import AllTask from "../pages/Main/allTask"
import MainLayout from "../layouts/mainLayout"

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin-dashboard" element={<MainLayout><AdminDashboard /></MainLayout>} />
                <Route path="/all-task" element={<MainLayout><AllTask /></MainLayout>} />
            </Routes>
        </BrowserRouter>
    )
}