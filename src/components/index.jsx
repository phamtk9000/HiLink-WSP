import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { useSplash } from "../context/SplashContext.jsx";

/* ── Site Footer ── */
const SiteFooter = () => {
  const loc = useLocation();
  if (loc.pathname.startsWith("/portal")) return null;
  return (
    <footer className="footer-pad" style={{ background:"#0F0F0F", color:"#FFFFFF", padding:"64px 48px 40px" }}>
      <div style={{ maxWidth:1400, margin:"0 auto" }}>
        {/* Top grid */}
        <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr", gap:48, paddingBottom:48, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          {/* Brand */}
          <div>
            <img src="/workspace-photos/logo-workspace-trim.png" alt="HiLink Premium Workspace" style={{ height:46, width:"auto", display:"block", marginBottom:18 }}/>
            <p style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.75, maxWidth:220, marginBottom:24 }}>Premium coworking in Hanoi, Vietnam. Two locations, one extraordinary experience.</p>
            <div style={{ display:"flex", gap:12 }}>
              {["LinkedIn","Instagram","Facebook"].map(s => (
                <a key={s} href="#" style={{ fontFamily:"'Inter', sans-serif", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", textDecoration:"none", transition:"color 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--gold)"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.35)"}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          {/* Contact */}
          <div>
            <p style={{ fontFamily:"'Inter', sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:20 }}>New Enquiries</p>
            <p style={{ fontFamily:"'Inter', sans-serif", fontSize:14, color:"rgba(255,255,255,0.75)", marginBottom:8 }}>+84 24 3936 9197</p>
            <p style={{ fontFamily:"'Inter', sans-serif", fontSize:14, color:"rgba(255,255,255,0.75)", marginBottom:24 }}>hello@hilink.vn</p>
            <p style={{ fontFamily:"'Inter', sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:12 }}>Address</p>
            <p style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.65 }}>60 Lý Thái Tổ, Hoàn Kiếm<br/>15 Tôn Thất Tùng, Đống Đa · Hanoi</p>
          </div>
          {/* Product links */}
          <div>
            <p style={{ fontFamily:"'Inter', sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:20 }}>Explore</p>
            {[["Spaces","/spaces"],["About","/about"],["The Forum","/forum"],["Membership","/membership"],["Pricing","/membership"]].map(([label,to]) => (
              <Link key={label} to={to} style={{ display:"block", fontFamily:"'Inter', sans-serif", fontSize:13, color:"rgba(255,255,255,0.55)", textDecoration:"none", marginBottom:12, transition:"color 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.color="#FFFFFF"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.55)"}>
                {label}
              </Link>
            ))}
          </div>
          {/* Legal links */}
          <div>
            <p style={{ fontFamily:"'Inter', sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:20 }}>Legal</p>
            {[["Privacy Policy","/privacy"],["Terms of Service","/terms"],["Cookie Policy","/cookies"],["Accessibility","/accessibility"]].map(([label,to]) => (
              <Link key={label} to={to} style={{ display:"block", fontFamily:"'Inter', sans-serif", fontSize:13, color:"rgba(255,255,255,0.55)", textDecoration:"none", marginBottom:12, transition:"color 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.color="#FFFFFF"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.55)"}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        {/* Bottom row */}
        <div style={{ paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <p style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:"rgba(255,255,255,0.25)" }}>© {new Date().getFullYear()} HiLink Workspaces. All rights reserved.</p>
          <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:"rgba(255,255,255,0.25)", letterSpacing:"0.1em" }}>Part of The HiLink Group</p>
        </div>
      </div>
    </footer>
  );
};

/* ── Page Transition + Footer ── */
export const PageWrap = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
    <SiteFooter />
  </motion.div>
);

/* ── Button ── */
export const Btn = ({ children, variant = "primary", size = "md", onClick, full, disabled, style: s }) => {
  const [hover, setHover] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", transition: "all 0.18s ease", userSelect: "none",
    opacity: disabled ? 0.4 : 1, width: full ? "100%" : undefined,
    borderRadius: 2, ...s,
  };
  const sizes = {
    sm: { padding: "7px 14px", fontSize: 13 },
    md: { padding: "10px 20px", fontSize: 14 },
    lg: { padding: "14px 28px", fontSize: 15 },
    xl: { padding: "16px 36px", fontSize: 16 },
  };
  const variants = {
    primary: {
      background: hover ? "var(--gold)" : "var(--text)",
      color: "#FFFFFF",
      boxShadow: "none",
    },
    secondary: {
      background: hover ? "var(--bg-3)" : "var(--bg-2)",
      color: "var(--text)", border: "1px solid var(--border)",
    },
    ghost: {
      background: "transparent",
      color: hover ? "var(--gold)" : "var(--text)",
      border: "1px solid " + (hover ? "var(--border-gold)" : "var(--border)"),
    },
    danger: {
      background: hover ? "rgba(192,57,43,0.08)" : "transparent",
      color: "var(--danger)", border: "1px solid rgba(192,57,43,0.25)",
    },
    "ghost-gold": {
      background: hover ? "var(--bg-3)" : "transparent",
      color: "var(--gold)", border: "1px solid var(--border-gold)",
    },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {children}
    </button>
  );
};

/* ── Badge / Chip ── */
export const Chip = ({ status }) => {
  const map = {
    Confirmed: { bg: "rgba(45,106,79,0.10)",  color: "#2D6A4F", dot: "#2D6A4F" },
    Completed: { bg: "rgba(15,15,15,0.07)",   color: "#707070", dot: "#707070" },
    Cancelled:  { bg: "rgba(15,15,15,0.07)",  color: "#707070", dot: "#707070" },
    Pending:    { bg: "rgba(181,134,42,0.12)", color: "#B5862A", dot: "#B5862A" },
    Paid:       { bg: "rgba(45,106,79,0.10)",  color: "#2D6A4F", dot: "#2D6A4F" },
    Overdue:    { bg: "rgba(192,57,43,0.10)",  color: "#C0392B", dot: "#C0392B" },
  };
  const c = map[status] || map.Pending;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:c.bg, color:c.color, fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:0, fontFamily:"'Inter', sans-serif", whiteSpace:"nowrap" }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
      {status}
    </span>
  );
};

/* ── Input Field ── */
export const Field = ({ label, type="text", value, onChange, error, success, placeholder, optional }) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display:"block", fontSize:12, fontWeight:500, marginBottom:6, color: focused ? "var(--gold)" : "var(--text-2)", fontFamily:"'Inter', sans-serif", transition:"color 0.15s", letterSpacing:"0.02em" }}>
        {label} {optional && <span style={{ color:"var(--text-3)", fontWeight:400 }}>(optional)</span>}
      </label>
      <div style={{ position:"relative" }}>
        <input
          type={type === "password" && show ? "text" : type}
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width:"100%", padding:"11px 16px", fontSize:14, fontFamily:"'Inter', sans-serif",
            background: focused ? "#FFFFFF" : "var(--bg-2)",
            border: `1px solid ${error ? "var(--danger)" : focused ? "var(--border-gold)" : "var(--border)"}`,
            borderRadius:0, color:"var(--text)", outline:"none", transition:"all 0.18s",
            paddingRight: (type === "password" || success) ? 44 : 16,
          }}
        />
        {type === "password" && (
          <button onClick={() => setShow(!show)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text-3)", fontSize:15, padding:4 }}>
            {show ? "🙈" : "👁"}
          </button>
        )}
        {success && type !== "password" && (
          <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"var(--success)", fontSize:14 }}>✓</span>
        )}
      </div>
      {error && <p style={{ color:"var(--danger)", fontSize:12, marginTop:5, fontFamily:"'Inter', sans-serif" }}>{error}</p>}
    </div>
  );
};

