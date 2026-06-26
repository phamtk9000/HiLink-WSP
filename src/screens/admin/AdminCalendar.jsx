import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout, BK_STATUS } from "../../components/admin.jsx";
import { Avatar } from "../../components/index.jsx";
import { getBuildings, getFloor, useBookings, createBooking, updateBooking, fmtVND, todayISO } from "../../data/booking.js";

const VI_DOW = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const dayIndex = (s, start) => Math.round((new Date(s) - start) / 86400000);
const rateOf = (r) => r.monthly ? Math.round(r.monthly / 22) : (r.hourly ? r.hourly * 8 : 350000);

export default function AdminCalendar() {
  const navigate = useNavigate();
  const bookings = useBookings();
  const buildings = getBuildings();
  const [view, setView] = useState("Month");
  const [buildingId, setBuildingId] = useState(buildings[0].id);
  const [cursor, setCursor] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); });
  const [drag, setDrag] = useState(null);          // booking id being dragged
  const [modal, setModal] = useState(null);        // { roomId, date } create reservation
  const [hover, setHover] = useState(null);         // { b, x, y } frosted info popup

  const building = buildings.find((b) => b.id === buildingId);

  // window of days for the chosen view
  const { start, days } = useMemo(() => {
    if (view === "Day") return { start: new Date(cursor), days: 1 };
    if (view === "Week") { const s = addDays(cursor, -((cursor.getDay() + 6) % 7)); return { start: s, days: 7 }; }
    const s = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    return { start: s, days: new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate() };
  }, [view, cursor]);
  const dayList = Array.from({ length: days }, (_, i) => addDays(start, i));
  const winStart = iso(start), winEnd = iso(addDays(start, days - 1));
  const DAY_W = view === "Month" ? 40 : view === "Week" ? 150 : 320;
  const LABEL_W = 150;
  const trackW = days * DAY_W;

  const rooms = building.floors.flatMap((f) => [...f.plan.rooms, ...(f.plan.seats || [])].map((r) => ({ ...r, floorId: f.id, floorLabel: f.label })));
  const bkFor = (roomId) => bookings.filter((b) => b.unitId === roomId && b.status !== "cancelled" && b.start <= winEnd && b.end >= winStart);
  const freeRooms = rooms.filter((r) => !bkFor(r.id).some((b) => b.start <= iso(cursor) && b.end >= iso(cursor))).length;

  const label = view === "Month"
    ? cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : view === "Week"
      ? `${iso(start)} → ${iso(addDays(start, 6))}`
      : cursor.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
  const shift = (n) => setCursor((c) => view === "Month" ? new Date(c.getFullYear(), c.getMonth() + n, 1) : addDays(c, n * days));

  const onDrop = (room) => {
    if (!drag) return;
    const b = bookings.find((x) => x.id === drag);
    setDrag(null);
    if (!b || b.unitId === room.id) return;
    updateBooking(b.id, { unitId: room.id, unitLabel: room.label, unitKind: room.kind, floorId: room.floorId, floorLabel: room.floorLabel }, `Moved to ${room.label} (drag & drop)`);
  };

  const createRes = (form) => {
    const room = rooms.find((r) => r.id === form.roomId);
    const end = iso(addDays(new Date(form.start), Math.max(1, +form.days) - 1));
    const subtotal = rateOf(room) * Math.max(1, +form.days);
    const vat = Math.round(subtotal * 0.1);
    const blocked = form.blocked;
    createBooking({
      unitId: room.id, unitType: "room", unitLabel: room.label, unitKind: room.kind,
      buildingId: building.id, buildingName: building.name, floorId: room.floorId, floorLabel: room.floorLabel,
      customer: blocked ? { name: "Blocked", email: "—", initials: "⛔" } : { name: form.name || "Walk-in", email: form.email || "—", initials: (form.name || "WI").split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase() },
      guests: 1, start: form.start, end, time: "09:00 – 18:00",
      pricing: { subtotal, promo: 0, addonsTotal: 0, taxable: subtotal, vat, total: subtotal + vat },
      promo: null, addons: [], deposit: { required: 0, paid: blocked ? 0 : subtotal + vat },
    });
    setModal(null);
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Calendar &amp; Scheduling</h1>
        <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>Drag a booking to another room to move it · click an empty cell to create one · {freeRooms} rooms free today</p>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", border: "1px solid var(--border)" }}>
          {["Day", "Week", "Month"].map((v) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "8px 16px", background: view === v ? "var(--olive)" : "#FFF", color: view === v ? "#FFF" : "var(--text-3)", border: "none", cursor: "pointer", fontFamily: "Inter", fontSize: 13, fontWeight: view === v ? 600 : 400 }}>{v}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {buildings.map((b) => <button key={b.id} onClick={() => setBuildingId(b.id)} style={tab(buildingId === b.id)}>{b.name}</button>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
          <button onClick={() => shift(-1)} style={navBtn}>‹</button>
          <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "var(--text)", minWidth: 150, textAlign: "center" }}>{label}</span>
          <button onClick={() => shift(1)} style={navBtn}>›</button>
        </div>
        <button onClick={() => setModal({ roomId: rooms[0].id, start: iso(cursor), days: 1, blocked: false })} style={{ padding: "8px 14px", background: "var(--olive)", color: "#FFF", border: "none", cursor: "pointer", fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}>＋ Create reservation</button>
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        {Object.entries(BK_STATUS).filter(([k]) => k !== "cancelled").map(([k, v]) => (
          <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}><span style={{ width: 12, height: 12, borderRadius: 3, background: v.barBg, border: `1.5px solid ${v.bar}` }} />{v.label}</span>
        ))}
      </div>

      <div style={{ border: "1px solid var(--border)", background: "#FFF", overflowX: "auto" }}>
        <div style={{ minWidth: LABEL_W + trackW }}>
          {/* header */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "#FFF", zIndex: 3 }}>
            <div style={{ width: LABEL_W, flexShrink: 0, position: "sticky", left: 0, background: "#FFF", borderRight: "1px solid var(--border)" }} />
            {dayList.map((d, i) => { const sun = d.getDay() === 0; return (
              <div key={i} style={{ width: DAY_W, flexShrink: 0, textAlign: "center", padding: "6px 0", background: sun ? "rgba(15,15,15,0.03)" : "transparent", borderRight: "1px solid rgba(15,15,15,0.05)" }}>
                <div style={{ fontFamily: "Inter", fontSize: 10, color: sun ? "var(--danger)" : "var(--text-3)" }}>{VI_DOW[d.getDay()]}</div>
                <div style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>{d.getDate()}</div>
              </div>
            ); })}
          </div>

          {/* room rows grouped by floor */}
          {building.floors.map((f) => (
            <div key={f.id}>
              <div style={{ display: "flex", background: "rgba(15,15,15,0.03)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: LABEL_W, flexShrink: 0, position: "sticky", left: 0, background: "#F2EFE9", padding: "7px 16px", fontFamily: "Inter", fontSize: 12, fontWeight: 700, color: "var(--text-2)" }}>{f.label}</div>
                <div style={{ flex: 1 }} />
              </div>
              {[...f.plan.rooms, ...(f.plan.seats || [])].map((room0) => {
                const room = { ...room0, floorId: f.id, floorLabel: f.label };
                const bks = bkFor(room.id);
                return (
                  <div key={room.id} style={{ display: "flex", borderBottom: "1px solid rgba(15,15,15,0.05)", minHeight: 46 }}
                    onDragOver={(e) => { e.preventDefault(); }} onDrop={() => onDrop(room)}>
                    <div style={{ width: LABEL_W, flexShrink: 0, position: "sticky", left: 0, background: "#FFF", borderRight: "1px solid var(--border)", padding: "0 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{room.label}</span>
                      <span style={{ fontFamily: "Inter", fontSize: 10, color: "var(--text-3)" }}>{room.kind}</span>
                    </div>
                    <div style={{ position: "relative", width: trackW, flexShrink: 0 }}>
                      {dayList.map((d, i) => (
                        <div key={i} onClick={() => setModal({ roomId: room.id, start: iso(d), days: 1, blocked: false })}
                          style={{ position: "absolute", left: i * DAY_W, top: 0, bottom: 0, width: DAY_W, borderRight: "1px solid rgba(15,15,15,0.05)", background: d.getDay() === 0 ? "rgba(15,15,15,0.02)" : "transparent", cursor: "cell" }} />
                      ))}
                      {bks.map((b) => {
                        const s = Math.max(0, dayIndex(b.start, start));
                        const e = Math.min(days - 1, dayIndex(b.end, start));
                        if (e < 0 || s > days - 1) return null;
                        const st = BK_STATUS[b.status] || BK_STATUS.pending;
                        const isBlock = b.customer.name === "Blocked";
                        return (
                          <div key={b.id} draggable onDragStart={() => setDrag(b.id)} onDragEnd={() => setDrag(null)}
                            onClick={(ev) => { ev.stopPropagation(); navigate(`/admin/bookings/${b.id}`); }}
                            onMouseEnter={(ev) => setHover({ b, x: ev.clientX, y: ev.clientY })}
                            onMouseMove={(ev) => setHover((h) => (h && h.b.id === b.id ? { b, x: ev.clientX, y: ev.clientY } : h))}
                            onMouseLeave={() => setHover(null)}
                            style={{ position: "absolute", top: 6, left: s * DAY_W + 3, width: (e - s + 1) * DAY_W - 6, height: 34, background: isBlock ? "rgba(15,15,15,0.08)" : st.barBg, border: `1.5px solid ${isBlock ? "var(--text-3)" : st.bar}`, borderRadius: 6, display: "flex", alignItems: "center", gap: 6, padding: "0 8px", cursor: "grab", overflow: "hidden", zIndex: 2, opacity: drag === b.id ? 0.4 : 1 }}>
                            {!isBlock && <Avatar initials={b.customer.initials} size={20} />}
                            <span style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isBlock ? "⛔ Blocked" : b.customer.name}{view !== "Month" ? ` · ${b.time}` : ""}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {hover && <HoverCard hover={hover} />}
      {modal && <CreateModal rooms={rooms} initial={modal} onClose={() => setModal(null)} onSave={createRes} />}
    </AdminLayout>
  );
}

function HoverCard({ hover }) {
  const { b, x, y } = hover;
  const isBlock = b.customer.name === "Blocked";
  const st = BK_STATUS[b.status] || BK_STATUS.pending;
  const paid = (b.payments || []).reduce((a, p) => a + p.amount, 0);
  const W = 268;
  const left = Math.min(x + 16, (typeof window !== "undefined" ? window.innerWidth : 1200) - W - 12);
  const top = Math.max(12, y - 12);
  const row = (k, v, c) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, fontFamily: "Inter", fontSize: 12, padding: "2px 0" }}>
      <span style={{ color: "var(--text-3)" }}>{k}</span><span style={{ color: c || "var(--text)", fontWeight: 500, textAlign: "right" }}>{v}</span>
    </div>
  );
  return (
    <div style={{ position: "fixed", left, top, width: W, zIndex: 250, pointerEvents: "none",
      background: "rgba(255,255,255,0.78)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 10px 34px rgba(0,0,0,0.18)", borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
        {!isBlock && <Avatar initials={b.customer.initials} size={30} gold />}
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isBlock ? "⛔ Blocked" : b.customer.name}</p>
          <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)" }}>{b.unitLabel} · {b.unitKind}</p>
        </div>
        <span style={{ marginLeft: "auto", fontFamily: "Inter", fontSize: 10, fontWeight: 700, color: st.bar, background: st.barBg, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>{st.label}</span>
      </div>
      <div style={{ borderTop: "1px solid rgba(15,15,15,0.10)", paddingTop: 8 }}>
        {row("Location", `${b.buildingName}`)}
        {row("Dates", `${b.start} → ${b.end}`)}
        {row("Time", b.time)}
        {!isBlock && row("Total", fmtVND(b.pricing.total))}
        {!isBlock && row("Paid", fmtVND(paid), paid >= b.pricing.total ? "var(--success)" : "var(--warning)")}
        {!isBlock && b.source && row("Source", b.source)}
      </div>
      <p style={{ fontFamily: "Inter", fontSize: 10, color: "var(--text-3)", marginTop: 8 }}>Click to open full booking →</p>
    </div>
  );
}

function CreateModal({ rooms, initial, onClose, onSave }) {
  const [f, setF] = useState({ name: "", email: "", roomId: initial.roomId, start: initial.start, days: 1, blocked: false });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const inp = { width: "100%", padding: "9px 12px", border: "1px solid var(--border)", fontFamily: "Inter", fontSize: 13, color: "var(--text)" };
  const lbl = { fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", display: "block", marginBottom: 5 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFF", border: "1px solid var(--border)", padding: 28, maxWidth: 420, width: "100%" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Create reservation</h2>
        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontSize: 13, color: "var(--text-2)" }}>
            <input type="checkbox" checked={f.blocked} onChange={(e) => set("blocked", e.target.checked)} /> Block this space (maintenance / hold)
          </label>
          {!f.blocked && <>
            <div><label style={lbl}>Customer name</label><input value={f.name} onChange={(e) => set("name", e.target.value)} style={inp} placeholder="Full name" /></div>
            <div><label style={lbl}>Email</label><input value={f.email} onChange={(e) => set("email", e.target.value)} style={inp} placeholder="email@company.com" /></div>
          </>}
          <div><label style={lbl}>Room</label><select value={f.roomId} onChange={(e) => set("roomId", e.target.value)} style={inp}>{rooms.map((r) => <option key={r.id} value={r.id}>{r.floorLabel} · {r.label} ({r.kind})</option>)}</select></div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><label style={lbl}>Start</label><input type="date" value={f.start} onChange={(e) => set("start", e.target.value)} style={inp} /></div>
            <div style={{ width: 110 }}><label style={lbl}>Days</label><input type="number" min={1} value={f.days} onChange={(e) => set("days", e.target.value)} style={inp} /></div>
          </div>
          <button onClick={() => onSave(f)} style={{ marginTop: 4, background: "var(--olive)", color: "#FFF", border: "none", padding: "11px", cursor: "pointer", fontFamily: "Inter", fontSize: 14, fontWeight: 600 }}>{f.blocked ? "Block space" : "Create reservation"}</button>
        </div>
      </div>
    </div>
  );
}

const tab = (on) => ({ padding: "8px 16px", border: `1px solid ${on ? "var(--olive)" : "var(--border)"}`, background: on ? "rgba(61,74,46,0.07)" : "#FFF", color: on ? "var(--olive)" : "var(--text-3)", fontFamily: "Inter", fontSize: 13, fontWeight: on ? 600 : 400, cursor: "pointer" });
const navBtn = { width: 32, height: 32, border: "1px solid var(--border)", background: "#FFF", cursor: "pointer", fontSize: 16, color: "var(--text)" };
