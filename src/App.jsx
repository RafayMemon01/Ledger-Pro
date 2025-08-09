// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DashboardLedgers from "./pages/Dashboard";
import LedgerPage from "./pages/LedgerPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLedgers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ledger/:ledgerId"
          element={
            <ProtectedRoute>
              <LedgerPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
}

const Notfound = () => {
  return <div>404 - Page Not Found</div>;
};
