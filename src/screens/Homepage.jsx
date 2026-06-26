import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrap, SectionHeader, Avatar } from "../components/index.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { TESTIMONIALS, GRADIENTS } from "../data/mockData.js";

/* Image path normalizer */
const img = (p) => {
  if (!p) return "";
  if (/^(https?:|data:|blob:)/.test(p)) return p;
  let s = p.replace(/^public\//, "");
  if (!s.startsWith("/")) s = "/" + s;
  try { return encodeURI(decodeURI(s)); } catch { return s; }
};

/* ── Shared text-link CTA style ─────────────────────────────────────── */
const textLink = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "'Inter', sans-serif",
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text)",
  textDecoration: "none",
  borderBottom: "1px solid var(--text)",
  paddingBottom: 2,
  transition: "color 0.2s, border-color 0.2s",
};

const goldLink = {
  ...textLink,
  color: "var(--gold)",
  borderBottom: "1px solid var(--gold)",
};

/* ── Feature images ─────────────────────────────────────────────────── */
const FEATURES = [
  {
    img: "public/workspace-photos/DSC05955(1).jpg",
    title: "Room to grow",
    desc: "Flexible contracts that scale with your business — from a single desk to a full floor.",
  },
  {
    img: "public/workspace-photos/BG_HOME.jpg",
    title: "Premium locations",
    desc: "Floors 12, 14 & 15 in the heart of Hanoi's most prestigious business district.",
  },
  {
    img: "public/workspace-photos/DSC06155(1).jpg",
    title: "Extraordinary workplaces",
    desc: "Every detail curated for focus, collaboration, and the occasional moment of inspiration.",
  },
];

/* ── Membership types ───────────────────────────────────────────────── */
const MEMBERSHIPS = [
  { icon:"⬡", type:"Hot Desk",       name:"Horizon Desk",    desc:"Flex access across our open floors. Day or month — your call.", from:"From ₫89k/hr",  capacity:"1 person",   grad:0, route:"/spaces/1",
    img: img("public/workspace-photos/DSC05749.jpg") },
  { icon:"◻", type:"Private Office", name:"Skyline Suite",   desc:"Your own lockable suite for 2–50 people. Fully furnished.",    from:"From ₫450k/hr", capacity:"2–50 people", grad:1, route:"/spaces/2",
    img: img("public/workspace-photos/IFT_9891_5.jpg") },
  { icon:"◈", type:"Meeting Room",   name:"Boardroom Alpha", desc:"Boardrooms and collab spaces. Book by the hour.",               from:"From ₫280k/hr", capacity:"1–40 people", grad:2, route:"/spaces/3",
    img: img("public/workspace-photos/Meeting room 6 copy.jpg") },
  { icon:"◉", type:"Virtual Office", name:"Virtual Gold",    desc:"Premium Hanoi address + mail + call forwarding.",               from:"From ₫299k/mo", capacity:"Any size",    grad:3, route:"/spaces/7",
    img: img("public/workspace-photos/9422f5054b4e72a0f5d2a5da96428320cc07f603-1490x2000.avif") },  /* ← empty string = falls back to gradient */
];

/* ── Stats ──────────────────────────────────────────────────────────── */
const STATS_VALUES = ["2,400+", "3", "98%", "< 2min"];

const TRANSLATIONS = {
  en: {
    eyebrow: "Premium Workspaces · Hanoi, Vietnam",
    h1a: "Workspaces to make",
    h1b: "your everyday",
    h1c: "extraordinary.",
    subtitle: "Premium flexible workspaces for startups, SMEs, and global enterprises in the heart of Hanoi.",
    cta1: "Browse spaces →",
    cta2: "Create free account",
    membershipsEyebrow: "What we offer",
    membershipsTitle: "Explore our spaces",
    membershipsLink: "View all →",
    statsLabels: ["Active Members", "Premium Floors", "Satisfaction Rate", "Avg Booking Time"],
    ctaDark: "Find your perfect workspace today",
    ctaDarkLink: "Browse all spaces →",
    footerTagline: "Premium coworking in Hanoi, Vietnam.",
  },
  vi: {
    eyebrow: "Không gian làm việc cao cấp · Hà Nội",
    h1a: "Không gian làm việc",
    h1b: "cho mỗi ngày",
    h1c: "phi thường.",
    subtitle: "Không gian làm việc linh hoạt cao cấp cho startup, SME và doanh nghiệp quốc tế tại trung tâm Hà Nội.",
    cta1: "Khám phá không gian →",
    cta2: "Tạo tài khoản miễn phí",
    membershipsEyebrow: "Dịch vụ của chúng tôi",
    membershipsTitle: "Khám phá không gian của chúng tôi",
    membershipsLink: "Xem tất cả →",
    statsLabels: ["Thành viên đang hoạt động", "Tầng cao cấp", "Tỷ lệ hài lòng", "Thời gian đặt chỗ TB"],
    ctaDark: "Tìm không gian làm việc lý tưởng của bạn",
    ctaDarkLink: "Xem tất cả không gian →",
    footerTagline: "Không gian làm việc cao cấp tại Hà Nội, Việt Nam.",
  },
};

