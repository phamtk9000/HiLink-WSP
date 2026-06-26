import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrap, Btn, Field, PortalLayout } from "../components/index.jsx";
import { SPACES } from "../data/mockData.js";
import { motion } from "framer-motion";

/* ── Shared form styles ── */
const lbl = { fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", display:"block", marginBottom:6 };
const sel = { width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter',sans-serif", fontSize:14, outline:"none", borderRadius:0 };
const inp = { ...sel };
const ta  = { ...sel, minHeight:100, resize:"vertical" };

const PageHead = ({ title, sub }) => (
  <div style={{ marginBottom:32 }}>
    <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Portal</p>
    <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:400, color:"var(--text)", marginBottom:8 }}>{title}</h1>
    {sub && <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-3)" }}>{sub}</p>}
  </div>
);

const SuccessCard = ({ message, onReset }) => (
  <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ background:"rgba(45,106,79,0.06)", border:"1px solid rgba(45,106,79,0.2)", padding:"32px", maxWidth:480 }}>
    <div style={{ fontSize:32, marginBottom:16 }}>✓</div>
    <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, color:"var(--text)", marginBottom:12 }}>{message}</p>
    <button onClick={onReset} style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--gold)", background:"none", border:"none", cursor:"pointer", borderBottom:"1px solid var(--gold)", paddingBottom:1 }}>Submit another →</button>
  </motion.div>
);

