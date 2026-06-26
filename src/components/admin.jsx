import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "./index.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const SECTIONS = [
  { label: "Overview", items: [
    { to: "/admin/dashboard", icon: "▥", label: "Dashboard" },
  ]},
  { label: "Operations", items: [
    { to: "/admin/calendar",      icon: "▦", label: "Calendar" },
    { to: "/admin/bookings",      icon: "▣", label: "Bookings" },
    { to: "/admin/meeting-rooms", icon: "◰", label: "Meeting Rooms" },
    { to: "/admin/spaces",        icon: "◫", label: "Floor & Space" },
    { to: "/admin/floor",         icon: "◉", label: "Live Floor Map" },
  ]},
  { label: "People", items: [
    { to: "/admin/customers", icon: "◍", label: "Customers" },
    { to: "/admin/leads",     icon: "◇", label: "Marketing & Leads" },
    { to: "/admin/visitors",  icon: "◐", label: "Visitors" },
    { to: "/admin/support",   icon: "💬", label: "Support (chat)" },
    { to: "/admin/tickets",   icon: "◌", label: "Tickets" },
  ]},
  { label: "Finance", items: [
    { to: "/admin/payments", icon: "₫", label: "Payments" },
    { to: "/admin/invoices", icon: "▤", label: "Invoices" },
  ]},
  { label: "Records", items: [
    { to: "/admin/documents", icon: "❒", label: "Documents" },
  ]},
];

export const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const loc = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const labelStyle = { fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", padding: "16px 14px 6px", whiteSpace: "nowrap" };

  return (
    <div style={{ width: collapsed ? 60 : 230, height: "100vh", background: "#FFFFFF", borderRight: "1px solid rgba(15,15,15,0.10)", display: "flex", flexDirection: "column", transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)", flexShrink: 0, position: "sticky", top: 0, overflow: "hidden" }}>
      <div style={{ padding: collapsed ? "14px 0" : "16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ width: 28, height: 28, background: "var(--olive)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 800, color: "#FFFFFF" }}>H</span>
        </div>
        {!collapsed && <div><p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, color: "var(--text)", margin: 0 }}>HiLink Ops</p><p style={{ fontFamily: "Inter", fontSize: 10, color: "var(--text-3)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin portal</p></div>}
      </div>

      {!collapsed && (
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials={(user?.name || "AD").slice(0, 2).toUpperCase()} size={32} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "Administrator"}</p>
            <span style={{ fontFamily: "Inter", fontSize: 11, color: "var(--olive)" }}>Operations</span>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, padding: "4px 0", overflowY: "auto" }}>
        {SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && <p style={labelStyle}>{section.label}</p>}
            {section.items.map((item) => {
              const active = loc.pathname === item.to
                || (item.to === "/admin/dashboard" && loc.pathname === "/admin")
                || (item.to === "/admin/bookings" && loc.pathname.startsWith("/admin/bookings"));
              return (
                <Link key={item.to} to={item.to} title={collapsed ? item.label : ""} style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "9px 14px", justifyContent: collapsed ? "center" : "flex-start", textDecoration: "none", color: active ? "var(--olive)" : "var(--text-3)", background: active ? "rgba(61,74,46,0.06)" : "transparent", borderLeft: active ? "3px solid var(--olive)" : "3px solid transparent", transition: "all 0.15s", fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: active ? 500 : 400 }}>
                  <span style={{ fontSize: 15, flexShrink: 0, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                  {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <>
          <Link to="/portal/dashboard" style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", color: "var(--text-3)", textDecoration: "none", fontSize: 12, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>↗</span> Member view</Link>
          <button onClick={() => { logout(); navigate("/"); }} style={{ padding: "10px 14px", background: "none", border: "none", borderTop: "1px solid var(--border)", color: "var(--text-3)", cursor: "pointer", fontSize: 12, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 8, width: "100%" }}><span style={{ fontSize: 14 }}>↩</span> Sign out</button>
        </>
      )}
      <button onClick={() => setCollapsed(!collapsed)} style={{ padding: "14px", background: "none", border: "none", borderTop: "1px solid var(--border)", color: "var(--text-3)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{collapsed ? "→" : "←"}</button>
    </div>
  );
};

export const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mob, setMob] = useState(false);
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <div className="hide-mob" style={{ display: "flex" }}>
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <button onClick={() => setMob(!mob)} style={{ position: "fixed", top: 14, left: 14, zIndex: 200, background: "var(--bg-3)", border: "1px solid var(--border)", padding: "8px 11px", color: "var(--text)", fontSize: 16, cursor: "pointer", display: "none" }} className="show-mob">☰</button>
      {mob && (
        <div style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.7)" }} onClick={() => setMob(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 230, height: "100%", background: "#FFF" }}>
            <AdminSidebar collapsed={false} setCollapsed={() => {}} />
          </div>
        </div>
      )}
      <main style={{ flex: 1, minWidth: 0, padding: "32px", overflow: "auto" }}>{children}</main>
    </div>
  );
};

// shared status palette for admin booking states
export const BK_STATUS = {
  confirmed: { label: "Confirmed", color: "var(--success)", bg: "rgba(45,106,79,0.10)", bar: "var(--success)", barBg: "rgba(45,106,79,0.14)" },
  pending:   { label: "Pending",   color: "var(--warning)", bg: "rgba(181,134,42,0.12)", bar: "var(--warning)", barBg: "rgba(181,134,42,0.14)" },
  partial:   { label: "Partial",   color: "#2563EB",         bg: "rgba(37,99,235,0.10)",  bar: "#2563EB",         barBg: "rgba(37,99,235,0.12)" },
  cancelled: { label: "Cancelled", color: "var(--text-3)",   bg: "rgba(15,15,15,0.07)",   bar: "var(--text-3)",   barBg: "rgba(15,15,15,0.06)" },
};
