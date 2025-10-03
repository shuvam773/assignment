import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import api from '../../api/api';
import CreateAssignment from './CreateAssignment ';
import AssignmentsPage from './AssignmentsPage';

const TeachersDashboard = ({ type = "overview" }) => {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const handleCreateAssignment = async (assignmentData) => {
    try {
      await api.post('/create-assignment', assignmentData);
      setShowCreateForm(false);
      fetchAssignments(); // Refresh the list
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };
  

  // If we're on a nested route, show specific content based on type
  if (type !== "overview") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {type === "assignments" ? "Assignments" : "Teacher Dashboard"}
                </h1>
                <p className="text-gray-600">Welcome, {user?.name}</p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/teachers')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Assignment
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
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading assignments...</p>
                  </div>
                ) : (
                  <AssignmentsPage 
                    assignments={assignments} 
                    onAssignmentCreated={fetchAssignments}
                  />
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Create Assignment Modal */}
        {showCreateForm && (
          <CreateAssignment
            onSubmit={handleCreateAssignment}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </div>
    );
  }

  // Main Dashboard Overview (for /teachers route)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="max-w-full text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
            </div>
            <div className="space-x-4 gap-3 flex">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Assignment
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
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading assignments...</p>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No assignments created yet.</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Create your first assignment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.slice(0, 3).map((assignment) => (
                    <div key={assignment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">Subject: {assignment.subject}</p>
                          <p className="text-gray-700 mt-2">Description: {assignment.description}</p>
                          <p className="text-sm text-gray-500">By: {assignment.teacherId?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Due: {new Date(assignment.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <CreateAssignment
          onSubmit={handleCreateAssignment}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

export default TeachersDashboard;