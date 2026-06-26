import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap, Btn, Chip, Tag, Avatar, Field, AmenityIcon, Icon, PortalLayout, AuthLayout } from "../components/index.jsx";
import { useAuth, findDemoAccount, DEMO_ACCOUNTS } from "../context/AuthContext.jsx";
import { addLead } from "../data/leadsStore.js";
import { SPACES, GRADIENTS, SPACE_DETAILS, DEFAULT_SPACE_DETAIL, BOOKINGS_UPCOMING, BOOKINGS_PAST, BOOKINGS_CANCELLED, INVOICES, MONTHLY_SPEND, RECENT_ACTIVITY } from "../data/mockData.js";

// ─── Space Detail ──────────────────────────────────────────────────────────
const REVIEWS = [
  { name:"Minh Hoang", avatar:"MH", stars:5, date:"Jan 15, 2025", text:"Exceptional. The views and service are unlike anything else in Hanoi." },
  { name:"Jennifer Park", avatar:"JP", stars:5, date:"Jan 8, 2025", text:"Best coworking experience I've had anywhere in Southeast Asia." },
  { name:"Tran Van An", avatar:"TA", stars:4, date:"Dec 20, 2024", text:"Great facilities and professional staff. Highly recommended for client meetings." },
];
// ── SVG amenity icon definitions ──────────────────────────────────────────────
const AMENITY_ICONS = {
  "WiFi": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 18c4.1-4.1 9.7-6.7 15.5-6.7S31.5 13.9 35.5 18" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9.5 22.5c2.8-2.8 6.6-4.5 10.5-4.5s7.7 1.7 10.5 4.5" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 27c1.6-1.6 3.8-2.5 6-2.5s4.4.9 6 2.5" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="32" r="1.5" fill="#0F0F0F"/>
    </svg>
  ),
  "Coffee": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 10c0-2 2-2 2-4M20 10c0-2 2-2 2-4" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 16h18l-2 14H11L9 16z" stroke="#0F0F0F" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M27 18h3a3 3 0 0 1 0 6h-3" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="31" x2="33" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "Phone Booth": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 8c0 4 3 7 3 7l-4 4c0 0 4 10 14 14l4-4c0 0 3 3 7 3" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "Printing": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="18" width="18" height="12" rx="1" stroke="#0F0F0F" strokeWidth="1.5"/>
      <path d="M14 18v-6h12v6" stroke="#0F0F0F" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="14" y="24" width="12" height="6" stroke="#0F0F0F" strokeWidth="1.5"/>
      <line x1="14" y1="27" x2="26" y2="27" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="29" cy="22" r="1" fill="#0F0F0F"/>
    </svg>
  ),
  "Parking": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="13" stroke="#0F0F0F" strokeWidth="1.5"/>
      <path d="M16 13h6a4 4 0 0 1 0 8h-6V13z" stroke="#0F0F0F" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="16" y1="21" x2="16" y2="28" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "Reception": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 9v2M12 23h16M20 11a9 9 0 0 1 9 9H11a9 9 0 0 1 9-9z" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="8" y="23" width="24" height="3" rx="1" stroke="#0F0F0F" strokeWidth="1.5"/>
      <line x1="20" y1="26" x2="20" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="31" x2="26" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "A/V Setup": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="24" height="16" rx="1.5" stroke="#0F0F0F" strokeWidth="1.5"/>
      <line x1="16" y1="26" x2="14" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="24" y1="26" x2="26" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="31" x2="27" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="14" y="13" width="12" height="9" rx="0.5" stroke="#0F0F0F" strokeWidth="1.5"/>
    </svg>
  ),
  "Natural Light": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="6" stroke="#0F0F0F" strokeWidth="1.5"/>
      <line x1="20" y1="8" x2="20" y2="11" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="29" x2="20" y2="32" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="20" x2="11" y2="20" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="29" y1="20" x2="32" y2="20" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="11.5" y1="11.5" x2="13.6" y2="13.6" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26.4" y1="26.4" x2="28.5" y2="28.5" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="28.5" y1="11.5" x2="26.4" y2="13.6" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13.6" y1="26.4" x2="11.5" y2="28.5" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};
// Descriptions for each amenity icon card
const AMENITY_DESCS = {
  "WiFi":          "High-speed 1Gbps fibre throughout.",
  "Coffee":        "Specialty coffee bar, all day.",
  "Phone Booth":   "Private acoustic call booths.",
  "Printing":      "Colour printing and scanning.",
  "Parking":       "Secure on-site parking available.",
  "Reception":     "Dedicated reception and concierge.",
  "A/V Setup":     "4K displays and video conferencing.",
  "Natural Light": "Floor-to-ceiling windows throughout.",
};
const TIMES = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
const HR_TIERS = Array.from({length:24},(_,i)=>i<8||i>18?"off":i>=11&&i<=14?"peak":"std");

/* ── What We Offer — tabbed section (replaces reviews) ── */
const OFFER_TABS = [
  {
    id:"office", label:"HiLink Office",
    img:"/workspace-photos/7f697d83c67bd824c915269932304e1e50668dd0-1800x1200.avif",
    desc:"Private offices for teams of 2 to 50, ready to move into tomorrow on flexible terms, with the option to tailor the space to the unique needs of you and your team.",
    points:[
      "Ready-to-use private offices, bespoke design and furnishings available upon request",
      "Flexible licenses, 1-month minimum term, full floor occupancy available with option to scale",
      "24/7 access to your home workspace and business hours access across all HiLink floors",
      "Member discount and priority booking on meeting rooms across our collection",
    ],
    from:"₫45,000,000 /mo", link:"/membership/office",
  },
  {
    id:"roam", label:"HiLink Roam",
    img:"/workspace-photos/9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif",
    desc:"Flexible hot desk access across all our floors. Switch up your working days in an inspiring, uniquely designed workspace — pay only for the time you use.",
    points:[
      "Hot desk access across all three HiLink floors, any time during opening hours",
      "Pay as you go — by the hour, day, or month with no long-term commitment",
      "Book your preferred floor and zone in advance via the HiLink portal",
      "Full access to specialty coffee, phone booths, printing, and community events",
    ],
    from:"₫89,000 /hr", link:"/membership/roam",
  },
  {
    id:"virtual", label:"HiLink Virtual",
    img:"/workspace-photos/761e2d35fafc758157f6414d741bde04927cf465-6720x4480.avif",
    desc:"A prestigious Hanoi business address and professional services without the cost of a full office. Build a credible presence from anywhere in the world.",
    points:[
      "Register your business at our premium OBC 60 Lý Thái Tổ or 15 Tôn Thất Tùng address",
      "Mail handling, signing, and forwarding with email notifications",
      "Dedicated Hanoi business number with call forwarding",
      "5 physical day passes per month for meetings or focused work",
    ],
    from:"₫3,500,000 /mo", link:"/membership/virtual",
  },
  {
    id:"meeting", label:"Meeting rooms",
    img:"/workspace-photos/ad7f4d6f9e6ba26fc29098d62b6911062f900bf1-2048x1365.avif",
    desc:"Thoughtfully designed meeting rooms and boardrooms, all equipped with the latest technology to keep your session running smoothly.",
    points:[
      "Boardrooms and meeting rooms for 1 to 40 people across our floors",
      "85″ 4K displays, video conferencing bridge, and wireless presentation",
      "Acoustic treatment and natural light in every room",
      "Book by the hour through the portal — member rates available",
    ],
    from:"₫180,000 /hr", link:"/spaces/meeting-rooms",
  },
];

