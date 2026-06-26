// Shared primitives for the admin screens — consistent tables, modals, pills.
export const TH = { padding: "11px 16px", textAlign: "left", fontFamily: "Inter", fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" };
export const TD = { padding: "12px 16px", fontFamily: "Inter", fontSize: 13, color: "var(--text)", whiteSpace: "nowrap" };
export const SEL = { padding: "9px 11px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13, color: "var(--text)" };
export const INP = { width: "100%", padding: "9px 12px", border: "1px solid var(--border)", fontFamily: "Inter", fontSize: 13, color: "var(--text)" };

export const PageHead = ({ title, sub, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 18 }}>
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{title}</h1>
      {sub && <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>{sub}</p>}
    </div>
    {right}
  </div>
);

export const Pill = ({ label, color = "var(--text-2)", bg = "rgba(15,15,15,0.06)" }) => (
  <span style={{ background: bg, color, fontFamily: "Inter", fontSize: 11, fontWeight: 600, padding: "3px 9px", whiteSpace: "nowrap" }}>{label}</span>
);

export const Search = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 14 }}>⌕</span>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "10px 12px 10px 34px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }} />
  </div>
);

export const Modal = ({ title, onClose, children, width = 460 }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
    <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFF", border: "1px solid var(--border)", padding: 28, maxWidth: width, width: "100%", maxHeight: "88vh", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19, fontWeight: 700, color: "var(--text)" }}>{title}</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "var(--text-3)", cursor: "pointer" }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

export const Field = ({ label, children }) => (
  <div><label style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", display: "block", marginBottom: 5 }}>{label}</label>{children}</div>
);

export const BtnPrimary = ({ children, onClick, full }) => (
  <button onClick={onClick} style={{ width: full ? "100%" : "auto", background: "var(--olive)", color: "#FFF", border: "none", padding: "11px 18px", cursor: "pointer", fontFamily: "Inter", fontSize: 14, fontWeight: 600 }}>{children}</button>
);

export const Card = ({ title, children, right }) => (
  <div style={{ background: "#FFF", border: "1px solid var(--border)", padding: "18px 20px" }}>
    {(title || right) && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{title}</p>{right}
    </div>}
    {children}
  </div>
);

// status palettes reused across people/finance screens
export const tone = {
  green:  { color: "var(--success)", bg: "rgba(45,106,79,0.10)" },
  blue:   { color: "#2563EB",        bg: "rgba(37,99,235,0.10)" },
  amber:  { color: "var(--warning)", bg: "rgba(181,134,42,0.12)" },
  red:    { color: "var(--danger)",  bg: "rgba(192,57,43,0.10)" },
  grey:   { color: "var(--text-3)",  bg: "rgba(15,15,15,0.07)" },
  olive:  { color: "var(--olive)",   bg: "rgba(61,74,46,0.10)" },
};
