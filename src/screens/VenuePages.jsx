import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap } from "../components/index.jsx";

const fade = (d=0) => ({ initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.6,delay:d} });
const lbl = { fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", display:"block", marginBottom:6 };
const inp = { width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:13, outline:"none", borderRadius:0 };
const sel = { ...inp };

const DISTRICTS = [
  { slug:"obc-ly-thai-to", name:"OBC 60 Lý Thái Tổ", floor:"Ground floor", intro:"Lakeside premium workspace in the historic heart of Hanoi.",
    img:"/workspace-photos/ryan-le-u3Jd3Bi6EIU-unsplash.jpg",
    transit:[["Hoàn Kiếm Lake","3 mins' walk"],["Old Quarter","6 mins' walk"],["Tràng Tiền","5 mins' walk"]] },
  { slug:"ttt-ton-that-tung", name:"HiLink 15 Tôn Thất Tùng", floor:"Floor 15", intro:"Đống Đa business address with skyline views.",
    img:"/workspace-photos/BG_Hanoi.avif",
    transit:[["Chùa Bộc","4 mins' walk"],["Tây Sơn","7 mins' walk"]] },
];

/* ── Config per kind ── */
const CONFIG = {
  meeting: {
    base:"/meeting-rooms", crossBase:"/event-venues",
    eyebrow:"Spaces", h1:"Meeting rooms to meet your needs",
    intro:"Whether you're pitching, brainstorming or impressing clients, you'll find individually designed, fully tech-enabled meeting rooms and boardrooms across HiLink's two Hanoi locations — for 2 to 30+ guests.",
    crossTitle:"Hosting a bigger event?", crossText:"We offer statement event venues across Hanoi, with spaces for up to 100 guests.", crossCta:"Explore event venues →",
    locVerb:"meeting rooms", statMid:"Meeting rooms", priceLabel:"Hourly hire from",
    bands:[ {label:"All", test:()=>true}, {label:"1-6", test:c=>c<=6}, {label:"7-12", test:c=>c>=7&&c<=12}, {label:"13-25", test:c=>c>=13&&c<=25}, {label:"25+", test:c=>c>25} ],
    features:[
      { eyebrow:"Space that works", title:"Room for every meeting", text:"From intimate two-person huddles to 30-seat boardrooms, find the perfect backdrop for client pitches, interviews, and team sessions across our floors.",
        imgs:["public/workspace-photos/IFT_0287_78.jpg","public/workspace-photos/Meeting room 4  (1).jpg"] },
      { eyebrow:"Don't worry about a thing", title:"Everything you need", text:"From welcoming receptionists greeting your guests to 4K displays, video conferencing, and 1Gbps WiFi in every room — we take care of the details so you can focus on the agenda.",
        imgs:["public/workspace-photos/DSC05809.jpg","public/workspace-photos/DSC05749.jpg"] },
      { eyebrow:"Hire on your terms", title:"Flexible rates", text:"Short pitch or all-day conference? You decide. Book by the hour, half day, or full day to work with your schedule — discounts available for longer bookings.",
        imgs:["https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Fbbac5a1c36a74120e03f072dfdbb8963cadcc136-1200x800.jpg&w=2000&q=75","https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Fa06b57fc106ce94e76e2bd0b7067a53901100c1a-8256x6192.jpg&w=980&q=75"] },
    ],
    testimonial:{ text:"From big client pitches to smaller team sessions, booking meeting rooms across HiLink has been effortless. The on-site team are knowledgeable and the rooms are beautifully designed.", name:"Hiếu Albert", role:"Founder, A Perfomance" },
    workspaces:(d)=>{
      // Each district has 2-3 workspaces. Each workspace has 4-6 individual rooms.
      const base = {
        "obc-ly-thai-to": [
          { slug:"obc-building", name:"OBC 60 Lý Thái Tổ", address:`60 Lý Thái Tổ, Hoàn Kiếm, Hanoi`,
            img:"/workspace-photos/d21d717acd95beefb878fd1f7e62b7d70e59c97a-2250x1500.avif",
            rooms:[
              { name:"Meeting Room 1", capacity:4, from:"₫250,000", priceVal:250000, img:"/workspace-photos/IFT_0287_78.jpg" },
              { name:"Meeting Room 2", capacity:6, from:"₫450,000", priceVal:450000, img:"/workspace-photos/9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif" },
            ] },
        ],
        "ttt-ton-that-tung": [
          { slug:"ttt-building", name:"HiLink 15 Tôn Thất Tùng", address:`15 Tôn Thất Tùng, Đống Đa, Hanoi`,
            img:"/workspace-photos/DSC05809.jpg",
            rooms:[
              { name:"M4",  capacity:6,  from:"₫300,000", priceVal:300000, img:"/workspace-photos/243c49f00a48d32d863d816c31aab29bdc8974cb-2048x1366.avif" },
              { name:"M6",  capacity:8,  from:"₫400,000", priceVal:400000, img:"/workspace-photos/IFT_9891_5.jpg" },
              { name:"M10", capacity:14, from:"₫600,000", priceVal:600000, img:"/workspace-photos/99afc4a54ee410cee61fa7b5043edb056288b1ed-2048x1366.avif" },
            ] },
        ],
      };
      return base[d.slug] || [];
    },
  },
  event: {
    base:"/event-venues", crossBase:"/meeting-rooms",
    eyebrow:"Spaces", h1:"Event venues to set the stage",
    intro:"From seasonal celebrations and networking nights to conferences and team days, our dedicated event venues set the stage for extraordinary. Discover statement spaces for up to 100 guests across our Hanoi floors.",
    crossTitle:"Just need a meeting room?", crossText:"Book individually designed, tech-enabled meeting rooms by the hour, half day, or full day.", crossCta:"Explore meeting rooms →",
    locVerb:"event venues", statMid:"Event spaces", priceLabel:"From",
    bands:[ {label:"All", test:()=>true}, {label:"Up to 30", test:c=>c<=30}, {label:"31-60", test:c=>c>=31&&c<=60}, {label:"61-100", test:c=>c>=61} ],
    features:[
      { eyebrow:"Make an impression", title:"Spaces with the wow factor", text:"From rooftop terraces with one-off Hanoi views to grand, light-filled lounges, you'll find an extraordinary venue that makes a big impression on every guest.",
        imgs:["/workspace-photos/243c49f00a48d32d863d816c31aab29bdc8974cb-2048x1366.avif","/workspace-photos/37ff63c10e4e53a3d93e34b41ac79d3a2d34780f-2048x1539.avif"] },
      { eyebrow:"All the kit", title:"Everything in place", text:"In-house AV with screen sharing and presentation tech, trusted caterers offering a selection of food and drinks, and a dedicated events team to curate the perfect occasion.",
        imgs:["/workspace-photos/Lounge%202%20copy.jpg","/workspace-photos/ce3706ad314592e4588da9dbc73a6256eed5159a-7195x4802.avif"] },
      { eyebrow:"We handle it", title:"Without the hassle", text:"From layout and catering to entertainment and AV, our dedicated team helps you plan the perfect event end-to-end, so you can be a guest at your own occasion.",
        imgs:["/workspace-photos/Lounge%209%20copy.jpg","/workspace-photos/c4e7eb49f55e6c60ff2b63250ccb285e63449a36-7378x4921.avif"] },
    ],
    testimonial:{ text:"We received so much positive feedback about the event — attendees commented on how beautiful the venue was and how well it fit the vibe of the evening. The HiLink team made it effortless.", name:"Nguyễn Bum", role:"COO, HiPress" },
    workspaces:(d)=>{
      const base = {
        "obc-ly-thai-to": [
          { slug:"obc-building", name:"OBC 60 Lý Thái Tổ", address:`60 Lý Thái Tổ, Hoàn Kiếm, Hanoi`,
            img:"/workspace-photos/37ff63c10e4e53a3d93e34b41ac79d3a2d34780f-2048x1539.avif",
            rooms:[
              { name:"Lakeside Lounge", capacity:40, from:"₫3,800,000", priceVal:3800000, img:"/workspace-photos/Lounge%202%20copy.jpg" },
              { name:"The Terrace",     capacity:25, from:"₫2,600,000", priceVal:2600000, img:"/workspace-photos/Lounge%209%20copy.jpg" },
            ] },
        ],
        "ttt-ton-that-tung": [
          { slug:"ttt-building", name:"HiLink 15 Tôn Thất Tùng", address:`15 Tôn Thất Tùng, Đống Đa, Hanoi`,
            img:"/workspace-photos/c4e7eb49f55e6c60ff2b63250ccb285e63449a36-7378x4921.avif",
            rooms:[
              { name:"The Grand Salon",   capacity:100, from:"₫8,500,000", priceVal:8500000, img:"/workspace-photos/243c49f00a48d32d863d816c31aab29bdc8974cb-2048x1366.avif" },
              { name:"Conference Hall",   capacity:60,  from:"₫5,400,000", priceVal:5400000, img:"/workspace-photos/ce3706ad314592e4588da9dbc73a6256eed5159a-7195x4802.avif" },
              { name:"Networking Lounge", capacity:30,  from:"₫2,900,000", priceVal:2900000, img:"/workspace-photos/Lounge%209%20copy.jpg" },
            ] },
        ],
      };
      return base[d.slug] || [];
    },
  },
};

/* ── Pool of supplementary meeting room / event venue photos for carousel ── */
const ROOM_PHOTO_POOL = {
  meeting: [
    "/workspace-photos/ad7f4d6f9e6ba26fc29098d62b6911062f900bf1-2048x1365.avif",
    "public/workspace-photos/Meeting room 4  (1).jpg",
    "/workspace-photos/IFT_0287_78.jpg",
    "public/workspace-photos/Meeting room 6 copy.jpg",
    "/workspace-photos/DSC05997.jpg",
    "/workspace-photos/Meeting%20room%204%20%20%281%29.jpg",
    "/workspace-photos/IFT_9891_5.jpg",
    "/workspace-photos/DSC05749.jpg",
    "/workspace-photos/243c49f00a48d32d863d816c31aab29bdc8974cb-2048x1366.avif",
    "/workspace-photos/99afc4a54ee410cee61fa7b5043edb056288b1ed-2048x1366.avif",
  ],
  event: [
    "/workspace-photos/243c49f00a48d32d863d816c31aab29bdc8974cb-2048x1366.avif",
    "/workspace-photos/Lounge%202%20copy.jpg",
    "/workspace-photos/37ff63c10e4e53a3d93e34b41ac79d3a2d34780f-2048x1539.avif",
    "/workspace-photos/Lounge%209%20copy.jpg",
    "/workspace-photos/ce3706ad314592e4588da9dbc73a6256eed5159a-7195x4802.avif",
    "/workspace-photos/c4e7eb49f55e6c60ff2b63250ccb285e63449a36-7378x4921.avif",
  ],
};

const buildRoomImages = (room, kind) => {
  const pool = ROOM_PHOTO_POOL[kind] || ROOM_PHOTO_POOL.meeting;
  // Hash room name to deterministically pick 2 supplementary images
  const hash = [...room.name].reduce((a,c)=>a+c.charCodeAt(0),0);
  const a = pool[hash % pool.length];
  const b = pool[(hash+3) % pool.length];
  // Return primary + supplementary, deduped, max 3
  const all = [room.img, a, b].filter((v,i,arr)=>v && arr.indexOf(v)===i);
  return all.length >= 2 ? all : [room.img, pool[0], pool[1]];
};

const arrowStyle = (side) => ({
  position:"absolute", top:"50%", [side]:12, transform:"translateY(-50%)",
  width:36, height:36, borderRadius:"50%", border:"none",
  background:"rgba(255,255,255,0.92)", color:"#1C1710",
  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
  boxShadow:"0 4px 12px rgba(0,0,0,0.2)", transition:"all 0.18s", zIndex:2,
});

const RoomImageCarousel = ({ images, alt }) => {
  const [idx, setIdx] = useState(0);
  const total = images.length;
  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + total) % total); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % total); };
  return (
    <div style={{ position:"relative", height:240, overflow:"hidden", background:"#1C1710" }}>
      <AnimatePresence mode="wait">
        <motion.img key={idx} src={images[idx]} alt={alt}
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
          style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }}/>
      </AnimatePresence>
      {/* Arrows */}
      <button onClick={prev} aria-label="Previous image" style={arrowStyle("left")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button onClick={next} aria-label="Next image" style={arrowStyle("right")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      {/* Dots */}
      <div style={{ position:"absolute", bottom:12, left:0, right:0, display:"flex", justifyContent:"center", gap:6, zIndex:2 }}>
        {images.map((_,i)=>(
          <button key={i} onClick={(e)=>{ e.stopPropagation(); setIdx(i); }} aria-label={`Image ${i+1}`}
            style={{ width: i===idx ? 18 : 6, height:6, borderRadius:3, border:"none", background: i===idx ? "#FFFFFF" : "rgba(255,255,255,0.55)", cursor:"pointer", padding:0, transition:"all 0.25s" }}/>
        ))}
      </div>
      {/* Counter */}
      <div style={{ position:"absolute", top:12, right:12, padding:"4px 10px", borderRadius:100, background:"rgba(0,0,0,0.55)", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.08em", zIndex:2 }}>
        {idx + 1} / {total}
      </div>
    </div>
  );
};
const EnquiryForm = ({ kind, district }) => {
  const [form, setForm] = useState({ name:"", email:"", company:"", phone:"", guests:"", date:"", notes:"" });
  const [sent, setSent] = useState(false);
  const set = k => v => setForm(f=>({...f,[k]:v}));
  if (sent) return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} style={{ background:"rgba(45,106,79,0.06)", border:"1px solid rgba(45,106,79,0.2)", padding:"40px", textAlign:"center" }}>
      <p style={{ fontSize:32, marginBottom:12 }}>✓</p>
      <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.3rem", color:"var(--text)", marginBottom:10 }}>Enquiry received</p>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", lineHeight:1.7 }}>Thank you! Our team will be in touch within 2 business hours to confirm availability and discuss your requirements.</p>
    </motion.div>
  );
  return (
    <div style={{ background:"#FFFFFF", border:"1px solid var(--border)", padding:"36px" }}>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Get in touch</p>
      <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.4rem", fontWeight:400, color:"var(--text)", marginBottom:6 }}>Make an enquiry</h3>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", marginBottom:24, lineHeight:1.6 }}>Fill in the details and our team will confirm availability and pricing within 2 hours.</p>
      {district && <div style={{ background:"var(--bg-2)", border:"1px solid var(--border-gold)", padding:"10px 14px", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)", flexShrink:0 }}/>
        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-2)" }}>Preferred location: <strong style={{ color:"var(--text)" }}>{district.name} · {district.floor}</strong></span>
      </div>}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lbl}>Full name</label><input value={form.name} onChange={e=>set("name")(e.target.value)} placeholder="Your name" style={inp}/></div>
        <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>set("email")(e.target.value)} placeholder="you@company.com" style={inp}/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lbl}>Company</label><input value={form.company} onChange={e=>set("company")(e.target.value)} placeholder="Company name" style={inp}/></div>
        <div><label style={lbl}>Phone</label><input value={form.phone} onChange={e=>set("phone")(e.target.value)} placeholder="+84 xxx xxx xxx" style={inp}/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lbl}>{kind==="event"?"Expected guests":"Attendees"}</label><input type="number" value={form.guests} onChange={e=>set("guests")(e.target.value)} placeholder="e.g. 12" style={inp}/></div>
        <div><label style={lbl}>Preferred date</label><input type="date" value={form.date} onChange={e=>set("date")(e.target.value)} style={inp}/></div>
      </div>
      <div style={{ marginBottom:24 }}>
        <label style={lbl}>Additional requirements (optional)</label>
        <textarea value={form.notes} onChange={e=>set("notes")(e.target.value)} placeholder="Catering, AV setup, layout preferences..." style={{...inp, minHeight:90, resize:"vertical"}}/>
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

