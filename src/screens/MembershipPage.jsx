import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrap } from "../components/index.jsx";
import { RecommendationEngine } from "./RecommendationTool.jsx";

const fade = (delay=0) => ({ initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.6,delay} });

const MEMBERSHIPS = [
  {
    type:"Private", tag:"Private", name:"HiLink Office", route:"/membership/office",
    img:" https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F0eaab531fabea051964e0d8257b65539d925ab60-11450x8587.jpg%3Fw%3D1000&w=1600&q=90",
    desc:"Fully enclosed private offices for teams of all sizes, ready to move in on flexible terms, with the option to tailor the space to your unique needs.",
    from:"From ₫45,000,000/mo", capacity:"2–50 people",
  },
  {
    type:"Coworking", tag:"Coworking", name:"HiLink Desk", route:"/membership/desk",
    img:"https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Fe8454e11e126f675ce35b786151d2bf1e8e4a144-4421x5894.jpg%3Fw%3D1000&w=1600&q=90",
    desc:"Your own dedicated desk, chair and secure storage in the workspace of your choice, plus access to coworking areas across all three of our floors.",
    from:"From ₫8,500,000/mo", capacity:"1 person",
  },
  {
    type:"Hot Desk", tag:"Flexible", name:"HiLink Roam", route:"/membership/roam",
    img:"https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Ff0d1f5b6bb5f5f67f5bdac6651f31fe926114ea6-7267x4847.jpg%3Fw%3D1000&w=1600&q=90",
    desc:"Switch up your working days with flexible hot desk access across our floors in an inspiring, uniquely designed workspace environment.",
    from:"From ₫89,000/hr", capacity:"1 person",
  },
  {
    type:"Virtual", tag:"Remote", name:"HiLink Virtual", route:"/membership/virtual",
    img:"https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F355e5430867d04a956ef0f225711c2515f272685-4887x8688.jpg&w=2000&q=75",
    desc:"Boost your presence in Hanoi's most prestigious business district. Register your business address with mail handling, call forwarding, and 5 day passes per month.",
    from:"From ₫3,500,000/mo", capacity:"Any size",
  },
];

const VALUE_PROPS = [
  {
    img:"public/workspace-photos/9df347136e8467636fcc2e51a072f148ca018ad7-5650x6643.avif",
    h3:"Room to grow",
    body:"Flexible contracts that scale with your business at every stage of your journey, with the option to scale up or down as your needs evolve.",
  },
  {
    img:"https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F96ba1803882efdb5c7b2d4c241280ffba5770551-6720x4480.jpg%3Fw%3D1000&w=1600&q=90",
    h3:"Extraordinary workplaces",
    body:"A HiLink membership unlocks exclusive access to our premium floors in the heart of Hanoi — so you'll always find the space you need to do your best work.",
  },
  {
    img:"https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F3ce876f838b2476273d0cb2fe0f69c451a958119-2048x2731.jpg%3Fw%3D1000&w=1600&q=90",
    h3:"One monthly bill",
    body:"WiFi, utilities, maintenance, building insurance and service charges — all included in a single monthly payment. No hidden costs, ever.",
  },
];

const EVENT_SPACES = [
  {
    img: "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F1ad414c55caff1d090fa292f6db757a58a24e1b9-1920x1080.jpg&w=2000&q=75",
    name: "Meeting rooms",
    tag: "SPACES",
    desc: "Thoughtfully designed meeting rooms and boardrooms, all equipped with the latest technology to keep your session running smoothly.",
    capacity: "1–40 people",
    link: "/spaces/meeting-rooms",
  },
  {
    img: "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F15533660feaa116b56cb2c3938023fe1069f8b13-9504x6336.jpg%3Fw%3D1200&w=2000&q=70",
    name: "Event venues",
    tag: "SPACES",
    desc: "Discover our statement event spaces across our floors. With spaces for up to 100 guests and stunning Hanoi city views.",
    capacity: "1–100 people",
    link: "/spaces/event-spaces",
  },
];