const WhatWeOffer = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("office");
  const active = OFFER_TABS.find(t=>t.id===tab) || OFFER_TABS[0];
  return (
    <div>
      <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.8rem", fontWeight:400, color:"var(--text)", marginBottom:24 }}>What we offer</h2>
      {/* Tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:"1px solid var(--border)", marginBottom:32, flexWrap:"wrap" }}>
        {OFFER_TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:"12px 20px", background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?"var(--text)":"transparent"}`, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:tab===t.id?600:400, color:tab===t.id?"var(--text)":"var(--text-3)", letterSpacing:"0.04em", transition:"all 0.2s", marginBottom:-1 }}>
            {t.label}
          </button>
        ))}
      </div>
      {/* Content — animated swap */}
      <AnimatePresence mode="wait">
        <motion.div key={active.id}
          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.32, ease:[0.22,1,0.36,1] }}
          style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>
          {/* Image */}
          <div style={{ overflow:"hidden", height:380 }}>
            <img src={active.img} alt={active.label} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
          </div>
          {/* Text */}
          <div>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:"var(--text)", lineHeight:1.6, marginBottom:28 }}>{active.desc}</p>
            <div style={{ marginBottom:28 }}>
              {active.points.map((p,i)=>(
                <div key={i} style={{ display:"flex", gap:12, marginBottom:16, alignItems:"flex-start" }}>
                  <span style={{ flexShrink:0, marginTop:1 }}><Icon name="check" size={18} stroke="var(--gold)" /></span>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)", lineHeight:1.6 }}>{p}</p>
                </div>
              ))}
            </div>
            <button onClick={()=>navigate(active.link)} className="hover-gold-line"
              style={{ background:"none", border:"none", padding:0, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)", marginBottom:32, display:"inline-block" }}>
              Discover {active.label} →
            </button>
            <div style={{ borderTop:"1px solid var(--border)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
              <div>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:6 }}>From</p>
                <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.6rem", fontWeight:400, color:"var(--text)" }}>{active.from}<span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}> per person</span></p>
              </div>
              <button onClick={()=>navigate(active.link)}
                style={{ padding:"13px 28px", background:"var(--gold)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", borderRadius:24, transition:"background 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--text)"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--gold)"}>
                Make an enquiry
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const space = SPACES.find(s=>s.id===id) || SPACES[0];
  const detail = SPACE_DETAILS[space.id] || DEFAULT_SPACE_DETAIL;

  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState("All");
  const [dur, setDur] = useState("Hourly");
  const [hrs, setHrs] = useState(2);
  const [time, setTime] = useState("09:00");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaseDur, setLeaseDur] = useState("3 months");
  const [booked, setBooked] = useState(false);
  const [enquired, setEnquired] = useState(false);

  const from = location.state?.from?.pathname || "/portal/dashboard";
  const images = detail.images;
  const manager = detail.manager;
  const travel = detail.travel;

  const unitPrice = dur==="Hourly" ? space.price : dur==="Daily" ? (space.pricePerDay||space.price*8) : (space.pricePerMonth||space.price*160);
  const total = unitPrice * (dur==="Hourly"?hrs:1);

  const TIMES = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
  const HR_TIERS = Array.from({length:24},(_,i)=>i<8||i>18?"off":i>=11&&i<=14?"peak":"std");

  // Demand data: value 0–1, label
  const DEMAND = [
    { day:"M", val:0.85 }, { day:"T", val:0.4 }, { day:"W", val:0.7 },
    { day:"T", val:0.9  }, { day:"F", val:0.6 }, { day:"S", val:0.2 }, { day:"S", val:0.1 },
  ];

  return (
    <PageWrap>
      <div className="pattern-soft-radial" style={{ paddingTop:64, minHeight:"100vh", background:"var(--bg)" }}>
        {/* Breadcrumb */}
        <div style={{ padding:"12px 48px", borderBottom:"1px solid var(--border)", background:"#FFFFFF", display:"flex", alignItems:"center", gap:8 }}>
          <Link to="/spaces" style={{ fontFamily:"'Inter', sans-serif", fontSize:12, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-3)", textDecoration:"none" }}>Spaces</Link>
          <span style={{ color:"var(--text-3)", fontSize:12 }}>/</span>
          <span style={{ fontFamily:"'Inter', sans-serif", fontSize:12, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-2)" }}>{space.name}</span>
        </div>

        {/* ── PHOTO GRID (Airbnb-style 4-up) ── */}
        <div style={{ background:"#FFFFFF", paddingBottom:0 }}>
          <div style={{ maxWidth:1400, margin:"0 auto", padding:"32px 48px 0" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"300px 200px", gap:4, overflow:"hidden" }}>
              {/* Hero image */}
              <div style={{ gridRow:"1 / 3", overflow:"hidden", cursor:"pointer", position:"relative" }} onClick={()=>setLightbox(true)}>
                <img src={images[0]} alt={space.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(15,15,15,0.2),transparent)", pointerEvents:"none" }} />
              </div>
              {/* Right top */}
              <div style={{ overflow:"hidden", cursor:"pointer" }} onClick={()=>{ setActiveImg(1); setLightbox(true); }}>
                <img src={images[1]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
              </div>
              {/* Right bottom — split into 2 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, overflow:"hidden" }}>
                {images.slice(2,4).map((img,i) => (
                  <div key={i} style={{ overflow:"hidden", cursor:"pointer", position:"relative" }} onClick={()=>{ setActiveImg(i+2); setLightbox(true); }}>
                    <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}
                      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                    {i===1 && (
                      <div style={{ position:"absolute", inset:0, background:"rgba(15,15,15,0.35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"#FFFFFF" }}>+{images.length-4} photos</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={()=>setLightbox(true)}
              style={{ marginTop:12, background:"none", border:"none", fontFamily:"'Inter', sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text)", borderBottom:"1px solid var(--text)", cursor:"pointer", paddingBottom:1 }}>
              Show all {images.length} photos
            </button>
          </div>
        </div>

        {/* Lightbox — categorized gallery */}
        {lightbox && (() => {
          // Photo categories
          const PHOTO_CATS = [
            { label:"First impressions", desc:"This distinctive workspace is designed to empower your unique workstyle.", imgs: images.slice(0,2).concat(images[2]?[images[2]]:[]) },
            { label:"Step inside",       desc:"Access premium amenities and create your own work-life harmony.", imgs: images.slice(1,3).concat(images[3]?[images[3]]:[]) },
            { label:"Choose your spot",  desc:"An open, communal area where you can catch up on emails, welcome your guests or grab a coffee.", imgs: [images[0],images[2]||images[0],images[1],images[3]||images[1]] },
          ];
          const ALL_CATS = [{ label:"All", desc:"", imgs:images }, ...PHOTO_CATS];
          const activeCat = ALL_CATS.find(c=>c.label===galleryCategory) || ALL_CATS[0];

          return (
            <div style={{ position:"fixed", inset:0, background:"#FFFFFF", zIndex:1000, display:"flex", overflowY:"auto" }} onClick={()=>setLightbox(false)}>
              {/* Left sidebar — categories */}
              <div style={{ width:260, flexShrink:0, background:"var(--bg-2)", borderRight:"1px solid var(--border)", padding:"32px 0", position:"sticky", top:0, height:"100vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
                <div style={{ padding:"0 24px 24px", borderBottom:"1px solid var(--border)", marginBottom:16 }}>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Gallery</p>
                  <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", fontWeight:400, color:"var(--text)" }}>{space.name}</h3>
                </div>
                {ALL_CATS.map(cat => (
                  <button key={cat.label} onClick={()=>setGalleryCategory(cat.label)}
                    style={{ width:"100%", textAlign:"left", padding:"12px 24px", background:galleryCategory===cat.label?"rgba(168,143,92,0.08)":"transparent", border:"none", borderLeft:`3px solid ${galleryCategory===cat.label?"var(--gold)":"transparent"}`, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13, color:galleryCategory===cat.label?"var(--gold)":"var(--text-2)", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"all 0.12s" }}>
                    {cat.label}
                    <span style={{ fontSize:11, color:"var(--text-3)" }}>{cat.imgs.length}</span>
                  </button>
                ))}
                <div style={{ padding:"24px", borderTop:"1px solid var(--border)", marginTop:16 }}>
                  <button onClick={()=>setLightbox(false)} style={{ width:"100%", padding:"10px", background:"var(--text)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:"pointer", letterSpacing:"0.1em", textTransform:"uppercase" }}>Close ×</button>
                </div>
              </div>

              {/* Right — photo grid */}
              <div style={{ flex:1, padding:"48px 56px", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
                <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:400, color:"var(--text)", marginBottom:10 }}>{activeCat.label}</h2>
                {activeCat.desc && <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-3)", marginBottom:32, maxWidth:600, lineHeight:1.7 }}>{activeCat.desc}</p>}
                {/* 2-column masonry grid */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {activeCat.imgs.map((img, i) => (
                    <div key={i} style={{ overflow:"hidden", cursor:"zoom-in", position:"relative" }}
                      onClick={()=>setActiveImg(i)}>
                      <img src={img} alt="" style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", display:"block", transition:"transform 0.5s ease" }}
                        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── MAIN CONTENT ── */}
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"48px 48px", display:"grid", gridTemplateColumns:"1fr 360px", gap:48, alignItems:"start" }}>
          {/* LEFT */}
          <div>
            {/* Title block */}
            <div style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)" }}>
              <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                <span style={{ fontFamily:"'Inter', sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)" }}>{space.type}</span>
                {space.floor && <span style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", letterSpacing:"0.1em" }}>· Floor {space.floor}</span>}
                <span style={{ fontFamily:"'Inter', sans-serif", fontSize:10, letterSpacing:"0.1em", color: space.availability==="available"?"var(--success)":space.availability==="limited"?"var(--warning)":"var(--danger)" }}>
                  · {space.availability.charAt(0).toUpperCase()+space.availability.slice(1)}
                </span>
              </div>
              <h1 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight:400, color:"var(--text)", marginBottom:16, lineHeight:1.1 }}>{space.name}</h1>
              <p style={{ fontFamily:"'Inter', sans-serif", fontSize:15, color:"var(--text-2)", lineHeight:1.8 }}>{space.description}</p>
            </div>

            {/* Amenities — SVG line icon cards */}
            <div style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)" }}>
              <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.4rem", fontWeight:400, color:"var(--text)", marginBottom:24 }}>Amenities</h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                {Object.entries(AMENITY_ICONS).map(([name, icon]) => {
                  const active = space.amenities.includes(name);
                  return (
                    <div key={name} className={active ? "hover-lift" : ""} style={{ background:"#FFFFFF", border:"1px solid var(--border)", borderRadius:8, padding:28, display:"flex", flexDirection:"column", alignItems:"center", gap:16, opacity: active?1:0.3, transition:"opacity 0.2s" }}>
                      {icon}
                      <p style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"var(--text-2)", lineHeight:1.55, textAlign:"center", margin:0 }}>{AMENITY_DESCS[name]}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── TRAVEL LINKS (with mini-map) ── */}
            <div style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, alignItems:"center" }}>
                {/* Left: SVG mini-map */}
                <div style={{ overflow:"hidden", height:340, position:"relative", border:"1px solid var(--border)" }}>
                  <svg viewBox="0 0 500 340" style={{ width:"100%", height:"100%", display:"block" }} xmlns="http://www.w3.org/2000/svg">
                    <rect width="500" height="340" fill="#EDE8DF"/>
                    {/* Water */}
                    <ellipse cx="360" cy="130" rx="70" ry="44" fill="#C5D9E8" stroke="#A8C4D8" strokeWidth="1"/>
                    <text x="360" y="134" textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize="9" fill="#6A95AF" letterSpacing="0.06em">HOÀN KIẾM LAKE</text>
                    {/* Roads */}
                    <line x1="0" y1="180" x2="500" y2="180" stroke="#D8D0C0" strokeWidth="11" strokeLinecap="round"/>
                    <line x1="180" y1="0" x2="180" y2="340" stroke="#D8D0C0" strokeWidth="8" strokeLinecap="round"/>
                    <line x1="300" y1="0" x2="300" y2="340" stroke="#D8D0C0" strokeWidth="6"/>
                    <line x1="0" y1="250" x2="500" y2="250" stroke="#E2DAC8" strokeWidth="4"/>
                    <line x1="0" y1="90" x2="500" y2="90" stroke="#E2DAC8" strokeWidth="3"/>
                    <line x1="420" y1="0" x2="420" y2="340" stroke="#E2DAC8" strokeWidth="3"/>
                    {/* Road labels */}
                    <text x="60" y="172" fontFamily="'Inter',sans-serif" fontSize="8" fill="#9A907A" letterSpacing="0.08em">HÀNG BÔNG</text>
                    <text x="190" y="280" fontFamily="'Inter',sans-serif" fontSize="8" fill="#9A907A" letterSpacing="0.08em">OLD QUARTER</text>
                    {/* Location pin (HiLink) */}
                    <g transform="translate(180,180)">
                      <ellipse cx="0" cy="30" rx="9" ry="3.5" fill="rgba(0,0,0,0.14)"/>
                      <path d="M0,-30 C12,-30 20,-19 20,-10 C20,3 7,16 0,30 C-7,16 -20,3 -20,-10 C-20,-19 -12,-30 0,-30 Z" fill="var(--gold)"/>
                      <circle cx="0" cy="-9" r="7" fill="rgba(255,255,255,0.92)"/>
                      <text x="0" y="-5.5" textAnchor="middle" fontFamily="'Playfair Display',Georgia,serif" fontSize="9" fontWeight="700" fill="var(--gold)">H</text>
                      <g transform="translate(26,-16)">
                        <rect x="0" y="-11" width="62" height="20" rx="2" fill="#1C1710"/>
                        <text x="8" y="3" fontFamily="'Inter',sans-serif" fontSize="9" fontWeight="600" fill="#F8F6F1" letterSpacing="0.06em">HiLink</text>
                      </g>
                    </g>
                    {/* Compass */}
                    <g transform="translate(468,28)">
                      <circle r="16" fill="rgba(248,246,241,0.9)" stroke="#D8D0C0" strokeWidth="1"/>
                      <text x="0" y="-3" textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize="8" fontWeight="700" fill="#0F0F0F">N</text>
                      <polygon points="0,-13 2,-6 -2,-6" fill="var(--gold)"/>
                    </g>
                  </svg>
                </div>
                {/* Right: travel info */}
                <div style={{ padding:"0 48px" }}>
                  <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.8rem", fontWeight:400, color:"var(--text)", marginBottom:32 }}>Travel links</h2>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:"var(--text-3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>Getting here</p>
                  <div style={{ borderTop:"1px solid var(--border)" }}>
                    {travel.map((t,i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
                        <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text)" }}>{t.label}</span>
                        <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:"var(--text-3)", letterSpacing:"0.08em" }}>{t.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── ON-SITE SUPPORT (Image 3 style) ── */}
            <div style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)", background:"var(--bg-2)", padding:"40px", margin:"0 0 40px" }}>
              <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.8rem", fontWeight:400, color:"var(--text)", marginBottom:8 }}>On-site support</h2>
              <p style={{ fontFamily:"'Inter', sans-serif", fontSize:14, color:"var(--text-3)", letterSpacing:"0.06em", marginBottom:28, fontVariantNumeric:"tabular-nums" }}>
                {manager.hours}
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                {/* Avatar circle */}
                <div style={{ width:64, height:64, borderRadius:"50%", background:"var(--bg-3)", border:"1.5px solid var(--border-gold)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:20, fontWeight:400, color:"var(--gold)" }}>{manager.avatar}</span>
                </div>
                <div>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:6 }}>{manager.role}</p>
                  <p style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.1rem", fontWeight:400, color:"var(--text)", marginBottom:4, letterSpacing:"0.04em" }}>{manager.name.toUpperCase()}</p>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"var(--text-2)" }}>{manager.phone}</p>
                </div>
              </div>
            </div>

            {/* ── WHAT WE OFFER (tabbed section) ── */}
            <WhatWeOffer />
          </div>

          {/* RIGHT — sticky booking panel */}
          <div style={{ position:"sticky", top:80 }}>
            <div style={{ background:"#FFFFFF", border:"1px solid var(--border)", padding:"32px", boxShadow:"0 4px 32px rgba(15,15,15,0.08)" }}>
              {/* Price */}
              <div style={{ marginBottom:20, paddingBottom:20, borderBottom:"1px solid var(--border)" }}>
                <p style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.14em" }}>Starting from</p>
                <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                  <span style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:42, fontWeight:400, color:"var(--gold)" }}>₫{space.price.toLocaleString()}</span>
                  <span style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"var(--text-3)" }}>/hr</span>
                </div>
              </div>

              {/* Duration tabs */}
              <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:20 }}>
                {["Hourly","Daily","Monthly"].map(d=>(
                  <button key={d} onClick={()=>setDur(d)} style={{ flex:1, padding:"10px 0", border:"none", borderBottom:`2px solid ${dur===d?"var(--gold)":"transparent"}`, cursor:"pointer", fontFamily:"'Inter', sans-serif", fontSize:11, fontWeight:dur===d?600:400, letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", color:dur===d?"var(--gold)":"var(--text-3)", transition:"all 0.15s", marginBottom:-1 }}>{d}</button>
                ))}
              </div>

              {/* Date */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.14em" }}>{dur === "Monthly" ? "Lease start date" : "Date"}</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter', sans-serif", fontSize:14, outline:"none" }} />
              </div>

              {/* Lease Duration — only for Monthly */}
              <AnimatePresence>
                {dur === "Monthly" && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }} style={{ overflow:"hidden" }}>
                    <div style={{ marginBottom:16 }}>
                      <label style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.14em" }}>Lease duration</label>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:4 }}>
                        {["1 month","3 months","6 months","12 months","24 months","Custom"].map(l=>(
                          <button key={l} onClick={()=>setLeaseDur(l)} style={{ padding:"7px 4px", border:`1px solid ${leaseDur===l?"var(--border-gold)":"var(--border)"}`, cursor:"pointer", fontSize:10, fontFamily:"'Inter', sans-serif", background:leaseDur===l?"rgba(168,143,92,0.10)":"transparent", color:leaseDur===l?"var(--gold)":"var(--text-3)", transition:"all 0.12s" }}>{l}</button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Number of desks — Daily/Monthly */}
              <AnimatePresence>
                {(dur === "Daily" || dur === "Monthly") && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }} style={{ overflow:"hidden" }}>
                    <div style={{ marginBottom:16 }}>
                      <label style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.14em" }}>Number of desks / offices</label>
                      <input type="number" min={1} max={space.capacity||50} value={hrs} onChange={e=>setHrs(Math.max(1,+e.target.value))}
                        style={{ width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter', sans-serif", fontSize:14, outline:"none" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Time slots */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", display:"block", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.14em" }}>Start time</label>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4 }}>
                  {TIMES.map(t=>(
                    <button key={t} onClick={()=>setTime(t)} style={{ padding:"7px 4px", border:`1px solid ${time===t?"var(--border-gold)":"var(--border)"}`, cursor:"pointer", fontSize:11, fontFamily:"'Inter', sans-serif", background:time===t?"rgba(168,143,92,0.10)":"transparent", color:time===t?"var(--gold)":"var(--text-3)", transition:"all 0.12s" }}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Hours */}
              {dur==="Hourly" && (
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.14em" }}>Duration (hours)</label>
                  <input type="number" min={1} max={8} value={hrs} onChange={e=>setHrs(Math.max(1,+e.target.value))}
                    style={{ width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter', sans-serif", fontSize:14, outline:"none" }} />
                </div>
              )}

              {/* Total */}
              <div style={{ background:"rgba(168,143,92,0.06)", border:"1px solid var(--border-gold)", padding:"16px", marginBottom:20 }}>
                <p style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.14em" }}>Estimated total</p>
                <p style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:"var(--text-2)", marginBottom:4 }}>
                  {dur==="Hourly" ? `${hrs} hr × ₫${unitPrice.toLocaleString()}` : "Flat rate"}
                </p>
                <p style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:30, fontWeight:400, color:"var(--gold)" }}>₫{total.toLocaleString()}</p>
              </div>

              {/* Book via payment OR enquiry */}
              {booked ? (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  style={{ background:"rgba(45,106,79,0.08)", border:"1px solid rgba(45,106,79,0.25)", padding:"20px", textAlign:"center" }}>
                  <p style={{ fontSize:20, marginBottom:8 }}>✓</p>
                  <p style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:15, color:"var(--text)", marginBottom:6 }}>Booking confirmed &amp; paid!</p>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:"var(--text-3)", marginBottom:12 }}>
                    {space.name} · {date} · {dur === "Monthly" ? leaseDur : time} · ₫{total.toLocaleString()}
                  </p>
                  <Link to="/portal/bookings" style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:"var(--gold)", borderBottom:"1px solid var(--gold)", paddingBottom:1, textDecoration:"none" }}>
                    View in My Bookings →
                  </Link>
                </motion.div>
              ) : enquired ? (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  style={{ background:"rgba(168,143,92,0.10)", border:"1px solid var(--border-gold)", padding:"20px", textAlign:"center" }}>
                  <p style={{ fontSize:20, marginBottom:8 }}>✉</p>
                  <p style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:15, color:"var(--text)", marginBottom:6 }}>Enquiry sent!</p>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:"var(--text-3)" }}>
                    Our team will contact you about {space.name} shortly — no payment taken.
                  </p>
                </motion.div>
              ) : (
                <div style={{ display:"grid", gap:10 }}>
                  <button onClick={() => { if (isAuthenticated) setBooked(true); else navigate("/login", { state:{ from:`/spaces/${space.id}`, intent:"payment" } }); }}
                    style={{ width:"100%", padding:"14px", background:"var(--text)", color:"#FFFFFF", border:"none", fontFamily:"'Inter', sans-serif", fontSize:13, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--gold)"}
                    onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
                    Book &amp; pay · ₫{total.toLocaleString()} →
                  </button>
                  <button onClick={() => {
                      addLead({
                        name: user?.name || "Website visitor",
                        email: user?.email || "",
                        source: "Website form",
                        interest: `${space.name} · ${space.type}`,
                      });
                      setEnquired(true);
                    }}
                    style={{ width:"100%", padding:"13px", background:"transparent", color:"var(--text)", border:"1px solid var(--text)", fontFamily:"'Inter', sans-serif", fontSize:13, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--gold)"; e.currentTarget.style.color="var(--gold)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--text)"; e.currentTarget.style.color="var(--text)"; }}>
                    Make an enquiry →
                  </button>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:"var(--text-3)", textAlign:"center", lineHeight:1.5 }}>
                    Pay now to confirm instantly, or enquire and our team will follow up — no payment taken.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrap>
  );
};


