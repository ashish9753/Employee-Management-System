import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Landing Page
import LandingPage from "./pages/LandingPage";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Employee Pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ApplyLeave from "./pages/employee/ApplyLeave";
import MyLeaves from "./pages/employee/MyLeaves";
import Profile from "./pages/employee/Profile";

// Manager Pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import LeaveRequests from "./pages/manager/LeaveRequests";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminLeaves from "./pages/admin/AdminLeaves";
import Analytics from "./pages/admin/Analytics";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<LandingPage />} />

            {/* Employee Routes */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute roles={["employee"]}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/apply"
              element={
                <ProtectedRoute roles={["employee"]}>
                  <ApplyLeave />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/my-leaves"
              element={
                <ProtectedRoute roles={["employee"]}>
                  <MyLeaves />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/profile"
              element={
                <ProtectedRoute roles={["employee"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Manager Routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute roles={["manager"]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/requests"
              element={
                <ProtectedRoute roles={["manager"]}>
                  <LeaveRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/my-leaves"
              element={
                <ProtectedRoute roles={["manager"]}>
                  <MyLeaves />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/apply"
              element={
                <ProtectedRoute roles={["manager"]}>
                  <ApplyLeave />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/profile"
              element={
                <ProtectedRoute roles={["manager"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leaves"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminLeaves />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
