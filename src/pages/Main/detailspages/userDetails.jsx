import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../../Services/userService";
import { getAllTasks } from "../../../Services/taskService";
import Table from "../../../components/reusable/table";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  CheckCircle,
  XCircle,
  Circle,
  CheckCircle2,
  Layers,
  ChevronRight,
  Hash,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

// ─── Animated Department Card ─────────────────────────────────────────────────
const DeptCard = ({ item, isSelected, onClick, index }) => (
  <button
    onClick={onClick}
    style={{ animationDelay: `${index * 60}ms` }}
    className={`
      group relative overflow-hidden flex-shrink-0 w-52 text-left
      rounded-2xl border-2 p-4 transition-all duration-300
      animate-fadeSlideIn
      ${
        isSelected
          ? "border-green-500 bg-gradient-to-br from-green-600 to-green-800 shadow-lg shadow-green-200 scale-[1.03]"
          : "border-gray-100 bg-white hover:border-green-300 hover:shadow-md hover:scale-[1.02]"
      }
    `}
  >
    {/* Decorative circle */}
    <span
      className={`absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 transition-all duration-300
        ${isSelected ? "bg-white scale-125" : "bg-green-400 group-hover:scale-125"}`}
    />

    <div className="flex items-start justify-between gap-2 relative z-10">
      <div
        className={`p-2 rounded-xl transition-colors duration-300
          ${isSelected ? "bg-white/20" : "bg-green-50 group-hover:bg-green-100"}`}
      >
        <Building2
          size={18}
          className={`transition-colors duration-300 ${isSelected ? "text-white" : "text-green-600"}`}
        />
      </div>
      <ChevronRight
        size={16}
        className={`mt-1 transition-all duration-300
          ${isSelected ? "text-white opacity-100 translate-x-0" : "text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}
      />
    </div>

    <p
      className={`mt-3 text-sm font-semibold leading-snug relative z-10 transition-colors duration-300
        ${isSelected ? "text-white" : "text-gray-800"}`}
    >
      {item.name}
    </p>
    <p
      className={`mt-1 text-xs relative z-10 transition-colors duration-300
        ${isSelected ? "text-green-100" : "text-gray-400"}`}
    >
      {isSelected ? "Selected" : "Click to view tasks"}
    </p>
  </button>
);

// ─── Animated Sub-Department Card ─────────────────────────────────────────────
const SubDeptCard = ({ item, isSelected, onClick, index }) => (
  <button
    onClick={onClick}
    style={{ animationDelay: `${index * 60}ms` }}
    className={`
      group relative overflow-hidden flex-shrink-0 w-52 text-left
      rounded-2xl border-2 p-4 transition-all duration-300
      animate-fadeSlideIn
      ${
        isSelected
          ? "border-emerald-500 bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-200 scale-[1.03]"
          : "border-gray-100 bg-white hover:border-emerald-300 hover:shadow-md hover:scale-[1.02]"
      }
    `}
  >
    {/* Decorative circle */}
    <span
      className={`absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 transition-all duration-300
        ${isSelected ? "bg-white scale-125" : "bg-emerald-400 group-hover:scale-125"}`}
    />

    <div className="flex items-start justify-between gap-2 relative z-10">
      <div
        className={`p-2 rounded-xl transition-colors duration-300
          ${isSelected ? "bg-white/20" : "bg-emerald-50 group-hover:bg-emerald-100"}`}
      >
        <Layers
          size={18}
          className={`transition-colors duration-300 ${isSelected ? "text-white" : "text-emerald-600"}`}
        />
      </div>
      <ChevronRight
        size={16}
        className={`mt-1 transition-all duration-300
          ${isSelected ? "text-white opacity-100 translate-x-0" : "text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}
      />
    </div>

    <p
      className={`mt-3 text-sm font-semibold leading-snug relative z-10 transition-colors duration-300
        ${isSelected ? "text-white" : "text-gray-800"}`}
    >
      {item.name}
    </p>
    {item.code && (
      <span
        className={`inline-flex items-center gap-1 mt-1 text-xs relative z-10 transition-colors duration-300
          ${isSelected ? "text-emerald-100" : "text-gray-400"}`}
      >
        <Hash size={10} />
        {item.code}
      </span>
    )}
  </button>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksPagination, setTasksPagination] = useState(null);
  const [tasksCurrentPage, setTasksCurrentPage] = useState(0);
  const [selectedScope, setSelectedScope] = useState(null);

  // ─── Badge helpers ───────────────────────────────────────────────────────────
  const renderStatusBadge = (status) => {
    const cfg = {
      PENDING: { color: "text-yellow-600", bg: "bg-yellow-50" },
      "IN PROGRESS": { color: "text-blue-600", bg: "bg-blue-50" },
      REVIEW: { color: "text-purple-600", bg: "bg-purple-50" },
      COMPLETED: { color: "text-green-600", bg: "bg-green-50" },
      OVERDUE: { color: "text-red-600", bg: "bg-red-50" },
    };
    const { color, bg } = cfg[status] || { color: "text-gray-600", bg: "bg-gray-50" };
    const Icon = status === "COMPLETED" ? CheckCircle2 : Circle;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
        <Icon size={10} fill="currentColor" />
        {status}
      </span>
    );
  };

  const renderPriorityBadge = (priority) => {
    const cfg = {
      Urgent: { color: "text-red-600", bg: "bg-red-50" },
      High: { color: "text-orange-600", bg: "bg-orange-50" },
      Medium: { color: "text-yellow-600", bg: "bg-yellow-50" },
      Low: { color: "text-green-600", bg: "bg-green-50" },
    };
    const { color, bg } = cfg[priority] || { color: "text-gray-600", bg: "bg-gray-50" };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
        <Circle size={10} fill="currentColor" />
        {priority}
      </span>
    );
  };

  const taskColumns = [
    { key: "serialNo", label: "S.No" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status", render: renderStatusBadge },
    { key: "priority", label: "Priority", render: renderPriorityBadge },
    { key: "assignee", label: "Assignee" },
  ];

  // ─── Fetch user ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);
        setUser(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUserDetails();
  }, [id]);

  // ─── Fetch tasks ─────────────────────────────────────────────────────────────
  const fetchTasks = async (scope, page = 0) => {
    if (!scope) return;
    setTasksLoading(true);
    try {
      const params = {
        pageable: { page, size: ITEMS_PER_PAGE, sort: ["createdAt,desc"] },
      };
      if (scope.type === "department") {
        params.departmentId = scope.id;
      } else {
        params.subDepartmentId = scope.id;
      }
      const response = await getAllTasks(params);
      setTasks(response.data?.content || response.content || []);
      setTasksPagination(
        response.data || {
          pageNumber: 0,
          pageSize: ITEMS_PER_PAGE,
          totalElements: 0,
          totalPages: 0,
          last: true,
        }
      );
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleDeptClick = (dept) => {
    const scope = { type: "department", id: dept.id, name: dept.name };
    setSelectedScope(scope);
    setTasksCurrentPage(0);
    fetchTasks(scope, 0);
  };

  const handleSubDeptClick = (subDept) => {
    const scope = { type: "subDepartment", id: subDept.id, name: subDept.name };
    setSelectedScope(scope);
    setTasksCurrentPage(0);
    fetchTasks(scope, 0);
  };

  const handleTasksPageChange = (page) => {
    setTasksCurrentPage(page);
    fetchTasks(selectedScope, page);
  };

  // ─── Guards ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading user details...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">User not found</div>
      </div>
    );
  }

  const hasDepts = user.departments && user.departments.length > 0;
  const hasSubDepts = user.subDepartments && user.subDepartments.length > 0;

  return (
    <div className="space-y-6 mt-2">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
          <p className="text-sm text-gray-600 mt-1">View user information and role assignments</p>
        </div>
      </div>

      {/* ── Top grid: Basic Info + Roles ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-[#2b7818]" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium text-gray-800">{user.username || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{user.fullName || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <Mail size={15} className="text-gray-400" />
                  {user.email || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <Phone size={15} className="text-gray-400" />
                  {user.phoneNumber || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                    user.active
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {user.active ? <><CheckCircle size={13} /> Active</> : <><XCircle size={13} /> Inactive</>}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium text-gray-800 text-xs break-all">{user.id || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Assignments */}
        <div>
          {user.roleAssignments && user.roleAssignments.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-[#2b7818]" />
                Role Assignments ({user.roleAssignments.length})
              </h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {user.roleAssignments.map((role) => (
                  <div key={role.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{role.roleName}</p>
                        <p className="text-xs text-gray-500">Scope: {role.dataScopeType}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded ${role.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {role.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {role.departmentName && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="text-gray-400">Dept:</span> {role.departmentName}
                      </p>
                    )}
                    {role.subDepartmentName && (
                      <p className="text-xs text-gray-500">
                        <span className="text-gray-400">Sub-Dept:</span> {role.subDepartmentName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Departments ── */}
      {hasDepts && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={20} className="text-[#2b7818]" />
            <h3 className="text-lg font-semibold text-gray-800">Departments</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Click a card to view tasks
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {user.departments.map((dept, i) => (
              <DeptCard
                key={dept.id}
                item={dept}
                index={i}
                isSelected={selectedScope?.id === dept.id && selectedScope?.type === "department"}
                onClick={() => handleDeptClick(dept)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Sub-Departments ── */}
      {hasSubDepts && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Layers size={20} className="text-[#2b7818]" />
            <h3 className="text-lg font-semibold text-gray-800">Sub-Departments</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Click a card to view tasks
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {user.subDepartments.map((subDept, i) => (
              <SubDeptCard
                key={subDept.id}
                item={subDept}
                index={i}
                isSelected={selectedScope?.id === subDept.id && selectedScope?.type === "subDepartment"}
                onClick={() => handleSubDeptClick(subDept)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Tasks Table — full width ── */}
      {selectedScope && (
        <div className="w-full">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={20} className="text-[#2b7818]" />
            <h3 className="text-lg font-semibold text-gray-800">
              Tasks in{" "}
              <span className="text-[#2b7818]">{selectedScope.name}</span>
            </h3>
            {tasksPagination && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {tasksPagination.totalElements} total
              </span>
            )}
          </div>

          {tasksLoading ? (
            <div className="w-full bg-white rounded-xl border border-gray-200 shadow-md py-12 flex items-center justify-center">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                Loading tasks...
              </div>
            </div>
          ) : (
            <div className="w-full">
              <Table
                columns={taskColumns}
                data={tasks.map((task, index) => ({
                  ...task,
                  serialNo: tasksCurrentPage * ITEMS_PER_PAGE + index + 1,
                }))}
                emptyMessage="No tasks found for this selection"
                pagination={tasksPagination}
                onPageChange={handleTasksPageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* ── keyframe styles ── */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.35s ease both;
        }
      `}</style>
    </div>
  );
};

export default UserDetails;