const Homepage = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const T = TRANSLATIONS[lang];
  const [hovered, setHovered] = useState(null);

  return (
    <PageWrap>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pattern-diag-corners" style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "#FFFFFF", paddingTop: 64, position:"relative", overflow:"hidden" }}>
        {/* Left: text content */}
        <div className="hero-grid section-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "80px 48px", width: "100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ maxWidth: 680 }}
          >
            {/* Eyebrow */}
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 32 }}>
              Premium Workspaces · Hanoi, Vietnam
            </p>

            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(3rem, 6vw, 6rem)", fontWeight: 400, lineHeight: 1.05, color: "var(--text)", marginBottom: 32, letterSpacing: "-0.02em" }}>
              Workspaces to make<br />your everyday<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>extraordinary.</em>
            </h1>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 500, marginBottom: 48 }}>
              Premium flexible workspaces for startups, SMEs, and global enterprises in the heart of Hanoi.
            </p>

            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              <Link to="/spaces" style={textLink}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; }}>
                Browse spaces →
              </Link>
              <Link to="/register" style={{ ...textLink, color: "var(--text-3)", borderColor: "rgba(15,15,15,0.25)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.borderColor = "rgba(15,15,15,0.25)"; }}>
                Create free account
              </Link>
            </div>
          </motion.div>

          {/* Right: Instagram photo collage */}
          <motion.div initial={{ opacity:0, x:32 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.9, delay:0.15, ease:[0.25,0.46,0.45,0.94] }}
            className="hero-collage" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"280px 200px", gap:8 }}>
            <div style={{ gridRow:"1/3", overflow:"hidden", borderRadius:2 }}>
              <img src="/workspace-photos/DSC05831(1).jpg" alt="HiLink workspace" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
            </div>
            <div style={{ overflow:"hidden", borderRadius:2 }}>
              <img src="/workspace-photos/DSC06008.jpg" alt="HiLink workspace" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
            </div>
            <div style={{ overflow:"hidden", borderRadius:2 }}>
              <img src="/workspace-photos/L1001039.jpg" alt="HiLink workspace" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
            </div>
          </motion.div>
        </div>

        {/* Ticker */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "var(--bg-2)", borderTop: "1px solid var(--border)", overflow: "hidden", display: "flex", alignItems: "center" }}>
          <div className="marquee-track" style={{ display: "flex", whiteSpace: "nowrap", gap: 0 }}>
            {[0, 1].map(i => (
              <span key={i} style={{ color: "var(--text-3)", fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.1em", paddingRight: 64 }}>
                12 desks live on Floor 15 &nbsp;·&nbsp; Off-peak rates until 9am &nbsp;·&nbsp; Floor 16 launching Q2 2025 &nbsp;·&nbsp; Pro members get priority booking &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE FEATURES (with real workspace photos) ────────────────── */}
      <section style={{ borderTop: "1px solid var(--border)" }}>
        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              style={{ borderRight: i < 2 ? "1px solid var(--border)" : "none" }}
            >
              {/* Full-bleed image */}
              <div style={{ overflow: "hidden" }}>
                <img
                  src={f.img}
                  alt={f.title}
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", transition: "transform 0.7s ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
              {/* Text below image */}
              <div style={{ padding: "28px 32px 40px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.3rem, 2vw, 1.6rem)", fontWeight: 400, color: "var(--text)", marginBottom: 12, lineHeight: 1.2 }}>{f.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MEMBERSHIPS ──────────────────────────────────────────────── */}
      <section className="pattern-dots section-pad" style={{ padding: "64px 48px", background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>What we offer</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1.1 }}>Explore our spaces</h2>
            </div>
            <Link
              to="/membership"
              style={textLink}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; }}
            >
              View memberships →
            </Link>
          </div>

          {/* 2×2 membership cards */}
          <div className="explore-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "var(--border)" }}>
            {MEMBERSHIPS.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="hover-lift"
                onClick={() => navigate(m.route || "/membership")}
                style={{ background: hovered === i ? "#FFFFFF" : "var(--bg-2)", cursor: "pointer", transition: "background 0.2s", display:"flex", flexDirection:"column" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image */}
                <div style={{ height: 168, background: GRADIENTS[i], overflow: "hidden", position: "relative", flexShrink:0 }}>
                  {m.img && (
                    <img
                      src={m.img}
                      alt={m.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease", transform: hovered === i ? "scale(1.04)" : "scale(1)" }}
                    />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,15,0.35), transparent)" }} />
                </div>

                {/* Card content */}
                <div style={{ padding: "18px 24px 20px", display:"flex", flexDirection:"column", flex:1 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>{m.type}</p>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.15rem, 1.8vw, 1.4rem)", fontWeight: 400, color: "var(--text)", marginBottom: 6, lineHeight: 1.2 }}>{m.name}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 14 }}>{m.desc}</p>
                  <div style={{ marginTop:"auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 14, gap:12, flexWrap:"wrap" }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{m.from}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "var(--text-3)", letterSpacing: "0.08em" }}>Suitable for <em style={{ fontStyle: "normal", color: "var(--text-2)" }}>{m.capacity}</em></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <section style={{ background: "#FFFFFF", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="stats-grid" style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {STATS_VALUES.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{ padding: "48px 40px", borderRight: i < 3 ? "1px solid var(--border)" : "none", textAlign: "center" }}
            >
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>{val}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)" }}>{T.statsLabels[i]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FULL-BLEED DARK CTA ───────────────────────────────────────── */}
      <section className="section-pad" style={{ background: "#0F0F0F", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>Ready to start?</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.15 }}>Find your perfect workspace today</h2>
          </div>
          <Link
            to="/spaces"
            style={{ ...goldLink, color: "var(--gold)", borderColor: "var(--gold)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#EAE3D2"; e.currentTarget.style.borderColor = "#EAE3D2"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
          >
            Browse all spaces →
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="pattern-soft-radial section-pad" style={{ background: "#FFFFFF", padding: "96px 48px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Social proof</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 400, color: "var(--text)", marginBottom: 64, lineHeight: 1.1 }}>Trusted by leaders</h2>

          <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: "0 40px 0 0", borderRight: i < 2 ? "1px solid var(--border)" : "none", paddingLeft: i > 0 ? 40 : 0 }}
              >
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text-2)", lineHeight: 1.75, marginBottom: 32 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar initials={t.avatar} size={38} gold />
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text)", margin: 0 }}>{t.name}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-3)", margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Animated partners marquee */}
          <div style={{ marginTop: 64, paddingTop: 48, borderTop: "1px solid var(--border)", overflow:"hidden" }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", textAlign:"center", marginBottom:28 }}>
              Trusted partners &amp; affiliates
            </p>
            <div style={{ position:"relative", overflow:"hidden", maskImage:"linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)", WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
              <div className="marquee-track" style={{ display:"flex", whiteSpace:"nowrap", gap:0 }}>
                {[0,1].map(copy => (
                  <span key={copy} style={{ display:"inline-flex", gap:0 }}>
                    {["Knight Frank","Colliers","Deloitte","PwC","KPMG","Baker McKenzie","Indochina Capital","CBRE","Savills","JLL","Knight Frank","Colliers","Deloitte"].map((name,i) => (
                      <span key={name+i} style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1rem,1.4vw,1.2rem)", fontWeight:400, color:"var(--text-3)", paddingRight:72, letterSpacing:"0.01em", display:"inline-block" }}>{name}</span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGN IN CTA STRIP ────────────────────────────────────────── */}
      <section className="pattern-diag section-pad" style={{ background: "#F5EFE4", padding: "80px 48px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>Join 2,400+ professionals</p>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, color: "var(--text)", marginBottom: 12, lineHeight: 1.15 }}>No commitment required.</h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "var(--text-2)", maxWidth: 400, margin: "0 auto 40px", lineHeight: 1.7 }}>Sign up free and explore our spaces. Upgrade to Pro whenever you're ready.</p>
        <Link
          to="/register"
          style={textLink}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; }}
        >
          Create free account →
        </Link>
      </section>


    </PageWrap>
  );
};

export default Homepage;
