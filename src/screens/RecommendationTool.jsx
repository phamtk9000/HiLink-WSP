import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrap, PortalLayout, Icon } from "../components/index.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { addLead } from "../data/leadsStore.js";
import { SPACES } from "../data/mockData.js";
import { motion, AnimatePresence } from "framer-motion";
import { AMENITY_NAMES, runRecommendations } from "../utils/recommend.js";

/* ── Minimal SVG icon map for amenities ── */
const AMENITY_ICON_NAME = {
  "WiFi":"wifi","Coffee":"coffee","Phone Booth":"phone","Printing":"printer",
  "Parking":"parking","Reception":"reception","A/V Setup":"av","Natural Light":"light",
};
const AMENITY_EMOJI = AMENITY_ICON_NAME; // legacy alias — now holds icon names not emoji

/* ── Employee pill options ── */
const EMP_PILLS = [
  { label:"Solo", val:1 },{ label:"2–5", val:3 },{ label:"6–15", val:10 },
  { label:"16–50", val:30 },{ label:"50+", val:75 },
];

/* ── Budget pill options ── */
const BUDGET_PILLS = [
  { label:"< ₫10M", val:9000000 },{ label:"₫10–20M", val:18000000 },
  { label:"₫20–45M", val:40000000 },{ label:"₫45–75M", val:65000000 },
  { label:"₫75M+", val:100000000 },
];

/* ── Lease pill options ── */
const LEASE_PILLS = ["Monthly","3 months","6 months","12 months","2+ years"];

/* ── Payment term pill options (how often rent is paid) ── */
const PAYMENT_PILLS = ["Pay monthly","Pay quarterly","Pay 6-monthly","Pay annually"];

/* ── Result card band colors ── */
const BAND = {
  "Best Match": "var(--gold)",
  "Most Affordable": "var(--success)",
  "Premium Option": "#1C1710",
  "Most Efficient": "var(--warning)",
};

/* ── Dark pill button ── */
const DarkPill = ({ label, selected, onClick, emoji }) => (
  <button onClick={onClick} style={{
    display:"inline-flex", alignItems:"center", gap:6,
    padding:"7px 14px", borderRadius:20, border:"none", cursor:"pointer",
    fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500,
    background: selected ? "var(--gold)" : "transparent",
    color: selected ? "#FFFFFF" : "rgba(255,255,255,0.55)",
    outline: selected ? "none" : "1px solid rgba(255,255,255,0.15)",
    transition:"all 0.15s ease",
    whiteSpace:"nowrap",
  }}>
    {emoji && <span style={{ fontSize:13 }}>{emoji}</span>}
    {label}
  </button>
);

/* ── Result card ── */
export const ResultCard = ({ label, space, criteria, index }) => {
  const navigate = useNavigate();
  if (!space) return null;
  const matchingAmenities = (space.amenities || []).filter(a => criteria.amenities.includes(a));
  const bandColor = BAND[label] || "var(--gold)";

  return (
    <motion.div
      initial={{ opacity:0, y:40 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.45, delay: index * 0.12, ease:[0.22,1,0.36,1] }}
      style={{ background:"#FFFFFF", border:"none", boxShadow:"0 2px 20px rgba(0,0,0,0.06)", overflow:"hidden", display:"flex", flexDirection:"column" }}
    >
      {/* Top color band */}
      <div style={{ height:4, background:bandColor, flexShrink:0 }} />
      <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", flex:1 }}>
        {/* Label badge */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:`${bandColor}18`, border:`1px solid ${bandColor}45`, padding:"2px 10px", marginBottom:14, alignSelf:"flex-start" }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:bandColor, flexShrink:0 }} />
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:bandColor }}>{label}</span>
        </div>

        <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.3rem", fontWeight:400, color:"var(--text)", marginBottom:4, lineHeight:1.2 }}>{space.name}</h3>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)", marginBottom:12 }}>
          {space.type} · {space.floor ? `Floor ${space.floor}` : "Virtual"} · Cap: {space.capacity || "N/A"}
        </p>

        {space.pricePerMonth && (
          <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.6rem", fontWeight:400, color:"var(--gold)", marginBottom:14, lineHeight:1 }}>
            ₫{space.pricePerMonth.toLocaleString()}
            <span style={{ fontSize:11, color:"var(--text-3)", fontFamily:"'Inter',sans-serif", fontWeight:400 }}>/mo</span>
          </p>
        )}

        {/* Amenity pills */}
        {space.amenities && space.amenities.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16 }}>
            {space.amenities.map(a => (
              <span key={a} style={{
                fontFamily:"'Inter',sans-serif", fontSize:10, padding:"2px 8px",
                background: matchingAmenities.includes(a) ? "rgba(168,143,92,0.14)" : "var(--bg-2)",
                color: matchingAmenities.includes(a) ? "var(--gold)" : "var(--text-3)",
                border:`1px solid ${matchingAmenities.includes(a)?"var(--border-gold)":"var(--border)"}`,
              }}>{a}</span>
            ))}
          </div>
        )}

        <div style={{ flex:1 }} />
        {/* Book CTA */}
        <button onClick={() => navigate("/portal/book-viewing")}
          style={{ width:"100%", padding:"11px", background:"#1C1710", border:"none", color:"#F8F6F1", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.15s", marginTop:8 }}
          onMouseEnter={e=>e.currentTarget.style.background="var(--gold)"}
          onMouseLeave={e=>e.currentTarget.style.background="#1C1710"}>
          Book viewing →
        </button>
      </div>
    </motion.div>
  );
};

