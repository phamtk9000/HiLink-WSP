import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap } from "../components/index.jsx";
import { SPACES } from "../data/mockData.js";

const TYPES        = ["Hot Desk","Private Office","Meeting Room","Virtual Office"];
const AMENITY_LIST = ["WiFi","Coffee","Phone Booth","Printing","Parking","Reception"];
const availColor = a => a==="available"?"var(--success)":a==="limited"?"var(--warning)":"var(--danger)";
const availLabel = a => a==="available"?"Available":a==="limited"?"Limited":"Occupied";

const SPACE_PHOTOS = {
  "1": "/workspace-photos/235510ecf59fb755c102c0f4b2254ba63925f069-1800x1200.avif",
  "2": "/workspace-photos/7f697d83c67bd824c915269932304e1e50668dd0-1800x1200.avif",
  "3": "/workspace-photos/ad7f4d6f9e6ba26fc29098d62b6911062f900bf1-2048x1365.avif",
  "4": "/workspace-photos/9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif",
  "5": "/workspace-photos/a57e2c5781bc65cf0e2a061375bf32119341b3b2-2048x1366.avif",
  "6": "/workspace-photos/DSC05997.jpg",
  "7": "/workspace-photos/761e2d35fafc758157f6414d741bde04927cf465-6720x4480.avif",
  "8": "/workspace-photos/DSC05955%281%29.jpg",
  "9": "/workspace-photos/761e2d35fafc758157f6414d741bde04927cf465-6720x4480.avif",
};

/* ── Google Maps loader — official inline bootstrap loader (importLibrary) ── */
const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
let bootstrapped = false;

// Google's official dynamic library import bootstrap (Apache-2.0). Defines
// google.maps.importLibrary once; subsequent imports are deduped by Google.
function bootstrapGmaps(key) {
  if (bootstrapped || window.google?.maps?.importLibrary) { bootstrapped = true; return; }
  bootstrapped = true;
  // eslint-disable-next-line no-async-promise-executor -- Google's official bootstrap loader (verbatim)
  ((g) => { let h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); const d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a); })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)); })({ key, v: "weekly" });
}

// Loads the libraries we need and resolves with the map + marker classes.
async function loadGoogleMaps() {
  if (typeof window === "undefined") throw new Error("no-window");
  if (!GMAPS_KEY) throw new Error("missing-key");
  bootstrapGmaps(GMAPS_KEY);
  const [{ Map }, { Marker }] = await Promise.all([
    window.google.maps.importLibrary("maps"),
    window.google.maps.importLibrary("marker"),
  ]);
  return { Map, Marker, maps: window.google.maps };
}

/* Two real HiLink addresses, with their actual Hanoi coordinates */
const PINS = [
  { id:"loc-obc", ids:["1","4","8","3","6"], lat:21.027852, lng:105.855412, label:"OBC",    district:"60 Lý Thái Tổ",   count:5 },
  { id:"loc-ttt", ids:["2","5","9","7"],      lat:21.004680, lng:105.827060, label:"HiLink", district:"15 Tôn Thất Tùng", count:4 },
];

/* Warm, desaturated map styling that matches the HiLink palette */
const MAP_STYLES = [
  { elementType:"geometry", stylers:[{ color:"#EDE8DF" }] },
  { elementType:"labels.text.fill", stylers:[{ color:"#8A8170" }] },
  { elementType:"labels.text.stroke", stylers:[{ color:"#F4F0E8" }] },
  { featureType:"poi", stylers:[{ visibility:"off" }] },
  { featureType:"transit", stylers:[{ visibility:"off" }] },
  { featureType:"road", elementType:"geometry", stylers:[{ color:"#DAD2C2" }] },
  { featureType:"road", elementType:"labels.text.fill", stylers:[{ color:"#9A907A" }] },
  { featureType:"road.highway", elementType:"geometry", stylers:[{ color:"#D2C8B4" }] },
  { featureType:"water", elementType:"geometry", stylers:[{ color:"#C5D9E8" }] },
  { featureType:"water", elementType:"labels.text.fill", stylers:[{ color:"#6A95AF" }] },
  { featureType:"administrative", elementType:"geometry", stylers:[{ visibility:"off" }] },
  { featureType:"landscape.man_made", elementType:"geometry", stylers:[{ color:"#E6E0D4" }] },
];

