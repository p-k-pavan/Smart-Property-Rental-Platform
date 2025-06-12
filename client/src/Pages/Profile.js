import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        password: "",
        role: currentUser.role || "",
      });
      setIsAdmin(currentUser.role === "admin");
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/profile",
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(updateUserSuccess(res.data.user));
      showMessage("Profile updated successfully");
    } catch (err) {
      dispatch(updateUserFailure(err.response?.data?.message || "Update failed"));
      showMessage(err.response?.data?.message || "Update failed", "error");
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    dispatch(deleteUserStart());
    try {
      await axios.delete("http://localhost:5000/api/user/profile", {
        withCredentials: true,
      });

      dispatch(deleteUserSuccess());
      showMessage("Account deleted successfully");
      navigate("/login");
    } catch (err) {
      dispatch(deleteUserFailure(err.response?.data?.message || "Delete failed"));
      showMessage(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart());
      await axios.get("http://localhost:5000/api/auth/signout", {}, { withCredentials: true });
      dispatch(signoutUserSuccess());
      navigate("/login");
    } catch (err) {
      dispatch(signoutUserFailure(err.response?.data?.message || "Signout failed"));
      showMessage(err.response?.data?.message || "Signout failed", "error");
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-md p-8 bg-white rounded-2xl shadow-lg text-center transform transition-all duration-300 hover:scale-[1.02]">
          <div className="mb-6 text-blue-500 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Delete Account</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>Are you sure you want to permanently delete your account?</p>
                <p className="mt-1 font-medium text-red-600">This action cannot be undone.</p>
              </div>
              <div className="mt-5 flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 p-1 backdrop-filter backdrop-blur-sm">
                  {formData.avatarPreview ? (
                    <img 
                      src={formData.avatarPreview} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover border-2 border-white border-opacity-30"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
               
              </div>
              <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                <h2 className="text-3xl font-bold">{currentUser.name}</h2>
                <p className="text-blue-100 mt-1">{currentUser.email}</p>
                <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                  <span className="w-2 h-2 mr-2 rounded-full bg-green-300 animate-pulse"></span>
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === "profile" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                Profile
              </button>
              
            </nav>
          </div>

          {/* Main Content */}
          <div className="px-8 py-8">
            {message.text && (
              <div
                className={`p-4 mb-6 rounded-lg shadow-sm ${message.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                  } animate-fade-in`}
              >
                <div className="flex items-center">
                  {message.type === "error" ? (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            {isAdmin ? (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 animate-fade-in">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500 mt-1 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800 text-lg">Admin Profile</h3>
                    <p className="text-blue-600 mt-1">
                      Admin profiles are managed by the system administrator.
                      Please contact support if you need to make changes to your account.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your personal details.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                        placeholder="••••••••"
                      />
                      <p className="mt-1 text-xs text-gray-500">Leave blank to keep current password</p>
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Account Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                        required
                        disabled={isAdmin}
                      >
                        <option value="">Select your role</option>
                        <option value="owner">Property Owner</option>
                        <option value="tenant">Tenant</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Account Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(currentUser.updatedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <p className="text-sm font-medium text-gray-500">Account Status</p>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <span className="w-2 h-2 mr-2 rounded-full bg-green-500 animate-pulse"></span>
                        Active
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{currentUser.role}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-8">
                  <Link to="/my-properties" className="w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={loading}
                      className="w-full px-6 py-2 border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 shadow-sm hover:shadow-md font-semibold"
                    >
                      My Properties
                    </button>
                  </Link>
                  
                  <button
                    type="button"
                    onClick={handleSignout}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 shadow-sm hover:shadow-md font-semibold"
                  >
                    {loading ? "Processing..." : "Sign Out"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 shadow-sm hover:shadow-md font-semibold"
                  >
                    Delete Account
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;