import './App.css';
import { Routes, Route, Navigate } from 'react-router';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoutes';
import AdminRoute from './components/AdminRoute';
import NavBar from './components/NavBar';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import SignUp from './pages/SignUp';

function AdminPanel() {
  return <h1>Admin Panel</h1>;
}

function App() {
  return (
    <>
      <div className="w-full h-full absolute bg-cover bg-center">

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Logged-in users only */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />

              {/* Admins only - nest inside protected */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
                
              </Route>
            </Route>
          </Route>

          {/* Unknown URLs -> home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
