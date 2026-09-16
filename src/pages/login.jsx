import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import RuLogo from "../assets/pngImages/RU Logo.png"
import { login } from '../Services/authService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await login(formData.email, formData.password)
      
      // Store access token in cookies
      if (response.data.accessToken) {
        Cookies.set("accessToken", response.data.accessToken, { expires: 7 })
      }
      
      // Store refresh token in cookies
      if (response.data.refreshToken) {
        Cookies.set("refreshToken", response.data.refreshToken, { expires: 7 })
      }
      
      // Show success toast
      toast.success("Login successful!")
      
      // Redirect to admin dashboard
      navigate("/admin-dashboard")
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-white/0 to-green-900/50 items-center justify-center p-12">
        <div className="text-center">
          <img 
            src={RuLogo} 
            alt="RU Logo" 
            className="w-64 h-64 object-contain mx-auto mb-8"
          />
          <h1 className="text-green-800 text-3xl font-bold">Welcome Back</h1>
          <p className=" text-green-800 mt-2 text-lg">Sign in to continue to your account</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className=" text-center mb-8">
            <img 
              src={RuLogo} 
              alt="RU Logo" 
              className="w-20 h-20 object-contain mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8">Login to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none transition"
                  placeholder="Enter your email"

                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

           

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 text-white py-3 px-4 rounded-lg hover:bg-green-900 focus:ring-4 focus:ring-green-300 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}