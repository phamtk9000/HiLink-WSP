import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrap } from "../components/index.jsx";
import { ARTICLES } from "../data/mockData.js";

const CATEGORIES = ["All","Insight","Guide","Member Story","Design","Neighbourhood"];

/* ── Forum listing page ─────────────────────────────────────────────── */
export function ForumPage() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? ARTICLES : ARTICLES.filter(a => a.category === cat);
  const [featured, ...rest] = filtered;

  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>

        {/* ── FEATURED HERO (image left, text right) ── */}
        {featured && (
          <Link to={`/forum/${featured.slug}`} style={{ textDecoration:"none", display:"block" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:560, background:"#FFFFFF", borderBottom:"1px solid var(--border)" }}
              onMouseEnter={e=>{
                const img = e.currentTarget.querySelector("img");
                if(img) img.style.transform="scale(1.03)";
              }}
              onMouseLeave={e=>{
                const img = e.currentTarget.querySelector("img");
                if(img) img.style.transform="scale(1)";
              }}>
              {/* Left: portrait image */}
              <div style={{ overflow:"hidden", minHeight:480 }}>
                <img src={featured.image} alt={featured.title}
                  style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease", display:"block" }} />
              </div>
              {/* Right: text */}
              <div style={{ padding:"64px 64px", display:"flex", flexDirection:"column", justifyContent:"center", background:"#FFFFFF" }}>
                <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontStyle:"italic", color:"var(--gold)", marginBottom:20, letterSpacing:"0.04em" }}>{featured.category}</p>
                <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(1.6rem, 2.8vw, 2.4rem)", fontWeight:400, color:"var(--text)", lineHeight:1.15, marginBottom:20 }}>{featured.title}</h2>
                <p style={{ fontFamily:"'Inter', sans-serif", fontSize:15, color:"var(--text-2)", lineHeight:1.75, marginBottom:32 }}>{featured.excerpt}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:24, borderTop:"1px solid var(--border)" }}>
                  <span style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:"var(--text-3)" }}>{featured.author} · {featured.date}</span>
                  <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text)", borderBottom:"1px solid var(--text)", paddingBottom:1 }}>Read →</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── CATEGORY TABS ── */}
        <div style={{ background:"#FFFFFF", borderBottom:"1px solid var(--border)", padding:"0 64px" }}>
          <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", gap:0 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding:"16px 0", marginRight:32, background:"none", border:"none",
                borderBottom:`2px solid ${cat===c?"var(--gold)":"transparent"}`,
                fontFamily:"'Inter', sans-serif", fontSize:11, fontWeight:cat===c?600:400,
                letterSpacing:"0.12em", textTransform:"uppercase",
                color:cat===c?"var(--gold)":"var(--text-3)",
                cursor:"pointer", transition:"all 0.15s", marginBottom:-1,
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* ── ARTICLE GRID ── */}
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"48px 64px 96px" }}>
          {/* Count */}
          <p style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"var(--text-3)", marginBottom:40 }}>
            {filtered.length} {filtered.length === 1 ? "story" : "stories"}
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"48px 32px" }}>
            {rest.map((a, i) => (
              <Link key={a.id} to={`/forum/${a.slug}`} style={{ textDecoration:"none" }}>
                <motion.div
                  initial={{ opacity:0, y:16 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }}
                  transition={{ delay:i*0.06 }}
                  style={{ cursor:"pointer" }}
                  onMouseEnter={e=>{
                    const img = e.currentTarget.querySelector("img");
                    if(img) img.style.transform="scale(1.04)";
                  }}
                  onMouseLeave={e=>{
                    const img = e.currentTarget.querySelector("img");
                    if(img) img.style.transform="scale(1)";
                  }}>
                  {/* Image — aspect 3/4 */}
                  <div style={{ aspectRatio:"3/4", overflow:"hidden", marginBottom:20 }}>
                    <img src={a.image} alt={a.title}
                      style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease", display:"block" }} />
                  </div>
                  {/* Category — italic, no pill */}
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontStyle:"italic", color:"var(--gold)", marginBottom:10, letterSpacing:"0.04em" }}>{a.category}</p>
                  {/* Title */}
                  <h4 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(1rem, 1.6vw, 1.25rem)", fontWeight:400, color:"var(--text)", lineHeight:1.25, marginBottom:12 }}>{a.title}</h4>
                  {/* Date only — no excerpt */}
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:"var(--text-3)", letterSpacing:"0.04em" }}>{a.date}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ fontFamily:"'Inter', sans-serif", color:"var(--text-3)", fontSize:14 }}>No stories in this category yet.</p>
          )}
        </div>
      </div>
    </PageWrap>
  );
}