/* ── BOOK VIEWING ── */
export const BookViewing = () => {
  const [form, setForm] = useState({ date:"", time:"09:00", space:"", name:"", phone:"", email:"", notes:"" });
  const [done, setDone] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]:v }));

  if (done) return (
    <PortalLayout><PageWrap>
      <PageHead title="Book a Viewing" />
      <SuccessCard message="Your viewing is booked. Our team will confirm within 2 hours." onReset={() => setDone(false)} />
    </PageWrap></PortalLayout>
  );

  return (
    <PortalLayout><PageWrap>
      <PageHead title="Book a Viewing" sub="Schedule a physical visit to one of our spaces." />
      <div style={{ maxWidth:520 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div>
            <label style={lbl}>Preferred date</label>
            <input type="date" value={form.date} onChange={e=>set("date")(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Preferred time</label>
            <select value={form.time} onChange={e=>set("time")(e.target.value)} style={sel}>
              {["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Space preference</label>
          <select value={form.space} onChange={e=>set("space")(e.target.value)} style={sel}>
            <option value="">Any space</option>
            {SPACES.map(s=><option key={s.id} value={s.name}>{s.name} — Floor {s.floor}</option>)}
          </select>
        </div>
        <Field label="Full name" value={form.name} onChange={set("name")} placeholder="Your name" />
        <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="+84 xxx xxx xxx" />
        <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" />
        <div style={{ marginBottom:24 }}>
          <label style={lbl}>Notes (optional)</label>
          <textarea value={form.notes} onChange={e=>set("notes")(e.target.value)} style={ta} placeholder="Anything else we should know?" />
        </div>
        <Btn onClick={() => setDone(true)}>Book viewing →</Btn>
      </div>
    </PageWrap></PortalLayout>
  );
};

/* ── REQUEST CALLBACK ── */
export const RequestCallback = () => {
  const [form, setForm] = useState({ name:"", phone:"", callTime:"Morning 9–12", subject:"General enquiry" });
  const [done, setDone] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]:v }));

  if (done) return (
    <PortalLayout><PageWrap>
      <PageHead title="Request Callback" />
      <SuccessCard message="We'll call you back within 1 business day." onReset={() => setDone(false)} />
    </PageWrap></PortalLayout>
  );

  return (
    <PortalLayout><PageWrap>
      <PageHead title="Request Callback" sub="Our sales team will call you at your preferred time." />
      <div style={{ maxWidth:520 }}>
        <Field label="Full name" value={form.name} onChange={set("name")} placeholder="Your name" />
        <Field label="Phone number" value={form.phone} onChange={set("phone")} placeholder="+84 xxx xxx xxx" />
        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Preferred call time</label>
          <select value={form.callTime} onChange={e=>set("callTime")(e.target.value)} style={sel}>
            {["Morning 9–12","Afternoon 12–5","Evening 5–7"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={lbl}>Subject</label>
          <select value={form.subject} onChange={e=>set("subject")(e.target.value)} style={sel}>
            {["General enquiry","Pricing","Availability","Contract"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <Btn onClick={() => setDone(true)}>Request callback →</Btn>
      </div>
    </PageWrap></PortalLayout>
  );
};

/* ── SUBMIT INQUIRY (3-step) ── */
const AMENITY_NAMES = ["WiFi","Coffee","Phone Booth","Printing","Parking","Reception","A/V Setup","Natural Light"];

export const SubmitInquiry = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ company:"", employees:"", budget:"<$500/month", location:"Any", moveIn:"", lease:"3 months", amenities:[], notes:"" });
  const [done, setDone] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]:v }));
  const toggleAmenity = a => setForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x=>x!==a) : [...f.amenities,a] }));

  const stepDot = n => (
    <div style={{ width:28, height:28, borderRadius:"50%", background: step>=n ? "var(--gold)" : "var(--bg-3)", border:`1px solid ${step>=n?"var(--gold)":"var(--border)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, color: step>=n ? "#FFFFFF":"var(--text-3)" }}>{n}</div>
  );

  if (done) return (
    <PortalLayout><PageWrap>
      <PageHead title="Submit Inquiry" />
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ maxWidth:520 }}>
        <div style={{ background:"rgba(45,106,79,0.06)", border:"1px solid rgba(45,106,79,0.2)", padding:"28px", marginBottom:24 }}>
          <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, color:"var(--text)", marginBottom:20 }}>✓ Inquiry submitted. A sales agent will contact you within 24 hours.</p>
          <div style={{ display:"grid", gap:8 }}>
            {[["Company",form.company],["Employees",form.employees],["Budget",form.budget],["Location",form.location],["Move-in",form.moveIn],["Lease",form.lease],["Amenities",form.amenities.join(", ")||"None"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", gap:16 }}>
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", minWidth:80 }}>{k}</span>
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text)", fontWeight:500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => { setDone(false); setStep(1); setForm({ company:"", employees:"", budget:"<$500/month", location:"Any", moveIn:"", lease:"3 months", amenities:[], notes:"" }); }} style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--gold)", background:"none", border:"none", cursor:"pointer", borderBottom:"1px solid var(--gold)", paddingBottom:1 }}>Submit another →</button>
      </motion.div>
    </PageWrap></PortalLayout>
  );

  return (
    <PortalLayout><PageWrap>
      <PageHead title="Submit Inquiry" sub="Tell us about your workspace needs." />
      {/* Step indicator */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:32 }}>
        {[1,2,3].map((n,i) => (<>
          {stepDot(n)}
          {i<2 && <div key={"line"+n} style={{ flex:1, height:1, maxWidth:48, background: step>n ? "var(--gold)":"var(--border)" }} />}
        </>))}
        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)", marginLeft:8 }}>Step {step} of 3</span>
      </div>

      <div style={{ maxWidth:520 }}>
        {step === 1 && (
          <>
            <Field label="Company name" value={form.company} onChange={set("company")} placeholder="Your company" />
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Number of employees</label>
              <input type="number" min={1} max={500} value={form.employees} onChange={e=>set("employees")(e.target.value)} style={inp} placeholder="e.g. 10" />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={lbl}>Monthly budget</label>
              <select value={form.budget} onChange={e=>set("budget")(e.target.value)} style={sel}>
                {["<$500/month","$500–$1000/month","$1000–$2000/month","$2000+/month"].map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <Btn onClick={() => setStep(2)}>Next →</Btn>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Preferred location</label>
              <select value={form.location} onChange={e=>set("location")(e.target.value)} style={sel}>
                {["Floor 12","Floor 14","Floor 15","Any"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Move-in date</label>
              <input type="date" value={form.moveIn} onChange={e=>set("moveIn")(e.target.value)} style={inp} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={lbl}>Lease duration</label>
              <select value={form.lease} onChange={e=>set("lease")(e.target.value)} style={sel}>
                {["1 month","3 months","6 months","12 months","24 months+"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
              <Btn onClick={() => setStep(3)}>Next →</Btn>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>Required amenities</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8 }}>
                {AMENITY_NAMES.map(a => (
                  <label key={a} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"8px 12px", border:`1px solid ${form.amenities.includes(a)?"var(--border-gold)":"var(--border)"}`, background:form.amenities.includes(a)?"rgba(168,143,92,0.06)":"transparent" }}>
                    <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} style={{ accentColor:"var(--gold)" }} />
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)" }}>{a}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={lbl}>Additional notes (optional)</label>
              <textarea value={form.notes} onChange={e=>set("notes")(e.target.value)} style={ta} placeholder="Any specific requirements..." />
            </div>
            <div style={{ display:"flex", gap:12 }}>
              <Btn variant="ghost" onClick={() => setStep(2)}>← Back</Btn>
              <Btn onClick={() => setDone(true)}>Submit inquiry →</Btn>
            </div>
          </>
        )}
      </div>
    </PageWrap></PortalLayout>
  );
};

/* ── RESERVE WORKSPACE ── */
export const ReserveWorkspace = () => {
  const [form, setForm] = useState({ space:"", hold:"24 hours", startDate:"" });
  const [done, setDone] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]:v }));

  const expiry = (() => {
    if (!form.startDate) return null;
    const hrs = parseInt(form.hold);
    const d = new Date(form.startDate);
    d.setHours(d.getHours() + hrs);
    return d.toLocaleString("en-GB", { dateStyle:"medium", timeStyle:"short" });
  })();

  if (done) return (
    <PortalLayout><PageWrap>
      <PageHead title="Reserve a Space" />
      <SuccessCard message={`Space held. You have ${form.hold} to confirm. We've sent details to your email.`} onReset={() => setDone(false)} />
    </PageWrap></PortalLayout>
  );

  return (
    <PortalLayout><PageWrap>
      <PageHead title="Reserve a Space" sub="Temporarily hold a space while you decide." />
      <div style={{ maxWidth:520 }}>
        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Select space</label>
          <select value={form.space} onChange={e=>set("space")(e.target.value)} style={sel}>
            <option value="">Choose a space...</option>
            {SPACES.filter(s=>s.availability!=="occupied").map(s=><option key={s.id} value={s.name}>{s.name} — Floor {s.floor}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Hold duration</label>
          <select value={form.hold} onChange={e=>set("hold")(e.target.value)} style={sel}>
            {["24 hours","48 hours","72 hours"].map(h=><option key={h}>{h}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={lbl}>Start date</label>
          <input type="date" value={form.startDate} onChange={e=>set("startDate")(e.target.value)} style={inp} />
        </div>
        {expiry && (
          <div style={{ background:"rgba(168,143,92,0.06)", border:"1px solid var(--border-gold)", padding:"14px 18px", marginBottom:24 }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-3)", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.12em" }}>Hold expires</p>
            <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, color:"var(--gold)" }}>{expiry}</p>
          </div>
        )}
        <Btn onClick={() => setDone(true)} disabled={!form.space || !form.startDate}>Reserve now →</Btn>
      </div>
    </PageWrap></PortalLayout>
  );
};

/* ── REQUEST CUSTOM OFFER ── */
export const RequestCustomOffer = () => {
  const [form, setForm] = useState({ company:"", teamSize:"", budget:"", requirements:"", contact:"Email" });
  const [done, setDone] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]:v }));

  if (done) return (
    <PortalLayout><PageWrap>
      <PageHead title="Custom Offer" />
      <SuccessCard message="Custom offer request received. Expect a tailored proposal within 48 hours." onReset={() => setDone(false)} />
    </PageWrap></PortalLayout>
  );

  return (
    <PortalLayout><PageWrap>
      <PageHead title="Custom Offer" sub="Get a pricing proposal tailored to your exact needs." />
      <div style={{ maxWidth:520 }}>
        <Field label="Company name" value={form.company} onChange={set("company")} placeholder="Your company" />
        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Team size</label>
          <input type="number" min={1} value={form.teamSize} onChange={e=>set("teamSize")(e.target.value)} style={inp} placeholder="Number of people" />
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Target monthly budget (VND)</label>
          <input type="number" min={0} value={form.budget} onChange={e=>set("budget")(e.target.value)} style={inp} placeholder="e.g. 20000000" />
          {form.budget && <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--gold)", marginTop:4 }}>≈ ₫{Number(form.budget).toLocaleString()}</p>}
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Specific requirements</label>
          <textarea value={form.requirements} onChange={e=>set("requirements")(e.target.value)} style={ta} placeholder="Describe your ideal workspace setup..." />
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={lbl}>Preferred contact method</label>
          <div style={{ display:"flex", gap:12 }}>
            {["Email","Phone","WhatsApp"].map(m => (
              <label key={m} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"8px 14px", border:`1px solid ${form.contact===m?"var(--border-gold)":"var(--border)"}`, background:form.contact===m?"rgba(168,143,92,0.06)":"transparent" }}>
                <input type="radio" name="contact" value={m} checked={form.contact===m} onChange={()=>set("contact")(m)} style={{ accentColor:"var(--gold)" }} />
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)" }}>{m}</span>
              </label>
            ))}
          </div>
        </div>
        <Btn onClick={() => setDone(true)}>Request offer →</Btn>
      </div>
    </PageWrap></PortalLayout>
  );
};