/* ── Shared two-panel engine ── */
/* ── Location pill options ── */
const LOCATION_PILLS = ["OBC 60 Lý Thái Tổ","HiLink 15 Tôn Thất Tùng","Any"];

/* ── Magazine pill button (single style for everything) ── */
const MagPill = ({ label, selected, onClick, icon }) => (
  <button onClick={onClick} style={{
    display:"inline-flex", alignItems:"center", gap:8,
    padding:"8px 16px", borderRadius:100,
    border:selected ? "1px solid #c9a55a" : "1px solid #d8d0c0",
    background: selected ? "#c9a55a" : "#FFFFFF",
    color: selected ? "#1a1612" : "#7a6f5e",
    fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:selected?500:400,
    cursor:"pointer", transition:"all 0.18s", whiteSpace:"nowrap", lineHeight:1.2,
  }}
  onMouseEnter={e=>{ if(!selected){ e.currentTarget.style.borderColor="#a09070"; e.currentTarget.style.color="#1a1612"; } }}
  onMouseLeave={e=>{ if(!selected){ e.currentTarget.style.borderColor="#d8d0c0"; e.currentTarget.style.color="#7a6f5e"; } }}>
    {icon && <Icon name={icon} size={14} stroke={selected ? "#1a1612" : "#7a6f5e"} strokeWidth={1.6}/>}
    {label}
  </button>
);

