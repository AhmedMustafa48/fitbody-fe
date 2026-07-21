import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@app/theme-context/theme-context";
import { AuthProvider } from "@app/auth-context/auth-context";
import ProtectedRoute from "@components/protected-route/protected-route";
import DashboardLayout from "@components/dashboard-layout/dashboard-layout";
import Login from "@modules/auth/components/login/login";
import Dashboard from "@modules/dashboard/components/dashboard/dashboard";
import Members from "@modules/members/components/members/members";
import MemberDetail from "@modules/members/components/member-detail/member-detail";
import Attendance from "@modules/attendance/components/attendance/attendance";
import Fees from "@modules/fees/components/fees/fees";

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="members/:id" element={<MemberDetail />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="fees" element={<Fees />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
