import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout, BK_STATUS } from "../../components/admin.jsx";
import { Avatar } from "../../components/index.jsx";
import { useBookings, fmtVND, getBuildings, updateBooking, cancelBooking, refundBooking } from "../../data/booking.js";

const paymentStateOf = (b) => {
  const paid = b.payments.reduce((a, p) => a + p.amount, 0);
  if (paid <= 0) return { label: "Unpaid", color: "var(--danger)", bg: "rgba(192,57,43,0.10)" };
  if (paid < b.pricing.total) return { label: "Partial", color: "#2563EB", bg: "rgba(37,99,235,0.10)" };
  return { label: "Paid", color: "var(--success)", bg: "rgba(45,106,79,0.10)" };
};
const Status = ({ s }) => { const v = BK_STATUS[s] || BK_STATUS.pending; return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: v.bg, color: v.color, fontFamily: "Inter", fontSize: 11, fontWeight: 600, padding: "3px 9px" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: v.color }} />{v.label}</span>; };
const Pill = ({ p }) => <span style={{ background: p.bg, color: p.color, fontFamily: "Inter", fontSize: 11, fontWeight: 600, padding: "3px 9px" }}>{p.label}</span>;

const addDaysISO = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

export default function AdminBookings() {
  const navigate = useNavigate();
  const bookings = useBookings();
  const buildings = getBuildings();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("All");
  const [status, setStatus] = useState("All");
  const [payFilter, setPayFilter] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [menu, setMenu] = useState(null);     // booking id whose action menu is open
  const [modal, setModal] = useState(null);    // { type, b }

  const rows = useMemo(() => bookings.filter((b) => {
    if (loc !== "All" && b.buildingName !== loc) return false;
    if (status !== "All" && (BK_STATUS[b.status]?.label || "") !== status) return false;
    if (payFilter !== "All" && paymentStateOf(b).label !== payFilter) return false;
    if (from && b.end < from) return false;
    if (to && b.start > to) return false;
    if (q && !(`${b.id} ${b.customer.name} ${b.unitLabel} ${b.buildingName}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [bookings, q, loc, status, payFilter, from, to]);

  const doAction = (type, b) => {
    setMenu(null);
    if (type === "Confirm") return updateBooking(b.id, { status: "confirmed" }, "Marked confirmed (admin)");
    if (type === "Cancel") return cancelBooking(b.id);
    if (type === "Refund") return refundBooking(b.id, b.pricing.total);
    setModal({ type, b });   // Modify / Extend open a form
  };
  const applyModal = (patch, log) => { updateBooking(modal.b.id, patch, log); setModal(null); };

  const th = { padding: "11px 14px", textAlign: "left", fontFamily: "Inter", fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" };
  const td = { padding: "12px 14px", fontFamily: "Inter", fontSize: 13, color: "var(--text)", whiteSpace: "nowrap" };
  const sel = { padding: "8px 10px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13, color: "var(--text)" };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Booking Management</h1>
        <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>{rows.length} of {bookings.length} bookings</p>
      </div>

      {/* filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customer, space, ref…" style={{ ...sel, minWidth: 220 }} />
        <select value={loc} onChange={(e) => setLoc(e.target.value)} style={sel}><option>All</option>{buildings.map((b) => <option key={b.id}>{b.name}</option>)}</select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={sel}>{["All", "Confirmed", "Pending", "Partial", "Cancelled"].map((s) => <option key={s}>{s}</option>)}</select>
        <select value={payFilter} onChange={(e) => setPayFilter(e.target.value)} style={sel}>{["All", "Paid", "Partial", "Unpaid"].map((s) => <option key={s}>{s}</option>)}</select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={sel} />
        <span style={{ color: "var(--text-3)" }}>–</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={sel} />
        {(q || loc !== "All" || status !== "All" || payFilter !== "All" || from || to) && <button onClick={() => { setQ(""); setLoc("All"); setStatus("All"); setPayFilter("All"); setFrom(""); setTo(""); }} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontFamily: "Inter", fontSize: 13 }}>Clear</button>}
      </div>

      <div style={{ border: "1px solid var(--border)", background: "#FFF" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Booking ID", "Customer", "Location", "Space", "Date", "Payment", "Status", ""].map((h) => <th key={h} style={th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {rows.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 ? "rgba(15,15,15,0.01)" : "transparent" }}>
                  <td style={{ ...td, color: "var(--olive)", cursor: "pointer" }} onClick={() => navigate(`/admin/bookings/${b.id}`)}>#{b.id}</td>
                  <td style={td}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Avatar initials={b.customer.initials} size={24} /><span>{b.customer.name}</span></span></td>
                  <td style={{ ...td, color: "var(--text-3)" }}>{b.buildingName}</td>
                  <td style={td}>{b.unitLabel}<span style={{ color: "var(--text-3)" }}> · {b.floorLabel}</span></td>
                  <td style={{ ...td, color: "var(--text-3)" }}>{b.start} → {b.end}</td>
                  <td style={td}><Pill p={paymentStateOf(b)} /></td>
                  <td style={td}><Status s={b.status} /></td>
                  <td style={{ ...td, position: "relative" }}>
                    <button onClick={() => setMenu(menu === b.id ? null : b.id)} style={{ border: "1px solid var(--border)", background: "#FFF", padding: "4px 10px", cursor: "pointer", fontSize: 14, color: "var(--text-2)" }}>⋯</button>
                    {menu === b.id && (
                      <div style={{ position: "absolute", right: 14, top: "100%", zIndex: 20, background: "#FFF", border: "1px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 150 }}>
                        {["View", "Confirm", "Modify", "Extend", "Cancel", "Refund"].map((a) => (
                          <button key={a} onClick={() => a === "View" ? navigate(`/admin/bookings/${b.id}`) : doAction(a, b)} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", background: "none", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", fontFamily: "Inter", fontSize: 13, color: a === "Cancel" || a === "Refund" ? "var(--danger)" : "var(--text)" }}>{a}</button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No bookings match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modify / Extend modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFF", border: "1px solid var(--border)", padding: 28, maxWidth: 400, width: "100%" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>{modal.type} · #{modal.b.id}</h2>
            {modal.type === "Extend" ? (
              <ExtendForm b={modal.b} onApply={applyModal} />
            ) : (
              <ModifyForm b={modal.b} onApply={applyModal} />
            )}
            <button onClick={() => setModal(null)} style={{ marginTop: 10, width: "100%", background: "none", border: "1px solid var(--border)", padding: "10px", cursor: "pointer", fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>Cancel</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function ModifyForm({ b, onApply }) {
  const [start, setStart] = useState(b.start);
  const [end, setEnd] = useState(b.end);
  const [time, setTime] = useState(b.time);
  const inp = { width: "100%", padding: "9px 12px", border: "1px solid var(--border)", fontFamily: "Inter", fontSize: 13, color: "var(--text)" };
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div><label style={lblS}>Start</label><input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={inp} /></div>
      <div><label style={lblS}>End</label><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={inp} /></div>
      <div><label style={lblS}>Time</label><input value={time} onChange={(e) => setTime(e.target.value)} style={inp} /></div>
      <button onClick={() => onApply({ start, end, time }, `Modified: ${start} → ${end}, ${time}`)} style={btnS}>Save changes</button>
    </div>
  );
}
function ExtendForm({ b, onApply }) {
  const [days, setDays] = useState(7);
  const newEnd = addDaysISO(b.end, days);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>Current end: <strong style={{ color: "var(--text)" }}>{b.end}</strong></p>
      <div><label style={lblS}>Extend by (days)</label><input type="number" min={1} value={days} onChange={(e) => setDays(Math.max(1, +e.target.value))} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }} /></div>
      <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-2)" }}>New end: <strong style={{ color: "var(--olive)" }}>{newEnd}</strong></p>
      <button onClick={() => onApply({ end: newEnd }, `Extended ${days} days → ${newEnd}`)} style={btnS}>Confirm extension</button>
    </div>
  );
}
const lblS = { fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", display: "block", marginBottom: 5 };
const btnS = { marginTop: 4, background: "var(--olive)", color: "#FFF", border: "none", padding: "11px", cursor: "pointer", fontFamily: "Inter", fontSize: 14, fontWeight: 600 };