/* ── Article detail page ─────────────────────────────────────────────── */
export function ArticlePage() {
  const { slug } = useParams();
  const article = ARTICLES.find(a => a.slug === slug);

  if (!article) return (
    <PageWrap>
      <div style={{ paddingTop:64, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"2rem", color:"var(--text)", marginBottom:16 }}>Story not found</h2>
          <Link to="/forum" style={{ color:"var(--gold)", fontFamily:"'Inter', sans-serif", fontSize:13 }}>← Back to The Forum</Link>
        </div>
      </div>
    </PageWrap>
  );

  const related = ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0,2);

  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        {/* Back */}
        <div style={{ background:"#FFFFFF", borderBottom:"1px solid var(--border)", padding:"16px 64px" }}>
          <Link to="/forum" style={{ fontFamily:"'Inter', sans-serif", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-3)", textDecoration:"none" }}
            onMouseEnter={e=>e.currentTarget.style.color="var(--gold)"}
            onMouseLeave={e=>e.currentTarget.style.color="var(--text-3)"}>
            ← The Forum
          </Link>
        </div>

        {/* Article header */}
        <section style={{ background:"#FFFFFF", padding:"64px 64px 0" }}>
          <div style={{ maxWidth:780, margin:"0 auto" }}>
            <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:28 }}>
              <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontStyle:"italic", color:"var(--gold)", margin:0 }}>{article.category}</p>
              <span style={{ color:"var(--border)" }}>·</span>
              <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:"var(--text-3)" }}>{article.readTime}</span>
              <span style={{ color:"var(--border)" }}>·</span>
              <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:"var(--text-3)" }}>{article.date}</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(2rem, 4vw, 3.2rem)", fontWeight:400, color:"var(--text)", lineHeight:1.1, marginBottom:24 }}>{article.title}</h1>
            <p style={{ fontFamily:"'Inter', sans-serif", fontSize:18, color:"var(--text-2)", lineHeight:1.7, marginBottom:48, fontStyle:"italic" }}>{article.excerpt}</p>
          </div>
        </section>

        {/* Hero image */}
        <div style={{ height:480, overflow:"hidden" }}>
          <img src={article.image} alt={article.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>

        {/* Body */}
        <section style={{ background:"#FFFFFF", padding:"64px 64px 80px" }}>
          <div style={{ maxWidth:780, margin:"0 auto" }}>
            {article.body.split("\n\n").map((para, i) => (
              <motion.p key={i}
                initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.04 }}
                style={{ fontFamily:"'Inter', sans-serif", fontSize:16, color:"var(--text-2)", lineHeight:1.85, marginBottom:28 }}>
                {para}
              </motion.p>
            ))}
            <div style={{ paddingTop:40, borderTop:"1px solid var(--border)", marginTop:16 }}>
              <span style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"var(--text-3)" }}>
                Written by <strong style={{ color:"var(--text)" }}>{article.author}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ background:"var(--bg-2)", borderTop:"1px solid var(--border)", padding:"64px 64px" }}>
            <div style={{ maxWidth:1400, margin:"0 auto" }}>
              <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontWeight:500, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:40 }}>More stories</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
                {related.map(a => (
                  <Link key={a.id} to={`/forum/${a.slug}`} style={{ textDecoration:"none" }}>
                    <div style={{ cursor:"pointer" }}
                      onMouseEnter={e=>{const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1.04)";}}
                      onMouseLeave={e=>{const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1)";}}>
                      <div style={{ height:200, overflow:"hidden", marginBottom:16 }}>
                        <img src={a.image} alt={a.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease" }} />
                      </div>
                      <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontStyle:"italic", color:"var(--gold)", marginBottom:8 }}>{a.category}</p>
                      <h3 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.15rem", fontWeight:400, color:"var(--text)", lineHeight:1.2 }}>{a.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageWrap>
  );
}
