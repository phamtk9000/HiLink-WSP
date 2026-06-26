import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { PageWrap } from "../components/index.jsx";

const LogoMark = () => (
  <div style={{ width:92, height:92, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 32px" }}>
    <img
      src="/workspace-photos/logo-workspace-trim.png"
      alt="HiLink Business Club"
      style={{ width:"100%", height:"100%", objectFit:"contain", display:"block" }}
    />
  </div>
);

const fade = (delay=0) => ({ initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.6,delay} });

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <PageWrap>
      <div style={{ paddingTop:64 }}>

        {/* ── S1: HERO ── */}
        <section style={{ height:"100vh", position:"relative", overflow:"hidden" }}>
          <img src="https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Fc972dc3a55e72b7663f1e6655d0fd39915d0a105-8250x6188.jpg&w=2000&q=75" alt="HiLink"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.2) 50%,transparent 100%)" }} />
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            style={{ position:"absolute", bottom:0, left:0, padding:"0 64px 80px", maxWidth:800 }}>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(3.5rem,7vw,6rem)", fontWeight:400, color:"#FFFFFF", lineHeight:1.05, margin:0 }}>
              Your extraordinary everyday
            </h1>
          </motion.div>
        </section>

        {/* ── S2: OWN YOUR WORKSTYLE — image L, text R ── */}
        <section style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:580 }}>
          <div style={{ overflow:"hidden" }}>
            <img src="https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Fff4a27cc97cfd96c4f11ee1afb1a9dd34fc212f5-6875x4586.jpg&w=2000&q=70" alt="Workstyle"
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
          </div>
          <motion.div {...fade()} style={{ background:"#FFFFFF", padding:"80px 72px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, fontStyle:"italic", color:"var(--gold)", marginBottom:12 }}>Own your workstyle</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,2.5vw,2.2rem)", fontWeight:400, color:"var(--text)", marginBottom:24, lineHeight:1.15 }}>
              Where work works for you
            </h2>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:"var(--text-2)", lineHeight:1.85 }}>
              Whether you're a quiet seeker, a noise needer, a solo thinker or a social butterfly — HiLink is the office, but not as you know it. Be empowered to do your best work in your own unique way across three premium floors in the heart of Hanoi.
            </p>
          </motion.div>
        </section>

        {/* ── S3: A NEW WORLD OF WORK — text L, image R ── */}
        <section style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:580 }}>
          <motion.div {...fade()} style={{ background:"var(--bg-2)", padding:"80px 72px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, fontStyle:"italic", color:"var(--gold)", marginBottom:16 }}>A new world of work</p>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:"var(--text-2)", lineHeight:1.85 }}>
              We provide a seamless end-to-end workspace experience, offering beautifully designed private offices for businesses of all sizes that are ready to move in or tailored to suit you. With flexible contracts and three-month minimum terms, you'll pay just one monthly bill including WiFi, utilities, and maintenance. Plus, enjoy access to communal amenities throughout your building: bookable meeting rooms, cafés, coworking areas, private phone booths, and more. We've been a trusted partner of leading businesses in Hanoi since 2021 and will be by your side through every stage of your journey.
            </p>
          </motion.div>
          <div style={{ overflow:"hidden" }}>
            <img src="https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Fca07725b6adb85468f05ac11d2b667a6d3086e0f-2589x1781.jpg&w=2000&q=70" alt="New world"
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
          </div>
        </section>

        {/* ── S4: 3-UP FEATURE CARDS ── */}
        <section style={{ background:"#FFFFFF", padding:"80px 64px", borderTop:"1px solid var(--border)" }}>
          <div style={{ maxWidth:1400, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:48 }}>
            {[
              { img:"https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Fbd0556e5c29736d44939ea96c407c5ec156533d8-8192x7358.jpg&w=2000&q=70", h3:"For your unique workstyle",    body:"Everyone has their own way of working. From buzzy breakout areas and quiet focus booths to energising fitness areas and calming spaces – it's all here for however you work best." },
              { img:"https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F863b3e42ea6abe7592b3641df9498093ca2139ce-5760x3840.jpg&w=2000&q=70", h3:"For extraordinary experiences", body:"The HiLink experience is all about ease, so you can focus on what matters most. With curated member events and wellness initiatives, you can shape your own unique company culture while being part of a wider community." },
              { img:"/workspace-photos/a57e2c5781bc65cf0e2a061375bf32119341b3b2-2048x1366.avif", h3:"For progressive thinkers",      body:"We're here for businesses of every size, from emerging ventures to global brands. Always innovating, always setting a higher standard — bringing your team together in a consciously designed workspace." },
            ].map((c, i) => (
              <motion.div key={c.h3} {...fade(i*0.1)}
                onMouseEnter={e=>{const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1.04)";}}
                onMouseLeave={e=>{const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1)";}}>
                <div style={{ aspectRatio:"4/3", overflow:"hidden", marginBottom:24 }}>
                  <img src={c.img} alt={c.h3} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s ease" }} />
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.1rem,1.6vw,1.35rem)", fontWeight:400, color:"var(--text)", marginBottom:14, lineHeight:1.25 }}>{c.h3}</h3>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-2)", lineHeight:1.75 }}>{c.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── S5: CEO BLOCKQUOTE #1 ── */}
        <section style={{ background:"var(--bg-2)", padding:"96px 64px", textAlign:"center" }}>
          <motion.div {...fade()}>
            <LogoMark />
            <blockquote style={{ maxWidth:760, margin:"0 auto" }}>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.4rem,2.8vw,2.2rem)", fontStyle:"italic", fontWeight:400, color:"var(--text)", lineHeight:1.55, marginBottom:32 }}>
                "By leading, challenging and setting the standard for what the workspace experience should be, we are energising and empowering people to create their best work in their best way."
              </p>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", marginBottom:4 }}>Pham Gia Khanh</p>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>CEO, HiLink</p>
            </blockquote>
          </motion.div>
        </section>

        {/* ── S6: MEDIA BANNER (video placeholder) ── */}
        <section style={{ position:"relative", height:400, overflow:"hidden" }}>
          <img src="/workspace-photos/9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif" alt="Discover HiLink"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }} />
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, textTransform:"uppercase", letterSpacing:"0.2em", color:"rgba(255,255,255,0.75)" }}>Discover HiLink</p>
            <div style={{ width:60, height:60, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.6)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <span style={{ color:"#FFFFFF", fontSize:20, marginLeft:4 }}>▶</span>
            </div>
            <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.4rem,2.5vw,2rem)", fontStyle:"italic", color:"#FFFFFF" }}>Where work works for you.</p>
          </div>
        </section>

        {/* ── S7: 3-COL SUSTAINABILITY/WELLNESS ── */}
        <section style={{ background:"#FFFFFF", padding:"80px 64px" }}>
          <div style={{ maxWidth:1400, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:48 }}>
            {[
              { img:"https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F239d5567060bb811d54a6a09c3254dcaf55608d7-2500x1875.jpg%3Frect%3D104%2C0%2C2292%2C1875%26w%3D1100%26h%3D900&w=2000&q=75",   aspect:"3/4", h3:"Do good, feel good",     body:"At HiLink, we know that redefining the office experience means creating working environments that are fit for future generations. Through our sustainability and wellness initiatives, we look after both the people in our spaces and the world around us.", link:null },
              { img:"https://www.foraspace.com/_next/image?url=https%3A%2F%2Fimg.evbuc.com%2Fhttps%253A%252F%252Fcdn.evbuc.com%252Fimages%252F1173400677%252F2132356656433%252F1%252Foriginal.20251222-163432%3Fauto%3Dformat%252Ccompress%26q%3D75%26sharp%3D10%26s%3D76eaca56966347c355484d665431d310&w=2000&q=75", aspect:"3/4", h3:"For the future",          body:"We're committed to driving positive change by running our buildings in the most sustainable way possible. All our workspaces are powered by 100% renewable electricity, we ensure zero waste goes to landfill through effective recycling schemes, optimise air quality, and use organic products that are kinder to people and planet. So, when you choose HiLink as your new business home, every day you will be contributing to a better future.", link:"Read the report →" },
              { img:"https://www.foraspace.com/_next/image?url=https%3A%2F%2Fimg.evbuc.com%2Fhttps%253A%252F%252Fcdn.evbuc.com%252Fimages%252F1185053654%252F2132356656433%252F1%252Foriginal.20260520-163507%3Fauto%3Dformat%252Ccompress%26q%3D75%26sharp%3D10%26s%3D1a4549d2762874b3834b371901af28fa&w=2000&q=75", aspect:"4/3", h3:"For mind, body and soul", body:"We understand the importance of a happy and healthy team. Our wellness facilities cater for physical and mental health in equal measures. We offer complimentary fitness sessions, monthly bookable classes, personal training, and exclusive discounts — so with us, it's easy for your team to stay well at work.", link:null },
            ].map((c, i) => (
              <motion.div key={c.h3} {...fade(i*0.1)}>
                <div style={{ aspectRatio:c.aspect, overflow:"hidden", marginBottom:24 }}>
                  <img src={c.img} alt={c.h3} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s ease" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.1rem,1.6vw,1.35rem)", fontWeight:400, color:"var(--text)", marginBottom:14, lineHeight:1.25 }}>{c.h3}</h3>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-2)", lineHeight:1.8, marginBottom: c.link?20:0 }}>{c.body}</p>
                {c.link && (
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)", borderBottom:"1px solid var(--text)", paddingBottom:1, cursor:"pointer", transition:"color 0.15s,border-color 0.15s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.color="var(--gold)"; e.currentTarget.style.borderColor="var(--gold)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.color="var(--text)"; e.currentTarget.style.borderColor="var(--text)"; }}>
                    {c.link}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── S8: SECOND BLOCKQUOTE ── */}
        <section style={{ background:"#FFFFFF", padding:"80px 64px", textAlign:"center", borderTop:"1px solid var(--border)" }}>
          <motion.div {...fade()}>
            <LogoMark />
            <blockquote style={{ maxWidth:680, margin:"0 auto" }}>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.2rem,2vw,1.7rem)", fontStyle:"italic", fontWeight:400, color:"var(--text)", lineHeight:1.6, marginBottom:28 }}>
                "Our characterful workspaces are uniquely designed to make your everyday extraordinary."
              </p>
            </blockquote>
            <span onClick={() => navigate("/spaces")}
              style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)", borderBottom:"1px solid var(--text)", paddingBottom:1, cursor:"pointer", transition:"color 0.15s,border-color 0.15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.color="var(--gold)"; e.currentTarget.style.borderColor="var(--gold)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.color="var(--text)"; e.currentTarget.style.borderColor="var(--text)"; }}>
              Discover our spaces →
            </span>
          </motion.div>
        </section>

        {/* ── S9: 5-IMAGE COLLAGE ── */}
        <div style={{ display:"flex", gap:4, height:480, overflow:"hidden" }}>
          {[
            "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Fceaea587a0a2c0bb3b3ae738f73055ebff4309d9-4000x3001.jpg&w=2000&q=75",
            "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F8bd33b28225b4348b791b33c76f47534d3110db5-1306x1958.jpg&w=2000&q=75",
            "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F550e192ca78100d56868224877f85e490782c9e1-8043x6032.jpg&w=2000&q=75",
            "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2Fa06b57fc106ce94e76e2bd0b7067a53901100c1a-8256x6192.jpg&w=980&q=75",
            "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F519d7d8ac3214605cd56b4a1238368624bd09c24-6045x8061.jpg&w=2000&q=75",
          ].map((src, i) => (
            <div key={i} style={{ flex:1, overflow:"hidden", alignSelf:[0,2,4].includes(i)?"stretch":"center", height:[0,2,4].includes(i)?"100%":"70%" }}>
              <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s ease" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
            </div>
          ))}
        </div>

        {/* ── S10: TAILORED DESIGN — text L, 3 stacked images R ── */}
        <section style={{ background:"var(--bg-2)", padding:"96px 64px", borderTop:"1px solid var(--border)" }}>
          <div style={{ maxWidth:1400, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
            <motion.div {...fade()}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, fontStyle:"italic", color:"var(--gold)", marginBottom:12 }}>Tailored design</p>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.8rem,3vw,2.6rem)", fontWeight:400, color:"var(--text)", marginBottom:24, lineHeight:1.1 }}>
                Tailored to suit your needs
              </h2>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:"var(--text-2)", lineHeight:1.85 }}>
                From standing desks and acoustic panels to branded walls and plants that boost productivity, our spaces are a canvas for you to transform in your own extraordinary way. Our expert in-house design team will work with you to bring your vision to life.
              </p>
            </motion.div>
            <motion.div {...fade(0.15)} style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F3b02e45968681b85ca56a56c4ec96e28dd938d1e-6529x4353.jpg&w=2000&q=75",
                "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F9bde114c2d39715135125121b899711f7b6d4354-6824x4548.jpg%3Fw%3D1000&w=1600&q=90",
                "https://www.foraspace.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F8vw7318k%2Fproduction%2F89786b7d3a1ec6e9c861fa50037dccc9606d82dc-8250x5619.jpg&w=1200&q=75",
              ].map((src, i) => (
                <div key={i} style={{ height:210, overflow:"hidden" }}>
                  <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s ease" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── S11: DUO-PANEL CTA (inset, border-radius 12) ── */}
        <section style={{ background:"#FFFFFF", padding:48 }}>
          {/* borderRadius:12 clips both panels — no border needed, radius IS the frame */}
          <div style={{ borderRadius:12, overflow:"hidden", display:"grid", gridTemplateColumns:"1fr 1fr" }}>
            {[
              { img:"public/workspace-photos/DSC06104.jpg", title:"Our memberships",           body:"Our hot desk, private office and virtual memberships are designed to suit the way you and your team work best.",link:"View memberships →", href:"/membership" },
              { img:"public/workspace-photos/BG_HOME.jpg", title:"Find your perfect space",  body:"Explore our floors across Hanoi and find a workspace for your business to call home.",link:"See all spaces →",   href:"/spaces" },
            ].map((p, i) => (
              <div key={i} style={{ position:"relative", minHeight:480, overflow:"hidden", cursor:"pointer" }}
                onClick={() => navigate(p.href)}
                onMouseEnter={e=>{ const img=e.currentTarget.querySelector("img"); if(img) img.style.transform="scale(1.04)"; }}
                onMouseLeave={e=>{ const img=e.currentTarget.querySelector("img"); if(img) img.style.transform="scale(1)"; }}>
                <img src={p.img} alt={p.title}
                  style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.70) 0%,rgba(0,0,0,0.2) 55%,transparent 100%)" }} />
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 40px 40px" }}>
                  <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:400, color:"#FFFFFF", marginBottom:12, lineHeight:1.2 }}>{p.title}</h3>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"rgba(255,255,255,0.78)", lineHeight:1.65, maxWidth:340, marginBottom:20 }}>{p.body}</p>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"#FFFFFF", display:"inline-flex", alignItems:"center", gap:8, borderBottom:"1px solid transparent", paddingBottom:1, transition:"border-color 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.borderBottom="1px solid rgba(255,255,255,0.8)"}
                    onMouseLeave={e=>e.currentTarget.style.borderBottom="1px solid transparent"}>
                    {p.link}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── S12: "WE'RE HERE TO HELP" — sage green, image floats from top-right ── */}
        <section style={{ background:"#B5C9A0", padding:"0 64px", overflow:"hidden" }}>
          <div style={{ maxWidth:1400, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:420, alignItems:"center", gap:64 }}>
            <motion.div {...fade()} style={{ padding:"64px 0" }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(15,15,15,0.5)", marginBottom:20 }}>Find a workspace that works for you</p>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:400, color:"#0F0F0F", lineHeight:1.1, marginBottom:24 }}>We're here to help</h2>
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
          </div>
        </section>

      </div>
    </PageWrap>
  );
}