/* ── Cross-sell strip ── */
const CrossStrip = ({ cfg }) => (
  <div style={{ background:"var(--olive-deep)", padding:"48px 64px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24 }}>
    <div>
      <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.6rem", fontWeight:400, color:"#F8F6F1", marginBottom:8 }}>{cfg.crossTitle}</h3>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"rgba(248,246,241,0.7)", maxWidth:480, lineHeight:1.6 }}>{cfg.crossText}</p>
    </div>
    <Link to={cfg.crossBase} style={{ fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--gold)", textDecoration:"none", borderBottom:"1px solid var(--gold)", paddingBottom:3, whiteSpace:"nowrap" }}>{cfg.crossCta}</Link>
  </div>
);

/* ── LANDING ── */
function VenueLanding({ kind }) {
  const cfg = CONFIG[kind];
  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        {/* Hero */}
        <div className="pattern-olive-corners" style={{ padding:"72px 64px 56px", background:"#FFFFFF", borderBottom:"1px solid var(--border)" }}>
          <div style={{ maxWidth:900 }}>
            <img src="/workspace-photos/logo-workspace-trim.png" alt="HiLink Flex-Spaces" style={{ height:64, width:"auto", display:"block", marginBottom:22 }}/>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>{cfg.eyebrow}</p>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2.5rem,5vw,4rem)", fontWeight:400, color:"var(--text)", lineHeight:1.05, marginBottom:24 }}>{cfg.h1}</h1>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:"var(--text-2)", lineHeight:1.7, maxWidth:680 }}>{cfg.intro}</p>
          </div>
        </div>

        {/* Feature rows */}
        <div style={{ padding:"0 64px" }}>
          {cfg.features.map((f,i)=>(
            <motion.div key={f.title} {...fade(i*0.05)}
              style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center", padding:"72px 0", borderBottom:i<cfg.features.length-1?"1px solid var(--border)":"none" }}>
              {/* Text — alternate side */}
              <div style={{ order: i%2===0?0:1 }}>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:14 }}>{f.eyebrow}</p>
                <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:400, color:"var(--text)", marginBottom:18, lineHeight:1.15 }}>{f.title}</h2>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:"var(--text-2)", lineHeight:1.7, maxWidth:440 }}>{f.text}</p>
              </div>
              {/* Image cluster */}
              <div style={{ order: i%2===0?1:0, display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:8, height:360 }}>
                <div style={{ overflow:"hidden" }}>
                  <img src={f.imgs[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
                </div>
                <div style={{ overflow:"hidden", marginTop:i%2===0?40:0, marginBottom:i%2===0?0:40 }}>
                  <img src={f.imgs[1]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Find a location */}
        <div style={{ padding:"72px 64px", background:"var(--bg-2)" }}>
          <motion.div {...fade()} style={{ marginBottom:40 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>Our locations</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>Find {kind==="event"?"an event venue":"a meeting room"}</h2>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"var(--border)" }}>
            {DISTRICTS.map((d,i)=>(
              <motion.div key={d.slug} {...fade(i*0.07)} style={{ background:"#FFFFFF" }}>
                <Link to={`${cfg.base}/${d.slug}`} style={{ textDecoration:"none", display:"block" }}>
                  <div style={{ height:240, overflow:"hidden" }}>
                    <img src={d.img} alt={d.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
                  </div>
                  <div style={{ padding:"24px 26px 28px" }}>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>{d.floor}</p>
                    <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.4rem", fontWeight:400, color:"var(--text)", marginBottom:10 }}>{d.name}</h3>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", lineHeight:1.6, marginBottom:16 }}>{d.intro}</p>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text)" }}>Explore {cfg.locVerb} →</span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Discover-all box — fills the third grid cell, invites users to browse every location */}
            <motion.div {...fade(DISTRICTS.length*0.07)} style={{ background:"#FFFFFF" }}>
              <Link to="/spaces" style={{ textDecoration:"none", display:"flex", flexDirection:"column", height:"100%", minHeight:240, background:"linear-gradient(150deg, #1C1710 0%, #2A2118 55%, #1C1710 100%)", position:"relative", overflow:"hidden" }}
                onMouseEnter={e=>{ const a=e.currentTarget.querySelector('[data-arrow]'); if(a) a.style.transform="translateX(4px)"; }}
                onMouseLeave={e=>{ const a=e.currentTarget.querySelector('[data-arrow]'); if(a) a.style.transform="translateX(0)"; }}>
                {/* Warm radial glow */}
                <div style={{ position:"absolute", top:"-10%", right:"-20%", width:300, height:300, background:"radial-gradient(circle, rgba(168,143,92,0.18) 0%, transparent 70%)", pointerEvents:"none" }}/>
                <div style={{ position:"relative", padding:"40px 36px", display:"flex", flexDirection:"column", justifyContent:"space-between", flex:1 }}>
                  <div>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>All HiLink locations</p>
                    <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.7rem", fontWeight:400, color:"#F8F6F1", lineHeight:1.18, marginBottom:14 }}>Discover every space across Hanoi</h3>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(248,246,241,0.6)", lineHeight:1.65, maxWidth:280 }}>Browse all {cfg.locVerb}, hot desks and private offices on one interactive map — and find the spot that fits you best.</p>
                  </div>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:10, marginTop:28, fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:"#F8F6F1" }}>
                    Explore all locations
                    <span data-arrow style={{ display:"inline-block", transition:"transform 0.25s ease", color:"var(--gold)" }}>→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Testimonial — olive accent */}
        <div style={{ padding:"80px 64px", background:"var(--olive)", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <span style={{ position:"absolute", top:30, left:"50%", transform:"translateX(-50%)", fontFamily:"'Playfair Display',Georgia,serif", fontSize:120, color:"rgba(248,246,241,0.10)", lineHeight:1, fontStyle:"italic" }}>"</span>
          <div style={{ maxWidth:760, margin:"0 auto", position:"relative" }}>
            <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.4rem,2.5vw,2rem)", fontStyle:"italic", color:"#F8F6F1", lineHeight:1.6, marginBottom:28 }}>"{cfg.testimonial.text}"</p>
            <div style={{ width:32, height:1, background:"var(--gold)", margin:"0 auto 20px" }}/>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:600, color:"#F8F6F1", letterSpacing:"0.06em" }}>{cfg.testimonial.name}</p>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"rgba(248,246,241,0.65)", marginTop:4 }}>{cfg.testimonial.role}</p>
          </div>
        </div>

        <CrossStrip cfg={cfg} />
      </div>
    </PageWrap>
  );
}

/* ── LOCATION ── */
function VenueLocation({ kind }) {
  const cfg = CONFIG[kind];
  const { district:slug } = useParams();
  const navigate = useNavigate();
  const district = DISTRICTS.find(d=>d.slug===slug);

  if (!district) return (
    <PageWrap>
      <div style={{ paddingTop:140, paddingBottom:120, textAlign:"center", background:"var(--bg)" }}>
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"2rem", fontWeight:400, color:"var(--text)", marginBottom:16 }}>Location not found</h1>
        <Link to={cfg.base} style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--gold)", textDecoration:"none", borderBottom:"1px solid var(--gold)", paddingBottom:2 }}>← Back to {cfg.locVerb}</Link>
      </div>
    </PageWrap>
  );

  const workspaces = cfg.workspaces(district);
  const totalRooms = workspaces.reduce((s,w)=>s+w.rooms.length, 0);
  const scrollToForm = () => document.getElementById("venue-enquiry")?.scrollIntoView({behavior:"smooth"});

  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        {/* Breadcrumb */}
        <div style={{ padding:"12px 64px", borderBottom:"1px solid var(--border)", background:"#FFFFFF", display:"flex", alignItems:"center", gap:8 }}>
          <Link to="/" style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.06em", color:"var(--text-3)", textDecoration:"none" }}>Home</Link>
          <span style={{ color:"var(--text-3)", fontSize:12 }}>/</span>
          <Link to={cfg.base} style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.06em", color:"var(--text-3)", textDecoration:"none" }}>{kind==="event"?"Event venues":"Meeting rooms"}</Link>
          <span style={{ color:"var(--text-3)", fontSize:12 }}>/</span>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.06em", color:"var(--text-2)" }}>{district.name}</span>
        </div>

        {/* Hero — green panel style matching Fora reference */}
        <div style={{ padding:"56px 64px", background:"#FFFFFF" }}>
          <div style={{ background:"var(--olive)", borderRadius:8, overflow:"hidden", display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:440 }}>
            <div style={{ padding:"56px 56px", color:"#F8F6F1", display:"flex", flexDirection:"column", justifyContent:"center" }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(248,246,241,0.7)", marginBottom:12 }}>{kind==="event"?"Event venues in":"Meeting rooms in"}</p>
              <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2.4rem,4.5vw,3.6rem)", fontWeight:400, color:"#F8F6F1", lineHeight:1.04, marginBottom:24 }}>{district.name}</h1>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"rgba(248,246,241,0.78)", lineHeight:1.7, maxWidth:440 }}>
                Host everything from {kind==="event"?"celebrations to conferences":"pitches to presentations"} in our choice of standout, tech-enabled {cfg.locVerb} in {district.name}. {district.intro}
              </p>
            </div>
            <div style={{ overflow:"hidden" }}>
              <img src={district.img} alt={district.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            </div>
          </div>
        </div>

        {/* District chips */}
        <div style={{ padding:"0 64px 28px", background:"#FFFFFF", display:"flex", gap:8, flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--text-3)", alignSelf:"center", marginRight:12 }}>Explore districts:</span>
          {DISTRICTS.map(d=>(
            <button key={d.slug} onClick={()=>navigate(`${cfg.base}/${d.slug}`)}
              style={{ padding:"8px 18px", borderRadius:100, border:`1px solid ${d.slug===slug?"var(--gold)":"var(--border)"}`, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500, background:d.slug===slug?"var(--gold)":"transparent", color:d.slug===slug?"#FFFFFF":"var(--text-2)", transition:"all 0.15s", letterSpacing:"0.04em" }}>
              {d.name}
            </button>
          ))}
        </div>

        {/* Workspaces list */}
        <div style={{ padding:"40px 64px 64px", background:"var(--bg-2)" }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", marginBottom:28 }}>
            {totalRooms} {cfg.locVerb} at {workspaces.length} workspace{workspaces.length===1?"":"s"} in {district.name}
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {workspaces.map((w,i)=>{
              const minPrice = Math.min(...w.rooms.map(r=>r.priceVal));
              const maxPrice = Math.max(...w.rooms.map(r=>r.priceVal));
              const fmt = (v) => `₫${v>=1000000 ? (v/1000000).toFixed(1).replace(/\.0$/,"")+"M" : (v/1000).toFixed(0)+"k"}`;
              const priceRange = minPrice===maxPrice ? fmt(minPrice) : `${fmt(minPrice)}-${fmt(maxPrice)}`;
              const minCap = Math.min(...w.rooms.map(r=>r.capacity));
              const maxCap = Math.max(...w.rooms.map(r=>r.capacity));
              return (
                <motion.div key={w.slug} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06, duration:0.5}}
                  className="hover-lift"
                  onClick={()=>navigate(`${cfg.base}/${slug}/${w.slug}`)}
                  style={{ background:"#FFFFFF", padding:"32px 36px", display:"grid", gridTemplateColumns:"200px 1.4fr 1fr auto", gap:32, alignItems:"center", cursor:"pointer", marginBottom:16, border:"1px solid var(--border)" }}>
                  <div style={{ height:130, overflow:"hidden", borderRadius:4 }}>
                    <img src={w.img} alt={w.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  </div>
                  <div>
                    <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.4rem", fontWeight:400, color:"var(--text)", marginBottom:8 }}>{w.name}</h3>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", marginBottom:14 }}>{w.address}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                      {district.transit.map(([place,time])=>(
                        <div key={place} style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--gold)", flexShrink:0 }}/>
                          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-2)", letterSpacing:"0.04em" }}>{place.toUpperCase()}: {time.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:28 }}>
                    <div>
                      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:4 }}>Capacity</p>
                      <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"var(--text)" }}>{minCap===maxCap?minCap:`${minCap}-${maxCap}`}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:4 }}>{cfg.statMid}</p>
                      <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"var(--text)" }}>{w.rooms.length}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:4 }}>{cfg.priceLabel}</p>
                      <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"var(--gold)" }}>{priceRange}</p>
                    </div>
                  </div>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, color:"var(--text)", borderBottom:"1px solid var(--text)", paddingBottom:2, whiteSpace:"nowrap" }}>View {cfg.locVerb} →</span>
                </motion.div>
              );
            })}
            {workspaces.length===0 && (
              <div style={{ textAlign:"center", padding:"60px 24px", background:"#FFFFFF", border:"1px solid var(--border)" }}>
                <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:20, color:"var(--text)", marginBottom:8 }}>No workspaces in this district yet</p>
                <Link to={cfg.base} style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--gold)" }}>← Back to all locations</Link>
              </div>
            )}
          </div>
        </div>

        {/* Enquiry */}
        <div id="venue-enquiry" style={{ padding:"64px", background:"#FFFFFF" }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <EnquiryForm kind={kind} district={district} />
          </div>
        </div>

        <CrossStrip cfg={cfg} />
      </div>
    </PageWrap>
  );
}

/* ── Workspace detail — individual rooms with photos ── */
function VenueWorkspace({ kind }) {
  const cfg = CONFIG[kind];
  const { district:slug, workspace:wslug } = useParams();
  const navigate = useNavigate();
  const [band, setBand] = useState("All");
  const [sort, setSort] = useState("asc");
  const district = DISTRICTS.find(d=>d.slug===slug);
  const workspaces = district ? cfg.workspaces(district) : [];
  const workspace = workspaces.find(w=>w.slug===wslug);

  if (!district || !workspace) return (
    <PageWrap>
      <div style={{ paddingTop:140, paddingBottom:120, textAlign:"center", background:"var(--bg)" }}>
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"2rem", fontWeight:400, color:"var(--text)", marginBottom:16 }}>Workspace not found</h1>
        <Link to={cfg.base} style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--gold)", textDecoration:"none", borderBottom:"1px solid var(--gold)", paddingBottom:2 }}>← Back to {cfg.locVerb}</Link>
      </div>
    </PageWrap>
  );

  const activeBand = cfg.bands.find(b=>b.label===band) || cfg.bands[0];
  let rooms = workspace.rooms.filter(r=>activeBand.test(r.capacity));
  rooms = [...rooms].sort((a,b)=> sort==="asc" ? a.priceVal-b.priceVal : b.priceVal-a.priceVal);
  const scrollToForm = () => document.getElementById("venue-enquiry")?.scrollIntoView({behavior:"smooth"});

  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        {/* Breadcrumb */}
        <div style={{ padding:"12px 64px", borderBottom:"1px solid var(--border)", background:"#FFFFFF", display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <Link to="/" style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.06em", color:"var(--text-3)", textDecoration:"none" }}>Home</Link>
          <span style={{ color:"var(--text-3)", fontSize:12 }}>/</span>
          <Link to={cfg.base} style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.06em", color:"var(--text-3)", textDecoration:"none" }}>{kind==="event"?"Event venues":"Meeting rooms"}</Link>
          <span style={{ color:"var(--text-3)", fontSize:12 }}>/</span>
          <Link to={`${cfg.base}/${slug}`} style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.06em", color:"var(--text-3)", textDecoration:"none" }}>{district.name}</Link>
          <span style={{ color:"var(--text-3)", fontSize:12 }}>/</span>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, letterSpacing:"0.06em", color:"var(--text-2)" }}>{workspace.name}</span>
        </div>

        {/* Hero: building photo with floating card */}
        <div style={{ position:"relative", height:"68vh", overflow:"hidden", background:"#1C1710" }}>
          <img src={workspace.img} alt={workspace.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 50%)" }}/>
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.7}}
            style={{ position:"absolute", left:64, top:"50%", transform:"translateY(-50%)", background:"#FFFFFF", padding:"40px 44px", maxWidth:440, boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"2.2rem", fontWeight:400, color:"var(--text)", lineHeight:1.05, marginBottom:8 }}>{workspace.name}</h1>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", marginBottom:24 }}>{district.name}</p>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-2)", marginBottom:14, lineHeight:1.6 }}>{workspace.address}</p>
            <div style={{ marginBottom:28 }}>
              {district.transit.map(([place,time])=>(
                <div key={place} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--gold)", flexShrink:0 }}/>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-2)", letterSpacing:"0.04em" }}>{place.toUpperCase()}: {time.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <button onClick={scrollToForm}
              style={{ padding:"12px 26px", borderRadius:100, background:"var(--gold)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer", letterSpacing:"0.06em", transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--text)"}
              onMouseLeave={e=>e.currentTarget.style.background="var(--gold)"}>
              View {cfg.locVerb}
            </button>
          </motion.div>
        </div>

        {/* Intro paragraph — olive accent strip */}
        <div style={{ padding:"56px 64px 56px", background:"#FFFFFF", textAlign:"center", position:"relative" }}>
          <div style={{ width:32, height:2, background:"var(--olive)", margin:"0 auto 24px" }}/>
          <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.4rem", fontWeight:400, color:"var(--text)", maxWidth:760, margin:"0 auto", lineHeight:1.5 }}>
            Beautifully designed, fully tech-enabled {cfg.locVerb} at {workspace.name} to suit every moment of your working day.
          </p>
        </div>

        {/* Filter controls */}
        <div style={{ padding:"20px 64px", background:"#FFFFFF", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", marginRight:8 }}>Capacity:</span>
            {cfg.bands.map(b=>(
              <button key={b.label} onClick={()=>setBand(b.label)}
                style={{ padding:"6px 14px", borderRadius:100, border:`1px solid ${band===b.label?"var(--border-gold)":"var(--border)"}`, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:12, background:band===b.label?"rgba(168,143,92,0.10)":"transparent", color:band===b.label?"var(--gold)":"var(--text-3)", transition:"all 0.12s" }}>
                {b.label}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{ ...sel, width:180 }}>
            <option value="asc">Lowest price</option>
            <option value="desc">Highest price</option>
          </select>
        </div>

        {/* Rooms heading bar */}
        <div style={{ padding:"48px 64px 16px", background:"var(--bg-2)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:24, marginBottom:8 }}>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:400, color:"var(--text)", lineHeight:1.1, maxWidth:520 }}>
              {cfg.locVerb.charAt(0).toUpperCase()+cfg.locVerb.slice(1)} at {workspace.name}
            </h2>
            <div style={{ background:"#FFFFFF", padding:"18px 24px", maxWidth:380, borderRadius:4 }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-2)", marginBottom:6, lineHeight:1.5 }}>Our team are here to support you and your business. Simply give us a call if you have any questions.</p>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)", letterSpacing:"0.04em" }}>Sales: <span style={{ color:"var(--text)" }}>+84(0) 24 3936 0717</span></p>
            </div>
          </div>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)" }}>{rooms.length} {cfg.locVerb}</p>
        </div>

        {/* Room photo grid */}
        <div style={{ padding:"24px 64px 64px", background:"var(--bg-2)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {rooms.map((r,i)=>(
              <motion.div key={r.name} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}}
                className="hover-lift"
                style={{ background:"#FFFFFF", overflow:"hidden", borderRadius:4 }}>
                <RoomImageCarousel images={buildRoomImages(r, kind)} alt={r.name} />
                <div style={{ padding:"24px 28px 28px" }}>
                  <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.15rem", fontWeight:400, color:"var(--text)", marginBottom:18 }}>{r.name}</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:22 }}>
                    <div>
                      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:4 }}>Capacity</p>
                      <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.4rem", color:"var(--text)" }}>{r.capacity}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:4 }}>{cfg.priceLabel}</p>
                      <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"var(--gold)" }}>{r.from}</p>
                    </div>
                  </div>
                  <button onClick={scrollToForm}
                    style={{ padding:"10px 22px", borderRadius:100, background:"var(--gold)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer", letterSpacing:"0.04em", transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--text)"}
                    onMouseLeave={e=>e.currentTarget.style.background="var(--gold)"}>
                    Make an enquiry
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          {rooms.length===0 && (
            <div style={{ textAlign:"center", padding:"60px 24px", background:"#FFFFFF" }}>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:20, color:"var(--text)", marginBottom:8 }}>No rooms in this range</p>
              <button onClick={()=>setBand("All")} style={{ background:"none", border:"1px solid var(--border)", padding:"8px 20px", fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text)", cursor:"pointer" }}>Show all</button>
            </div>
          )}
        </div>

        {/* Enquiry */}
        <div id="venue-enquiry" style={{ padding:"64px", background:"#FFFFFF" }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <EnquiryForm kind={kind} district={district} />
          </div>
        </div>

        <CrossStrip cfg={cfg} />
      </div>
    </PageWrap>
  );
}

export const MeetingRoomsLanding   = () => <VenueLanding kind="meeting" />;
export const MeetingRoomsLocation  = () => <VenueLocation kind="meeting" />;
export const MeetingRoomsWorkspace = () => <VenueWorkspace kind="meeting" />;
export const EventVenuesLanding    = () => <VenueLanding kind="event" />;
export const EventVenuesLocation   = () => <VenueLocation kind="event" />;
export const EventVenuesWorkspace  = () => <VenueWorkspace kind="event" />;