// ─── Login ─────────────────────────────────────────────────────────────────
export const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState({});
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const from = location.state?.from?.pathname || "/portal/dashboard";

  const submit = () => {
    const e={};
    if(!email||!email.includes("@")) e.email="Enter a valid email";
    if(!pass) e.pass="Password is required";
    setErrors(e);
    if(!Object.keys(e).length) {
      // exact demo-credential match wins; otherwise admin@/ops@ emails get the ops portal
      const acct = findDemoAccount(email, pass);
      const isAdminEmail = acct ? acct.role === "admin" : /^(admin|ops)@/i.test(email.trim());
      login({ email, name: acct?.name || email.split("@")[0], role: isAdminEmail ? "admin" : "member" });
      navigate(isAdminEmail ? "/admin" : from, { replace: true });
    }
  };

  // one-tap demo sign-ins (mock data — no real auth)
  const demoLogin = (role) => {
    if (role === "admin") { login({ email:"admin@hilink.vn", name:"Operations", role:"admin" }); navigate("/admin", { replace:true }); }
    else { login({ email:"member@hilink.vn", name:"Nguyen Thanh", role:"member" }); navigate("/portal/dashboard", { replace:true }); }
  };

  if(forgotMode) return (
    <AuthLayout title="Reset password" subtitle="We'll email you a recovery link">
      {forgotSent ? (
        <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} style={{textAlign:"center",padding:"32px 0"}}>
          <div style={{fontSize:48,marginBottom:16}}>✉️</div>
          <h3 style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:20,color:"var(--text)",marginBottom:8}}>Check your inbox</h3>
          <p style={{fontFamily:"Inter",fontSize:14,color:"var(--text-2)",marginBottom:24}}>Sent to <strong>{forgotEmail}</strong></p>
          <Btn variant="ghost" onClick={()=>{setForgotMode(false);setForgotSent(false);}}>← Back to sign in</Btn>
        </motion.div>
      ) : (
        <>
          <Field label="Email" type="email" value={forgotEmail} onChange={setForgotEmail} error={errors.forgot} placeholder="you@company.com" />
          <Btn full onClick={()=>{ if(forgotEmail.includes("@")) setForgotSent(true); else setErrors({forgot:"Enter valid email"});}}>Send recovery link</Btn>
          <div style={{textAlign:"center",marginTop:16}}>
            <button onClick={()=>setForgotMode(false)} style={{background:"none",border:"none",color:"var(--text-3)",cursor:"pointer",fontFamily:"Inter",fontSize:13}}>← Back to sign in</button>
          </div>
        </>
      )}
    </AuthLayout>
  );

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your HiLink account">
      <Field label="Email" type="email" value={email} onChange={setEmail} error={errors.email} placeholder="you@company.com" success={email.includes("@")&&!errors.email} />
      <Field label="Password" type="password" value={pass} onChange={setPass} error={errors.pass} placeholder="••••••••" />
      <div style={{textAlign:"right",marginTop:-10,marginBottom:20}}>
        <button onClick={()=>setForgotMode(true)} style={{background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontFamily:"Inter",fontSize:12}}>Forgot password?</button>
      </div>
      <Btn full size="lg" onClick={submit}>Sign in</Btn>
      <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0"}}>
        <div style={{flex:1,height:1,background:"var(--border)"}} />
        <span style={{color:"var(--text-3)",fontSize:12,fontFamily:"Inter"}}>or</span>
        <div style={{flex:1,height:1,background:"var(--border)"}} />
      </div>
      <Btn full variant="secondary" onClick={()=>navigate("/portal/dashboard")}>
        <svg width="16" height="16" viewBox="0 0 24 24" style={{marginRight:8}}>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </Btn>
      <div style={{marginTop:18,padding:"12px 14px",border:"1px dashed var(--border)",background:"var(--surface)"}}>
        <p style={{fontFamily:"Inter",fontSize:11,color:"var(--text-3)",textAlign:"center",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.1em"}}>Demo access</p>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <Btn full size="sm" variant="ghost" onClick={()=>demoLogin("member")}>Member portal</Btn>
          <Btn full size="sm" variant="ghost-gold" onClick={()=>demoLogin("admin")}>Operations portal</Btn>
        </div>
        {DEMO_ACCOUNTS.map(a=>(
          <p key={a.email} style={{fontFamily:"Inter",fontSize:11,color:"var(--text-3)",display:"flex",justifyContent:"space-between"}}>
            <span style={{textTransform:"capitalize",color:"var(--text-2)"}}>{a.role}</span>
            <span>{a.email} · {a.password}</span>
          </p>
        ))}
      </div>
      <p style={{textAlign:"center",marginTop:20,fontFamily:"Inter",fontSize:13,color:"var(--text-3)"}}>
        No account? <Link to="/register" style={{color:"var(--gold)",textDecoration:"none",fontWeight:600}}>Create one free</Link>
      </p>
    </AuthLayout>
  );
};