/* ── Tag / Pill ── */
export const Tag = ({ children, color = "default" }) => {
  const colors = {
    default: { bg:"var(--bg-3)", color:"var(--text-2)" },
    gold:    { bg:"rgba(168,143,92,0.12)", color:"var(--gold)" },
    success: { bg:"rgba(45,106,79,0.10)",  color:"var(--success)" },
    danger:  { bg:"rgba(192,57,43,0.10)",  color:"var(--danger)" },
    warning: { bg:"rgba(181,134,42,0.12)", color:"var(--warning)" },
  };
  const c = colors[color];
  return <span style={{ background:c.bg, color:c.color, fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:0, fontFamily:"'Inter', sans-serif" }}>{children}</span>;
};

/* ── Section Header ── */
export const SectionHeader = ({ eyebrow, title, center }) => (
  <div style={{ textAlign: center ? "center" : "left", marginBottom: 56 }}>
    {eyebrow && <p style={{ fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--gold)", fontFamily:"'Inter', sans-serif", marginBottom:12 }}>{eyebrow}</p>}
    <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(28px, 4vw, 44px)", fontWeight:700, color:"var(--text)", lineHeight:1.15 }}>{title}</h2>
  </div>
);

/* ── Divider ── */
export const Divider = () => <div style={{ height:1, background:"var(--border)", margin:"0" }} />;

/* ── Avatar ── */
export const Avatar = ({ initials, size=36, gold }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background: gold ? "rgba(168,143,92,0.12)" : "var(--bg-3)", border:`1.5px solid ${gold ? "var(--border-gold)" : "var(--border)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:Math.round(size*0.34), fontWeight:600, color: gold ? "var(--gold)" : "var(--text-2)", fontFamily:"'Inter', sans-serif", flexShrink:0 }}>
    {initials}
  </div>
);

/* ── Amenity Icon ── */
/* ── Modern SVG line icons (Change 5) ── */
export const Icon = ({ name, size = 22, stroke = "var(--text)", strokeWidth = 1.5 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    wifi: <><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="0.5" fill={stroke}/></>,
    coffee: <><path d="M5 9h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2"/><path d="M8 4v1.5M11 4v1.5"/></>,
    phone: <><rect x="8" y="3" width="8" height="18" rx="2"/><path d="M11 18h2"/></>,
    printer: <><path d="M7 9V4h10v5"/><rect x="5" y="9" width="14" height="7" rx="1"/><path d="M7 16h10v4H7z"/><circle cx="16.5" cy="11.5" r="0.5" fill={stroke}/></>,
    parking: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9"/></>,
    reception: <><path d="M4 18h16"/><path d="M6 18v-4a6 6 0 0 1 12 0v4"/><path d="M12 8V5"/><path d="M10 5h4"/></>,
    av: <><rect x="3" y="5" width="18" height="11" rx="1"/><path d="M8 20h8M12 16v4"/></>,
    light: <><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></>,
    chair: <><path d="M6 19v-3M18 19v-3M6 16h12"/><path d="M7 16l-1-9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2l-1 9"/><path d="M8 10h8"/></>,
    key: <><circle cx="8" cy="14" r="4"/><path d="M11 11l8-8M16 6l2 2M14 8l1.5 1.5"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    calendar: <><rect x="4" y="5" width="16" height="16" rx="1"/><path d="M4 9h16M9 3v4M15 3v4"/></>,
    mail: <><rect x="3" y="6" width="18" height="12" rx="1"/><path d="m3 7 9 6 9-6"/></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5M3 16l9 5 9-5" opacity="0.5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    building: <><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></>,
    bolt: <><path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M16 6a3 3 0 0 1 0 6M21 19a6 6 0 0 0-4-5.6"/></>,
    phone_mobile: <><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 18h4"/></>,
    doc: <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 5-5"/></>,
  };
  return <svg {...common}>{paths[name] || paths.check}</svg>;
};

export const AmenityIcon = ({ name, size=16 }) => {
  const m = { WiFi:"wifi", Coffee:"coffee", "Phone Booth":"phone", Printing:"printer", Parking:"parking", Reception:"reception", "A/V Setup":"av", "Natural Light":"light" };
  return <Icon name={m[name] || "check"} size={size} stroke="var(--gold)" />;
};

/* ── Top Navbar ── */
const navLinkStyle = (active) => ({
  textDecoration: "none",
  fontSize: 11,
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: active ? "var(--gold)" : "var(--text)",
  transition: "color 0.15s",
  padding: "4px 0",
  whiteSpace: "nowrap",
  borderBottom: active ? "1px solid var(--gold)" : "1px solid transparent",
});

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { lang, toggle } = useLang();
  const { trigger } = useSplash();
  const isPortal = loc.pathname.startsWith("/portal");
  const isAuth = ["/login", "/register", "/forgot-password", "/reset-password"].some(p => loc.pathname.startsWith(p));
  // Hide navbar inside portal (sidebar handles navigation) and on auth pages (own layout)
  if (isPortal || isAuth) return null;

  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, height:64, background:"rgba(248,246,241,0.95)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:"1px solid rgba(15,15,15,0.10)" }}>
       <div style={{ maxWidth:1400, margin:"0 auto", height:"100%", padding:"0 64px", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>

        {/* Left links */}
        <div className="hide-mob" style={{ display:"flex", alignItems:"center", gap:18, flex:1, minWidth:0 }}>
          <Link to="/about" style={navLinkStyle(loc.pathname === "/about")}>About</Link>
          <Link to="/spaces" style={navLinkStyle(loc.pathname.startsWith("/spaces"))}>Spaces</Link>
          <Link to="/meeting-rooms" style={navLinkStyle(loc.pathname.startsWith("/meeting-rooms"))}>Meeting Rooms</Link>
          <Link to="/event-venues" style={navLinkStyle(loc.pathname.startsWith("/event-venues"))}>Event Venues</Link>
          <Link to="/membership" style={navLinkStyle(loc.pathname === "/membership")}>Membership</Link>
        </div>

        {/* Logo — true centre flex item, link groups sit either side */}
        <div
          onClick={() => { trigger(); navigate("/"); }}
          style={{ cursor:"pointer", flexShrink:0, margin:"0 20px", display:"flex", alignItems:"center", textDecoration:"none", outline:"none", WebkitTapHighlightColor:"transparent" }}
        >
          <img src="/workspace-photos/logo-mark.png" alt="HiLink" style={{ height:34, width:"auto", display:"block", border:"none", outline:"none" }}/>
        </div>

        {/* Right links */}
        <div className="hide-mob" style={{ display:"flex", alignItems:"center", gap:16, flex:1, justifyContent:"flex-end", minWidth:0 }}>
          <Link to="/forum" style={navLinkStyle(loc.pathname.startsWith("/forum"))}>The Forum</Link>
          {isAuthenticated ? (
            <>
              <Link to="/recommend" style={navLinkStyle(loc.pathname === "/recommend")}>Find my space</Link>
              <Link to="/portal/dashboard" style={navLinkStyle(false)}>Portal</Link>
              <button onClick={() => { logout(); navigate("/"); }} style={{ ...navLinkStyle(false), background:"none", border:"none", cursor:"pointer", borderBottom:"1px solid transparent" }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/recommend" style={navLinkStyle(loc.pathname === "/recommend")}>Find my space</Link>
              <Link to="/login" style={navLinkStyle(loc.pathname === "/login")}>Sign in</Link>
            </>
          )}
          {/* EN/VI Language toggle — plain text slash style */}
          <div style={{ display:"flex", alignItems:"center", fontFamily:"'Inter',sans-serif", fontSize:11, letterSpacing:"0.1em" }}>
            <span
              onClick={() => lang !== "en" && toggle()}
              style={{ color: lang==="en"?"var(--gold)":"var(--text-3)", fontWeight: lang==="en"?600:400, cursor: lang==="en"?"default":"pointer", transition:"color 0.15s" }}
            >EN</span>
            <span style={{ color:"var(--text-3)", margin:"0 5px", fontWeight:300 }}>/</span>
            <span
              onClick={() => lang !== "vi" && toggle()}
              style={{ color: lang==="vi"?"var(--gold)":"var(--text-3)", fontWeight: lang==="vi"?600:400, cursor: lang==="vi"?"default":"pointer", transition:"color 0.15s" }}
            >VI</span>
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="show-mob" onClick={() => setMenuOpen(!menuOpen)} style={{ display:"none", position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--text)", cursor:"pointer", fontSize:20 }}>☰</button>
       </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position:"fixed", top:64, left:0, right:0, zIndex:99, background:"#F8F6F1", borderBottom:"1px solid var(--border)", padding:"24px 32px 32px" }}>
          {[{to:"/about",label:"About"},{to:"/spaces",label:"Spaces"},{to:"/meeting-rooms",label:"Meeting Rooms"},{to:"/event-venues",label:"Event Venues"},{to:"/membership",label:"Membership"},{to:"/forum",label:"The Forum"},{to:"/recommend",label:"Find my space"},{to:"/login",label:"Sign in"}].map(l => (
            <Link key={l.to+l.label} to={l.to} onClick={() => setMenuOpen(false)} style={{ display:"block", padding:"14px 0", color:"var(--text)", textDecoration:"none", fontFamily:"'Inter', sans-serif", fontSize:13, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", borderBottom:"1px solid var(--border)" }}>{l.label}</Link>
          ))}
          {isAuthenticated && (
            <button onClick={() => { logout(); navigate("/"); setMenuOpen(false); }} style={{ display:"block", marginTop:16, background:"none", border:"none", color:"var(--text-3)", cursor:"pointer", fontFamily:"'Inter', sans-serif", fontSize:13, letterSpacing:"0.1em", textTransform:"uppercase" }}>Sign out</button>
          )}
        </div>
      )}
    </>
  );
};

/* ── Portal Sidebar ── */
export const PortalSidebar = ({ collapsed, setCollapsed }) => {
  const loc = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  const sections = [
    {
      label: "Overview",
      items: [
        { to:"/portal/dashboard",    icon:"⬡", label:"Dashboard" },
        { to:"/portal/book",         icon:"✦", label:"Book a Space" },
        { to:"/portal/availability", icon:"◉", label:"Live Availability" },
      ],
    },
    {
      label: "My Account",
      items: [
        { to:"/portal/bookings",  icon:"◻", label:"My Bookings" },
        { to:"/portal/invoices",  icon:"◈", label:"Invoices" },
        { to:"/portal/documents", icon:"◇", label:"Documents" },
        { to:"/portal/settings",  icon:"◎", label:"Settings" },
      ],
    },
    {
      label: "Book & Enquire",
      items: [
        { to:"/portal/book-viewing",  icon:"◍", label:"Book a Viewing" },
        { to:"/portal/callback",      icon:"◌", label:"Request Callback" },
        { to:"/portal/inquiry",       icon:"◯", label:"Submit Inquiry" },
        { to:"/portal/reserve",       icon:"◐", label:"Reserve a Space" },
        { to:"/portal/custom-offer",  icon:"◑", label:"Custom Offer" },
      ],
    },
    {
      label: "Tools",
      items: [
        { to:"/portal/recommend", icon:"◒", label:"Smart Recommendations" },
      ],
    },
    {
      label: "My Space",
      items: [
        { to:"/portal/tenant", icon:"◓", label:"Tenant Portal" },
      ],
    },
    {
      label: "Support",
      items: [
        { to:"/portal/support", icon:"◌", label:"Support" },
      ],
    },
  ];

  const sectionLabelStyle = {
    fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600,
    letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--text-3)",
    padding:"16px 14px 6px", whiteSpace:"nowrap",
  };

  return (
    <div style={{ width: collapsed ? 60 : 220, minHeight:"100vh", background:"#FFFFFF", borderRight:"1px solid rgba(15,15,15,0.10)", display:"flex", flexDirection:"column", transition:"width 0.22s cubic-bezier(0.4,0,0.2,1)", flexShrink:0, position:"sticky", top:0, overflow:"hidden" }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? "14px 0" : "16px 16px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "flex-start" }}>
        {collapsed ? (
          <div style={{ width:28, height:28, background:"var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:13, fontWeight:800, color:"#FFFFFF" }}>H</span>
          </div>
        ) : (
          <img src="/workspace-photos/logo-mark.png" alt="HiLink" style={{ height:32, width:"auto", display:"block" }}/>
        )}
      </div>

      {/* User */}
      {!collapsed && (
        <div style={{ padding:"14px 16px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:10 }}>
          <Avatar initials="NT" size={32} gold />
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--text)", margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Nguyen Thanh</p>
            <Tag color="gold">Pro Member</Tag>
          </div>
        </div>
      )}

      {/* Nav sections */}
      <nav style={{ flex:1, padding:"4px 0", overflowY:"auto" }}>
        {sections.map(section => (
          <div key={section.label}>
            {!collapsed && <p style={sectionLabelStyle}>{section.label}</p>}
            {section.items.map(item => {
              const active = loc.pathname === item.to;
              return (
                <Link key={item.to} to={item.to} title={collapsed ? item.label : ""} style={{ display:"flex", alignItems:"center", gap:10, padding: collapsed ? "10px 0" : "9px 14px", justifyContent: collapsed ? "center" : "flex-start", textDecoration:"none", color: active ? "var(--gold)" : "var(--text-3)", background: active ? "rgba(168,143,92,0.06)" : "transparent", borderLeft: active ? "3px solid var(--gold)" : "3px solid transparent", transition:"all 0.15s", fontSize:13, fontFamily:"'Inter', sans-serif", fontWeight: active ? 500 : 400 }}>
                  <span style={{ fontSize:15, flexShrink:0, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                  {!collapsed && <span style={{ whiteSpace:"nowrap" }}>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Public site link + Logout */}
      {!collapsed && (
        <>
          {isAdmin && (
            <Link to="/admin" style={{ padding:"10px 14px", borderTop:"1px solid var(--border)", color:"var(--olive)", textDecoration:"none", fontSize:12, fontWeight:600, fontFamily:"'Inter', sans-serif", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:14 }}>▦</span> Operations portal
            </Link>
          )}
          <Link to="/" style={{ padding:"10px 14px", borderTop:"1px solid var(--border)", color:"var(--text-3)", textDecoration:"none", fontSize:12, fontFamily:"'Inter', sans-serif", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:14 }}>↗</span> Back to site
          </Link>
          <button onClick={() => { logout(); navigate("/"); }} style={{ padding:"10px 14px", background:"none", border:"none", borderTop:"1px solid var(--border)", color:"var(--text-3)", cursor:"pointer", fontSize:12, fontFamily:"'Inter', sans-serif", display:"flex", alignItems:"center", gap:8, width:"100%" }}>
            <span style={{ fontSize:14 }}>↩</span> Sign out
          </button>
        </>
      )}
      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)} style={{ padding:"14px", background:"none", border:"none", borderTop:"1px solid var(--border)", color:"var(--text-3)", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {collapsed ? "→" : "←"}
      </button>
    </div>
  );
};

/* ── Portal Layout ── */
export const PortalLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mob, setMob] = useState(false);
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>
      <div className="hide-mob" style={{ display:"flex" }}>
        <PortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <button onClick={() => setMob(!mob)} style={{ position:"fixed", top:14, left:14, zIndex:200, background:"var(--bg-3)", border:"1px solid var(--border)", borderRadius:0, padding:"8px 11px", color:"var(--text)", fontSize:16, cursor:"pointer", display:"none" }} className="show-mob">☰</button>
      {mob && (
        <div style={{ position:"fixed", inset:0, zIndex:150, background:"rgba(0,0,0,0.7)" }} onClick={() => setMob(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width:220, height:"100%", background:"var(--bg-2)" }}>
            <PortalSidebar collapsed={false} setCollapsed={() => {}} />
          </div>
        </div>
      )}
      <main style={{ flex:1, minWidth:0, padding:"32px", overflow:"auto" }}>
        {children}
      </main>
    </div>
  );
};

/* ── Auth Layout ── */
export const AuthLayout = ({ children, title, subtitle }) => (
  <PageWrap>
    <div style={{ display:"flex", minHeight:"100vh" }}>
      {/* Left panel */}
      <div className="hide-mob" style={{ width:"42%", borderRight:"1px solid rgba(15,15,15,0.10)", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"48px", position:"relative", overflow:"hidden",
        backgroundImage:"url('/workspace-photos/auth-texture.png')", backgroundSize:"cover", backgroundPosition:"center" }}>
        {/* White overlay — lower opacity = pattern more visible */}
        <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,0.62)", pointerEvents:"none" }} />
        {/* Orb */}
        <div style={{ position:"absolute", top:"30%", left:"20%", width:300, height:300, background:"radial-gradient(circle, rgba(168,143,92,0.06) 0%, transparent 65%)", pointerEvents:"none" }} />
        <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, ease:[0.25,0.46,0.45,0.94] }} style={{ position:"relative" }}>
          <Link to="/" style={{ textDecoration:"none", display:"flex", alignItems:"center" }}>
            <img src="/workspace-photos/logo-workspace-trim.png" alt="HiLink Premium Workspace" style={{ height:52, width:"auto", display:"block" }} />
          </Link>
        </motion.div>
        <div style={{ position:"relative" }}>
          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.15, ease:[0.25,0.46,0.45,0.94] }}
            style={{ fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--gold)", fontFamily:"Inter", marginBottom:16 }}>Premium Workspace · Hanoi</motion.p>
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.28, ease:[0.25,0.46,0.45,0.94] }}
            style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(28px,3.5vw,40px)", fontWeight:700, color:"var(--text)", lineHeight:1.15, marginBottom:20 }}>
            Where focus<br />meets<br /><span className="gold-text">freedom.</span>
          </motion.h1>
          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.45, ease:[0.25,0.46,0.45,0.94] }}
            style={{ color:"var(--text-2)", fontFamily:"Inter", fontSize:15, lineHeight:1.7, maxWidth:320 }}>
            2,000+ professionals choose HiLink as their Hanoi base of operations.
          </motion.p>
          <div style={{ marginTop:36, display:"flex", flexDirection:"column", gap:12 }}>
            {["Two prime Hanoi locations", "Instant booking — no waiting", "24/7 Pro member access"].map((f, idx) => (
              <motion.div key={f} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, delay:0.6 + idx*0.12, ease:[0.25,0.46,0.45,0.94] }}
                style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:18, height:18, borderRadius:"50%", background:"rgba(168,143,92,0.10)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ color:"var(--gold)", fontSize:10 }}>✓</span>
                </div>
                <span style={{ color:"var(--text-2)", fontFamily:"Inter", fontSize:13 }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <p style={{ position:"relative", color:"var(--text-3)", fontSize:12, fontFamily:"Inter" }}>© 2025 HiLink Workspaces</p>
      </div>

      {/* Right form */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 40px", background:"var(--bg)" }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          <Link to="/" className="show-mob" style={{ display:"none", marginBottom:28 }}>
            <img src="/workspace-photos/logo-workspace-trim.png" alt="HiLink Premium Workspace" style={{ height:44, width:"auto" }} />
          </Link>
          <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:26, fontWeight:700, color:"var(--text)", marginBottom:6 }}>{title}</h2>
          <p style={{ color:"var(--text-2)", fontFamily:"Inter", fontSize:14, marginBottom:36 }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  </PageWrap>
);
