import { Routes, Route, Navigate } from 'react-router';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoutes';
import AdminRoute from './components/AdminRoute';
import NavBar from './components/NavBar';
import './App.css';
import Layout from './components/Layout';

function Dashboard() {
  return <h1>Dashboard</h1>;
}

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

          {/* Logged-in users only */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />

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