/* ── Magazine masthead style RecommendationEngine ── */
export function RecommendationEngine({ compact = false }) {
  const { user } = useAuth();
  const isMember = !!user && user.role !== "admin";
  const [criteria, setCriteria] = useState({
    employees: null, budget: 40000000, floors: [], moveIn: "", amenities: [], lease: "3 months", paymentTerm: "Pay monthly", locations: [],
    email: isMember ? (user?.email || "") : "", phone: isMember ? (user?.phone || "") : "",
  });
  const [results, setResults] = useState(null);
  const [leadLogged, setLeadLogged] = useState(false);

  const toggleLocation = l => setCriteria(c => ({
    ...c, locations: c.locations.includes(l) ? c.locations.filter(x=>x!==l) : [...c.locations, l],
  }));

  const BUDGET_MIN = 5000000, BUDGET_MAX = 100000000;
  const budgetIsAny = criteria.budget >= BUDGET_MAX;
  const budgetPct = ((criteria.budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
  const fmtBudget = (v) => v >= BUDGET_MAX ? "₫100M+ (any)" : "₫" + (v / 1000000).toFixed(0) + "M";

  // contact gate — members are auto-filled; guests must supply email or phone
  const emailOk = /^\S+@\S+\.\S+$/.test(criteria.email.trim());
  const phoneOk = criteria.phone.replace(/[^\d]/g, "").length >= 8;
  const contactOk = isMember || emailOk || phoneOk;

  // Count active filters
  const activeCount = (criteria.employees ? 1 : 0)
    + (budgetIsAny ? 0 : 1)
    + criteria.locations.length
    + (criteria.lease ? 1 : 0)
    + (criteria.paymentTerm ? 1 : 0);

  const rowStyle = { display:"grid", gridTemplateColumns:"130px 1fr", borderBottom:"1px solid #d8d0c0", padding:"16px 0", alignItems:"start" };
  const labelStyle = { fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"#7a6f5e", paddingTop:8, paddingRight:12 };
  const optsStyle = { display:"flex", flexWrap:"wrap", gap:6 };

  return (
    <div className="reco-shell" style={{ display:"grid", gridTemplateColumns: results ? "minmax(440px, 480px) 1fr" : "1fr", gap:0, minHeight: compact ? "auto" : 640, background:"#f5f0e8" }}>

      {/* ── LEFT: magazine-style filter ── */}
      <div className="reco-filter" style={{ background:"#f5f0e8", padding:"40px 36px", borderRight: results ? "1px solid #d8d0c0" : "none" }}>
        {/* Masthead */}
        <div style={{ borderTop:"3px solid #9a7230", borderBottom:"1px solid #d8d0c0", padding:"14px 0", marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
          <div>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:9, letterSpacing:"0.22em", color:"#7a6f5e", fontWeight:500, marginBottom:3 }}>THE OFFICE GUIDE</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:26, fontWeight:700, color:"#1a1612", lineHeight:1 }}>Find your space</h2>
          </div>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:"#b0a890", letterSpacing:"0.1em", fontWeight:300 }}>Hanoi, 2026</span>
        </div>

        {/* Team size — dropdown */}
        <div className="reco-row" style={rowStyle}>
          <span style={labelStyle}>Team size</span>
          <div style={optsStyle}>
            <select value={criteria.employees ?? ""} onChange={(e) => setCriteria(c => ({ ...c, employees: e.target.value === "" ? null : Number(e.target.value) }))}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d8d0c0", background: "#FFFFFF", fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#1a1612", cursor: "pointer" }}>
              <option value="">Any size</option>
              {EMP_PILLS.map(p => <option key={p.label} value={p.val}>{p.label} {p.val === 1 ? "" : "people"}</option>)}
            </select>
          </div>
        </div>

        {/* Monthly budget — ruler / slider */}
        <div className="reco-row" style={rowStyle}>
          <span style={labelStyle}>Monthly budget</span>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, fontWeight: 700, color: "#1a1612" }}>{fmtBudget(criteria.budget)}</span>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: "#b0a890" }}>max / month</span>
            </div>
            <input type="range" className="hilink-range" min={BUDGET_MIN} max={BUDGET_MAX} step={5000000} value={criteria.budget} list="budget-ticks"
              onChange={(e) => setCriteria(c => ({ ...c, budget: Number(e.target.value) }))}
              style={{ width: "100%", background: `linear-gradient(to right, #c9a55a 0%, #c9a55a ${budgetPct}%, #e6ddca ${budgetPct}%, #e6ddca 100%)` }} />
            <datalist id="budget-ticks">
              {Array.from({ length: 20 }, (_, i) => BUDGET_MIN + i * 5000000).map(v => <option key={v} value={v} />)}
            </datalist>
            <div style={{ position: "relative", height: 14, marginTop: 4 }}>
              {[["₫5M", 5000000], ["₫25M", 25000000], ["₫50M", 50000000], ["₫75M", 75000000], ["₫100M+", 100000000]].map(([t, v], i, arr) => {
                const pct = ((v - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
                const tx = i === 0 ? "0" : i === arr.length - 1 ? "-100%" : "-50%";
                return <span key={t} style={{ position: "absolute", left: pct + "%", transform: `translateX(${tx})`, fontFamily: "'Inter',sans-serif", fontSize: 9, color: criteria.budget === v ? "#c9a55a" : "#b0a890", fontWeight: criteria.budget === v ? 700 : 400, whiteSpace: "nowrap" }}>{t}</span>;
              })}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="reco-row" style={rowStyle}>
          <span style={labelStyle}>Location</span>
          <div style={optsStyle}>
            {LOCATION_PILLS.map(l => (
              <MagPill key={l} label={l} selected={criteria.locations.includes(l)}
                onClick={() => toggleLocation(l)} />
            ))}
          </div>
        </div>

        {/* Your details — auto-filled for members, required for guests */}
        <div className="reco-row" style={rowStyle}>
          <span style={labelStyle}>Your details</span>
          {isMember ? (
            <div style={{ background: "rgba(201,165,90,0.10)", border: "1px solid #e3d4ad", borderRadius: 8, padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "#1a1612", fontWeight: 600 }}>Signed in as {user.name}</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "#7a6f5e", marginTop: 2 }}>We'll use {criteria.email}{criteria.phone ? ` · ${criteria.phone}` : ""}</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              <input type="email" value={criteria.email} onChange={(e) => setCriteria(c => ({ ...c, email: e.target.value }))} placeholder="Email *"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${criteria.email && !emailOk ? "#c0392b" : "#d8d0c0"}`, background: "#FFFFFF", fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#1a1612" }} />
              <input type="tel" value={criteria.phone} onChange={(e) => setCriteria(c => ({ ...c, phone: e.target.value }))} placeholder="Phone number *"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d8d0c0", background: "#FFFFFF", fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#1a1612" }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: contactOk ? "#7a6f5e" : "#b0a890", fontStyle: "italic" }}>
                {contactOk ? "We'll send your matches here." : "Enter a valid email or phone to see matches."}
              </span>
            </div>
          )}
        </div>

        {/* Lease duration */}
        <div className="reco-row" style={rowStyle}>
          <span style={labelStyle}>Lease duration</span>
          <div style={optsStyle}>
            {LEASE_PILLS.map(l => (
              <MagPill key={l} label={l} selected={criteria.lease===l}
                onClick={() => setCriteria(c=>({...c, lease:l}))} />
            ))}
          </div>
        </div>

        {/* Payment terms */}
        <div className="reco-row" style={{ ...rowStyle, borderBottom:"none" }}>
          <span style={labelStyle}>Payment terms</span>
          <div style={optsStyle}>
            {PAYMENT_PILLS.map(p => (
              <MagPill key={p} label={p} selected={criteria.paymentTerm===p}
                onClick={() => setCriteria(c=>({...c, paymentTerm: c.paymentTerm===p ? null : p}))} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop:"2px solid #1a1612", paddingTop:18, marginTop:18, display:"flex", alignItems:"center", gap:16 }}>
          <button disabled={!contactOk}
            onClick={() => {
              if (!contactOk) return;
              setResults(runRecommendations({ ...criteria, employees: criteria.employees || "", budget: budgetIsAny ? "" : criteria.budget }, SPACES));
              if (!leadLogged) {
                addLead({
                  name: isMember ? user.name : (criteria.email || criteria.phone || "Website visitor"),
                  email: criteria.email, phone: criteria.phone, source: "Find my space",
                  interest: `${criteria.employees ? criteria.employees + " pax" : "Flexible team"} · up to ${fmtBudget(criteria.budget)}${criteria.locations.filter(l => l !== "Any").length ? " · " + criteria.locations.filter(l => l !== "Any").join(", ") : ""}`,
                });
                setLeadLogged(true);
              }
            }}
            style={{ flex:1, padding:15, borderRadius:100, background: contactOk ? "#1a1612" : "#bdb4a0", color:"#f5f0e8", border:"none", fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor: contactOk ? "pointer" : "not-allowed", transition:"background 0.2s" }}
            onMouseEnter={e=>{ if(contactOk) e.currentTarget.style.background="#3a3020"; }}
            onMouseLeave={e=>{ if(contactOk) e.currentTarget.style.background="#1a1612"; }}>
            Find my match →
          </button>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:"#b0a890", fontStyle:"italic", whiteSpace:"nowrap" }}>
            {activeCount} filter{activeCount===1?"":"s"} active
          </span>
        </div>
      </div>

      {/* ── RIGHT: results panel ── */}
      <AnimatePresence>
        {results && (
          <motion.div key="results-panel" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }} transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
            className="reco-panel" style={{ background:"var(--bg)", padding:40, minWidth:0 }}>
            <div style={{ marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.5rem", fontWeight:400, color:"var(--text)" }}>Your matches</h3>
              <button onClick={()=>setResults(null)} style={{ background:"none", border:"none", padding:0, fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)", cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase" }}>Reset</button>
            </div>
            <div className="reco-results-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                { label:"Best Match",      space:results.bestMatch },
                { label:"Most Affordable", space:results.mostAffordable },
                { label:"Premium Option",  space:results.premium },
                { label:"Most Efficient",  space:results.mostEfficient },
              ].map(({ label, space }, i) => (
                <ResultCard key={label} label={label} space={space} criteria={criteria} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Portal version ── */
export default function RecommendationTool() {
  return (
    <PortalLayout>
      <PageWrap>
        <div style={{ marginBottom:32 }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Tools</p>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:400, color:"var(--text)", marginBottom:8 }}>Smart Recommendations</h1>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-3)" }}>Enter your requirements and we'll match you with the best spaces.</p>
        </div>
        <RecommendationEngine compact={false} />
      </PageWrap>
    </PortalLayout>
  );
}

/* ── Public version ── */
export function PublicRecommendationTool() {
  return (
    <PageWrap>
      <div style={{ paddingTop:64 }}>
        {/* Dark hero header */}
        <div style={{ background:"#1C1710", padding:"80px 64px 48px" }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>Smart Match</p>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2.5rem,5vw,4rem)", fontWeight:400, color:"#FFFFFF", lineHeight:1.05, marginBottom:16 }}>
            Find your perfect match
          </h1>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:"rgba(255,255,255,0.6)", lineHeight:1.75, maxWidth:480 }}>
            Tell us what you need. We'll handle the rest.
          </p>
        </div>
        {/* Engine */}
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 64px 80px" }}>
          <RecommendationEngine compact={false} />
        </div>
      </div>
    </PageWrap>
  );
}