// ─── Register ───────────────────────────────────────────────────────────────
export const RegisterScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [f, setF] = useState({name:"",email:"",phone:"",pass:"",company:""});
  const [errors, setErrors] = useState({});
  const set = k => v => setF(prev=>({...prev,[k]:v}));
  const submit = () => {
    const e={};
    if(!f.name) e.name="Required";
    if(!f.email.includes("@")) e.email="Enter valid email";
    if(f.phone.length<9) e.phone="Enter valid phone";
    if(f.pass.length<8) e.pass="Min 8 characters";
    setErrors(e);
    if(!Object.keys(e).length) {
      login({ email: f.email, name: f.name });
      navigate("/portal/dashboard", { replace: true });
    }
  };
  return (
    <AuthLayout title="Create account" subtitle="Start with a free membership — upgrade anytime.">
      <Field label="Full name" value={f.name} onChange={set("name")} error={errors.name} placeholder="Nguyen Van A" success={f.name.length>2} />
      <Field label="Email" type="email" value={f.email} onChange={set("email")} error={errors.email} placeholder="you@company.com" success={f.email.includes("@")} />
      <Field label="Phone" value={f.phone} onChange={set("phone")} error={errors.phone} placeholder="+84 901 234 567" />
      <Field label="Password" type="password" value={f.pass} onChange={set("pass")} error={errors.pass} placeholder="Min. 8 characters" />
      <Field label="Company" value={f.company} onChange={set("company")} optional placeholder="Your company" />
      <Btn full size="lg" onClick={submit}>Create account</Btn>
      <p style={{textAlign:"center",marginTop:16,fontFamily:"Inter",fontSize:13,color:"var(--text-3)"}}>
        Have an account? <Link to="/login" style={{color:"var(--gold)",textDecoration:"none",fontWeight:600}}>Sign in</Link>
      </p>
    </AuthLayout>
  );
};

// ─── Dashboard ──────────────────────────────────────────────────────────────
export const Dashboard = () => {
  const [secs, setSecs] = useState(84*60);
  const [qType, setQType] = useState("Hot Desk");
  const [qDate, setQDate] = useState(new Date().toISOString().split('T')[0]);
  useEffect(()=>{ const t=setInterval(()=>setSecs(s=>Math.max(0,s-1)),1000); return()=>clearInterval(t); },[]);
  const mm = String(Math.floor(secs/60)).padStart(2,"0");
  const ss = String(secs%60).padStart(2,"0");
  const maxSpend = Math.max(...MONTHLY_SPEND.map(m=>m.amount));

  const activityIcons = { calendar:"📅", receipt:"🧾", check:"✅", refresh:"🔄", dollar:"💰" };

  return (
    <PortalLayout>
      <PageWrap>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div>
            <p style={{fontFamily:"Inter",fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",marginBottom:6}}>Portal</p>
            <h1 style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:"clamp(22px,3vw,30px)",fontWeight:700,color:"var(--text)",marginBottom:4}}>Good morning, Nguyen Thanh 👋</h1>
            <p style={{fontFamily:"Inter",fontSize:13,color:"var(--text-3)"}}>Monday, January 27, 2025</p>
          </div>
          <Link to="/spaces"><Btn>+ New booking</Btn></Link>
        </div>

        {/* Active booking */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} style={{background:"rgba(168,143,92,0.06)",border:"1px solid var(--border-gold)",borderRadius:0,padding:"22px 26px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:44,height:44,borderRadius:0,background:"rgba(168,143,92,0.08)",border:"1px solid var(--border-gold)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏢</div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                <span className="pulse" style={{width:6,height:6,borderRadius:"50%",background:"var(--success)",display:"inline-block"}} />
                <span style={{fontFamily:"Inter",fontSize:11,fontWeight:600,color:"var(--success)",letterSpacing:"0.08em",textTransform:"uppercase"}}>Active now</span>
              </div>
              <p style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:18,fontWeight:600,color:"var(--text)",margin:0}}>Meeting Room A3</p>
              <p style={{fontFamily:"Inter",fontSize:12,color:"var(--text-3)"}}>Floor 14 · 09:00 – 11:00 · Jan 27</p>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <div style={{textAlign:"center"}}>
              <p style={{fontFamily:"Inter",fontSize:11,color:"var(--text-3)",marginBottom:2}}>Ends in</p>
              <span style={{fontFamily:"'Inter', sans-serif",fontSize:28,fontWeight:500,color:"var(--text)"}}>{mm}:{ss}</span>
            </div>
            <Btn size="sm" variant="ghost-gold">✓ Check in</Btn>
          </div>
        </motion.div>

        {/* 3 stat cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginBottom:20}}>
          {/* Plan */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.08}} style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:0,padding:"20px 22px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <p style={{fontFamily:"Inter",fontSize:12,color:"var(--text-3)"}}>My Plan</p>
              <Tag color="gold">Pro Member</Tag>
            </div>
            <p style={{fontFamily:"Inter",fontSize:12,color:"var(--text-3)",marginBottom:10}}>18/20 days used · Renews Jun 15</p>
            <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
              <div style={{height:4,width:"90%",background:"var(--gold)",borderRadius:2}} />
            </div>
          </motion.div>

          {/* Quick book */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.12}} style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:0,padding:"20px 22px"}}>
            <p style={{fontFamily:"Inter",fontSize:12,color:"var(--text-3)",marginBottom:12}}>Quick Book</p>
            <select value={qType} onChange={e=>setQType(e.target.value)} style={{width:"100%",padding:"8px 10px",background:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",borderRadius:0,color:"var(--text)",fontFamily:"Inter",fontSize:13,marginBottom:8,outline:"none"}}>
              {["Hot Desk","Private Office","Meeting Room"].map(t=><option key={t} value={t} style={{background:"#FFFFFF"}}>{t}</option>)}
            </select>
            <input type="date" value={qDate} onChange={e=>setQDate(e.target.value)} style={{width:"100%",padding:"8px 10px",background:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",borderRadius:0,color:"var(--text)",fontFamily:"Inter",fontSize:13,marginBottom:10,outline:"none"}} />
            <Link to="/spaces"><Btn full size="sm">Find available →</Btn></Link>
          </motion.div>

          {/* Spend */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.16}} style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:0,padding:"20px 22px"}}>
            <p style={{fontFamily:"Inter",fontSize:12,color:"var(--text-3)",marginBottom:8}}>Spend this month</p>
            <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:6}}>
              <span style={{fontFamily:"'Inter', sans-serif",fontSize:26,fontWeight:500,color:"var(--text)"}}>₫4.2M</span>
              <Tag color="success">↑ 12%</Tag>
            </div>
            <p style={{fontFamily:"Inter",fontSize:12,color:"var(--text-3)"}}>vs ₫3.75M last month</p>
          </motion.div>
        </div>

        {/* Activity + Chart */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2}} style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:0,padding:"22px"}}>
            <p style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:16,fontWeight:600,color:"var(--text)",marginBottom:18}}>Recent activity</p>
            {RECENT_ACTIVITY.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,paddingBottom:14,marginBottom:14,borderBottom:i<RECENT_ACTIVITY.length-1?"1px solid var(--border)":"none"}}>
                <div style={{width:32,height:32,borderRadius:0,background:"var(--bg-3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{activityIcons[a.icon]}</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontFamily:"Inter",fontSize:13,color:"var(--text)",marginBottom:2,fontWeight:500}}>{a.text}</p>
                  <p style={{fontFamily:"Inter",fontSize:11,color:"var(--text-3)"}}>{a.sub}</p>
                </div>
                <span style={{fontFamily:"Inter",fontSize:11,color:"var(--text-3)",flexShrink:0}}>{a.time}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.24}} style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:0,padding:"22px"}}>
            <p style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:16,fontWeight:600,color:"var(--text)",marginBottom:18}}>Monthly spend</p>
            <div style={{display:"flex",alignItems:"flex-end",gap:10,height:120,justifyContent:"center"}}>
              {MONTHLY_SPEND.map((m,i)=>{
                const active=i===MONTHLY_SPEND.length-1;
                return (
                  <div key={m.month} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flex:1}}>
                    {active && <span style={{fontFamily:"'Inter', sans-serif",fontSize:9,color:"var(--gold)"}}>{(m.amount/1000000).toFixed(1)}M</span>}
                    <div style={{width:"100%",height:Math.round((m.amount/maxSpend)*100),background:active?"var(--gold)":"rgba(15,15,15,0.08)",borderRadius:0,transition:"height 0.4s ease",border:active?"none":"1px solid rgba(15,15,15,0.10)"}} title={`₫${m.amount.toLocaleString()}`} />
                    <span style={{fontFamily:"Inter",fontSize:10,color:active?"var(--gold)":"var(--text-3)",fontWeight:active?600:400}}>{m.month}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </PageWrap>
    </PortalLayout>
  );
};

