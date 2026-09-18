import React from "react";
import Table from '../../components/reusable/table'

const AdminDashboard = () => {
  return (
    <div className="p-6">
      {/* Green Banner */}
      <div className="bg-green-800 rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Left Content */}
          <div className="flex-1">
            {/* Status Pill */}
            {/* <div className="inline-flex items-center bg-green-600 rounded-full px-3 py-1 mb-4">
              <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
              <span className="text-white text-sm font-medium">Reporting Cycle Active</span>
            </div> */}
            
            {/* Welcome Text */}
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            
            {/* Description */}
            <p className="text-green-100 text-sm md:text-base max-w-2xl">
              Here is today's overview across all departments, task statuses, and pending approval workflows.
            </p>
          </div>
          
          {/* Right Content - Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            {/* Create New Task Button */}
            {/* <button className="inline-flex items-center justify-center bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Task
            </button> */}
            
            {/* Export Report Button */}
            {/* <button className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button> */}
          </div>
        </div>
      </div>
      
      {/* Table Component */}
      <Table />
    </div>
  );
};

export default AdminDashboard;