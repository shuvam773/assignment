import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Home, LogIn } from "lucide-react";
import UserContext from "../context/UserContext"; // Adjust path as needed

const UnauthorizedPage = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (user?.isAuthenticated) {
      // Redirect based on user role
      switch (user.role?.toLowerCase()) {
        case 'teachers':
          navigate('/teachers/assignments');
          break;
        case 'students':
          navigate('/students/assignments');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  const handleLogin = () => {
    if (user?.isAuthenticated) {
      logout(); // Logout first if already authenticated but unauthorized
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <Lock className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-6">
          {user?.isAuthenticated 
            ? `You are logged in as ${user.role}, but don't have permission to access this page.`
            : "Please log in with the correct account to access this page."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg border border-gray-300 font-semibold hover:bg-gray-100 transition"
          >
            <LogIn className="w-4 h-4" />
            {user?.isAuthenticated ? 'Switch Account' : 'Login'}
          </button>
        </div>
        
        {user?.isAuthenticated && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              Logged in as: <strong>{user.email}</strong> ({user.role})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnauthorizedPage;