import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap, Icon } from "../components/index.jsx";

const fade = (d=0) => ({ initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.6,delay:d} });

/* ═══════════════════════════════════════════════════
   FEATURE 2 — Shared components for membership pages
═══════════════════════════════════════════════════ */

/* ── 2a. Sticky jump-nav ── */
const JumpNav = ({ anchorBase }) => {
  const links = [
    { id:`${anchorBase}-overview`,  label:"Overview" },
    { id:`${anchorBase}-included`,  label:"What's included" },
    { id:`${anchorBase}-locations`, label:"Locations" },
    { id:`${anchorBase}-pricing`,   label:"Pricing" },
    { id:`${anchorBase}-enquiry`,   label:"Enquire" },
  ];
  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };
  return (
    <div style={{ position:"sticky", top:64, zIndex:30, background:"rgba(248,246,241,0.95)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderBottom:"1px solid var(--border)" }}>
      <div style={{ maxWidth:1300, margin:"0 auto", padding:"14px 64px", display:"flex", gap:32, flexWrap:"wrap", justifyContent:"center" }}>
        {links.map(l => (
          <button key={l.id} onClick={()=>jump(l.id)}
            style={{ background:"none", border:"none", padding:"4px 0", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:500, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text-2)", transition:"color 0.15s, border-color 0.15s", borderBottom:"1px solid transparent" }}
            onMouseEnter={e=>{ e.currentTarget.style.color="var(--gold)"; e.currentTarget.style.borderBottomColor="var(--gold)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.color="var(--text-2)"; e.currentTarget.style.borderBottomColor="transparent"; }}>
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── 2b. Available at these locations ── */
const PLAN_DISTRICTS = [
  { slug:"obc", name:"OBC 60 Lý Thái Tổ", floor:"Ground floor", line:"Hoàn Kiếm lakeside.", img:"/workspace-photos/d21d717acd95beefb878fd1f7e62b7d70e59c97a-2250x1500.avif" },
  { slug:"ttt", name:"HiLink 15 Tôn Thất Tùng", floor:"Floor 15", line:"Đống Đa business address.", img:"/workspace-photos/235510ecf59fb755c102c0f4b2254ba63925f069-1800x1200.avif" },
];
const LocationsSection = ({ id, eyebrow, heading, ctaLabel="Explore this location" }) => (
  <div id={id} style={{ padding:"64px 64px", background:"#FFFFFF" }}>
    <motion.div {...fade()} style={{ marginBottom:40 }}>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>{eyebrow || "Where to find us"}</p>
      <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>{heading || "Available at these locations"}</h2>
    </motion.div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"var(--border)" }}>
      {PLAN_DISTRICTS.map((d,i) => (
        <motion.div key={d.slug} {...fade(i*0.08)} className="hover-lift" style={{ background:"#FFFFFF" }}>
          <Link to={`/spaces?district=${d.slug}`} style={{ textDecoration:"none", color:"inherit", display:"block" }}>
            <div style={{ height:240, overflow:"hidden" }}>
              <img src={d.img} alt={d.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
            </div>
            <div style={{ padding:"24px 28px 28px" }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>{d.floor}</p>
              <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.4rem", fontWeight:400, color:"var(--text)", marginBottom:10 }}>{d.name}</h3>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", marginBottom:18, lineHeight:1.65 }}>{d.line}</p>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text)", borderBottom:"1px solid var(--text)", paddingBottom:2 }}>{ctaLabel} →</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ── 2c. Pricing tiers ── */
const PricingTiers = ({ id, eyebrow, heading, tiers, enquiryAnchor }) => {
  const scrollToEnquiry = () => {
    const el = document.getElementById(enquiryAnchor);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };
  return (
    <div id={id} style={{ padding:"64px 64px", background:"var(--bg-2)" }}>
      <motion.div {...fade()} style={{ marginBottom:40 }}>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>{eyebrow || "Choose your plan"}</p>
        <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>{heading || "Pricing"}</h2>
      </motion.div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"var(--border)" }}>
        {tiers.map((t,i) => (
          <motion.div key={t.name} {...fade(i*0.08)} className="hover-lift" style={{ background:"#FFFFFF", padding:"36px 32px", display:"flex", flexDirection:"column", position:"relative" }}>
            {t.tag && <span style={{ position:"absolute", top:18, right:18, fontFamily:"'Inter',sans-serif", fontSize:9, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--gold)", border:"1px solid var(--border-gold)", padding:"3px 8px" }}>{t.tag}</span>}
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:10 }}>{t.label}</p>
            <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.3rem", fontWeight:400, color:"var(--text)", marginBottom:18 }}>{t.name}</h3>
            <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"2rem", fontWeight:400, color:"var(--gold)", lineHeight:1.1, marginBottom:6 }}>{t.price}</p>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", marginBottom:24 }}>{t.priceNote}</p>
            <div style={{ flex:1, marginBottom:24, borderTop:"1px solid var(--border)", paddingTop:20 }}>
              {t.features.map(f => (
                <div key={f} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"flex-start" }}>
                  <span style={{ flexShrink:0, marginTop:1 }}><Icon name="check" size={16} stroke="var(--gold)"/></span>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)", lineHeight:1.5 }}>{f}</p>
                </div>
              ))}
            </div>
            <button onClick={scrollToEnquiry}
              style={{ padding:"12px 20px", background:"var(--text)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--gold)"}
              onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
              Make an enquiry →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ── 2d. FAQ accordion ── */
const FAQAccordion = ({ items }) => {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ maxWidth:880, margin:"0 auto" }}>
      {items.map((q,i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom:"1px solid var(--border)" }}>
            <button onClick={()=>setOpen(isOpen ? null : i)}
              style={{ width:"100%", textAlign:"left", background:"none", border:"none", padding:"22px 0", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:24, fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.05rem", fontWeight:400, color:"var(--text)" }}>
              <span style={{ paddingRight:8 }}>{q.q}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }} style={{ flexShrink:0, display:"inline-flex", color:"var(--gold)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6"/></svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }} style={{ overflow:"hidden" }}>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-2)", lineHeight:1.75, paddingBottom:22, paddingRight:48 }}>{q.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
const FAQSection = ({ items }) => (
  <div style={{ padding:"64px 64px", background:"#FFFFFF" }}>
    <motion.div {...fade()} style={{ marginBottom:40, textAlign:"center" }}>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>Common questions</p>
      <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>Frequently asked</h2>
    </motion.div>
    <FAQAccordion items={items} />
  </div>
);

/* ── 2e. Cross-sell strip ── */
const ALL_PLANS = [
  { key:"office",  name:"HiLink Office",  route:"/membership/office",  desc:"Fully private offices for teams." },
  { key:"desk",    name:"HiLink Desk",    route:"/membership/desk",    desc:"Your dedicated desk in our coworking." },
  { key:"roam",    name:"HiLink Roam",    route:"/membership/roam",    desc:"Flexible hot desk access." },
  { key:"virtual", name:"HiLink Virtual", route:"/membership/virtual", desc:"Prestige Hanoi business address." },
];
const CrossSell = ({ current }) => {
  const others = ALL_PLANS.filter(p => p.key !== current);
  return (
    <div style={{ padding:"56px 64px", background:"var(--bg-3)", borderTop:"1px solid var(--border)" }}>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:10, textAlign:"center" }}>Looking for something else?</p>
      <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.6rem", fontWeight:400, color:"var(--text)", textAlign:"center", marginBottom:32 }}>Explore our other memberships</h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"var(--border)", maxWidth:1100, margin:"0 auto" }}>
        {others.map(p => (
          <Link key={p.key} to={p.route} className="hover-lift" style={{ background:"#FFFFFF", padding:"28px 24px", textDecoration:"none", color:"inherit", display:"block" }}>
            <h4 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.15rem", fontWeight:400, color:"var(--text)", marginBottom:8 }}>{p.name}</h4>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", marginBottom:16, lineHeight:1.6 }}>{p.desc}</p>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--gold)" }}>Learn more →</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ── Per-plan content (pricing tiers + FAQs) ── */
const PLAN_CONTENT = {
  office: {
    tiers: [
      { label:"Small team", name:"1–4 desks",  price:"₫22M",  priceNote:"/month, from",  features:["Private office for up to 4","All amenities included","Month-to-month lease","Business address registration"] },
      { label:"Growing team", name:"5–15 desks", price:"₫45M",  priceNote:"/month, from",  tag:"Most popular", features:["Private suite for up to 15","Dedicated meeting room credits","24/7 access","Branded entrance signage"] },
      { label:"Enterprise", name:"16+ desks",  price:"Bespoke",priceNote:"contact our team", features:["Full-floor occupancy available","Tailored fit-out & furnishings","Dedicated account manager","Multi-floor expansion options"] },
    ],
    faqs: [
      { q:"What's the minimum lease term?", a:"HiLink Office starts at a 1-month minimum on flexible terms. You can scale up or down with 30 days' notice." },
      { q:"Can I personalise the office?", a:"Yes — bespoke design and furnishings are available on request, including company branding at your entrance and choice of layout." },
      { q:"What's included in the price?", a:"Everything: WiFi, utilities, cleaning, maintenance, building insurance, and 24/7 access to your space. One flat monthly bill, no surprises." },
      { q:"Do I get access to other floors?", a:"Yes, your team has business-hours access to coworking lounges across all three HiLink floors and member rates on meeting rooms." },
      { q:"How quickly can we move in?", a:"Move-in ready offices are available within 48 hours. Bespoke fit-outs typically take 2–4 weeks." },
    ],
  },
  desk: {
    tiers: [
      { label:"Monthly", name:"Monthly", price:"₫8.5M", priceNote:"/month, from", features:["Your dedicated desk, always yours","Lockable storage drawer","5 hrs meeting room credits","Multi-floor access"] },
      { label:"Quarterly", name:"Quarterly", price:"₫7.5M", priceNote:"/month, 3 mo. min", tag:"Best value", features:["10% off monthly rate","Locker upgrade included","8 hrs meeting room credits","Priority on community events"] },
      { label:"Annual", name:"Annual", price:"₫6.5M", priceNote:"/month, 12 mo. min", features:["25% off monthly rate","Premium locker location","15 hrs meeting room credits","Free guest passes (4/month)"] },
    ],
    faqs: [
      { q:"Is my desk truly mine?", a:"Yes — your desk, monitor setup, chair, and storage are reserved for you and only you. No hot-desking, no competing for space." },
      { q:"Can I switch floors?", a:"Your dedicated desk lives on one floor, but you can drop into coworking areas on the other two HiLink floors whenever you need a change of scene." },
      { q:"What if I need to pause for a month?", a:"On monthly contracts you can pause with 14 days' notice. On annual contracts we offer up to one month per year freeze." },
      { q:"Can I have post delivered to my desk?", a:"Yes. All members receive post and parcels at reception, which our team will sign for and notify you about by email." },
    ],
  },
  roam: {
    tiers: [
      { label:"Casual", name:"Hourly", price:"₫89k", priceNote:"/hour", features:["Pay per hour, no commitment","Any HiLink floor, any time","All amenities included","Book in advance via portal"] },
      { label:"Regular", name:"Day pass", price:"₫350k", priceNote:"/day", tag:"Popular", features:["Full day of unlimited access","Specialty coffee & snacks","Phone booth bookings","Bundle discounts available"] },
      { label:"Frequent", name:"Monthly", price:"₫5.5M", priceNote:"/month, unlimited", features:["Unlimited drop-in access","2 hrs meeting room credits","Guest passes (2/month)","Priority booking on hot zones"] },
    ],
    faqs: [
      { q:"Do I need to book in advance?", a:"Not for general hot desks during off-peak hours. We recommend booking ahead for popular zones and during 10am–2pm peak times via the portal." },
      { q:"Can I bring a guest?", a:"Monthly Roam members get 2 free guest day passes per month. Hourly and day-pass users can purchase guest passes at reception." },
      { q:"Is there a minimum stay?", a:"No. Hourly Roam is genuinely pay-per-hour with a 1-hour minimum. Day passes are valid for one calendar day." },
      { q:"Can I get a permanent desk later?", a:"Yes — all Roam members get priority and 30 days at the monthly rate when upgrading to HiLink Desk." },
    ],
  },
  virtual: {
    tiers: [
      { label:"Lite", name:"Lite", price:"₫3.5M", priceNote:"/month", features:["Premium Hanoi business address","Mail receipt & email alerts","Use for company registration","Quarterly day pass (1 day)"] },
      { label:"Standard", name:"Standard", price:"₫5.5M", priceNote:"/month", tag:"Recommended", features:["Everything in Lite","Mail forwarding (weekly)","Dedicated Hanoi phone number","5 day passes per month"] },
      { label:"Premium", name:"Premium", price:"₫8.5M", priceNote:"/month", features:["Everything in Standard","Daily mail forwarding","Live call answering service","Unlimited day passes"] },
    ],
    faqs: [
      { q:"Can I register my business at this address?", a:"Yes. Our OBC 60 Lý Thái Tổ and 15 Tôn Thất Tùng addresses are approved for business registration, VAT, and banking documentation in Vietnam." },
      { q:"How is mail handled?", a:"All post is received and signed for by our reception team, with email notification on the same day. Forwarding frequency depends on your tier." },
      { q:"What is the dedicated phone number?", a:"You receive a Hanoi landline (024) number on the Standard tier and above. Calls are forwarded to a number of your choice, or answered live on Premium." },
      { q:"Can I use meeting rooms?", a:"Yes. Virtual members get member rates on all HiLink meeting rooms, bookable through the portal up to 30 days in advance." },
      { q:"What if I need a real office later?", a:"Virtual members get 30 days at member rates when transitioning to HiLink Desk or Office, plus a dedicated onboarding manager." },
    ],
  },
};

/* ── Shared enquiry form ── */
const EnquiryForm = ({ planName }) => {
  const [form, setForm] = useState({ name:"", email:"", company:"", teamSize:"", message:"", start:"" });
  const [sent, setSent] = useState(false);
  const set = k => v => setForm(f=>({...f,[k]:v}));
  const lbl = { fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", display:"block", marginBottom:6 };
  const inp = { width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:13, outline:"none", borderRadius:0 };
  if (sent) return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} style={{ background:"rgba(45,106,79,0.06)", border:"1px solid rgba(45,106,79,0.2)", padding:"32px", textAlign:"center" }}>
      <p style={{ fontSize:32, marginBottom:12 }}>✓</p>
      <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.2rem", color:"var(--text)", marginBottom:8 }}>Enquiry received</p>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)" }}>A member of our team will be in touch within 2 business hours.</p>
    </motion.div>
  );
  return (
    <div style={{ background:"#FFFFFF", border:"1px solid var(--border)", padding:"36px" }}>
      <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.3rem", fontWeight:400, color:"var(--text)", marginBottom:6 }}>Enquire about {planName}</h3>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", marginBottom:28 }}>Our team will get back to you within 2 business hours.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lbl}>Full name</label><input value={form.name} onChange={e=>set("name")(e.target.value)} placeholder="Your name" style={inp}/></div>
        <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>set("email")(e.target.value)} placeholder="you@company.com" style={inp}/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lbl}>Company</label><input value={form.company} onChange={e=>set("company")(e.target.value)} placeholder="Company name" style={inp}/></div>
        <div><label style={lbl}>Team size</label><input type="number" value={form.teamSize} onChange={e=>set("teamSize")(e.target.value)} placeholder="Number of people" style={inp}/></div>
      </div>
      <div style={{ marginBottom:16 }}>
        <label style={lbl}>Preferred start date</label>
        <input type="date" value={form.start} onChange={e=>set("start")(e.target.value)} style={inp}/>
      </div>
      <div style={{ marginBottom:24 }}>
        <label style={lbl}>Message (optional)</label>
        <textarea value={form.message} onChange={e=>set("message")(e.target.value)} placeholder="Any specific requirements?" style={{...inp, minHeight:90, resize:"vertical"}}/>
      </div>
      <button onClick={()=>setSent(true)}
        style={{ width:"100%", padding:"14px", background:"var(--text)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.15s" }}
        onMouseEnter={e=>e.currentTarget.style.background="var(--gold)"}
        onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
        Send enquiry →
      </button>
    </div>
  );
};

/* ── Shared feature icon card ── */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="hover-lift" style={{ background:"#FFFFFF", border:"1px solid var(--border)", padding:"28px 24px", display:"flex", flexDirection:"column", alignItems:"flex-start", height:"100%" }}>
    <div style={{ width:48, height:48, background:"var(--bg-2)", border:"1px solid var(--border-gold)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
      <Icon name={icon} size={22} stroke="var(--gold)" />
    </div>
    <h4 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1rem", fontWeight:400, color:"var(--text)", marginBottom:8 }}>{title}</h4>
    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", lineHeight:1.65 }}>{desc}</p>
  </div>
);

/* ── Shared gallery strip ── */
const GalleryStrip = ({ imgs }) => {
  const [active, setActive] = useState(null);
  return (
    <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:4 }}>
      {imgs.slice(0,3).map((src,i) => (
        <div key={i} style={{ overflow:"hidden", cursor:"zoom-in", height:i===0?360:176 }} onClick={()=>setActive(active===i?null:i)}>
          <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   HILINK OFFICE  (private offices)
═══════════════════════════════════════════════════ */
export function HilinkOfficePage() {
  const navigate = useNavigate();
  const IMGS = [
    "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F0eaab531fabea051964e0d8257b65539d925ab60-11450x8587.jpg%3Fw%3D1000&w=1600&q=90",
    "/workspace-photos/DSC05997.jpg",
    "/workspace-photos/9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif",
    "/workspace-photos/2063289b5ed54b17130343c5c069f1e527a9c10a-6531x4354.avif",
  ];
  const FEATURES = [
    { icon:"lock", title:"Fully private & secure", desc:"Floor-to-ceiling glass with frosted privacy film, secure keycard entry to your office, and lockable storage." },
    { icon:"layers", title:"Move-in ready", desc:"Fully furnished offices ready on day one. Ergonomic chairs, adjustable desks, cable management — everything you need." },
    { icon:"doc", title:"Flexible terms", desc:"Month-to-month or multi-year leases. Scale up or down as your team grows with no penalty." },
    { icon:"globe", title:"Business address", desc:"Use our premium OBC 60 Lý Thái Tổ or 15 Tôn Thất Tùng address for company registration, mail handling, and client correspondence." },
    { icon:"coffee", title:"Shared amenities", desc:"Access the entire HiLink floor: specialty coffee bar, meeting rooms, phone booths, gym, and roof terrace." },
    { icon:"bolt", title:"All bills included", desc:"WiFi, utilities, cleaning, maintenance, building insurance — one flat monthly bill. No surprises." },
  ];
  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        {/* Hero */}
        <div style={{ position:"relative", height:"70vh", overflow:"hidden" }}>
          <img src={IMGS[0]} alt="HiLink Office" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)" }} />
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            style={{ position:"absolute", bottom:0, left:0, padding:"0 64px 72px", maxWidth:760 }}>
            <img src="/workspace-photos/logo-workspace-trim.png" alt="HiLink Private Office" style={{ height:72, width:"auto", display:"block", marginBottom:18 }}/>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>Private Office</p>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2.5rem,5vw,4.5rem)", fontWeight:400, color:"#FFFFFF", lineHeight:1.05, marginBottom:20 }}>HiLink Office</h1>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:"rgba(255,255,255,0.82)", lineHeight:1.75, maxWidth:560, marginBottom:32 }}>
              Your own fully private office in one of Hanoi's most prestigious addresses. Ready to move in. Ready to grow.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:24 }}>
              <button onClick={()=>document.getElementById("office-enquiry").scrollIntoView({behavior:"smooth"})}
                style={{ padding:"13px 28px", background:"var(--gold)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer" }}>
                Enquire now
              </button>
              <Link to="/membership" style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(255,255,255,0.7)", textDecoration:"none", borderBottom:"1px solid rgba(255,255,255,0.35)", paddingBottom:1 }}>← All memberships</Link>
            </div>
          </motion.div>
        </div>

        {/* Pricing banner */}
        <div style={{ background:"var(--text)", padding:"20px 64px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          {[["From","₫45,000,000/month"],["Capacity","2–50 people"],["Lease","1 month minimum"],["Location","3 floors across Hanoi"]].map(([k,v])=>(
            <div key={k}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:"rgba(255,255,255,0.45)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:4 }}>{k}</p>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"#FFFFFF" }}>{v}</p>
            </div>
          ))}
        </div>

        <JumpNav anchorBase="office" />

        {/* Gallery */}
        <div id="office-overview" style={{ padding:"48px 64px", background:"#FFFFFF" }}>
          <GalleryStrip imgs={IMGS} />
        </div>

        {/* Features */}
        <div id="office-included" style={{ padding:"64px 64px", background:"var(--bg-2)" }}>
          <motion.div {...fade()} style={{ marginBottom:48 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>What's included</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>Everything your team needs</h2>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {FEATURES.map((f,i) => <motion.div key={f.title} {...fade(i*0.07)}><FeatureCard {...f}/></motion.div>)}
          </div>
        </div>

        {/* Enquiry + CTA */}
        <div style={{ padding:"64px 64px", background:"#FFFFFF" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
            <div id="office-enquiry">
              <EnquiryForm planName="HiLink Office" />
            </div>
            <div style={{ paddingTop:8 }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>Why choose HiLink Office</p>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,2.5vw,2.2rem)", fontWeight:400, color:"var(--text)", marginBottom:20, lineHeight:1.2 }}>Your business. Your space. Your brand.</h2>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-2)", lineHeight:1.8, marginBottom:24 }}>
                A HiLink private office isn't just a place to work — it's a place to build. With your name on the door, your culture on the walls, and your team around you, you'll have everything you need to create something extraordinary.
              </p>
              {["No long-term commitment required","Includes dedicated meeting room credits","24/7 access for Pro members","Pet-friendly floors available"].map(item => (
                <div key={item} style={{ display:"flex", gap:12, marginBottom:12 }}>
                  <span style={{ color:"var(--gold)", flexShrink:0, marginTop:1 }}>✓</span>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <LocationsSection id="office-locations" eyebrow="Where to find us" heading="Available at these locations" ctaLabel="Explore offices" />
        <PricingTiers id="office-pricing" eyebrow="Choose your plan" heading="Office pricing" tiers={PLAN_CONTENT.office.tiers} enquiryAnchor="office-enquiry" />
        <FAQSection items={PLAN_CONTENT.office.faqs} />
        <CrossSell current="office" />
      </div>
    </PageWrap>
  );
}

/* ═══════════════════════════════════════════════════
   HILINK DESK  (dedicated desk / coworking)
═══════════════════════════════════════════════════ */
export function HilinkDeskPage() {
  const navigate = useNavigate();
  const IMGS = [
    "/workspace-photos/235510ecf59fb755c102c0f4b2254ba63925f069-1800x1200.avif",
    "/workspace-photos/a57e2c5781bc65cf0e2a061375bf32119341b3b2-2048x1366.avif",
    "/workspace-photos/DSC05997.jpg",
  ];
  const FEATURES = [
    { icon:"chair", title:"Your dedicated desk", desc:"A permanent desk with your monitor setup, storage pedestal, ergonomic chair — no hot-desking, no competing for space." },
    { icon:"key", title:"Secure storage", desc:"Lockable drawer unit and locker to store personal belongings safely when you're away." },
    { icon:"globe", title:"Multi-floor access", desc:"Your desk membership grants access to coworking areas on all three HiLink floors." },
    { icon:"calendar", title:"Meeting room credits", desc:"5 hours of meeting room credits per month, bookable through the HiLink portal." },
    { icon:"mail", title:"Business address", desc:"Use our Hanoi business address for post, banking, and company registration." },
    { icon:"coffee", title:"Full amenity access", desc:"Specialty coffee, phone booths, high-speed WiFi, printing, and communal events." },
  ];
  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        <div style={{ position:"relative", height:"70vh", overflow:"hidden" }}>
          <img src={IMGS[0]} alt="HiLink Desk" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)" }} />
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            style={{ position:"absolute", bottom:0, left:0, padding:"0 64px 72px", maxWidth:760 }}>
            <img src="/workspace-photos/logo-workspace-trim.png" alt="HiLink Dedicated Desk" style={{ height:62, width:"auto", display:"block", marginBottom:18 }}/>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>Dedicated Desk</p>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2.5rem,5vw,4.5rem)", fontWeight:400, color:"#FFFFFF", lineHeight:1.05, marginBottom:20 }}>HiLink Desk</h1>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:"rgba(255,255,255,0.82)", lineHeight:1.75, maxWidth:560, marginBottom:32 }}>
              Your own dedicated desk in an inspiring coworking environment. All the community, none of the compromise.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:24 }}>
              <button onClick={()=>document.getElementById("desk-enquiry").scrollIntoView({behavior:"smooth"})}
                style={{ padding:"13px 28px", background:"var(--gold)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer" }}>
                Enquire now
              </button>
              <Link to="/membership" style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(255,255,255,0.7)", textDecoration:"none", borderBottom:"1px solid rgba(255,255,255,0.35)", paddingBottom:1 }}>← All memberships</Link>
            </div>
          </motion.div>
        </div>
        <div style={{ background:"var(--text)", padding:"20px 64px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          {[["From","₫8,500,000/month"],["Capacity","1 person"],["Lease","1 month minimum"],["Access","All 3 floors"]].map(([k,v])=>(
            <div key={k}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:"rgba(255,255,255,0.45)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:4 }}>{k}</p>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"#FFFFFF" }}>{v}</p>
            </div>
          ))}
        </div>
        <JumpNav anchorBase="desk" />
        <div id="desk-overview" style={{ padding:"48px 64px", background:"#FFFFFF" }}><GalleryStrip imgs={IMGS}/></div>
        <div id="desk-included" style={{ padding:"64px 64px", background:"var(--bg-2)" }}>
          <motion.div {...fade()} style={{ marginBottom:48 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>What's included</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>Your spot, waiting for you</h2>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {FEATURES.map((f,i) => <motion.div key={f.title} {...fade(i*0.07)}><FeatureCard {...f}/></motion.div>)}
          </div>
        </div>
        <div style={{ padding:"64px 64px", background:"#FFFFFF" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
            <div id="desk-enquiry"><EnquiryForm planName="HiLink Desk" /></div>
            <div style={{ paddingTop:8 }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>Why choose HiLink Desk</p>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,2.5vw,2.2rem)", fontWeight:400, color:"var(--text)", marginBottom:20, lineHeight:1.2 }}>The energy of a team. The focus of your own space.</h2>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-2)", lineHeight:1.8, marginBottom:24 }}>
                HiLink Desk gives you the best of both worlds — the social energy and serendipity of coworking, with the routine and reliability of a permanent desk that's always yours.
              </p>
              {["Your desk ready every morning","Included in all-floor access pass","Community events and networking","Month-to-month flexibility"].map(item => (
                <div key={item} style={{ display:"flex", gap:12, marginBottom:12 }}>
                  <span style={{ color:"var(--gold)", flexShrink:0, marginTop:1 }}>✓</span>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <LocationsSection id="desk-locations" eyebrow="Where to find us" heading="Your desk, in your favourite spot" ctaLabel="Explore desks" />
        <PricingTiers id="desk-pricing" eyebrow="Choose your plan" heading="Desk pricing" tiers={PLAN_CONTENT.desk.tiers} enquiryAnchor="desk-enquiry" />
        <FAQSection items={PLAN_CONTENT.desk.faqs} />
        <CrossSell current="desk" />
      </div>
    </PageWrap>
  );
}

/* ═══════════════════════════════════════════════════
   HILINK ROAM  (hot desk / flexible)
═══════════════════════════════════════════════════ */
export function HilinkRoamPage() {
  const IMGS = [
    "/workspace-photos/9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif",
    "/workspace-photos/a57e2c5781bc65cf0e2a061375bf32119341b3b2-2048x1366.avif",
    "/workspace-photos/ad7f4d6f9e6ba26fc29098d62b6911062f900bf1-2048x1365.avif",
  ];
  const FEATURES = [
    { icon:"calendar", title:"Pay as you go", desc:"Book by the hour or day. Work when you want, only pay for the time you use." },
    { icon:"building", title:"Access all floors", desc:"One membership, two locations. Switch between OBC 60 Lý Thái Tổ and 15 Tôn Thất Tùng." },
    { icon:"bolt", title:"Ready in seconds", desc:"Walk in, connect to WiFi, and get to work. No booking required for hot desk areas during off-peak hours." },
    { icon:"users", title:"Built-in community", desc:"Meet founders, freelancers, and innovators from across Hanoi every time you visit." },
    { icon:"phone_mobile", title:"App booking", desc:"Reserve your preferred floor and zone in advance via the HiLink portal to guarantee a spot." },
    { icon:"coffee", title:"Full amenities", desc:"Specialty coffee, printing, phone booths, and communal spaces all included." },
  ];
  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        <div style={{ position:"relative", height:"70vh", overflow:"hidden" }}>
          <img src={IMGS[0]} alt="HiLink Roam" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)" }} />
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            style={{ position:"absolute", bottom:0, left:0, padding:"0 64px 72px", maxWidth:760 }}>
            <img src="/workspace-photos/logo-workspace-trim.png" alt="HiLink Flexible Hot Desk" style={{ height:62, width:"auto", display:"block", marginBottom:18 }}/>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>Flexible Hot Desk</p>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2.5rem,5vw,4.5rem)", fontWeight:400, color:"#FFFFFF", lineHeight:1.05, marginBottom:20 }}>HiLink Roam</h1>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:"rgba(255,255,255,0.82)", lineHeight:1.75, maxWidth:560, marginBottom:32 }}>
              Switch up your workday. Access our inspiring spaces across all floors — whenever you need it, for however long you like.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:24 }}>
              <button onClick={()=>document.getElementById("roam-enquiry").scrollIntoView({behavior:"smooth"})}
                style={{ padding:"13px 28px", background:"var(--gold)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer" }}>
                Get started
              </button>
              <Link to="/membership" style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(255,255,255,0.7)", textDecoration:"none", borderBottom:"1px solid rgba(255,255,255,0.35)", paddingBottom:1 }}>← All memberships</Link>
            </div>
          </motion.div>
        </div>
        <div style={{ background:"var(--text)", padding:"20px 64px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          {[["From","₫89,000/hour"],["Day pass","₫350,000/day"],["Monthly","₫5,500,000/month"],["Access","All 3 floors, any time"]].map(([k,v])=>(
            <div key={k}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:"rgba(255,255,255,0.45)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:4 }}>{k}</p>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"#FFFFFF" }}>{v}</p>
            </div>
          ))}
        </div>
        <JumpNav anchorBase="roam" />
        <div id="roam-overview" style={{ padding:"48px 64px", background:"#FFFFFF" }}><GalleryStrip imgs={IMGS}/></div>
        <div id="roam-included" style={{ padding:"64px 64px", background:"var(--bg-2)" }}>
          <motion.div {...fade()} style={{ marginBottom:48 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>What's included</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>Work where inspiration finds you</h2>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {FEATURES.map((f,i) => <motion.div key={f.title} {...fade(i*0.07)}><FeatureCard {...f}/></motion.div>)}
          </div>
        </div>
        <div style={{ padding:"64px 64px", background:"#FFFFFF" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
            <div id="roam-enquiry"><EnquiryForm planName="HiLink Roam" /></div>
            <div style={{ paddingTop:8 }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>Who it's for</p>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,2.5vw,2.2rem)", fontWeight:400, color:"var(--text)", marginBottom:20, lineHeight:1.2 }}>For freelancers, founders, and everyone in between.</h2>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-2)", lineHeight:1.8, marginBottom:24 }}>
                HiLink Roam is built for people whose work doesn't fit a 9-to-5 mould. Whether you're working from Hanoi for a week or building your startup from scratch, Roam gives you the infrastructure without the commitment.
              </p>
              {["No long-term contract needed","Drop-in or pre-book via portal","Discounts on day passes and bundles","Access to all HiLink events"].map(item => (
                <div key={item} style={{ display:"flex", gap:12, marginBottom:12 }}>
                  <span style={{ color:"var(--gold)", flexShrink:0, marginTop:1 }}>✓</span>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <LocationsSection id="roam-locations" eyebrow="Where to roam" heading="Two locations, your choice" ctaLabel="Explore floors" />
        <PricingTiers id="roam-pricing" eyebrow="Choose your plan" heading="Roam pricing" tiers={PLAN_CONTENT.roam.tiers} enquiryAnchor="roam-enquiry" />
        <FAQSection items={PLAN_CONTENT.roam.faqs} />
        <CrossSell current="roam" />
      </div>
    </PageWrap>
  );
}

/* ═══════════════════════════════════════════════════
   HILINK VIRTUAL  (virtual office)
═══════════════════════════════════════════════════ */
export function HilinkVirtualPage() {
  const IMGS = [
    "/workspace-photos/761e2d35fafc758157f6414d741bde04927cf465-6720x4480.avif",
    "/workspace-photos/235510ecf59fb755c102c0f4b2254ba63925f069-1800x1200.avif",
    "/workspace-photos/7f697d83c67bd824c915269932304e1e50668dd0-1800x1200.avif",
  ];
  const FEATURES = [
    { icon:"building", title:"Prestigious address", desc:"Register your company at our OBC 60 Lý Thái Tổ or 15 Tôn Thất Tùng address — two of Hanoi's most prestigious locations." },
    { icon:"mail", title:"Mail handling", desc:"All post received, signed for, and forwarded or held for collection. Notified by email for every delivery." },
    { icon:"phone", title:"Call forwarding", desc:"A dedicated Hanoi business number that forwards to your mobile or international number." },
    { icon:"calendar", title:"5 day passes/month", desc:"Physical access to any HiLink floor for 5 days per month — for client meetings or focused work sessions." },
    { icon:"doc", title:"Company registration", desc:"Use our address for VAT registration, business banking, and official correspondence." },
    { icon:"globe", title:"Remote-first friendly", desc:"Build a credible Hanoi presence from anywhere in the world with zero physical commitment." },
  ];
  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        <div style={{ position:"relative", height:"70vh", overflow:"hidden" }}>
          <img src={IMGS[0]} alt="HiLink Virtual" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)" }} />
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            style={{ position:"absolute", bottom:0, left:0, padding:"0 64px 72px", maxWidth:760 }}>
            <img src="/workspace-photos/logo-workspace-trim.png" alt="HiLink Virtual Office" style={{ height:62, width:"auto", display:"block", marginBottom:18 }}/>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>Virtual Office</p>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2.5rem,5vw,4.5rem)", fontWeight:400, color:"#FFFFFF", lineHeight:1.05, marginBottom:20 }}>HiLink Virtual</h1>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:"rgba(255,255,255,0.82)", lineHeight:1.75, maxWidth:560, marginBottom:32 }}>
              A prestigious Hanoi address and professional services without the cost of a full office. Your business, elevated.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:24 }}>
              <button onClick={()=>document.getElementById("virtual-enquiry").scrollIntoView({behavior:"smooth"})}
                style={{ padding:"13px 28px", background:"var(--gold)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer" }}>
                Get started
              </button>
              <Link to="/membership" style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(255,255,255,0.7)", textDecoration:"none", borderBottom:"1px solid rgba(255,255,255,0.35)", paddingBottom:1 }}>← All memberships</Link>
            </div>
          </motion.div>
        </div>
        <div style={{ background:"var(--text)", padding:"20px 64px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          {[["From","₫3,500,000/month"],["Address","60 Lý Thái Tổ or 15 Tôn Thất Tùng"],["Day passes","5 included/month"],["Term","Monthly rolling"]].map(([k,v])=>(
            <div key={k}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:"rgba(255,255,255,0.45)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:4 }}>{k}</p>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"#FFFFFF" }}>{v}</p>
            </div>
          ))}
        </div>
        <JumpNav anchorBase="virtual" />
        <div id="virtual-overview" style={{ padding:"48px 64px", background:"#FFFFFF" }}><GalleryStrip imgs={IMGS}/></div>
        <div id="virtual-included" style={{ padding:"64px 64px", background:"var(--bg-2)" }}>
          <motion.div {...fade()} style={{ marginBottom:48 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>What's included</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>A Hanoi presence without the overhead</h2>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {FEATURES.map((f,i) => <motion.div key={f.title} {...fade(i*0.07)}><FeatureCard {...f}/></motion.div>)}
          </div>
        </div>
        <div style={{ padding:"64px 64px", background:"#FFFFFF" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
            <div id="virtual-enquiry"><EnquiryForm planName="HiLink Virtual" /></div>
            <div style={{ paddingTop:8 }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>Perfect for</p>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,2.5vw,2.2rem)", fontWeight:400, color:"var(--text)", marginBottom:20, lineHeight:1.2 }}>Businesses building a Hanoi presence.</h2>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-2)", lineHeight:1.8, marginBottom:24 }}>
                HiLink Virtual is ideal for overseas companies expanding into Vietnam, remote-first businesses needing a credible address, or solo founders who want the professionalism of a business address without paying for an office.
              </p>
              {["International businesses expanding to Vietnam","Freelancers and remote workers","Startups not yet ready for a full office","Companies testing the Hanoi market"].map(item => (
                <div key={item} style={{ display:"flex", gap:12, marginBottom:12 }}>
                  <span style={{ color:"var(--gold)", flexShrink:0, marginTop:1 }}>✓</span>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <LocationsSection id="virtual-locations" eyebrow="Your registered address" heading="Choose your Hanoi address" ctaLabel="Learn more" />
        <PricingTiers id="virtual-pricing" eyebrow="Choose your plan" heading="Virtual pricing" tiers={PLAN_CONTENT.virtual.tiers} enquiryAnchor="virtual-enquiry" />
        <FAQSection items={PLAN_CONTENT.virtual.faqs} />
        <CrossSell current="virtual" />
      </div>
    </PageWrap>
  );
}
