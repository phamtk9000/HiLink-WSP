import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PortalLayout, PageWrap, Btn } from "../components/index.jsx";
import Floorplan, { FloorLegend } from "../components/Floorplan.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getBuildings, getFloor, getUnit, fmtVND, todayISO,
  ADDONS, PROMOS, VAT_RATE, createBooking, recordPayment,
} from "../data/booking.js";

const DURATIONS = [
  { id: "day",   label: "Day pass",  days: 1,  deposit: 0 },
  { id: "week",  label: "1 week",    days: 5,  deposit: 0 },
  { id: "month", label: "Monthly",   days: 22, deposit: 3000000 },
];

const dayRate = (u) => u.daily || (u.hourly ? u.hourly * 8 : Math.round((u.monthly || 0) / 22));
const addDaysISO = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

const Stepper = ({ step }) => {
  const steps = ["Location", "Select space", "Review", "Payment"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
      {steps.map((s, i) => (
        <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 24, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontFamily: "Inter", fontWeight: 600,
            background: i <= step ? "var(--gold)" : "transparent", color: i <= step ? "#FFF" : "var(--text-3)", border: `1px solid ${i <= step ? "var(--gold)" : "var(--border)"}` }}>{i + 1}</span>
          <span style={{ fontFamily: "Inter", fontSize: 13, color: i === step ? "var(--text)" : "var(--text-3)", fontWeight: i === step ? 600 : 400 }}>{s}</span>
          {i < steps.length - 1 && <span style={{ width: 22, height: 1, background: "var(--border)" }} />}
        </span>
      ))}
    </div>
  );
};