export default function MembershipPage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <PageWrap>
      <div style={{ paddingTop:64 }}>

        {/* ── S1: HERO ── */}
        <section style={{ height:"80vh", minHeight:560, position:"relative", overflow:"hidden" }}>
          <img
            src="/workspace-photos/L1001039.jpg"
            alt="HiLink workspace"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
          />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%)" }} />
          <motion.div
            initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}
            style={{ position:"absolute", bottom:0, left:0, padding:"0 64px 80px", maxWidth:760 }}
          >
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:20 }}>
              Memberships to suit your workstyle
            </p>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(3rem,6vw,5rem)", fontWeight:400, color:"#FFFFFF", lineHeight:1.05, marginBottom:24 }}>
              Where work works<br />for you
            </h1>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:"rgba(255,255,255,0.8)", lineHeight:1.75, maxWidth:600 }}>
              Whether you're looking for a private office, a hot desk in an inspiring coworking area, or a prestigious virtual address — we offer an extraordinary workspace experience for businesses of all sizes.
            </p>
          </motion.div>
        </section>

        {/* ── S2: THREE VALUE PROPS ── */}
        <section style={{ background:"#FFFFFF", padding:"80px 64px" }}>
          <div style={{ maxWidth:1400, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:48 }}>
            {VALUE_PROPS.map((c, i) => (
              <motion.div key={c.h3} {...fade(i*0.1)}
                onMouseEnter={e=>{ const img=e.currentTarget.querySelector("img"); if(img) img.style.transform="scale(1.04)"; }}
                onMouseLeave={e=>{ const img=e.currentTarget.querySelector("img"); if(img) img.style.transform="scale(1)"; }}>
                <div style={{ aspectRatio:"2/3", overflow:"hidden", marginBottom:24 }}>
                  <img src={c.img} alt={c.h3} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s ease" }} />
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.2rem,1.8vw,1.5rem)", fontWeight:400, color:"var(--text)", marginBottom:14, lineHeight:1.2 }}>{c.h3}</h3>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-2)", lineHeight:1.8 }}>{c.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── S3: EXPLORE MEMBERSHIPS ── */}
        <section style={{ background:"var(--bg-2)", padding:"80px 64px", borderTop:"1px solid var(--border)" }}>
          <div style={{ maxWidth:1400, margin:"0 auto" }}>
            <motion.div {...fade()} style={{ marginBottom:56 }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>
                What we offer
              </p>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2rem,3.5vw,3rem)", fontWeight:400, color:"var(--text)", marginBottom:20, lineHeight:1.1 }}>
                Explore our memberships
              </h2>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:"var(--text-2)", lineHeight:1.75, maxWidth:640 }}>
                For big teams that love the buzz of an office, solopreneurs who need space to grow, or those seeking a break from home — we offer flexible memberships curated with you in mind.
              </p>
            </motion.div>

            {/* 2×2 membership card grid, gap 1px on dark border bg = grid lines */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:"var(--border)" }}>
              {MEMBERSHIPS.map((m, i) => (
                <motion.div key={m.name} {...fade(i*0.08)}
                  style={{
                    background:"#FFFFFF", cursor:"pointer",
                    borderTop: hoveredCard===i ? "3px solid var(--gold)" : "3px solid transparent",
                    transition:"border-color 0.2s",
                  }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(m.route || `/spaces?type=${encodeURIComponent(m.type)}`)}>
                  {/* Image */}
                  <div style={{ height:280, overflow:"hidden" }}>
                    <img src={m.img} alt={m.name}
                      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s ease", transform: hoveredCard===i ? "scale(1.03)" : "scale(1)" }} />
                  </div>
                  {/* Content */}
                  <div style={{ padding:"28px" }}>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>{m.tag}</p>
                    <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.4rem", fontWeight:400, color:"var(--text)", marginBottom:10, lineHeight:1.2 }}>{m.name}</h3>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-2)", lineHeight:1.7, marginBottom:20 }}>{m.desc}</p>
                    {/* Price row */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid var(--border)", paddingTop:16, marginBottom:16 }}>
                      <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"var(--gold)" }}>{m.from}</span>
                      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)" }}>Suitable for <em style={{ fontStyle:"normal", color:"var(--text-2)" }}>{m.capacity}</em></span>
                    </div>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)", borderBottom:"1px solid var(--text)", paddingBottom:1, transition:"color 0.15s, border-color 0.15s",
                      ...(hoveredCard===i ? { color:"var(--gold)", borderColor:"var(--gold)" } : {}) }}>
                      Find out more →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── S4: MEET & IMPRESS ── */}
        <section style={{ background:"#FFFFFF", padding:"80px 64px", borderTop:"1px solid var(--border)" }}>
          <div style={{ maxWidth:1400, margin:"0 auto" }}>
            <motion.div {...fade()} style={{ marginBottom:48 }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>
                For your team
              </p>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2rem,3.5vw,3rem)", fontWeight:400, color:"var(--text)", marginBottom:16, lineHeight:1.1 }}>
                Meet &amp; impress
              </h2>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:"var(--text-2)", lineHeight:1.75, maxWidth:560 }}>
                Hosting a memorable team meeting or wowing clients with an unforgettable event? Our inspiring spaces tick all the boxes.
              </p>
            </motion.div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
              {EVENT_SPACES.map((s, i) => (
                <motion.div key={s.name} {...fade(i*0.1)}
                  style={{ position:"relative", overflow:"hidden", minHeight:440, cursor:"pointer", borderRadius:4 }}
                  onClick={() => navigate(s.link)}
                  onMouseEnter={e=>{ const img=e.currentTarget.querySelector("img"); if(img) img.style.transform="scale(1.04)"; }}
                  onMouseLeave={e=>{ const img=e.currentTarget.querySelector("img"); if(img) img.style.transform="scale(1)"; }}>
                  <img src={s.img} alt={s.name}
                    style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 36px 36px" }}>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.65)", marginBottom:10 }}>{s.tag}</p>
                    <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.3rem,2vw,1.8rem)", fontWeight:400, color:"#FFFFFF", marginBottom:10, lineHeight:1.2 }}>{s.name}</h3>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(255,255,255,0.75)", lineHeight:1.65, maxWidth:360, marginBottom:16 }}>{s.desc}</p>
                    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"rgba(255,255,255,0.5)", marginBottom:16 }}>Suitable for {s.capacity}</p>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"#FFFFFF", borderBottom:"1px solid rgba(255,255,255,0.5)", paddingBottom:1 }}>Book now →</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── S5: SMART RECOMMENDATION (embedded inline, public) ── */}
        <section style={{ background:"var(--bg-2)", padding:"80px 64px", borderTop:"1px solid var(--border)" }}>
          <div style={{ maxWidth:1400, margin:"0 auto" }}>
            <motion.div {...fade()} style={{ marginBottom:48 }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>
                Smart match
              </p>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2rem,3.5vw,3rem)", fontWeight:400, color:"var(--text)", marginBottom:16, lineHeight:1.1 }}>
                Find your perfect match
              </h2>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:"var(--text-2)", lineHeight:1.75, maxWidth:560 }}>
                Tell us about your team and budget — our smart tool will instantly recommend the best HiLink spaces for you.
              </p>
            </motion.div>
            <div style={{ background:"#FFFFFF", border:"1px solid var(--border)", padding:"40px" }}>
              <RecommendationEngine compact={true} />
            </div>
          </div>
        </section>

        {/* ── S6: SAGE-GREEN "WE'RE HERE TO HELP" CTA ── */}
        <section style={{ background:"#B5C9A0", padding:"0 64px", overflow:"hidden" }}>
          <div style={{ maxWidth:1400, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:420, alignItems:"center", gap:64 }}>
            <motion.div {...fade()} style={{ padding:"64px 0" }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(15,15,15,0.5)", marginBottom:20 }}>
                Find a workspace that works for you
              </p>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:400, color:"#0F0F0F", lineHeight:1.1, marginBottom:24 }}>
                We're here to help
              </h2>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"rgba(15,15,15,0.65)", lineHeight:1.75, maxWidth:380, marginBottom:32 }}>
                Our team are on hand to answer any questions and help you find the perfect workspace for you and your team.
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
                <button onClick={() => navigate("/register")}
                  style={{ padding:"12px 28px", borderRadius:24, background:"#C9A84C", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:500, cursor:"pointer", transition:"background 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#0F0F0F"}
                  onMouseLeave={e=>e.currentTarget.style.background="#C9A84C"}>
                  Make an enquiry
                </button>
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(15,15,15,0.6)" }}>Sales: +84 24 3936 9197</span>
              </div>
            </motion.div>
            {/* Image floats from top-right with card border-radius */}
            <motion.div {...fade(0.15)} style={{ position:"relative", alignSelf:"stretch", display:"flex", alignItems:"flex-start", justifyContent:"flex-end" }}>
              <div style={{ position:"absolute", top:32, right:48, bottom:32, width:"calc(100% - 48px)", maxWidth:500, borderRadius:12, overflow:"hidden" }}>
                <img src="https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Fa335698b30e3051701dfc7f0ed4d08c55e013163-2500x1875.jpg%3Fq%3D100&w=1600&q=75" alt="We're here to help"
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </PageWrap>
  );
}
