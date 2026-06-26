import { useState, useRef, useEffect } from "react";
import { PageWrap, PortalLayout } from "../components/index.jsx";
import { motion, AnimatePresence } from "framer-motion";

/* ── Shared styles ── */
const lbl = { fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", display:"block", marginBottom:6 };
const inp = { width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:14, outline:"none", borderRadius:0 };
const sel = { ...inp };
const ta  = { ...inp, minHeight:90, resize:"vertical" };
const tabBtn = (active) => ({ padding:"10px 20px", background:"none", border:"none", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:active?600:400, color:active?"var(--text)":"var(--text-3)", borderBottom:`2px solid ${active?"var(--gold)":"transparent"}`, marginBottom:-1, transition:"all 0.15s" });
const statusChip = (s) => {
  if (s==="Pending") return { bg:"rgba(181,134,42,0.12)", color:"#B5862A" };
  if (s==="In Progress") return { bg:"rgba(24,95,165,0.10)", color:"#185FA5" };
  if (s==="Fixed") return { bg:"rgba(45,106,79,0.10)", color:"#2D6A4F" };
  return { bg:"var(--bg-3)", color:"var(--text-3)" };
};

const ROOMS = ["Meeting Room A (12)","Boardroom Suite (20)","Phone Booth 1 (1)","Phone Booth 2 (1)"];
const HOURS = Array.from({length:11},(_,i)=>`${(8+i).toString().padStart(2,"0")}:00`);

/* Pre-occupied slots for realism */
const OCCUPIED = { "Meeting Room A (12)":["10:00","11:00"], "Boardroom Suite (20)":["14:00","15:00","16:00"], "Phone Booth 1 (1)":["09:00"], "Phone Booth 2 (1)":["13:00","14:00"] };

/* Get 7-day week starting from a date */
const getWeek = (base) => Array.from({length:7},(_,i)=>{ const d=new Date(base); d.setDate(d.getDate()+i); return d; });
const fmtDate = (d) => d.toLocaleDateString("en-GB",{weekday:"short",month:"short",day:"numeric"});
const fmtIso = (d) => d.toISOString().split("T")[0];

const SERVICES = [
  { id:"clean",   icon:"🧹", name:"Cleaning",      desc:"Professional cleaning of your space",            variants:[{label:"Daily",price:200000},{label:"Weekly",price:500000},{label:"One-time",price:150000}] },
  { id:"it",      icon:"💻", name:"IT Support",     desc:"Technical assistance for your team",             variants:[{label:"Remote",price:0},{label:"On-site",price:300000}] },
  { id:"furn",    icon:"🪑", name:"Furniture",      desc:"Additional furniture at no extra cost",          variants:[{label:"Chair",price:0},{label:"Desk",price:0},{label:"Monitor stand",price:0}] },
  { id:"print",   icon:"🖨️", name:"Document Printing", desc:"Colour printing and scanning service",      variants:[{label:"Per page",price:2000}] },
];

export default function TenantPortal() {
  const [tab, setTab] = useState("report");

  /* ── Report issue state ── */
  const [issueForm, setIssueForm] = useState({ type:"AC", floor:"Floor 12", room:"", desc:"", priority:"Medium", photo:null, photoUrl:null });
  const [tickets, setTickets] = useState([]);

  /* ── Bookings state ── */
  const [weekBase, setWeekBase] = useState(() => { const d=new Date(); d.setDate(d.getDate()-d.getDay()+1); return d; });
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [confirmSlot, setConfirmSlot] = useState(null); // {day, hour}
  const [roomBookings, setRoomBookings] = useState([]); // {room,day,hour}

  /* ── Extra services ── */
  const [toast, setToast] = useState(null);
  const [serviceVariants, setServiceVariants] = useState(() => Object.fromEntries(SERVICES.map(s=>[s.id, s.variants[0].label])));

  /* ── Contact manager ── */
  const [msgForm, setMsgForm] = useState({ subject:"", message:"" });
  const [msgSent, setMsgSent] = useState(false);

  const setIssue = k => v => setIssueForm(f=>({...f,[k]:v}));

  const submitIssue = () => {
    if (!issueForm.desc) return;
    const id = `TKT-${new Date().getFullYear()}-${String(tickets.length+1).padStart(3,"0")}`;
    setTickets(t=>[...t,{ id, type:issueForm.type, location:`${issueForm.floor}${issueForm.room?`, ${issueForm.room}`:""}`, priority:issueForm.priority, status:"Pending", date:new Date().toLocaleDateString() }]);
    setIssueForm({ type:"AC", floor:"Floor 12", room:"", desc:"", priority:"Medium", photo:null, photoUrl:null });
    setTab("tickets");
  };

  const week = getWeek(weekBase);
  const isOccupied = (room, day, hour) => {
    const pre = (OCCUPIED[room]||[]).includes(hour);
    const booked = roomBookings.some(b=>b.room===room && b.day===fmtIso(day) && b.hour===hour);
    return pre || booked;
  };
  const isReserved = (room, day, hour) => roomBookings.some(b=>b.room===room && b.day===fmtIso(day) && b.hour===hour);

  const confirmBook = () => {
    if (!confirmSlot) return;
    setRoomBookings(bs=>[...bs,{ room:selectedRoom, day:fmtIso(confirmSlot.day), hour:confirmSlot.hour }]);
    setConfirmSlot(null);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  const TABS = [
    {id:"report", label:"Report Issue"},
    {id:"tickets",label:"My Tickets"},
    {id:"rooms",  label:"Book Meeting Room"},
    {id:"services",label:"Extra Services"},
    {id:"manager",label:"Contact Manager"},
  ];

  return (
    <PortalLayout>
      <PageWrap>
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
              style={{ position:"fixed", top:80, right:24, zIndex:300, background:"rgba(45,106,79,0.95)", color:"#FFFFFF", padding:"12px 20px", fontFamily:"'Inter',sans-serif", fontSize:13, borderRadius:2, boxShadow:"0 4px 20px rgba(0,0,0,0.2)" }}>
              ✓ {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm booking modal */}
        {confirmSlot && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setConfirmSlot(null)}>
            <div onClick={e=>e.stopPropagation()} style={{ background:"#FFFFFF", padding:"28px 32px", maxWidth:380, width:"100%" }}>
              <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.2rem", color:"var(--text)", marginBottom:20 }}>Confirm booking</h3>
              <div style={{ display:"grid", gap:8, marginBottom:24 }}>
                {[["Room",selectedRoom],["Date",fmtDate(confirmSlot.day)],["Time",confirmSlot.hour]].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", gap:16 }}>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", minWidth:40 }}>{k}</span>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text)", fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button onClick={confirmBook} style={{ padding:"9px 20px", background:"var(--text)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:"pointer" }}>Confirm</button>
                <button onClick={()=>setConfirmSlot(null)} style={{ padding:"9px 16px", background:"none", border:"1px solid var(--border)", color:"var(--text-3)", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:"pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom:24 }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>My Space</p>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:400, color:"var(--text)" }}>Tenant Portal</h1>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:28, gap:4, overflowX:"auto" }}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={tabBtn(tab===t.id)}>{t.label}</button>)}
        </div>

        {/* ── Tab 1: Report Issue ── */}
        {tab === "report" && (
          <div style={{ maxWidth:540 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div>
                <label style={lbl}>Issue type</label>
                <select value={issueForm.type} onChange={e=>setIssue("type")(e.target.value)} style={sel}>
                  {["AC","Internet","Door","Electricity","Plumbing","Other"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Floor</label>
                <select value={issueForm.floor} onChange={e=>setIssue("floor")(e.target.value)} style={sel}>
                  {["Floor 12","Floor 14","Floor 15"].map(f=><option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Desk / room number (optional)</label>
              <input value={issueForm.room} onChange={e=>setIssue("room")(e.target.value)} style={inp} placeholder="e.g. Desk 12-A4" />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Description</label>
              <textarea value={issueForm.desc} onChange={e=>setIssue("desc")(e.target.value)} style={ta} placeholder="Describe the issue in detail..." />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Priority</label>
              <div style={{ display:"flex", gap:10 }}>
                {["Low","Medium","Urgent"].map(p=>(
                  <label key={p} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"7px 14px", border:`1px solid ${issueForm.priority===p?"var(--border-gold)":"var(--border)"}`, background:issueForm.priority===p?"rgba(168,143,92,0.06)":"transparent" }}>
                    <input type="radio" name="priority" checked={issueForm.priority===p} onChange={()=>setIssue("priority")(p)} style={{ accentColor:"var(--gold)" }} />
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)" }}>{p}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={lbl}>Photo (optional)</label>
              <input type="file" accept="image/*" onChange={e=>{ const f=e.target.files[0]; if(f){ setIssue("photo")(f); setIssue("photoUrl")(URL.createObjectURL(f)); }}} style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)" }} />
              {issueForm.photoUrl && <img src={issueForm.photoUrl} alt="Preview" style={{ marginTop:10, maxWidth:200, maxHeight:120, objectFit:"cover", border:"1px solid var(--border)" }} />}
            </div>
            <button onClick={submitIssue} style={{ padding:"10px 24px", background:"var(--text)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.08em", cursor:"pointer", transition:"background 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background="var(--gold)"} onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
              Submit issue →
            </button>
          </div>
        )}

        {/* ── Tab 2: My Tickets ── */}
        {tab === "tickets" && (
          <div>
            {tickets.length === 0 ? (
              <div style={{ textAlign:"center", padding:"64px 0", color:"var(--text-3)" }}>
                <p style={{ fontSize:32, marginBottom:12 }}>◌</p>
                <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"var(--text-2)", marginBottom:8 }}>No tickets yet</p>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13 }}>Report an issue to get started.</p>
              </div>
            ) : (
              <div style={{ background:"var(--bg-2)", border:"1px solid var(--border)", overflow:"hidden" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid var(--border)" }}>
                      {["Ticket ID","Issue","Location","Priority","Status","Date",""].map(h=>(
                        <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, color:"var(--text-3)", textTransform:"uppercase", letterSpacing:"0.1em", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t=>{
                      const sc=statusChip(t.status);
                      return (
                        <tr key={t.id} style={{ borderBottom:"1px solid var(--border)" }}>
                          <td style={{ padding:"12px 14px", fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--gold)", fontWeight:600 }}>{t.id}</td>
                          <td style={{ padding:"12px 14px", fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)" }}>{t.type}</td>
                          <td style={{ padding:"12px 14px", fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>{t.location}</td>
                          <td style={{ padding:"12px 14px", fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>{t.priority}</td>
                          <td style={{ padding:"12px 14px" }}>
                            <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:sc.bg, color:sc.color, fontSize:11, fontWeight:600, padding:"2px 8px", fontFamily:"'Inter',sans-serif" }}>
                              <span style={{ width:5, height:5, borderRadius:"50%", background:sc.color, flexShrink:0 }}/>{t.status}
                            </span>
                          </td>
                          <td style={{ padding:"12px 14px", fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>{t.date}</td>
                          <td style={{ padding:"12px 14px" }}>
                            {t.status !== "Fixed" && (
                              <button onClick={()=>setTickets(ts=>ts.map(x=>x.id===t.id?{...x,status:"Fixed"}:x))} style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)", background:"none", border:"1px solid var(--border)", padding:"4px 10px", cursor:"pointer" }}>Mark fixed</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 3: Book Meeting Room ── */}
        {tab === "rooms" && (
          <div>
            {/* Room selector */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
              {ROOMS.map(r=>(
                <button key={r} onClick={()=>setSelectedRoom(r)} style={{ padding:"8px 16px", background:selectedRoom===r?"var(--text)":"var(--bg-2)", border:`1px solid ${selectedRoom===r?"var(--text)":"var(--border)"}`, color:selectedRoom===r?"#FFFFFF":"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:"pointer", transition:"all 0.15s" }}>{r}</button>
              ))}
            </div>

            {/* Week navigator */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <button onClick={()=>setWeekBase(d=>{ const n=new Date(d); n.setDate(n.getDate()-7); return n; })} style={{ padding:"6px 12px", background:"none", border:"1px solid var(--border)", cursor:"pointer", color:"var(--text-3)", fontFamily:"'Inter',sans-serif", fontSize:12 }}>← Prev</button>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)" }}>{fmtDate(week[0])} – {fmtDate(week[6])}</span>
              <button onClick={()=>setWeekBase(d=>{ const n=new Date(d); n.setDate(n.getDate()+7); return n; })} style={{ padding:"6px 12px", background:"none", border:"1px solid var(--border)", cursor:"pointer", color:"var(--text-3)", fontFamily:"'Inter',sans-serif", fontSize:12 }}>Next →</button>
            </div>

            {/* Day selector */}
            <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto" }}>
              {week.map((d,i)=>(
                <button key={i} onClick={()=>setSelectedDay(d)} style={{ padding:"8px 12px", minWidth:72, background:selectedDay&&fmtIso(d)===fmtIso(selectedDay)?"var(--text)":"var(--bg-2)", border:`1px solid ${selectedDay&&fmtIso(d)===fmtIso(selectedDay)?"var(--text)":"var(--border)"}`, color:selectedDay&&fmtIso(d)===fmtIso(selectedDay)?"#FFFFFF":"var(--text-3)", fontFamily:"'Inter',sans-serif", fontSize:11, cursor:"pointer", textAlign:"center", transition:"all 0.15s" }}>
                  <div style={{ fontWeight:600, marginBottom:2 }}>{d.toLocaleDateString("en",{weekday:"short"})}</div>
                  <div>{d.getDate()}</div>
                </button>
              ))}
            </div>

            {/* Time grid */}
            {selectedDay ? (
              <>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.1em" }}>
                  {fmtDate(selectedDay)} · {selectedRoom}
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
                  {HOURS.map(h=>{
                    const occ = isOccupied(selectedRoom, selectedDay, h);
                    const res = isReserved(selectedRoom, selectedDay, h);
                    const bgColor = occ ? (res?"rgba(24,95,165,0.12)":"rgba(192,57,43,0.10)") : "rgba(45,106,79,0.10)";
                    const textColor = occ ? (res?"#185FA5":"var(--danger)") : "var(--success)";
                    const borderColor = occ ? (res?"rgba(24,95,165,0.3)":"rgba(192,57,43,0.3)") : "rgba(45,106,79,0.3)";
                    return (
                      <button key={h} disabled={occ && !res} onClick={()=>!occ && setConfirmSlot({day:selectedDay,hour:h})}
                        style={{ padding:"8px 14px", background:bgColor, border:`1px solid ${borderColor}`, color:textColor, fontFamily:"'Inter',sans-serif", fontSize:12, cursor:occ?"not-allowed":"pointer", transition:"all 0.12s" }}>
                        {h} {res?"· Yours":occ?"· Occupied":"· Available"}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:20 }}>
                  {[["rgba(45,106,79,0.10)","rgba(45,106,79,0.3)","var(--success)","Available"],["rgba(24,95,165,0.12)","rgba(24,95,165,0.3)","#185FA5","Your booking"],["rgba(192,57,43,0.10)","rgba(192,57,43,0.3)","var(--danger)","Occupied"]].map(([bg,bdr,col,label])=>(
                    <div key={label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:16, height:16, background:bg, border:`1px solid ${bdr}` }} />
                      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-3)" }}>Select a day to see available slots.</p>
            )}

            {/* My bookings list */}
            {roomBookings.length > 0 && (
              <>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:10 }}>My bookings</p>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {roomBookings.map((b,i)=>(
                    <div key={i} style={{ display:"flex", gap:16, padding:"10px 14px", background:"rgba(24,95,165,0.06)", border:"1px solid rgba(24,95,165,0.15)" }}>
                      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text)", fontWeight:500 }}>{b.room}</span>
                      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>{b.day}</span>
                      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>{b.hour}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Tab 4: Extra Services ── */}
        {tab === "services" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
            {SERVICES.map(s=>{
              const variant = s.variants.find(v=>v.label===serviceVariants[s.id]) || s.variants[0];
              return (
                <div key={s.id} style={{ background:"var(--bg-2)", border:"1px solid var(--border)", padding:"22px" }}>
                  <p style={{ fontSize:28, marginBottom:10 }}>{s.icon}</p>
                  <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1rem", fontWeight:400, color:"var(--text)", marginBottom:6 }}>{s.name}</h3>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", lineHeight:1.5, marginBottom:12 }}>{s.desc}</p>
                  {s.variants.length > 1 && (
                    <div style={{ marginBottom:12 }}>
                      <select value={serviceVariants[s.id]} onChange={e=>setServiceVariants(sv=>({...sv,[s.id]:e.target.value}))} style={{ ...sel, width:"auto", fontSize:12, padding:"6px 10px" }}>
                        {s.variants.map(v=><option key={v.label}>{v.label}</option>)}
                      </select>
                    </div>
                  )}
                  <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"var(--gold)", marginBottom:14 }}>
                    {variant.price === 0 ? "Included" : `₫${variant.price.toLocaleString()}`}
                  </p>
                  <button onClick={()=>showToast("Request submitted. Team will confirm within 4 hours.")} style={{ padding:"8px 18px", background:"var(--text)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:"pointer", transition:"background 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background="var(--gold)"} onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
                    Request
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Tab 5: Contact Manager ── */}
        {tab === "manager" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>
            {/* Manager card */}
            <div style={{ background:"var(--bg-2)", border:"1px solid var(--border)", padding:"28px" }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:20 }}>Property Manager</p>
              <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:20 }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:"var(--bg-3)", border:"1.5px solid var(--border-gold)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, fontWeight:400, color:"var(--gold)" }}>PL</span>
                </div>
                <div>
                  <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", color:"var(--text)", marginBottom:2 }}>Pham Thi Lan</p>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}>Property Manager</p>
                </div>
              </div>
              <div style={{ borderTop:"1px solid var(--border)", paddingTop:16, display:"flex", flexDirection:"column", gap:10 }}>
                {[["📞","+84 24 3936 9197"],["📧","manager@hilink.vn"],["🕐","Mon–Fri 08:00–18:00"]].map(([icon,val])=>(
                  <div key={val} style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span>{icon}</span>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Message form */}
            <div>
              <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.2rem", fontWeight:400, color:"var(--text)", marginBottom:20 }}>Send a message</h2>
              {msgSent ? (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{ background:"rgba(45,106,79,0.06)", border:"1px solid rgba(45,106,79,0.2)", padding:"24px" }}>
                  <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1rem", color:"var(--text)", marginBottom:12 }}>✓ Message sent. You'll hear back within 2 business hours.</p>
                  <button onClick={()=>setMsgSent(false)} style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--gold)", background:"none", border:"none", cursor:"pointer", borderBottom:"1px solid var(--gold)", paddingBottom:1 }}>Send another →</button>
                </motion.div>
              ) : (
                <>
                  <div style={{ marginBottom:16 }}>
                    <label style={lbl}>Subject</label>
                    <input value={msgForm.subject} onChange={e=>setMsgForm(f=>({...f,subject:e.target.value}))} style={inp} placeholder="e.g. AC not working on Floor 12" />
                  </div>
                  <div style={{ marginBottom:20 }}>
                    <label style={lbl}>Message</label>
                    <textarea value={msgForm.message} onChange={e=>setMsgForm(f=>({...f,message:e.target.value}))} style={{ ...ta, minHeight:120 }} placeholder="Describe your question or issue..." />
                  </div>
                  <button onClick={()=>{ if(msgForm.subject&&msgForm.message) setMsgSent(true); }} style={{ padding:"10px 24px", background:"var(--text)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:500, cursor:"pointer", transition:"background 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background="var(--gold)"} onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
                    Send message →
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </PageWrap>
    </PortalLayout>
  );
}