/* Gold teardrop marker icon (active/inactive) as an inline SVG data URL */
const pinIcon = (count, active) => {
  const fill   = active ? "#A88F5C" : "#FFFFFF";
  const stroke = "#A88F5C";
  const txt    = active ? "#FFFFFF" : "#A88F5C";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="46" height="60" viewBox="-23 -36 46 76">
    <ellipse cx="0" cy="34" rx="9" ry="3.5" fill="rgba(0,0,0,0.14)"/>
    <path d="M0,-32 C14,-32 22,-20 22,-10 C22,4 8,18 0,32 C-8,18 -22,4 -22,-10 C-22,-20 -14,-32 0,-32 Z" fill="${fill}" stroke="${stroke}" stroke-width="${active?0:1.5}"/>
    <circle cx="0" cy="-8" r="10" fill="${active?"rgba(255,255,255,0.25)":"rgba(168,143,92,0.10)"}"/>
    <text x="0" y="-4" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="${txt}">${count}</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
};

/* Google-Maps-backed map with gold pin markers */
const HanoiMapWithPins = ({ activePin, onPin, searchValue, onSearch, typeFilter, onToggleType, onClear, hasFilters, filterOpen, setFilterOpen, filterPanel }) => {
  const mapEl   = useRef(null);
  const mapObj  = useRef(null);
  const markers = useRef({});      // pin.id -> google.maps.Marker
  const [status, setStatus] = useState(GMAPS_KEY ? "loading" : "error"); // loading | ready | error
  const [errKind, setErrKind] = useState(GMAPS_KEY ? null : "missing");  // missing | auth | load
  const activePinRef = useRef(activePin);
  useEffect(() => { activePinRef.current = activePin; }, [activePin]);

  // Init the map once
  useEffect(() => {
    if (!GMAPS_KEY) return;          // missing-key state already set on mount
    let cancelled = false;

    // Google calls this global when it rejects the key (API not enabled,
    // referrer not allowed, billing/demo-terms missing). Without it, the
    // library still "resolves" and the map silently renders blank.
    window.gm_authFailure = () => {
      if (cancelled) return;
      console.error("[HiLink map] Google rejected the API key (gm_authFailure).");
      setErrKind("auth"); setStatus("error");
    };

    loadGoogleMaps()
      .then(({ Map, Marker, maps }) => {
        if (cancelled || !mapEl.current) return;
        const map = new Map(mapEl.current, {
          center: { lat: 21.0163, lng: 105.8412 },
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          clickableIcons: false,
          styles: MAP_STYLES,
        });
        mapObj.current = map;

        const bounds = new maps.LatLngBounds();
        PINS.forEach(pin => {
          const marker = new Marker({
            position: { lat: pin.lat, lng: pin.lng },
            map,
            title: `${pin.label} · ${pin.district}`,
            icon: {
              url: pinIcon(pin.count, activePinRef.current === pin.id),
              scaledSize: new maps.Size(46, 60),
              anchor: new maps.Point(23, 36),
            },
            zIndex: 10,
          });
          marker.addListener("click", () => {
            const isActive = activePinRef.current === pin.id;
            onPin(isActive ? null : pin.id);
            map.panTo({ lat: pin.lat, lng: pin.lng });
          });
          markers.current[pin.id] = marker;
          bounds.extend({ lat: pin.lat, lng: pin.lng });
        });
        map.fitBounds(bounds, 120);
        setStatus("ready");

        // The map lives in a position:sticky column; nudge it once layout
        // settles so tiles paint correctly instead of staying blank.
        setTimeout(() => {
          if (cancelled || !mapObj.current) return;
          maps.event.trigger(map, "resize");
          map.fitBounds(bounds, 120);
        }, 300);
      })
      .catch(err => {
        if (cancelled) return;
        console.error("[HiLink map] Failed to load Google Maps:", err);
        setErrKind("load"); setStatus("error");
      });
    return () => { cancelled = true; };
  }, [onPin]);

  // Re-style markers when the active pin changes
  useEffect(() => {
    if (status !== "ready" || !window.google?.maps) return;
    const maps = window.google.maps;
    PINS.forEach(pin => {
      const m = markers.current[pin.id];
      if (!m) return;
      const isActive = activePin === pin.id;
      m.setIcon({
        url: pinIcon(pin.count, isActive),
        scaledSize: new maps.Size(isActive ? 53 : 46, isActive ? 69 : 60),
        anchor: new maps.Point(isActive ? 26.5 : 23, isActive ? 41 : 36),
      });
      m.setZIndex(isActive ? 30 : 10);
    });
  }, [activePin, status]);

  return (
    <div style={{ position:"relative", width:"100%", height:"100%" }}>
      {/* ── Search + Filter bar overlaid on map top ── */}
      <div style={{ position:"absolute", top:16, left:16, right:16, zIndex:10, display:"flex", gap:8 }}>
        {/* Search input */}
        <div style={{ flex:1, display:"flex", alignItems:"center", background:"rgba(248,246,241,0.97)", backdropFilter:"blur(12px)", border:"1px solid rgba(168,143,92,0.2)", padding:"0 16px", height:44, gap:10, boxShadow:"0 4px 20px rgba(0,0,0,0.10)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#A88F5C" strokeWidth="1.5"/>
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#A88F5C" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            value={searchValue}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search spaces, floors, types..."
            style={{ flex:1, border:"none", background:"transparent", fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)", outline:"none" }}
          />
          {searchValue && (
            <button onClick={() => onSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-3)", fontSize:16, lineHeight:1, padding:"0 2px" }}>×</button>
          )}
        </div>
        {/* Filter button */}
        <div style={{ position:"relative" }}>
          <button onClick={() => setFilterOpen(o=>!o)}
            style={{ height:44, padding:"0 18px", background: hasFilters ? "var(--gold)" : "rgba(248,246,241,0.97)", backdropFilter:"blur(12px)", border:`1px solid ${hasFilters?"var(--gold)":"rgba(168,143,92,0.2)"}`, cursor:"pointer", display:"flex", alignItems:"center", gap:8, fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500, color: hasFilters ? "#FFFFFF" : "var(--text)", letterSpacing:"0.08em", boxShadow:"0 4px 20px rgba(0,0,0,0.10)", whiteSpace:"nowrap", transition:"all 0.15s" }}>
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
              <line x1="0" y1="1.5" x2="13" y2="1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="5.5" x2="11" y2="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="4" y1="9.5" x2="9" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Filter{hasFilters ? " ·" : ""}
          </button>
          {filterPanel}
        </div>
      </div>

      {/* ── Google Map container ── */}
      <div ref={mapEl} style={{ width:"100%", height:"100%", minHeight:400, background:"#EDE8DF" }} />

      {/* Loading / error overlay (covers map area, sits below the search bar) */}
      {status !== "ready" && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 32px 32px", background:"#EDE8DF", pointerEvents: status==="error" ? "auto" : "none" }}>
          {status === "loading" ? (
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", letterSpacing:"0.06em" }}>Loading map…</p>
          ) : (
            <div style={{ textAlign:"center", maxWidth:380 }}>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.2rem", color:"var(--text)", marginBottom:10 }}>Map unavailable</p>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", lineHeight:1.7 }}>
                {errKind === "missing" && "No API key found. Add VITE_GOOGLE_MAPS_API_KEY to a .env file in the project root, then fully restart the dev server (Vite only reads .env at startup)."}
                {errKind === "auth" && "Google rejected the key. Confirm the Maps JavaScript API is enabled on the key's project, that the key's HTTP-referrer restrictions allow this site (or are unset), and — for a Demo Key — that you accepted the demo terms. Then hard-refresh."}
                {errKind === "load" && "Couldn't load the Google Maps script. Check your connection / ad-blocker and that the key value is correct, then reload. See the browser console for details."}
                {!errKind && "Couldn't load Google Maps. See the browser console for details."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Active pin tooltip ── */}
      {activePin && (() => {
        const pin = PINS.find(p=>p.id===activePin);
        return pin ? (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            style={{ position:"absolute", bottom:16, left:16, right:16, background:"rgba(248,246,241,0.97)", backdropFilter:"blur(12px)", border:"1px solid var(--border-gold)", padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 20px rgba(0,0,0,0.10)" }}>
            <div>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--gold)", marginBottom:2 }}>{pin.label} · {pin.district}</p>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1rem", color:"var(--text)" }}>{pin.count} space{pin.count!==1?"s":""} available</p>
            </div>
            <button onClick={() => onPin(null)} style={{ background:"none", border:"none", color:"var(--text-3)", cursor:"pointer", fontSize:18, lineHeight:1, padding:"4px 8px" }}>×</button>
          </motion.div>
        ) : null;
      })()}
    </div>
  );
};

/* Modern full filter panel — image reference 1 */
const FilterPanel = ({ capacity, setCapacity, priceMax, setPriceMax, amenities, toggleAmen, date, setDate, leaseType, setLeaseType, onApply, onClear }) => (
  <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, width:320, background:"rgba(248,246,241,0.99)", backdropFilter:"blur(16px)", border:"1px solid var(--border)", boxShadow:"0 12px 40px rgba(0,0,0,0.14)", padding:"24px 24px 20px", zIndex:20 }}>
    {/* Team size */}
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
        <label style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)" }}>Team size</label>
        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--gold)", fontWeight:500 }}>1–{capacity} people</span>
      </div>
      <input type="range" min={1} max={50} value={capacity} onChange={e=>setCapacity(+e.target.value)} style={{ width:"100%" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        {["1","5","10","20","50+"].map(v=><span key={v} style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:"var(--text-3)" }}>{v}</span>)}
      </div>
    </div>
    {/* Monthly budget */}
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
        <label style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)" }}>Max monthly budget</label>
        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--gold)", fontWeight:500 }}>₫{(priceMax/1000000).toFixed(0)}M</span>
      </div>
      <input type="range" min={0} max={100000000} step={1000000} value={priceMax} onChange={e=>setPriceMax(+e.target.value)} style={{ width:"100%" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        {["₫0","₫25M","₫50M","₫75M","₫100M"].map(v=><span key={v} style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:"var(--text-3)" }}>{v}</span>)}
      </div>
    </div>
    {/* Lease type */}
    <div style={{ marginBottom:22 }}>
      <label style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", display:"block", marginBottom:10 }}>Lease type</label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {["Hourly","Daily","Monthly","Long-term"].map(l => (
          <button key={l} onClick={()=>setLeaseType(leaseType===l?null:l)}
            style={{ padding:"5px 12px", border:`1px solid ${leaseType===l?"var(--border-gold)":"var(--border)"}`, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:12, background:leaseType===l?"rgba(168,143,92,0.10)":"transparent", color:leaseType===l?"var(--gold)":"var(--text-3)", transition:"all 0.12s" }}>
            {l}
          </button>
        ))}
      </div>
    </div>
    {/* Amenities */}
    <div style={{ marginBottom:22 }}>
      <label style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", display:"block", marginBottom:10 }}>Amenities</label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {AMENITY_LIST.map(a => (
          <button key={a} onClick={()=>toggleAmen(a)}
            style={{ padding:"5px 12px", border:`1px solid ${amenities.includes(a)?"var(--border-gold)":"var(--border)"}`, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:11, background:amenities.includes(a)?"rgba(168,143,92,0.10)":"transparent", color:amenities.includes(a)?"var(--gold)":"var(--text-3)", transition:"all 0.12s" }}>
            {a}
          </button>
        ))}
      </div>
    </div>
    {/* Date */}
    <div style={{ marginBottom:22 }}>
      <label style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", display:"block", marginBottom:8 }}>Move-in date</label>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ width:"100%", padding:"9px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:13, outline:"none" }}/>
    </div>
    <div style={{ display:"flex", justifyContent:"space-between", paddingTop:4, borderTop:"1px solid var(--border)" }}>
      <button onClick={onClear} style={{ background:"none", border:"none", fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", cursor:"pointer", letterSpacing:"0.06em" }}>Clear all</button>
      <button onClick={onApply} style={{ background:"var(--text)", color:"#FFFFFF", border:"none", padding:"9px 20px", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:"pointer", letterSpacing:"0.08em", fontWeight:500 }}>Apply</button>
    </div>
  </div>
);

const DISTRICTS = [
  { name:"OBC 60 Lý Thái Tổ",      desc:"Hoàn Kiếm lakeside · hot desks, focus pods & 2 meeting rooms", ids:["1","4","8","3","6"] },
  { name:"HiLink 15 Tôn Thất Tùng", desc:"Đống Đa · private offices, dedicated desks & meeting rooms",     ids:["2","5","9","7"] },
];

const SpacesExplorer = () => {
  const navigate = useNavigate();
  const [typeFilter,     setTypeFilter]     = useState([]);
  const [searchValue,    setSearchValue]    = useState("");
  const [filterCapacity, setFilterCapacity] = useState(50);
  const [filterPriceMax, setFilterPriceMax] = useState(100000000);
  const [filterAmenities,setFilterAmenities]= useState([]);
  const [filterDate,     setFilterDate]     = useState("");
  const [filterLeaseType,setFilterLeaseType]= useState(null);
  const [filterOpen,     setFilterOpen]     = useState(false);
  const [banner,         setBanner]         = useState(true);
  const [hovered,        setHovered]        = useState(null);
  const [activePin,      setActivePin]      = useState(null);
  const [districtFilter, setDistrictFilter] = useState(null);

  const toggleType = t => setTypeFilter(f => f.includes(t)?f.filter(x=>x!==t):[...f,t]);
  const clearAll = () => { setTypeFilter([]); setSearchValue(""); setFilterCapacity(50); setFilterPriceMax(100000000); setFilterAmenities([]); setFilterDate(""); setFilterLeaseType(null); setDistrictFilter(null); setActivePin(null); };

  const capacity = filterCapacity;
  const priceMax = filterPriceMax;
  const amenities = filterAmenities;

  const activePinIds = activePin ? (PINS.find(p => p.id === activePin)?.ids || []) : [];

  const filtered = SPACES.filter(s => {
    if (typeFilter.length && !typeFilter.includes(s.type)) return false;
    if (s.capacity && s.capacity > capacity) return false;
    if (s.price > priceMax) return false;
    if (amenities.length && !amenities.every(a => s.amenities.includes(a))) return false;
    if (districtFilter && !districtFilter.includes(s.id)) return false;
    if (activePinIds.length && !activePinIds.includes(s.id)) return false;
    if (searchValue) {
      const q = searchValue.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.type.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const hasFilters = typeFilter.length > 0 || searchValue || capacity < 50 || priceMax < 100000000 || amenities.length > 0 || filterLeaseType;

  return (
    <PageWrap>
      <div style={{ paddingTop:64, minHeight:"100vh", background:"var(--bg)" }}>

        {/* ── EDITORIAL HEADER ── */}
        <div style={{ background:"#FFFFFF", padding:"40px 48px 0", borderBottom:"1px solid var(--border)" }}>
          <div style={{ maxWidth:"100%", display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
            <div>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:10 }}>Spaces</p>
              <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:400, color:"var(--text)", lineHeight:1.05 }}>Find your space</h1>
            </div>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", lineHeight:2, textAlign:"right", paddingTop:8 }}>
              9 Spaces · 3 Floors<br/>Hanoi, Vietnam
            </p>
          </div>
          {/* District tabs */}
          <div style={{ display:"flex", gap:0, borderTop:"1px solid var(--border)" }}>
            <button onClick={() => { setDistrictFilter(null); setActivePin(null); }}
              style={{ padding:"14px 20px", background:"none", border:"none", borderBottom:`2px solid ${!districtFilter?"var(--gold)":"transparent"}`, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500, color:!districtFilter?"var(--gold)":"var(--text-3)", letterSpacing:"0.06em", transition:"all 0.15s" }}>
              All
            </button>
            {DISTRICTS.map((d,i) => {
              const pinId = ["loc-obc","loc-ttt"][i];
              const active = districtFilter === d.ids;
              return (
                <button key={d.name} onClick={() => { setDistrictFilter(active ? null : d.ids); setActivePin(active ? null : pinId); }}
                  style={{ padding:"14px 20px", background:"none", border:"none", borderBottom:`2px solid ${active?"var(--gold)":"transparent"}`, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500, color:active?"var(--gold)":"var(--text-3)", letterSpacing:"0.06em", transition:"all 0.15s" }}>
                  {d.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MAIN: SIDE-BY-SIDE LIST + MAP ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 480px", minHeight:"calc(100vh - 200px)" }}>

          {/* LEFT: space list */}
          <div style={{ overflowY:"auto", maxHeight:"calc(100vh - 200px)", background:"var(--bg)" }}>

            {/* Live banner */}
            <AnimatePresence>
              {banner && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                  style={{ background:"rgba(45,106,79,0.06)", borderBottom:"1px solid rgba(45,106,79,0.15)", padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ width:6, height:6, background:"var(--success)", display:"inline-block", borderRadius:"50%" }}/>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--success)" }}>3 seats just freed up on Floor 12</span>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)" }}>· 2 min ago</span>
                  </div>
                  <button onClick={() => setBanner(false)} style={{ background:"none", border:"none", color:"var(--text-3)", cursor:"pointer", fontSize:16 }}>×</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result count */}
            <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--border)", background:"#FFFFFF" }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>
                {filtered.length} space{filtered.length!==1?"s":""} found
                {(hasFilters || activePin) && (
                  <button onClick={clearAll} style={{ marginLeft:12, background:"none", border:"none", fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--gold)", cursor:"pointer", textDecoration:"underline" }}>Clear filters</button>
                )}
              </p>
            </div>

            {/* Cards — vertical list, full editorial */}
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {filtered.map((space, i) => {
                const isActive = hovered===space.id;
                return (
                  <motion.div key={space.id}
                    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
                    onClick={() => navigate(`/spaces/${space.id}`)}
                    onMouseEnter={() => setHovered(space.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ display:"flex", background:"#FFFFFF", cursor:"pointer", borderBottom:"1px solid var(--border)", borderLeft:`3px solid ${isActive?"var(--gold)":"transparent"}`, transition:"all 0.15s" }}>
                    {/* Image */}
                    <div style={{ width:200, flexShrink:0, overflow:"hidden", position:"relative", minHeight:160 }}>
                      <img src={SPACE_PHOTOS[space.id] || SPACE_PHOTOS["1"]} alt={space.name}
                        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease", transform:isActive?"scale(1.06)":"scale(1)" }} />
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />
                      {space.floor && (
                        <span style={{ position:"absolute", bottom:8, left:8, fontFamily:"'Inter',sans-serif", fontSize:9, color:"rgba(255,255,255,0.9)", background:"rgba(15,15,15,0.55)", padding:"2px 7px", letterSpacing:"0.08em" }}>Floor {space.floor}</span>
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ flex:1, padding:"20px 22px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:9, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)" }}>{space.type}</p>
                          <span style={{ display:"flex", alignItems:"center", gap:4, fontFamily:"'Inter',sans-serif", fontSize:10, color:availColor(space.availability) }}>
                            <span style={{ width:5, height:5, borderRadius:"50%", background:availColor(space.availability), flexShrink:0 }}/>{availLabel(space.availability)}
                          </span>
                        </div>
                        <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", fontWeight:400, color:"var(--text)", marginBottom:6, lineHeight:1.2 }}>{space.name}</h3>
                        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-2)", lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{space.description}</p>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12, paddingTop:10, borderTop:"1px solid var(--border)" }}>
                        <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1rem", color:"var(--gold)" }}>
                          ₫{space.price.toLocaleString()}<span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:"var(--text-3)" }}>/hr</span>
                        </span>
                        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:isActive?"var(--gold)":"var(--text-3)", transition:"color 0.15s" }}>View →</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign:"center", padding:"60px 24px", background:"#FFFFFF" }}>
                  <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:20, color:"var(--text)", marginBottom:8 }}>No spaces match</p>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", marginBottom:16 }}>Try relaxing your filters</p>
                  <button onClick={clearAll} style={{ background:"none", border:"1px solid var(--border)", padding:"8px 20px", fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text)", cursor:"pointer" }}>Clear all filters</button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: sticky map with overlaid search + filter */}
          <div style={{ position:"sticky", top:64, height:"calc(100vh - 64px)", background:"#EDE8DF", overflow:"hidden" }}>
            <HanoiMapWithPins
              activePin={activePin}
              onPin={id => { setActivePin(id); if(id) { const pin = PINS.find(p => p.id === id); setDistrictFilter(pin?.ids || null); } else { setDistrictFilter(null); } }}
              searchValue={searchValue}
              onSearch={setSearchValue}
              typeFilter={typeFilter}
              onToggleType={toggleType}
              onClear={clearAll}
              hasFilters={hasFilters}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              filterPanel={
                filterOpen ? (
                  <FilterPanel
                    capacity={filterCapacity} setCapacity={setFilterCapacity}
                    priceMax={filterPriceMax} setPriceMax={setFilterPriceMax}
                    amenities={filterAmenities} toggleAmen={a => setFilterAmenities(f=>f.includes(a)?f.filter(x=>x!==a):[...f,a])}
                    date={filterDate} setDate={setFilterDate}
                    leaseType={filterLeaseType} setLeaseType={setFilterLeaseType}
                    onApply={() => setFilterOpen(false)}
                    onClear={() => { setFilterCapacity(50); setFilterPriceMax(100000000); setFilterAmenities([]); setFilterDate(""); setFilterLeaseType(null); setFilterOpen(false); }}
                  />
                ) : null
              }
            />
          </div>
        </div>
      </div>
    </PageWrap>
  );
};

export default SpacesExplorer;
