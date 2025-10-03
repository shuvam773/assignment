import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const Register = () => {
  const { signupInfo, setSignupInfo, user, loading } = useContext(UserContext);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user?.isAuthenticated) {
      switch (user.role.toLowerCase()) {
        case 'teachers':
          navigate('/teachers/assignments');
          break;
        case 'students':
          navigate('/students/assignments');
          break;
        default:
          navigate('/unauthorized');
      }
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    const requiredFields = ['name', 'email', 'password'];

    for (const field of requiredFields) {
      if (!signupInfo[field]?.trim()) {
        setError(`${field.replace('_', ' ')} is required`);
        return;
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(signupInfo.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (signupInfo.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/signup', signupInfo);

      if (response.data.status) {
        // Registration successful, redirect to login
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading if authentication state is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render register form if user is already authenticated
  if (user?.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-6 mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="pb-6 mx-auto w-full max-w-md">
            <h1 className="text-center text-3xl font-extrabold text-gray-900">
              Create Account
            </h1>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="name"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your full name"
                value={signupInfo.name || ''}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
                value={signupInfo.email || ''}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                onChange={handleChange}
                type="password"
                name="password"
                required
                minLength="6"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password (min 6 characters)"
                value={signupInfo.password || ''}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <span>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
