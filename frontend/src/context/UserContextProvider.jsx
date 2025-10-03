import React, { useEffect, useState } from 'react';
import UserContext from './UserContext';
import { jwtDecode } from 'jwt-decode';

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          logout();
          return;
        }

        // Use consistent field names - match what's in JWT
        const userData = {
          name: decoded.name || localStorage.getItem('loggedInUser') || '',
          role: (decoded.role || localStorage.getItem('userRole') || '').toLowerCase(),
          email: decoded.email || localStorage.getItem('userEmail') || '',
          id: decoded.userId || localStorage.getItem('userId') || '', // Changed to match JWT
          isAuthenticated: true,
          jwtToken: token,
        };
        
        console.log('Decoded user data:', userData); // Debug log
        
        setUser(userData);
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.jwtToken);
    localStorage.setItem('loggedInUser', userData.name || '');
    localStorage.setItem('userRole', (userData.role || '').toLowerCase());
    localStorage.setItem('userEmail', userData.email || '');
    localStorage.setItem('userId', userData.id || '');

    setUser({
      name: userData.name || '',
      role: (userData.role || '').toLowerCase(),
      email: userData.email || '',
      id: userData.id || '',
      isAuthenticated: true,
      jwtToken: userData.jwtToken,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userCreatedBy');
    setUser(null);
    // Use navigate from react-router
    window.location.replace('/login');
  };

  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  return (
    <UserContext.Provider
      value={{
        signupInfo,
        setSignupInfo,
        loginInfo,
        setLoginInfo,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
