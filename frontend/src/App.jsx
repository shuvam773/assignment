import UserContextProvider from './context/UserContextProvider';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './context/ProtectedRoute';
import AuthRedirect from './context/AuthRedirect';
import TeachersDashboard from './pages/teachers/TeachersDashboard';
import StudentsDashboard from './pages/students/StudentsDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <AuthRedirect />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<UnauthorizedPage/>}/>

          {/* Protected routes */}
          {/* Teachers routes */}
          <Route path='/teachers' element={
            <ProtectedRoute roles={['teachers']}>
              <TeachersDashboard />
            </ProtectedRoute>
          }>
            {/* Default teacher dashboard */}
            <Route index element={<TeachersDashboard type="overview" />} />
            <Route path="assignments" element={<TeachersDashboard type="assignments" />} />
          </Route>

          {/* Students routes */}
          <Route path='/students' element={
            <ProtectedRoute roles={['students']}>
              <StudentsDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<StudentsDashboard type="overview" />} />
            <Route path="assignments" element={<StudentsDashboard type="assignments" />} />
          </Route>

        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  )
}

export default App