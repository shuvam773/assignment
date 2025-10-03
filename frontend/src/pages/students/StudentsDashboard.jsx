import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import api from '../../api/api';

const StudentsDashboard = ({ type = "overview" }) => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch assignments when component mounts
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/assignment');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  

  

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  

  const isAssignmentOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Assignments View
  if (type === "assignments") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                <p className="text-gray-600">Welcome, {user?.name}</p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/students')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Assignments Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading assignments...</p>
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assignments Yet</h3>
                  <p className="text-gray-600">Check back later for new assignments from your teachers.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => {
                  const isOverdue = isAssignmentOverdue(assignment.deadline);
                  const daysRemaining = getDaysRemaining(assignment.deadline);
                  const teacherName = assignment.teacherId?.name || 'Teacher';
                  
                  return (
                    <div key={assignment._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                      {/* Card Header */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{assignment.subject}</p>
                          </div>
                          
                        </div>
                        
                        <p className="text-gray-700 text-sm line-clamp-3">{assignment.description}</p>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        {/* Teacher Info */}
                        <div className="flex items-center mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-sm font-bold">T</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">By {teacherName}</p>
                            <p className="text-xs text-gray-600">Posted: {new Date(assignment.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Deadline Info */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Due Date</p>
                            <p className="text-xs text-gray-600">
                              {new Date(assignment.deadline).toLocaleDateString()} at {new Date(assignment.deadline).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${
                              isOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {isOverdue ? 'Overdue' : `${daysRemaining} days left`}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          
                          <button 
                            onClick={() => {/* Add view details functionality */}}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Main Dashboard Overview (for /students route)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total Assignments</h3>
              <p className="text-3xl font-bold text-indigo-600">{assignments.length}</p>
            </div>
          </div>

          {/* Recent Assignments Preview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
              <button
                onClick={() => navigate('/students/assignments')}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading assignments...</p>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No assignments available yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Your teachers will post assignments here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assignments.slice(0, 3).map((assignment) => {
                    const teacherName = assignment.teacherId?.name || 'Teacher';
                    
                    return (
                      <div key={assignment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{assignment.title}</h3>
                          
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Subject: {assignment.subject}</p>
                        <p className="text-gray-700 text-sm line-clamp-3 mb-4">Description: {assignment.description}</p>
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <span>By: {teacherName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Due: {new Date(assignment.deadline).toLocaleDateString()}
                          </span>
                          
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentsDashboard;