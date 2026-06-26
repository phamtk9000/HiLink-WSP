import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrap } from "../components/index.jsx";

const fade = (d=0) => ({ initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.6,delay:d} });

const lbl = { fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", display:"block", marginBottom:6 };
const inp = { width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:13, outline:"none", borderRadius:0 };
const sel = { ...inp };

const EnquiryForm = ({ planName, extraFields }) => {
  const [form, setForm] = useState({ name:"", email:"", company:"", phone:"", guests:"", date:"", time:"", notes:"" });
  const [sent, setSent] = useState(false);
  const set = k => v => setForm(f=>({...f,[k]:v}));
  if (sent) return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} style={{ background:"rgba(45,106,79,0.06)", border:"1px solid rgba(45,106,79,0.2)", padding:"40px", textAlign:"center" }}>
      <p style={{ fontSize:32, marginBottom:12 }}>✓</p>
      <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.3rem", color:"var(--text)", marginBottom:10 }}>Enquiry received</p>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", lineHeight:1.7 }}>Thank you! A member of our events team will be in touch within 2 business hours to confirm availability and discuss your requirements.</p>
    </motion.div>
  );
  return (
    <div style={{ background:"#FFFFFF", border:"1px solid var(--border)", padding:"36px" }}>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Book this space</p>
      <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.4rem", fontWeight:400, color:"var(--text)", marginBottom:6 }}>Make an enquiry</h3>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", marginBottom:28, lineHeight:1.6 }}>Fill in the details below and our team will confirm availability and pricing within 2 hours.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lbl}>Full name</label><input value={form.name} onChange={e=>set("name")(e.target.value)} placeholder="Your name" style={inp}/></div>
        <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>set("email")(e.target.value)} placeholder="you@company.com" style={inp}/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lbl}>Company</label><input value={form.company} onChange={e=>set("company")(e.target.value)} placeholder="Company name" style={inp}/></div>
        <div><label style={lbl}>Phone</label><input value={form.phone} onChange={e=>set("phone")(e.target.value)} placeholder="+84 xxx xxx xxx" style={inp}/></div>
      </div>
      {extraFields && extraFields(form, set, lbl, inp, sel)}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lbl}>Preferred date</label><input type="date" value={form.date} onChange={e=>set("date")(e.target.value)} style={inp}/></div>
        <div><label style={lbl}>Preferred start time</label>
          <select value={form.time} onChange={e=>set("time")(e.target.value)} style={sel}>
            <option value="">Select time...</option>
            {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom:24 }}>
        <label style={lbl}>Additional requirements (optional)</label>
        <textarea value={form.notes} onChange={e=>set("notes")(e.target.value)} placeholder="Catering, AV setup, layout preferences, accessibility needs..." style={{...inp, minHeight:90, resize:"vertical"}}/>
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

/* ── MEETING ROOMS PAGE ── */
export function MeetingRoomsPage() {
  const IMGS = [
    "/workspace-photos/ad7f4d6f9e6ba26fc29098d62b6911062f900bf1-2048x1365.avif",
    "/workspace-photos/DSC05997.jpg",
    "/workspace-photos/7f697d83c67bd824c915269932304e1e50668dd0-1800x1200.avif",
  ];
  const ROOMS = [
    { name:"Boardroom Alpha", floor:"Floor 14", cap:"1–20", desc:"State-of-the-art boardroom with 85″ 4K display, video conferencing bridge, and acoustic wall panels.", price:"₫350,000/hr" },
    { name:"Meeting Room B2", floor:"Floor 12", cap:"1–8",  desc:"Intimate meeting room ideal for client calls, interviews, and focused team sessions.", price:"₫180,000/hr" },
    { name:"Workshop Suite", floor:"Floor 15", cap:"1–40", desc:"Open-plan workshop space with moveable furniture, dual screens, and whiteboard walls.", price:"₫450,000/hr" },
    { name:"Phone Booths", floor:"All floors", cap:"1",    desc:"Acoustic one-person call pods. Perfect for quick calls and video meetings on any floor.", price:"₫89,000/hr" },
  ];
  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        {/* Hero — matching reference image 3 */}
        <div style={{ position:"relative", height:"75vh", overflow:"hidden", borderRadius:0 }}>
          <img src={IMGS[0]} alt="Meeting rooms" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)" }} />
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            style={{ position:"absolute", bottom:0, left:0, padding:"0 64px 72px", maxWidth:700 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.6)", marginBottom:16 }}>SPACES</p>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2.5rem,5vw,4rem)", fontWeight:400, color:"#FFFFFF", lineHeight:1.05, marginBottom:20 }}>Meeting rooms</h1>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:"rgba(255,255,255,0.78)", lineHeight:1.75, maxWidth:520, marginBottom:12 }}>
              Thoughtfully designed meeting rooms and boardrooms, all equipped with the latest technology to keep your session running smoothly.
            </p>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:24 }}>Suitable for 1–40 people</p>
            <button onClick={()=>document.getElementById("meeting-enquiry").scrollIntoView({behavior:"smooth"})}
              style={{ background:"none", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:13, cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,0.55)", paddingBottom:2, display:"inline-flex", alignItems:"center", gap:8 }}>
              Book now →
            </button>
          </motion.div>
        </div>

        {/* Room cards */}
        <div style={{ background:"#FFFFFF", padding:"64px" }}>
          <motion.div {...fade()} style={{ marginBottom:40 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>Available rooms</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>Choose your space</h2>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:1, background:"var(--border)" }}>
            {ROOMS.map((r,i)=>(
              <motion.div key={r.name} {...fade(i*0.07)} style={{ background:"#FFFFFF", padding:"28px 32px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--gold)", marginBottom:6 }}>
                      {r.floor} · Up to {r.cap} people
                    </p>
                    <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.2rem", fontWeight:400, color:"var(--text)" }}>{r.name}</h3>
                  </div>
                  <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1rem", color:"var(--gold)", whiteSpace:"nowrap", paddingLeft:16 }}>{r.price}</span>
                </div>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", lineHeight:1.65 }}>{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enquiry + photos */}
        <div style={{ padding:"64px", background:"var(--bg-2)" }}>
          <div style={{ maxWidth:1300, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"start" }}>
            <div id="meeting-enquiry">
              <EnquiryForm planName="Meeting Rooms"
                extraFields={(form, set, lbl, inp, sel) => (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                    <div>
                      <label style={lbl}>Number of attendees</label>
                      <input type="number" min={1} max={40} value={form.guests} onChange={e=>set("guests")(e.target.value)} placeholder="e.g. 8" style={inp}/>
                    </div>
                    <div>
                      <label style={lbl}>Room preference</label>
                      <select value={form.room} onChange={e=>set("room")(e.target.value)} style={sel}>
                        <option value="">Any available</option>
                        {["Boardroom Alpha","Meeting Room B2","Workshop Suite","Phone Booth"].map(r=><option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              />
            </div>
            {/* Photos grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
              {IMGS.map((src,i) => (
                <div key={i} style={{ overflow:"hidden", height:200, gridColumn:i===0?"1/-1":"auto" }}>
                  <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding:"20px 64px", background:"var(--text)", display:"flex", justifyContent:"center" }}>
          <Link to="/membership" style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", borderBottom:"1px solid rgba(255,255,255,0.2)", paddingBottom:1 }}>← Back to memberships</Link>
        </div>
      </div>
    </PageWrap>
  );
}

/* ── EVENT SPACES PAGE ── */
export function EventSpacesPage() {
  const IMGS = [
    "/workspace-photos/a57e2c5781bc65cf0e2a061375bf32119341b3b2-2048x1366.avif",
    "/workspace-photos/761e2d35fafc758157f6414d741bde04927cf465-6720x4480.avif",
    "/workspace-photos/ad7f4d6f9e6ba26fc29098d62b6911062f900bf1-2048x1365.avif",
  ];
  const SPACES = [
    { name:"Sky Terrace", floor:"Floor 15", cap:"Up to 100", desc:"Open-air rooftop terrace with panoramic Hanoi skyline views. Perfect for evening receptions and product launches.", price:"₫8,000,000/event" },
    { name:"The Gallery", floor:"Floor 14", cap:"Up to 60",  desc:"Versatile gallery space with exposed concrete, statement lighting, and city views. Ideal for exhibitions and private dinners.", price:"₫5,500,000/event" },
    { name:"Horizon Lounge", floor:"Floor 12", cap:"Up to 80", desc:"Floor-to-ceiling glass event space with a built-in bar, breakout areas, and professional AV system.", price:"₫6,500,000/event" },
  ];
  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        {/* Hero — matching reference image 2 */}
        <div style={{ position:"relative", height:"75vh", overflow:"hidden" }}>
          <img src={IMGS[0]} alt="Event spaces" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.12) 100%)" }} />
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            style={{ position:"absolute", bottom:0, left:0, padding:"0 64px 72px", maxWidth:700 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.6)", marginBottom:16 }}>SPACES</p>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2.5rem,5vw,4rem)", fontWeight:400, color:"#FFFFFF", lineHeight:1.05, marginBottom:20 }}>Event spaces</h1>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:"rgba(255,255,255,0.78)", lineHeight:1.75, maxWidth:520, marginBottom:12 }}>
              Discover our statement event spaces across our floors. With spaces for up to 100 guests and stunning Hanoi city views.
            </p>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:24 }}>Suitable for 1–100 people</p>
            <button onClick={()=>document.getElementById("event-enquiry").scrollIntoView({behavior:"smooth"})}
              style={{ background:"none", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:13, cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,0.55)", paddingBottom:2 }}>
              Book now →
            </button>
          </motion.div>
        </div>

        {/* Space cards */}
        <div style={{ background:"#FFFFFF", padding:"64px" }}>
          <motion.div {...fade()} style={{ marginBottom:40 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>Our event spaces</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>Built for extraordinary occasions</h2>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"var(--border)" }}>
            {SPACES.map((s,i)=>(
              <motion.div key={s.name} {...fade(i*0.08)} style={{ background:"#FFFFFF", padding:"28px 32px" }}>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--gold)", marginBottom:6 }}>{s.floor} · {s.cap} guests</p>
                <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.2rem", fontWeight:400, color:"var(--text)", marginBottom:10 }}>{s.name}</h3>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)", lineHeight:1.65, marginBottom:16 }}>{s.desc}</p>
                <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1rem", color:"var(--gold)" }}>{s.price}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div style={{ background:"var(--bg-2)", padding:"0 64px 64px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, paddingTop:0 }}>
            {IMGS.map((src,i)=>(
              <div key={i} style={{ overflow:"hidden", height:300, gridColumn:i===0?"1/-1":"auto" }}>
                <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry */}
        <div style={{ padding:"64px", background:"#FFFFFF" }}>
          <div style={{ maxWidth:1000, margin:"0 auto" }}>
            <div id="event-enquiry">
              <motion.div {...fade()} style={{ marginBottom:32 }}>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>Get in touch</p>
                <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.5rem)", fontWeight:400, color:"var(--text)" }}>Plan your event with us</h2>
              </motion.div>
              <EnquiryForm planName="Event Spaces"
                extraFields={(form, set, lbl, inp, sel) => (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                    <div>
                      <label style={lbl}>Expected guests</label>
                      <input type="number" min={1} max={100} value={form.guests} onChange={e=>set("guests")(e.target.value)} placeholder="e.g. 50" style={inp}/>
                    </div>
                    <div>
                      <label style={lbl}>Event type</label>
                      <select style={sel}>
                        <option>Corporate reception</option>
                        <option>Product launch</option>
                        <option>Team away day</option>
                        <option>Private dinner</option>
                        <option>Workshop / seminar</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <div style={{ padding:"20px 64px", background:"var(--text)", display:"flex", justifyContent:"center" }}>
          <Link to="/membership" style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", borderBottom:"1px solid rgba(255,255,255,0.2)", paddingBottom:1 }}>← Back to memberships</Link>
        </div>
      </div>
    </PageWrap>
  );
}
