import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

// Two seeded demo accounts for testing each role (mock auth only).
export const DEMO_ACCOUNTS = [
  { email: "admin@hilink.vn",  password: "Admin@123",  name: "Operations Admin", role: "admin",  phone: "+84 24 3000 0000" },
  { email: "member@hilink.vn", password: "Member@123", name: "Nguyen Thanh",     role: "member", phone: "+84 90 123 4567" },
];

export const findDemoAccount = (email, password) =>
  DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === (email || "").trim().toLowerCase() && a.password === password) || null;

export const AuthProvider = ({ children }) => {
  // Persist session through page reloads (clears when tab closes)
  const [user, setUser] = useState(() => {
    try {
      const s = sessionStorage.getItem("hilink_user");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  // role defaults to "member"; pass role:"admin" for the operations portal
  const login = (userData) => {
    const u = { role: "member", ...userData };
    sessionStorage.setItem("hilink_user", JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    sessionStorage.removeItem("hilink_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Admin-only guard: must be authenticated AND have the admin role
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/portal/dashboard" replace />;
  }
  return children;
};