const card = { background: "var(--bg-2)", border: "1px solid var(--border)", padding: "20px 22px" };
const h1 = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--text)", marginBottom: 4 };
const sub = { fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" };

export default function BookingFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const buildings = getBuildings();

  const [buildingId, setBuildingId] = useState(buildings[0].id);
  const [floorId, setFloorId] = useState(buildings[0].floors[0].id);
  const [date, setDate] = useState(todayISO());
  const [duration, setDuration] = useState("day");
  const [selected, setSelected] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoErr, setPromoErr] = useState("");
  const [addons, setAddons] = useState([]);
  const [cust, setCust] = useState({ name: user?.name || "", email: user?.email || "" });
  const [confirmed, setConfirmed] = useState(null);

  const building = buildings.find((b) => b.id === buildingId);
  const floor = getFloor(floorId);
  const dur = DURATIONS.find((d) => d.id === duration);

  const toggle = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  // ── pricing ──
  const price = useMemo(() => {
    const units = selected.map(getUnit).filter(Boolean);
    const subtotal = units.reduce((a, u) => a + dayRate(u) * dur.days, 0);
    let promoAmt = 0;
    if (appliedPromo) promoAmt = appliedPromo.type === "percent" ? Math.round(subtotal * appliedPromo.value / 100) : appliedPromo.value;
    promoAmt = Math.min(promoAmt, subtotal);
    const addonsTotal = addons.reduce((a, id) => a + (ADDONS.find((x) => x.id === id)?.price || 0), 0);
    const taxable = subtotal - promoAmt + addonsTotal;
    const vat = Math.round(taxable * VAT_RATE);
    const total = taxable + vat;
    return { units, subtotal, promo: promoAmt, addonsTotal, taxable, vat, total };
  }, [selected, dur, appliedPromo, addons]);

  const applyPromo = () => {
    const p = PROMOS.find((x) => x.code.toLowerCase() === promoCode.trim().toLowerCase());
    if (p) { setAppliedPromo(p); setPromoErr(""); } else { setAppliedPromo(null); setPromoErr("Invalid code"); }
  };

  const pay = () => {
    const end = addDaysISO(date, dur.days - 1);
    const initials = (cust.name || "GU").split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase();
    const created = price.units.map((u) => {
      const subtotal = dayRate(u) * dur.days;
      const promoAmt = appliedPromo ? (appliedPromo.type === "percent" ? Math.round(subtotal * appliedPromo.value / 100) : Math.min(appliedPromo.value, subtotal)) : 0;
      const addonsTotal = addons.reduce((a, id) => a + (ADDONS.find((x) => x.id === id)?.price || 0), 0);
      const taxable = subtotal - promoAmt + addonsTotal;
      const vat = Math.round(taxable * VAT_RATE);
      const total = taxable + vat;
      return createBooking({
        unitId: u.id, unitType: u.type, unitLabel: u.label, unitKind: u.kind,
        buildingId: u.buildingId, buildingName: u.buildingName, floorId: u.floorId, floorLabel: u.floorLabel,
        customer: { name: cust.name || "Guest User", email: cust.email, initials },
        guests: 1, start: date, end, time: dur.id === "day" ? "09:00 – 18:00" : "Full term",
        pricing: { subtotal, promo: promoAmt, addonsTotal, taxable, vat, total },
        promo: appliedPromo, addons: addons.map((id) => ADDONS.find((x) => x.id === id)).filter(Boolean),
        deposit: { required: dur.deposit, paid: 0 },
      });
    });
    created.forEach((b) => recordPayment(b.id, { id: "tx" + Date.now(), date: todayISO(), amount: b.pricing.total, method: "VietQR transfer", status: "Success", note: "Full payment" }));
    setConfirmed({ ids: created.map((b) => b.id), total: price.total });
    setStep(4);
  };

  // ── confirmation ──
  if (step === 4 && confirmed) return (
    <PortalLayout><PageWrap>
      <div style={{ maxWidth: 520, margin: "40px auto", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(45,106,79,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--success)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h1 style={h1}>Booking confirmed</h1>
        <p style={{ ...sub, marginBottom: 24 }}>{confirmed.ids.length} space{confirmed.ids.length > 1 ? "s" : ""} booked · {fmtVND(confirmed.total)} paid</p>
        <div style={{ ...card, textAlign: "left", marginBottom: 24 }}>
          {confirmed.ids.map((id) => <p key={id} style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-2)", marginBottom: 6 }}>Ref <span style={{ color: "var(--gold)" }}>#{id}</span></p>)}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn onClick={() => navigate("/portal/bookings")}>View my bookings</Btn>
          <Btn variant="ghost" onClick={() => { setStep(0); setSelected([]); setConfirmed(null); setAppliedPromo(null); setAddons([]); }}>Book another</Btn>
        </div>
      </div>
    </PageWrap></PortalLayout>
  );

  return (
    <PortalLayout><PageWrap>
      <div style={{ marginBottom: 24 }}>
        <h1 style={h1}>Book a space</h1>
        <p style={sub}>Choose a location, pick from the live floor map, and pay securely.</p>
      </div>
      <Stepper step={step} />

      {/* STEP 0 — location */}
      {step === 0 && (
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <p style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Location</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
              {buildings.map((b) => (
                <button key={b.id} onClick={() => { setBuildingId(b.id); setFloorId(b.floors[0].id); }} style={{ textAlign: "left", ...card, cursor: "pointer", borderColor: buildingId === b.id ? "var(--gold)" : "var(--border)", background: buildingId === b.id ? "rgba(168,143,92,0.06)" : "var(--bg-2)" }}>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{b.name}</p>
                  <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>{b.district}</p>
                  <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{b.address}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Floor</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {building.floors.map((f) => (
                <button key={f.id} onClick={() => setFloorId(f.id)} style={{ padding: "10px 22px", border: `1px solid ${floorId === f.id ? "var(--gold)" : "var(--border)"}`, background: floorId === f.id ? "rgba(168,143,92,0.08)" : "transparent", color: floorId === f.id ? "var(--gold)" : "var(--text-3)", fontFamily: "Inter", fontSize: 13, fontWeight: floorId === f.id ? 600 : 400, cursor: "pointer" }}>{f.label}</button>
              ))}
            </div>
          </div>
          <div><Btn onClick={() => setStep(1)}>Continue →</Btn></div>
        </div>
      )}

      {/* STEP 1 — floorplan */}
      {step === 1 && (
        <div>
          <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {building.floors.map((f) => (
                <button key={f.id} onClick={() => setFloorId(f.id)} style={{ padding: "8px 18px", border: `1px solid ${floorId === f.id ? "var(--gold)" : "var(--border)"}`, background: floorId === f.id ? "rgba(168,143,92,0.08)" : "#FFF", color: floorId === f.id ? "var(--gold)" : "var(--text-3)", fontFamily: "Inter", fontSize: 13, fontWeight: floorId === f.id ? 600 : 400, cursor: "pointer" }}>{f.label}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>Date</span>
              <input type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}><FloorLegend /></div>
          <Floorplan floor={floor} date={date} selected={selected} onToggle={toggle} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-2)" }}>
              {selected.length ? <>{selected.length} selected · {selected.map((id) => getUnit(id)?.label).join(", ")}</> : "Tap an available desk or room to select it."}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" onClick={() => setStep(0)}>← Back</Btn>
              <Btn disabled={!selected.length} onClick={() => setStep(2)}>Review →</Btn>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — review */}
      {step === 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }} className="reco-shell">
          <div style={{ display: "grid", gap: 16 }}>
            <div style={card}>
              <p style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Duration</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {DURATIONS.map((d) => (
                  <button key={d.id} onClick={() => setDuration(d.id)} style={{ padding: "9px 18px", border: `1px solid ${duration === d.id ? "var(--gold)" : "var(--border)"}`, background: duration === d.id ? "rgba(168,143,92,0.08)" : "transparent", color: duration === d.id ? "var(--gold)" : "var(--text-3)", fontFamily: "Inter", fontSize: 13, fontWeight: duration === d.id ? 600 : 400, cursor: "pointer" }}>{d.label}</button>
                ))}
              </div>
            </div>

            <div style={card}>
              <p style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Add-on services</p>
              <div style={{ display: "grid", gap: 8 }}>
                {ADDONS.map((a) => {
                  const on = addons.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => setAddons((p) => on ? p.filter((x) => x !== a.id) : [...p, a.id])} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: `1px solid ${on ? "var(--gold)" : "var(--border)"}`, background: on ? "rgba(168,143,92,0.06)" : "transparent", cursor: "pointer" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "Inter", fontSize: 13, color: "var(--text)" }}>
                        <span style={{ width: 16, height: 16, border: `1px solid ${on ? "var(--gold)" : "var(--border)"}`, background: on ? "var(--gold)" : "transparent", color: "#FFF", fontSize: 11, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</span>
                        {a.label}
                      </span>
                      <span style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>{fmtVND(a.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={card}>
              <p style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Promo code</p>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="e.g. HILINK10" style={{ flex: 1, padding: "9px 12px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }} />
                <Btn variant="ghost" onClick={applyPromo}>Apply</Btn>
              </div>
              {appliedPromo && <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--success)", marginTop: 8 }}>✓ {appliedPromo.label} applied</p>}
              {promoErr && <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--danger)", marginTop: 8 }}>{promoErr}</p>}
              <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginTop: 8 }}>Try HILINK10 or WELCOME</p>
            </div>

            <div style={card}>
              <p style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Your details</p>
              <div style={{ display: "grid", gap: 10 }}>
                <input value={cust.name} onChange={(e) => setCust({ ...cust, name: e.target.value })} placeholder="Full name" style={{ padding: "9px 12px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }} />
                <input value={cust.email} onChange={(e) => setCust({ ...cust, email: e.target.value })} placeholder="Email" style={{ padding: "9px 12px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }} />
              </div>
            </div>
          </div>

          {/* summary */}
          <div style={{ ...card, position: "sticky", top: 20 }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{building.name}</p>
            <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", marginBottom: 14 }}>{floor.label} · {date} · {dur.label}</p>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginBottom: 12 }}>
              {price.units.map((u) => (
                <div key={u.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-2)" }}>{u.label} · {u.kind}</span>
                  <span style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text)" }}>{fmtVND(dayRate(u) * dur.days)}</span>
                </div>
              ))}
            </div>
            {[["Subtotal", price.subtotal], ["Promo", -price.promo], ["Add-ons", price.addonsTotal], [`VAT ${VAT_RATE * 100}%`, price.vat]].filter(([, v]) => v !== 0 || true).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>{k}</span>
                <span style={{ fontFamily: "Inter", fontSize: 13, color: v < 0 ? "var(--success)" : "var(--text)" }}>{v < 0 ? "−" : ""}{fmtVND(Math.abs(v))}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4, marginBottom: 4 }}>
              <span style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Total</span>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "var(--gold)" }}>{fmtVND(price.total)}</span>
            </div>
            {dur.deposit > 0 && <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginBottom: 14 }}>Includes refundable deposit {fmtVND(dur.deposit)}</p>}
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              <Btn full disabled={!cust.name || !cust.email} onClick={() => setStep(3)}>Proceed to payment →</Btn>
              <Btn full variant="ghost" onClick={() => setStep(1)}>← Edit selection</Btn>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 — VietQR payment */}
      {step === 3 && (
        <div style={{ maxWidth: 460, margin: "0 auto" }}>
          <div style={{ ...card, textAlign: "center" }}>
            <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Amount due</p>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, color: "var(--gold)", marginBottom: 18 }}>{fmtVND(price.total)}</p>
            {/* decorative QR */}
            <div style={{ width: 180, height: 180, margin: "0 auto 18px", background: "#FFF", border: "1px solid var(--border)", padding: 12 }}>
              <svg viewBox="0 0 21 21" width="100%" height="100%" shapeRendering="crispEdges">
                {Array.from({ length: 21 }).map((_, y) => Array.from({ length: 21 }).map((__, x) => {
                  const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
                  const ring = corner && (x % 6 === 0 || y % 6 === 0 || (x > 1 && x < 5 && y > 1 && y < 5) || (x > 15 && x < 19 && y > 1 && y < 5) || (x > 1 && x < 5 && y > 15 && y < 19));
                  const fill = corner ? ring : ((x * 7 + y * 13 + x * y) % 3 === 0);
                  return fill ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0F0F0F" /> : null;
                }))}
              </svg>
            </div>
            <div style={{ textAlign: "left", borderTop: "1px solid var(--border)", paddingTop: 14, marginBottom: 18 }}>
              {[["Bank", "Techcombank"], ["Account", "1903 7216 9520 16"], ["Holder", "HiLink Vietnam JSC"], ["Reference", "HILINK-" + (cust.name || "GUEST").split(" ")[0].toUpperCase()]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>{k}</span>
                  <span style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", marginBottom: 18 }}>Scan with any VietQR-enabled banking app, or transfer using the details above.</p>
            <div style={{ display: "grid", gap: 8 }}>
              <Btn full onClick={pay}>I've completed payment</Btn>
              <Btn full variant="ghost" onClick={() => setStep(2)}>← Back</Btn>
            </div>
          </div>
        </div>
      )}
    </PageWrap></PortalLayout>
  );
}