// ─── My Bookings ────────────────────────────────────────────────────────────
export const MyBookings = () => {
  const [tab, setTab] = useState("Upcoming");
  const [upcoming, setUpcoming] = useState(BOOKINGS_UPCOMING);
  const data = { Upcoming:upcoming, Past:BOOKINGS_PAST, Cancelled:BOOKINGS_CANCELLED };

  const BCard = ({b,type}) => (
    <motion.div layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:0,padding:"18px 22px",marginBottom:10,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",transition:"border-color 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border-gold)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
      <div style={{width:72,height:56,borderRadius:0,background:GRADIENTS[0],flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏢</div>
      <div style={{flex:1,minWidth:0}}>
        <p style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:3}}>{b.room}</p>
        <p style={{fontFamily:"Inter",fontSize:12,color:"var(--text-3)"}}>{b.floor?`Floor ${b.floor} · `:""}  {b.date} · {b.time} · {b.duration}</p>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span style={{fontFamily:"'Inter', sans-serif",fontSize:15,fontWeight:500,color:"var(--text)"}}>₫{b.price.toLocaleString()}</span>
        <Chip status={b.status} />
        {type==="upcoming" && (
          <div style={{display:"flex",gap:6}}>
            <Btn size="sm" variant="ghost">Edit</Btn>
            <Btn size="sm" variant="danger" onClick={()=>setUpcoming(prev=>prev.filter(x=>x.id!==b.id))}>Cancel</Btn>
          </div>
        )}
        {type==="past" && <Btn size="sm" variant="ghost-gold">Rebook</Btn>}
      </div>
    </motion.div>
  );

  return (
    <PortalLayout>
      <PageWrap>
        <div style={{marginBottom:32}}>
          <h1 style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:"clamp(22px,3vw,28px)",fontWeight:700,color:"var(--text)",marginBottom:4}}>My Bookings</h1>
          <p style={{fontFamily:"Inter",fontSize:13,color:"var(--text-3)"}}>Manage your workspace reservations</p>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid var(--border)",marginBottom:24,gap:4}}>
          {["Upcoming","Past","Cancelled"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 20px",background:"none",border:"none",cursor:"pointer",fontFamily:"Inter",fontSize:13,fontWeight:tab===t?600:400,color:tab===t?"var(--text)":"var(--text-3)",borderBottom:`2px solid ${tab===t?"var(--gold)":"transparent"}`,marginBottom:-1,transition:"all 0.15s",display:"flex",alignItems:"center",gap:6}}>
              {t}
              <span style={{background:"rgba(255,255,255,0.06)",color:"var(--text-3)",fontSize:11,padding:"1px 7px",borderRadius:10}}>{data[t].length}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {data[tab].length===0 ? (
            <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{textAlign:"center",padding:"80px 24px"}}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{margin:"0 auto 16px",display:"block"}}>
                <rect x="8" y="16" width="48" height="40" rx="4" stroke="rgba(168,143,92,0.3)" strokeWidth="1.5" fill="none"/>
                <path d="M20 16V10M44 16V10" stroke="rgba(168,143,92,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 28h48" stroke="rgba(168,143,92,0.2)" strokeWidth="1"/>
                <path d="M24 42l8-8 8 8M32 34v10" stroke="rgba(168,143,92,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:18,color:"var(--text)",marginBottom:8}}>No bookings here</p>
              <p style={{fontFamily:"Inter",fontSize:13,color:"var(--text-3)",marginBottom:24}}>Ready to book your next space?</p>
              <Link to="/spaces" style={{color:"var(--gold)",fontFamily:"Inter",fontWeight:600,fontSize:14,textDecoration:"none"}}>Browse spaces →</Link>
            </motion.div>
          ) : (
            <motion.div key={tab} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              {data[tab].map(b=><BCard key={b.id} b={b} type={tab.toLowerCase()} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </PageWrap>
    </PortalLayout>
  );
};

// ─── Invoices ───────────────────────────────────────────────────────────────
export const Invoices = () => {
  const [sf, setSf] = useState("All");
  const [modal, setModal] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const filtered = INVOICES.filter(i => {
    if (sf !== "All" && i.status !== sf) return false;
    if (dateFrom && i.date && i.date < dateFrom) return false;
    if (dateTo && i.date && i.date > dateTo) return false;
    return true;
  });
  const totalMTD = INVOICES.reduce((s,i)=>s+i.amount,0);
  const outstanding = INVOICES.filter(i=>i.status==="Pending"||i.status==="Overdue").reduce((s,i)=>s+i.amount,0);

  return (
    <PortalLayout>
      <PageWrap>
        <div style={{marginBottom:32}}>
          <h1 style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:"clamp(22px,3vw,28px)",fontWeight:700,color:"var(--text)",marginBottom:4}}>Invoices</h1>
          <p style={{fontFamily:"Inter",fontSize:13,color:"var(--text-3)"}}>Billing history and payments</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
          <div style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:0,padding:"18px 22px"}}>
            <p style={{fontFamily:"Inter",fontSize:11,color:"var(--text-3)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.1em"}}>Total MTD</p>
            <span style={{fontFamily:"'Inter', sans-serif",fontSize:24,fontWeight:500,color:"var(--text)"}}>₫{totalMTD.toLocaleString()}</span>
          </div>
          <div style={{background:"var(--bg-2)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:0,padding:"18px 22px"}}>
            <p style={{fontFamily:"Inter",fontSize:11,color:"var(--text-3)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.1em"}}>Outstanding</p>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontFamily:"'Inter', sans-serif",fontSize:24,fontWeight:500,color:"var(--text)"}}>₫{outstanding.toLocaleString()}</span>
              <Tag color="warning">Unpaid</Tag>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          {["All","Paid","Pending","Overdue"].map(s=>(
            <button key={s} onClick={()=>setSf(s)} style={{padding:"7px 16px",borderRadius:0,border:"1px solid",fontFamily:"Inter",fontSize:12,cursor:"pointer",transition:"all 0.15s",fontWeight:sf===s?600:400,background:sf===s?"rgba(168,143,92,0.08)":"transparent",color:sf===s?"var(--gold)":"var(--text-3)",borderColor:sf===s?"var(--border-gold)":"var(--border)"}}>{s}</button>
          ))}
          <div style={{width:1, height:24, background:"var(--border)", margin:"0 4px"}}/>
          <div style={{display:"flex", alignItems:"center", gap:8}}>
            <span style={{fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)", letterSpacing:"0.1em", textTransform:"uppercase"}}>From</span>
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{padding:"6px 10px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:12, outline:"none"}}/>
            <span style={{fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)"}}>–</span>
            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{padding:"6px 10px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:12, outline:"none"}}/>
            {(dateFrom||dateTo) && <button onClick={()=>{setDateFrom("");setDateTo("");}} style={{background:"none",border:"none",color:"var(--text-3)",cursor:"pointer",fontSize:13}}>×</button>}
          </div>
        </div>
        <div style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:0,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:"1px solid var(--border)"}}>
                  {["Invoice #","Space","Period","Amount","Status",""].map(h=>(
                    <th key={h} style={{padding:"12px 18px",textAlign:"left",fontFamily:"Inter",fontSize:11,fontWeight:600,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.08em",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv,i)=>(
                  <tr key={inv.id} onClick={()=>setModal(inv)} style={{borderBottom:"1px solid var(--border)",background:i%2===0?"transparent":"rgba(15,15,15,0.01)",cursor:"pointer",transition:"background 0.12s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(168,143,92,0.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":"rgba(15,15,15,0.01)"}>
                    <td style={{padding:"13px 18px",fontFamily:"'Inter', sans-serif",fontSize:12,color:"var(--gold)"}}>{inv.id}</td>
                    <td style={{padding:"13px 18px",fontFamily:"Inter",fontSize:13,color:"var(--text)",whiteSpace:"nowrap"}}>{inv.space}</td>
                    <td style={{padding:"13px 18px",fontFamily:"Inter",fontSize:12,color:"var(--text-3)"}}>{inv.period}</td>
                    <td style={{padding:"13px 18px",fontFamily:"'Inter', sans-serif",fontSize:13,fontWeight:500,color:"var(--text)"}}>₫{inv.amount.toLocaleString()}</td>
                    <td style={{padding:"13px 18px"}}><Chip status={inv.status} /></td>
                    <td style={{padding:"13px 18px"}}><button onClick={e=>{e.stopPropagation();setModal(inv);}} style={{background:"none",border:"1px solid var(--border)",borderRadius:0,padding:"5px 10px",color:"var(--text-3)",cursor:"pointer",fontSize:12,fontFamily:"Inter"}}>↓</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {modal && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(4px)"}} onClick={()=>setModal(null)}>
            <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} onClick={e=>e.stopPropagation()}
              style={{background:"var(--bg-2)",border:"1px solid var(--border-gold)",borderRadius:0,padding:"36px",maxWidth:440,width:"100%"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
                <div>
                  <p style={{fontFamily:"Inter",fontSize:11,color:"var(--text-3)",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Invoice</p>
                  <h2 style={{fontFamily:"'Inter', sans-serif",fontSize:18,color:"var(--gold)"}}>{modal.id}</h2>
                </div>
                <button onClick={()=>setModal(null)} style={{background:"none",border:"none",color:"var(--text-3)",cursor:"pointer",fontSize:22}}>×</button>
              </div>
              <div style={{borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",padding:"18px 0",marginBottom:18}}>
                {[["Space",modal.space],["Period",modal.period],["Subtotal",`₫${Math.round(modal.amount/1.1).toLocaleString()}`],["VAT 10%",`₫${Math.round(modal.amount*0.1/1.1).toLocaleString()}`]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <span style={{fontFamily:"Inter",fontSize:13,color:"var(--text-3)"}}>{k}</span>
                    <span style={{fontFamily:"'Inter', sans-serif",fontSize:13,color:"var(--text)"}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
                <span style={{fontFamily:"Inter",fontSize:15,fontWeight:600,color:"var(--text)"}}>Total</span>
                <span style={{fontFamily:"'Inter', sans-serif",fontSize:20,color:"var(--gold)"}}>₫{modal.amount.toLocaleString()}</span>
              </div>
              <div style={{background:"var(--bg-3)",borderRadius:0,width:88,height:88,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",border:"1px solid var(--border)"}}>
                <span style={{fontFamily:"'Inter', sans-serif",fontSize:12,color:"var(--text-3)"}}>QR</span>
              </div>
              <div style={{display:"flex",gap:10}}>
                <Btn full variant="ghost" onClick={()=>setModal(null)}>↓ Download PDF</Btn>
                {(modal.status==="Pending"||modal.status==="Overdue")&&<Btn full onClick={()=>setModal(null)}>Pay now</Btn>}
              </div>
            </motion.div>
          </div>
        )}
      </PageWrap>
    </PortalLayout>
  );
};

// ─── Live Availability ──────────────────────────────────────────────────────
const mkSeats = () => Array.from({length:40},(_,i)=>{
  const r=Math.random();
  return {id:`${Math.floor(i/8)}-${i%8}`,status:r<0.45?"available":r<0.65?"reserved":"occupied",premium:(Math.floor(i/8)===0||Math.floor(i/8)===4)&&(i%8===0||i%8===7)};
});

export const LiveAvailability = () => {
  const [floor, setFloor] = useState("Floor 15");
  const [tip, setTip] = useState(null);
  const [secs, setSecs] = useState(8);
  const [seats, setSeats] = useState(mkSeats);
  const [flashing, setFlashing] = useState([]);

  useEffect(()=>{
    const t=setInterval(()=>setSecs(s=>s>0?s-1:8),1000);
    return()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(secs===0){
      const ids=[];
      setSeats(prev=>{
        const next=[...prev];
        for(let i=0;i<2;i++){
          const idx=Math.floor(Math.random()*next.length);
          ids.push(next[idx].id);
          next[idx]={...next[idx],status:next[idx].status==="available"?"occupied":"available"};
        }
        return next;
      });
      // ids populated synchronously during setSeats callback before next render
      setTimeout(()=>{
        setFlashing(ids);
        setTimeout(()=>setFlashing([]),600);
      },0);
    }
  },[secs]);

  const counts=seats.reduce((a,s)=>{a[s.status]=(a[s.status]||0)+1;return a;},{});
  const sColor=s=>s.status==="available"?"var(--success)":s.status==="reserved"?"var(--warning)":"var(--danger)";
  const sBg=s=>s.status==="available"?"rgba(45,106,79,0.12)":s.status==="reserved"?"rgba(181,134,42,0.12)":"rgba(192,57,43,0.12)";

  return (
    <PortalLayout>
      <PageWrap>
        <div style={{marginBottom:32}}>
          <h1 style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:"clamp(22px,3vw,28px)",fontWeight:700,color:"var(--text)",marginBottom:4}}>Live Availability</h1>
          <p style={{fontFamily:"Inter",fontSize:13,color:"var(--text-3)"}}>Real-time seat and room status</p>
        </div>

        <div style={{display:"flex",borderBottom:"1px solid var(--border)",marginBottom:24,gap:4}}>
          {["Floor 12","Floor 14","Floor 15"].map(f=>(
            <button key={f} onClick={()=>{setFloor(f);setSeats(mkSeats());}} style={{padding:"10px 20px",background:"none",border:"none",cursor:"pointer",fontFamily:"Inter",fontSize:13,fontWeight:floor===f?600:400,color:floor===f?"var(--text)":"var(--text-3)",borderBottom:`2px solid ${floor===f?"var(--gold)":"transparent"}`,marginBottom:-1,transition:"all 0.15s"}}>{f}</button>
          ))}
        </div>

        {/* Stats */}
        <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
          {[["Available",counts.available||0,"var(--success)"],["Reserved",counts.reserved||0,"var(--warning)"],["Occupied",counts.occupied||0,"var(--danger)"]].map(([l,c,col])=>(
            <div key={l} style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:0,padding:"10px 16px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:col,display:"inline-block"}} />
              <span style={{fontFamily:"'Inter', sans-serif",fontSize:16,fontWeight:500,color:"var(--text)"}}>{c}</span>
              <span style={{fontFamily:"Inter",fontSize:12,color:"var(--text-3)"}}>{l}</span>
            </div>
          ))}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,fontFamily:"Inter",fontSize:12,color:"var(--text-3)"}}>
            <span className="pulse" style={{width:6,height:6,borderRadius:"50%",background:"var(--success)",display:"inline-block"}} />
            Live · updated {secs}s ago
          </div>
        </div>

        {/* Floor map */}
        <div style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:0,padding:"28px",marginBottom:20,overflowX:"auto"}}>
          <p style={{fontFamily:"Inter",fontSize:11,color:"var(--text-3)",marginBottom:16,textTransform:"uppercase",letterSpacing:"0.1em"}}>{floor} · Seat Map</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(8,44px)",gridTemplateRows:"repeat(5,44px)",gap:8,width:"fit-content"}}>
            {seats.map(seat=>(
              <div key={seat.id} className={flashing.includes(seat.id)?"seat-update":""}
                onMouseEnter={()=>setTip(seat.id)} onMouseLeave={()=>setTip(null)}
                style={{width:44,height:44,borderRadius:0,background:sBg(seat),border:`1.5px solid ${sColor(seat)}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"transform 0.12s",opacity:seat.status==="occupied"?0.7:1}}
                onMouseOver={e=>{e.currentTarget.style.transform="scale(1.1)";e.currentTarget.style.zIndex=10;}}
                onMouseOut={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.zIndex=1;}}>
                {seat.premium && <div style={{position:"absolute",top:-3,right:-3,width:8,height:8,borderRadius:"50%",background:"var(--gold)",border:"1.5px solid var(--bg-2)"}} />}
                <span style={{fontFamily:"'Inter', sans-serif",fontSize:8,color:sColor(seat),opacity:0.8}}>{seat.id}</span>
                {tip===seat.id && (
                  <div style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",background:"var(--bg-3)",border:"1px solid var(--border-gold)",borderRadius:0,padding:"10px 12px",zIndex:20,whiteSpace:"nowrap",minWidth:110,boxShadow:"0 8px 24px rgba(0,0,0,0.5)"}}>
                    <p style={{fontFamily:"'Inter', sans-serif",fontSize:11,color:"var(--gold)",marginBottom:3}}>Seat {seat.id}</p>
                    <p style={{fontFamily:"Inter",fontSize:11,color:"var(--text-2)",marginBottom:seat.status==="available"?8:0,textTransform:"capitalize"}}>{seat.status}{seat.premium?" · Window":""}</p>
                    {seat.status==="available" && <span style={{background:"var(--gold)",color:"#FFFFFF",fontSize:10,padding:"3px 8px",borderRadius:0,fontFamily:"Inter",fontWeight:600,cursor:"pointer"}}>Book</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Room cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12}}>
          {[["Meeting Room A",12,true],["Boardroom Suite",20,false],["Phone Booth 1",1,true],["Phone Booth 2",1,true]].map(([name,cap,avail])=>(
            <div key={name} style={{background:"var(--bg-2)",border:`1px solid ${avail?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`,borderRadius:0,padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <p style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:13,fontWeight:600,color:"var(--text)"}}>{name}</p>
                <span style={{width:7,height:7,borderRadius:"50%",background:avail?"var(--success)":"var(--danger)",display:"inline-block",marginTop:3}} />
              </div>
              <p style={{fontFamily:"Inter",fontSize:12,color:"var(--text-3)"}}>👥 {cap} · {avail?"Open":"In use"}</p>
            </div>
          ))}
        </div>
      </PageWrap>
    </PortalLayout>
  );
};


/* ── CSS toggle helper ──────────────────────────────────────────────────────── */
const Toggle = ({ on, onChange }) => (
  <button onClick={onChange} style={{
    width:44, height:24, borderRadius:12, border:"none", cursor:"pointer",
    background: on?"var(--gold)":"rgba(15,15,15,0.15)", position:"relative", transition:"background 0.2s", flexShrink:0,
  }}>
    <span style={{ position:"absolute", top:3, left: on?20:3, width:18, height:18, borderRadius:"50%", background:"#FFFFFF", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
  </button>
);

/* ── Settings ───────────────────────────────────────────────────────────────── */
export const Settings = () => {
  const [profile, setProfile] = useState({ name:"Nguyen Thanh", email:"thanh@novatech.vn", phone:"+84 901 234 567", company:"NovaTech" });
  const [notifs, setNotifs]   = useState({ bookings:true, invoices:true, spaces:false, membership:true });
  const [pwd, setPwd]         = useState({ current:"", next:"", confirm:"" });
  const [saved, setSaved]     = useState(false);

  const saveProfile = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };
  const lbl = { fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", display:"block", marginBottom:6 };
  const inp = { width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:14, outline:"none" };
  const sH  = { fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.3rem", fontWeight:400, color:"var(--text)", marginBottom:24 };

  return (
    <PortalLayout>
      <PageWrap>
        <div style={{ maxWidth:640 }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Portal</p>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:400, color:"var(--text)", marginBottom:40 }}>Settings</h1>

          {/* Profile */}
          <section style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)" }}>
            <h2 style={sH}>Profile</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div><label style={lbl}>Full name</label><input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>Email <span style={{color:"var(--text-3)",fontWeight:400}}>(read-only)</span></label><input value={profile.email} readOnly style={{...inp,opacity:0.5,cursor:"not-allowed"}}/></div>
              <div><label style={lbl}>Phone</label><input value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>Company</label><input value={profile.company} onChange={e=>setProfile(p=>({...p,company:e.target.value}))} style={inp}/></div>
            </div>
            <button onClick={saveProfile} style={{ padding:"10px 24px", background:saved?"var(--success)":"var(--text)", color:"#FFFFFF", border:"none", fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.2s" }}>
              {saved?"Saved ✓":"Save changes"}
            </button>
          </section>

          {/* Plan & billing */}
          <section style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)" }}>
            <h2 style={sH}>Plan &amp; billing</h2>
            <div style={{ background:"rgba(168,143,92,0.06)", border:"1px solid var(--border-gold)", padding:"20px 24px", marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", marginBottom:4 }}>Current plan</p>
                  <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.15rem", color:"var(--text)" }}>Pro Member</p>
                </div>
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)" }}>Renews Jun 15, 2025</span>
              </div>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)", marginBottom:8 }}>18/20 days used this month</p>
              <div style={{ height:4, background:"rgba(15,15,15,0.1)", borderRadius:2 }}>
                <div style={{ height:4, width:"90%", background:"var(--gold)", borderRadius:2 }}/>
              </div>
            </div>
            <div style={{ display:"flex", gap:24 }}>
              <button style={{ background:"none", border:"none", fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text)", borderBottom:"1px solid var(--text)", cursor:"pointer", paddingBottom:1 }}>Upgrade plan</button>
              <button style={{ background:"none", border:"none", fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-3)", borderBottom:"1px solid var(--text-3)", cursor:"pointer", paddingBottom:1 }}>Manage billing</button>
            </div>
          </section>

          {/* Notifications */}
          <section style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)" }}>
            <h2 style={sH}>Notifications</h2>
            {[
              ["bookings",  "Booking confirmations",  "Get notified when a booking is confirmed or modified."],
              ["invoices",  "Invoice reminders",       "Receive reminders for upcoming and overdue invoices."],
              ["spaces",    "New space alerts",         "Be first to know when new spaces become available."],
              ["membership","Membership updates",       "Updates about your plan, renewal, and exclusive offers."],
            ].map(([key,label,desc]) => (
              <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
                <div>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:500, color:"var(--text)", marginBottom:3 }}>{label}</p>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>{desc}</p>
                </div>
                <Toggle on={notifs[key]} onChange={()=>setNotifs(n=>({...n,[key]:!n[key]}))}/>
              </div>
            ))}
          </section>

          {/* Password */}
          <section>
            <h2 style={sH}>Password</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
              <div><label style={lbl}>Current password</label><input type="password" value={pwd.current} onChange={e=>setPwd(p=>({...p,current:e.target.value}))} style={inp} placeholder="••••••••"/></div>
              <div><label style={lbl}>New password</label><input type="password" value={pwd.next} onChange={e=>setPwd(p=>({...p,next:e.target.value}))} style={inp} placeholder="Min 8 characters"/></div>
              <div><label style={lbl}>Confirm new password</label><input type="password" value={pwd.confirm} onChange={e=>setPwd(p=>({...p,confirm:e.target.value}))} style={inp} placeholder="Repeat new password"/></div>
            </div>
            <button style={{ padding:"10px 24px", background:"var(--text)", color:"#FFFFFF", border:"none", fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer" }}>Update password</button>
          </section>
        </div>
      </PageWrap>
    </PortalLayout>
  );
};

/* ── Documents ──────────────────────────────────────────────────────────────── */
const DOCS = [
  { id:"d1", name:"Membership Agreement — Pro", type:"Contract", date:"Jan 1, 2025",  size:"248 KB", status:"Active" },
  { id:"d2", name:"Floor 15 Access Policy",     type:"Policy",   date:"Jan 1, 2025",  size:"84 KB",  status:"Active" },
  { id:"d3", name:"Invoice Terms & Conditions", type:"Legal",    date:"Dec 1, 2024",  size:"120 KB", status:"Active" },
  { id:"d4", name:"NDA — NovaTech Project",     type:"NDA",      date:"Nov 15, 2024", size:"64 KB",  status:"Signed" },
  { id:"d5", name:"Old Membership Agreement",   type:"Contract", date:"Jan 1, 2024",  size:"231 KB", status:"Expired" },
];
const docChip = s => s==="Active"?{bg:"rgba(45,106,79,0.10)",color:"#2D6A4F"}:s==="Signed"?{bg:"rgba(168,143,92,0.12)",color:"#A88F5C"}:{bg:"rgba(15,15,15,0.07)",color:"#707070"};

export const Documents = () => {
  const [tab, setTab] = useState("docs");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadCategory, setUploadCategory] = useState("Company Registration");
  const [dragOver, setDragOver] = useState(false);
  const [contracts, setContracts] = useState([
    { id:"c1", name:"Membership Agreement — Pro (Jan 2025)", status:"Signed" },
    { id:"c2", name:"Office Lease — Floor 15 (Feb 2025)", status:"Awaiting signature" },
  ]);
  const [signModal, setSignModal] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [docDateFrom, setDocDateFrom] = useState("");
  const [docDateTo, setDocDateTo] = useState("");
  let canvasEl = null;

  const startDraw = (e) => {
    if (!canvasEl) return;
    ctx = canvasEl.getContext("2d");
    setDrawing(true);
    setHasSig(true);
    const r = canvasEl.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
  };
  const draw = (e) => {
    if (!drawing || !canvasEl) return;
    ctx = canvasEl.getContext("2d");
    const r = canvasEl.getBoundingClientRect();
    ctx.lineWidth = 2; ctx.strokeStyle = "#0F0F0F"; ctx.lineCap = "round";
    ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
    ctx.stroke();
  };
  const stopDraw = () => setDrawing(false);
  const clearCanvas = () => {
    if (!canvasEl) return;
    canvasEl.getContext("2d").clearRect(0, 0, canvasEl.width, canvasEl.height);
    setHasSig(false);
  };
  const confirmSign = () => {
    setContracts(cs => cs.map(c => c.id === signModal ? { ...c, status:"Signed" } : c));
    setSignModal(null);
    setHasSig(false);
  };

  const handleFileInput = (files) => {
    const allowed = ["application/pdf","image/jpeg","image/png","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    Array.from(files).forEach(f => {
      if (allowed.includes(f.type) || f.name.endsWith(".docx")) {
        setUploadedFiles(prev => [...prev, { id: Date.now()+Math.random(), name:f.name, size:`${(f.size/1024).toFixed(0)} KB`, date:new Date().toLocaleDateString(), category:uploadCategory }]);
      }
    });
  };

  const TABS = [
    { id:"docs", label:"My Documents" },
    { id:"upload", label:"Upload Documents" },
    { id:"esign", label:"E-Sign" },
    { id:"rules", label:"House Rules" },
  ];

  const tabBtnStyle = (active) => ({
    padding:"10px 20px", background:"none", border:"none", cursor:"pointer",
    fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:active?600:400,
    color:active?"var(--text)":"var(--text-3)",
    borderBottom:`2px solid ${active?"var(--gold)":"transparent"}`,
    marginBottom:-1, transition:"all 0.15s",
  });

  return (
    <PortalLayout>
      <PageWrap>
        <div style={{ marginBottom:24 }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Portal</p>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:400, color:"var(--text)" }}>Documents</h1>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:28, gap:4 }}>
          {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={tabBtnStyle(tab===t.id)}>{t.label}</button>)}
        </div>

        {/* ── Tab: My Documents ── */}
        {tab === "docs" && (
          <div style={{ background:"var(--bg-2)", border:"1px solid var(--border)", overflow:"hidden" }}>
            {/* Date filter */}
            <div style={{ padding:"12px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", background:"#FFFFFF" }}>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text-3)" }}>Filter by date</span>
              <input type="date" value={docDateFrom} onChange={e=>setDocDateFrom(e.target.value)} style={{ padding:"5px 9px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:12, outline:"none" }}/>
              <span style={{ color:"var(--text-3)", fontSize:12 }}>–</span>
              <input type="date" value={docDateTo} onChange={e=>setDocDateTo(e.target.value)} style={{ padding:"5px 9px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:12, outline:"none" }}/>
              {(docDateFrom||docDateTo) && <button onClick={()=>{setDocDateFrom("");setDocDateTo("");}} style={{ background:"none", border:"none", color:"var(--text-3)", cursor:"pointer", fontSize:13 }}>× Clear</button>}
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid var(--border)" }}>
                    {["Document","Type","Date","Size","Status",""].map(h=>(
                      <th key={h} style={{ padding:"12px 18px", textAlign:"left", fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, color:"var(--text-3)", textTransform:"uppercase", letterSpacing:"0.12em", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DOCS.filter(doc => {
                    if (docDateFrom && doc.date && doc.date < docDateFrom) return false;
                    if (docDateTo && doc.date && doc.date > docDateTo) return false;
                    return true;
                  }).map((doc,i)=>{
                    const sc=docChip(doc.status);
                    return (
                      <tr key={doc.id} style={{ borderBottom:"1px solid var(--border)", background:i%2===0?"transparent":"rgba(15,15,15,0.01)", transition:"background 0.12s" }}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(168,143,92,0.03)"}
                        onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":"rgba(15,15,15,0.01)"}>
                        <td style={{ padding:"14px 18px", fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)", fontWeight:500 }}>{doc.name}</td>
                        <td style={{ padding:"14px 18px", fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>{doc.type}</td>
                        <td style={{ padding:"14px 18px", fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>{doc.date}</td>
                        <td style={{ padding:"14px 18px", fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>{doc.size}</td>
                        <td style={{ padding:"14px 18px" }}>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:sc.bg, color:sc.color, fontSize:11, fontWeight:600, padding:"3px 9px", fontFamily:"'Inter',sans-serif" }}>
                            <span style={{ width:5, height:5, borderRadius:"50%", background:sc.color, flexShrink:0 }}/>{doc.status}
                          </span>
                        </td>
                        <td style={{ padding:"14px 18px" }}>
                          <button onClick={()=>alert("Downloading "+doc.name)}
                            style={{ background:"none", border:"1px solid var(--border)", padding:"5px 10px", color:"var(--text-3)", cursor:"pointer", fontSize:13, fontFamily:"'Inter',sans-serif" }}
                            onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--border-gold)"; e.currentTarget.style.color="var(--gold)"; }}
                            onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-3)"; }}>↓</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Upload Documents ── */}
        {tab === "upload" && (
          <div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", display:"block", marginBottom:6 }}>Document category</label>
              <select value={uploadCategory} onChange={e=>setUploadCategory(e.target.value)} style={{ padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:14, outline:"none", borderRadius:0, maxWidth:300 }}>
                {["Company Registration","ID Document","Financial Statement","Other"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            {/* Drop zone */}
            <div
              onDragOver={e=>{ e.preventDefault(); setDragOver(true); }}
              onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{ e.preventDefault(); setDragOver(false); handleFileInput(e.dataTransfer.files); }}
              onClick={()=>document.getElementById("fileInput").click()}
              style={{ border:`2px dashed ${dragOver?"var(--gold)":"var(--border)"}`, background:dragOver?"rgba(168,143,92,0.04)":"var(--bg-2)", padding:"48px 24px", textAlign:"center", cursor:"pointer", transition:"all 0.2s", marginBottom:24 }}>
              <p style={{ fontSize:32, marginBottom:12 }}>↑</p>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"var(--text)", marginBottom:8 }}>Drop files here or click to browse</p>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>Accepts PDF, JPG, PNG, DOCX</p>
              <input id="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" multiple style={{ display:"none" }} onChange={e=>handleFileInput(e.target.files)} />
            </div>
            {uploadedFiles.length === 0 ? (
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)" }}>No files uploaded yet.</p>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {uploadedFiles.map(f => (
                  <div key={f.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"var(--bg-2)", border:"1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)", fontWeight:500, marginBottom:2 }}>{f.name}</p>
                      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)" }}>{f.category} · {f.size} · Uploaded {f.date}</p>
                    </div>
                    <button onClick={()=>setUploadedFiles(fs=>fs.filter(x=>x.id!==f.id))} style={{ background:"none", border:"none", color:"var(--text-3)", cursor:"pointer", fontSize:16, padding:"4px 8px" }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: E-Sign ── */}
        {tab === "esign" && (
          <div>
            {signModal && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setSignModal(null)}>
                <div onClick={e=>e.stopPropagation()} style={{ background:"#FFFFFF", padding:"32px", maxWidth:480, width:"100%" }}>
                  <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.2rem", color:"var(--text)", marginBottom:8 }}>Sign document</h3>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", marginBottom:16 }}>Draw your signature below</p>
                  <canvas ref={el=>{canvasEl=el;}} width={400} height={120}
                    style={{ border:"1px solid var(--border)", background:"#FAFAFA", display:"block", cursor:"crosshair", touchAction:"none" }}
                    onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} />
                  <div style={{ display:"flex", gap:12, marginTop:16 }}>
                    <button onClick={clearCanvas} style={{ padding:"8px 16px", background:"none", border:"1px solid var(--border)", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:"pointer", color:"var(--text-3)" }}>Clear</button>
                    <button onClick={confirmSign} disabled={!hasSig} style={{ padding:"8px 20px", background:hasSig?"var(--text)":"var(--bg-3)", border:"none", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:hasSig?"pointer":"not-allowed", color:hasSig?"#FFFFFF":"var(--text-3)", transition:"background 0.15s" }}>Confirm signature</button>
                    <button onClick={()=>setSignModal(null)} style={{ marginLeft:"auto", padding:"8px 12px", background:"none", border:"none", color:"var(--text-3)", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:12 }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {contracts.map(c => {
                const signed = c.status === "Signed";
                const sc = signed ? { bg:"rgba(45,106,79,0.10)", color:"#2D6A4F" } : { bg:"rgba(181,134,42,0.12)", color:"#B5862A" };
                return (
                  <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", background:"var(--bg-2)", border:"1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text)", fontWeight:500, marginBottom:6 }}>{c.name}</p>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:sc.bg, color:sc.color, fontSize:11, fontWeight:600, padding:"2px 8px", fontFamily:"'Inter',sans-serif" }}>
                        <span style={{ width:5, height:5, borderRadius:"50%", background:sc.color, flexShrink:0 }}/>{c.status}
                      </span>
                    </div>
                    {signed ? (
                      <button onClick={()=>alert("Preparing signed PDF download...")} style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", background:"none", border:"1px solid var(--border)", padding:"7px 14px", cursor:"pointer" }}>↓ Download signed PDF</button>
                    ) : (
                      <button onClick={()=>{ setHasSig(false); setSignModal(c.id); }} style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"#FFFFFF", background:"var(--text)", border:"none", padding:"8px 18px", cursor:"pointer", transition:"background 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background="var(--gold)"} onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>Sign now →</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab: House Rules ── */}
        {tab === "rules" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
            {[
              { icon:"🕐", title:"Building access hours", items:["Weekdays: 7:00 AM – 10:00 PM","Weekends: 8:00 AM – 8:00 PM","After-hours access: Pro members only"] },
              { icon:"📶", title:"WiFi credentials", items:["Network: HiLink-Members","Password: HL2025#","Speed: 1 Gbps fibre throughout"] },
              { icon:"📅", title:"Meeting room booking", items:["Max 4 hours per day","48-hour advance notice required","Cancellation: 24 hours before session"] },
              { icon:"👥", title:"Guest policy", items:["Max 2 guests per member at a time","Guests must sign in at reception","Guests not permitted after 8 PM"] },
              { icon:"🆘", title:"Emergency contacts", items:["Reception: +84 24 3936 9197","Building security: ext. 100","Fire emergency: ext. 911"] },
            ].map(card => (
              <div key={card.title} style={{ background:"var(--bg-2)", border:"1px solid var(--border)", padding:"20px 22px" }}>
                <p style={{ fontSize:24, marginBottom:10 }}>{card.icon}</p>
                <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1rem", fontWeight:400, color:"var(--text)", marginBottom:12 }}>{card.title}</h3>
                {card.items.map(item => (
                  <div key={item} style={{ display:"flex", gap:10, marginBottom:6 }}>
                    <span style={{ color:"var(--gold)", fontSize:11, marginTop:2, flexShrink:0 }}>·</span>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)", lineHeight:1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </PageWrap>
    </PortalLayout>
  );
};

// ─── Support FAQ ─────────────────────────────────────────────────────────────
const FAQ_TREE = [
  {
    id:"billing", q:"Billing & invoices", icon:"💳",
    children:[
      { id:"billing_view",   q:"How do I view my invoices?",          a:"Your invoices are in the portal under Invoices. You can filter by status (Paid, Pending, Overdue) and by date range. Click any invoice to download a PDF copy." },
      { id:"billing_pay",    q:"How do I pay an outstanding invoice?", a:"Click the invoice in the Invoices page and select 'Pay now'. We accept bank transfer and major Vietnamese payment methods (VNPay, MoMo, Moca)." },
      { id:"billing_change", q:"Can I change my billing date?",        a:"Yes — contact your property manager or email billing@hilink.vn at least 5 business days before your current billing date." },
    ],
  },
  {
    id:"access", q:"Building access & keys", icon:"🔑",
    children:[
      { id:"access_hours",   q:"What are the building access hours?",  a:"Members can access the building from 7:00 AM to 10:00 PM on weekdays and 8:00 AM to 8:00 PM on weekends. Pro members get 24/7 access." },
      { id:"access_guest",   q:"How do I register a guest?",           a:"Use the Tenant Portal → Guest Pass to register guests up to 48 hours in advance. Max 2 guests per member per day." },
      { id:"access_card",    q:"My access card isn't working",         a:"Report it via Tenant Portal → Report Issue (select 'Door'). We'll issue a replacement card within 2 business hours during building hours." },
    ],
  },
  {
    id:"rooms", q:"Meeting rooms & bookings", icon:"📅",
    children:[
      { id:"rooms_book",     q:"How do I book a meeting room?",        a:"Use Tenant Portal → Book Meeting Room. Select your preferred room, date and available time slot. Bookings must be made at least 48 hours in advance." },
      { id:"rooms_cancel",   q:"How do I cancel a booking?",           a:"Navigate to My Bookings in the portal and click 'Cancel'. Cancellations within 24 hours of the booking may incur a cancellation fee." },
      { id:"rooms_av",       q:"Is A/V equipment included?",           a:"All meeting rooms include a 4K display, HDMI/USB-C adapters, video conferencing bridge, and wireless presentation. Request extra equipment via Tenant Portal → Extra Services." },
    ],
  },
  {
    id:"wifi", q:"WiFi & IT support", icon:"📶",
    children:[
      { id:"wifi_creds",     q:"What are the WiFi credentials?",       a:"Network: HiLink-Members · Password: HL2025#\nFor private office networks, check your welcome pack or contact reception." },
      { id:"wifi_slow",      q:"The internet is slow — what do I do?", a:"First try disconnecting and reconnecting. If the issue persists, submit a ticket via Tenant Portal → Report Issue (select 'Internet'). Our IT team responds within 2 hours." },
      { id:"wifi_support",   q:"Can I get on-site IT support?",        a:"Yes — request it via Tenant Portal → Extra Services → IT Support (On-site). Available Mon–Fri 09:00–18:00. On-site visits are ₫300,000." },
    ],
  },
  {
    id:"membership", q:"Membership & contracts", icon:"📋",
    children:[
      { id:"mem_upgrade",    q:"How do I upgrade my membership?",      a:"Contact your property manager or submit a Custom Offer request via the portal. Upgrades typically take effect from the next billing cycle." },
      { id:"mem_cancel",     q:"How do I cancel my membership?",       a:"We require written notice of at least 30 days (or as stated in your lease agreement). Email notice@hilink.vn or speak to your property manager." },
      { id:"mem_docs",       q:"Where are my signed documents?",       a:"All your signed lease agreements and membership documents are in the portal under Documents → E-Sign. You can download signed copies at any time." },
    ],
  },
];

export const SupportPage = () => {
  const [category, setCategory] = useState(null);
  const [question, setQuestion] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputVal, setInputVal] = useState("");

  const handleSelectCategory = (cat) => {
    setCategory(cat);
    setQuestion(null);
    setChatHistory(prev => [
      ...prev,
      { type:"user", text:cat.q },
      { type:"bot", text:`Great — here are the common questions about **${cat.q}**. Select one below or type your own question.` },
    ]);
  };

  const handleSelectQuestion = (faq) => {
    setQuestion(faq);
    setChatHistory(prev => [
      ...prev,
      { type:"user", text:faq.q },
      { type:"bot", text:faq.a },
    ]);
    // After answering, show the other questions again after a moment
    setTimeout(() => setQuestion(null), 100);
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const q = inputVal.trim();
    setInputVal("");
    // Simple keyword matching
    let answer = "I don't have a specific answer for that right now. Please contact your property manager or email support@hilink.vn — our team typically responds within 2 business hours.";
    const lower = q.toLowerCase();
    FAQ_TREE.forEach(cat => cat.children.forEach(faq => {
      if (faq.q.toLowerCase().split(" ").some(w => w.length > 3 && lower.includes(w))) {
        answer = faq.a;
      }
    }));
    setChatHistory(prev => [
      ...prev,
      { type:"user", text:q },
      { type:"bot", text:answer },
    ]);
  };

  return (
    <PortalLayout>
      <PageWrap>
        <div style={{ marginBottom:28 }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Support</p>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:400, color:"var(--text)", marginBottom:8 }}>How can we help?</h1>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-3)" }}>Browse our FAQs or ask a question below.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:24, alignItems:"start" }}>
          {/* LEFT — FAQ category list */}
          <div style={{ background:"#FFFFFF", border:"1px solid var(--border)" }}>
            <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)" }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)" }}>Topics</p>
            </div>
            {FAQ_TREE.map(cat => (
              <div key={cat.id}>
                <button onClick={() => handleSelectCategory(cat)}
                  style={{ width:"100%", textAlign:"left", padding:"12px 18px", background:category?.id===cat.id?"rgba(168,143,92,0.06)":"transparent", border:"none", borderLeft:`3px solid ${category?.id===cat.id?"var(--gold)":"transparent"}`, cursor:"pointer", display:"flex", alignItems:"center", gap:12, transition:"all 0.12s" }}>
                  <span style={{ fontSize:18 }}>{cat.icon}</span>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:category?.id===cat.id?"var(--gold)":"var(--text-2)", fontWeight:category?.id===cat.id?500:400 }}>{cat.q}</span>
                </button>
                {/* Sub-questions */}
                {category?.id===cat.id && cat.children.map(faq => (
                  <button key={faq.id} onClick={() => handleSelectQuestion(faq)}
                    style={{ width:"100%", textAlign:"left", padding:"9px 18px 9px 50px", background:question?.id===faq.id?"rgba(168,143,92,0.04)":"transparent", border:"none", borderLeft:`3px solid ${question?.id===faq.id?"var(--gold)":"transparent"}`, cursor:"pointer", transition:"all 0.12s" }}>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:question?.id===faq.id?"var(--gold)":"var(--text-3)", lineHeight:1.5, display:"block" }}>{faq.q}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* RIGHT — Chat panel */}
          <div style={{ background:"#FFFFFF", border:"1px solid var(--border)", display:"flex", flexDirection:"column", minHeight:520 }}>
            {/* Header */}
            <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, background:"var(--bg-3)", border:"1.5px solid var(--border-gold)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:14, color:"var(--gold)" }}>H</span>
              </div>
              <div>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:600, color:"var(--text)" }}>HiLink Support</p>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--success)", display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--success)", display:"inline-block" }}/>Online · Responds in ~2 hours
                </p>
              </div>
            </div>

            {/* Chat history */}
            <div style={{ flex:1, padding:"24px", display:"flex", flexDirection:"column", gap:16, overflowY:"auto", minHeight:320 }}>
              {chatHistory.length === 0 && (
                <div style={{ textAlign:"center", padding:"48px 0" }}>
                  <p style={{ fontSize:32, marginBottom:12 }}>💬</p>
                  <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"var(--text-2)", marginBottom:8 }}>Select a topic to get started</p>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)" }}>Or type your question in the box below.</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} style={{ display:"flex", justifyContent:msg.type==="user"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth:"75%", padding:"12px 16px", background:msg.type==="user"?"var(--gold)":"var(--bg-2)", color:msg.type==="user"?"#FFFFFF":"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:13, lineHeight:1.65 }}>
                    {msg.text.replace(/\*\*/g,"").split("\n").map((line, j) => <p key={j} style={{ margin:j>0?"8px 0 0":0 }}>{line}</p>)}
                  </div>
                </div>
              ))}
              {/* Inline question suggestion buttons — shown after category selected, before any sub-question chosen */}
              {category && !question && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Common questions:</p>
                  {category.children.map(faq => (
                    <button key={faq.id} onClick={() => handleSelectQuestion(faq)}
                      style={{ textAlign:"left", padding:"10px 14px", background:"#FFFFFF", border:"1px solid var(--border)", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)", transition:"all 0.12s", display:"flex", alignItems:"center", gap:10 }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--border-gold)"; e.currentTarget.style.color="var(--gold)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-2)"; }}>
                      <span style={{ color:"var(--gold)", flexShrink:0 }}>→</span>
                      {faq.q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding:"16px 24px", borderTop:"1px solid var(--border)", display:"flex", gap:10 }}>
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key==="Enter" && handleSend()}
                placeholder="Type your question..."
                style={{ flex:1, padding:"10px 14px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:13, outline:"none" }}
              />
              <button onClick={handleSend} style={{ padding:"10px 20px", background:"var(--gold)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background="var(--text)"} onMouseLeave={e=>e.currentTarget.style.background="var(--gold)"}>
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick contact footer */}
        <div style={{ marginTop:24, padding:"20px 24px", background:"var(--bg-2)", border:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)" }}>Can't find what you're looking for?</p>
          <div style={{ display:"flex", gap:16 }}>
            {[["📞","+84 24 3936 9197","Call us"],["📧","support@hilink.vn","Email"],["💬","Live chat","Start chat"]].map(([icon,val,label])=>(
              <div key={label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span>{icon}</span>
                <div>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)", marginBottom:1 }}>{label}</p>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--gold)", fontWeight:500 }}>{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageWrap>
    </PortalLayout>
  );
};

export const PortalPlaceholder = ({ title }) => (
  <PortalLayout>
    <PageWrap>
      <h1 style={{fontFamily:"'Playfair Display', Georgia, serif",fontSize:26,fontWeight:700,color:"var(--text)",marginBottom:8}}>{title}</h1>
      <p style={{fontFamily:"Inter",fontSize:14,color:"var(--text-3)"}}>Coming soon.</p>
    </PageWrap>
  </PortalLayout>
);
