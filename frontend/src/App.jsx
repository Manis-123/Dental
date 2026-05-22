import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Treatments from './pages/Treatments';
import Appointments from './pages/Appointments';
import Bills from './pages/Bills';
import PatientDetail from './pages/PatientDetail';
import Inventory from './pages/Inventory';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Reminders from './pages/Reminders';
import Clinics from './pages/Clinics';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/AdminRoute';

export default function App() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // If authenticated, show protected routes
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="treatments" element={<Treatments />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="bills" element={<Bills />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route
          path="clinics"
          element={
            <AdminRoute>
              <Clinics />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
