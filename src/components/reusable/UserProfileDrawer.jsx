import { useState, useEffect } from 'react';
import { X, User, Building, Mail, Loader2, RefreshCw } from 'lucide-react';
import axiosInstance from '../../axiosInstance/axios';
import apiAllRoutes from '../../apiRoutes/apiRoutes';

const UserProfileDrawer = ({ isOpen, onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(apiAllRoutes.auth.getMe);
      setProfileData(response.data.data);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !profileData) {
      fetchProfileData();
    }
  }, [isOpen]);

  const handleRetry = () => {
    fetchProfileData();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-drawer-title"
      >
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5 border-b border-green-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <h2
                  id="profile-drawer-title"
                  className="text-xl font-semibold text-white"
                >
                  My Profile
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                aria-label="Close profile drawer"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-green-600 mb-4" size={32} />
                <p className="text-gray-500">Loading profile...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <X size={24} className="text-red-600" />
                </div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              </div>
            ) : profileData ? (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Profile Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Full Name</label>
                      <p className="text-gray-800 font-medium">{profileData.fullName || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Username</label>
                      <p className="text-gray-800 font-medium">{profileData.username || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Email</label>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <p className="text-gray-800 font-medium">{profileData.email || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Organization
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-2">Departments</label>
                      {profileData.departments && profileData.departments.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profileData.departments.map((dept) => (
                            <span
                              key={dept.id}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                            >
                              <Building size={14} />
                              {dept.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">No departments assigned</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-2">Sub Departments</label>
                      {profileData.subDepartments && profileData.subDepartments.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profileData.subDepartments.map((subDept) => (
                            <span
                              key={subDept.id}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                            >
                              {subDept.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">No sub-departments assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileDrawer;
