import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout, BK_STATUS } from "../../components/admin.jsx";
import { Avatar } from "../../components/index.jsx";
import { getBooking, recordPayment, fmtVND, todayISO, useBookings } from "../../data/booking.js";

// payment-schedule status palette (separate from booking BK_STATUS)
const PP = {
  Paid:    { label: "Paid",          color: "var(--success)", bg: "rgba(45,106,79,0.10)" },
  Pending: { label: "Unpaid",        color: "var(--warning)", bg: "rgba(181,134,42,0.12)" },
  Overdue: { label: "In arrears",    color: "var(--danger)",  bg: "rgba(192,57,43,0.10)" },
  Partial: { label: "Partially paid", color: "#2563EB",        bg: "rgba(37,99,235,0.10)" },
};

const AMENITIES_BY_KIND = {
  "Private Office": ["High-speed WiFi", "Meeting room credits", "Reception", "Printing", "Tea & coffee"],
  "Meeting Room":   ["85\" 4K display", "Video conferencing", "WiFi", "Whiteboard", "Reception"],
  "Focus Cabin":    ["WiFi", "Acoustic privacy", "Power & USB-C", "Adjustable lighting"],
  "Hot Desk":       ["WiFi", "Hot drinks", "Shared printing", "Community events"],
  "Dedicated Desk": ["WiFi", "Lockable storage", "Dual monitor", "Hot drinks", "Printing"],
};

const TABS = ["Payment schedule", "Invoices", "Transactions", "Add-on services", "Amenities", "Deposit", "Change log"];

const SummaryCard = ({ icon, label, value, accent }) => (
  <div style={{ background: "#FFF", border: "1px solid var(--border)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, minWidth: 200, flex: 1 }}>
    <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", background: accent.bg, color: accent.color, fontSize: 18, flexShrink: 0 }}>{icon}</div>
    <div>
      <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginBottom: 3, letterSpacing: "0.04em" }}>{label}</p>
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{value}</p>
    </div>
  </div>
);

const Panel = ({ title, children }) => (
  <div style={{ background: "#FFF", border: "1px solid var(--border)", padding: "20px 22px" }}>
    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>{title}</p>
    {children}
  </div>
);

const Row = ({ k, v, strong, accent }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
    <span style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>{k}</span>
    <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: strong ? 600 : 500, color: accent || "var(--text)" }}>{v}</span>
  </div>
);

export default function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  useBookings();                         // subscribe so the view updates after recordPayment
  const b = getBooking(id);
  const [tab, setTab] = useState(TABS[0]);

  if (!b) return (
    <AdminLayout>
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "var(--text)", marginBottom: 12 }}>Booking not found</p>
        <button onClick={() => navigate("/admin/bookings")} style={{ color: "var(--olive)", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter", fontWeight: 600 }}>← Back to all bookings</button>
      </div>
    </AdminLayout>
  );

  const paid = b.payments.reduce((a, p) => a + p.amount, 0);
  const outstanding = Math.max(0, b.pricing.total - paid);
  const st = BK_STATUS[b.status] || BK_STATUS.pending;
  const amenities = AMENITIES_BY_KIND[b.unitKind] || AMENITIES_BY_KIND["Hot Desk"];

  const takePayment = () => {
    if (outstanding <= 0) return;
    recordPayment(b.id, { id: "tx" + Date.now(), date: todayISO(), amount: outstanding, method: "Bank transfer", status: "Success", note: "Balance settled (admin)" });
  };

  const th = { padding: "10px 14px", textAlign: "left", fontFamily: "Inter", fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", borderBottom: "1px solid var(--border)" };
  const td = { padding: "12px 14px", fontFamily: "Inter", fontSize: 13, color: "var(--text)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };

  return (
    <AdminLayout>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <button onClick={() => navigate("/admin/bookings")} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontFamily: "Inter", fontSize: 12, marginBottom: 8, padding: 0 }}>← All bookings</button>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(20px,3vw,26px)", fontWeight: 700, color: "var(--text)" }}>
            {b.unitLabel} <span style={{ color: "var(--text-3)", fontSize: 16, fontWeight: 400 }}>· #{b.id}</span>
          </h1>
          <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>{b.buildingName} · {b.floorLabel} · {b.unitKind}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: st.bg, color: st.color, fontFamily: "Inter", fontSize: 12, fontWeight: 600, padding: "5px 12px" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: st.color }} />{st.label}</span>
          {outstanding > 0 && <button onClick={takePayment} style={{ background: "var(--olive)", color: "#FFF", border: "none", padding: "9px 18px", fontFamily: "Inter", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Record payment · {fmtVND(outstanding)}</button>}
        </div>
      </div>

      {/* summary cards */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
        <SummaryCard icon="▤" label="Total invoiced" value={fmtVND(b.pricing.total)} accent={{ bg: "rgba(181,134,42,0.12)", color: "var(--warning)" }} />
        <SummaryCard icon="✓" label="Paid"           value={fmtVND(paid)}            accent={{ bg: "rgba(45,106,79,0.12)", color: "var(--success)" }} />
        <SummaryCard icon="◷" label="Deposit"        value={`${fmtVND(b.deposit.paid)} / ${fmtVND(b.deposit.required)}`} accent={{ bg: "rgba(61,74,46,0.10)", color: "var(--olive)" }} />
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border)", marginBottom: 18, overflowX: "auto" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter", fontSize: 13, fontWeight: tab === t ? 600 : 400, color: tab === t ? "var(--text)" : "var(--text-3)", borderBottom: `2px solid ${tab === t ? "var(--olive)" : "transparent"}`, marginBottom: -1, whiteSpace: "nowrap" }}>{t}</button>
        ))}
      </div>

      {/* tab content */}
      <div style={{ background: "#FFF", border: "1px solid var(--border)", marginBottom: 22, overflowX: "auto" }}>
        {tab === "Payment schedule" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Period", "Due date", "Status", "Amount", "Discount"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {b.schedule.map((p) => { const v = PP[p.status] || PP.Pending; return (
                <tr key={p.id}>
                  <td style={td}>{p.start} – {p.end}</td>
                  <td style={{ ...td, color: "var(--text-3)" }}>{p.due}</td>
                  <td style={td}><span style={{ background: v.bg, color: v.color, fontFamily: "Inter", fontSize: 11, fontWeight: 600, padding: "3px 9px" }}>{v.label}</span></td>
                  <td style={{ ...td, fontWeight: 500 }}>{fmtVND(p.amount)}</td>
                  <td style={{ ...td, color: p.discount ? "var(--success)" : "var(--text-3)" }}>{p.discount ? "−" + fmtVND(p.discount) : fmtVND(0)}</td>
                </tr>
              ); })}
            </tbody>
          </table>
        )}

        {tab === "Invoices" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Invoice", "Issued", "Amount", "Status"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {b.schedule.map((p, i) => { const v = PP[p.status] || PP.Pending; return (
                <tr key={p.id}>
                  <td style={{ ...td, color: "var(--olive)" }}>INV-{b.id}-{i + 1}</td>
                  <td style={{ ...td, color: "var(--text-3)" }}>{p.due}</td>
                  <td style={{ ...td, fontWeight: 500 }}>{fmtVND(p.amount - (p.discount || 0))}</td>
                  <td style={td}><span style={{ background: v.bg, color: v.color, fontFamily: "Inter", fontSize: 11, fontWeight: 600, padding: "3px 9px" }}>{v.label}</span></td>
                </tr>
              ); })}
            </tbody>
          </table>
        )}

        {tab === "Transactions" && (
          b.payments.length ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Date", "Method", "Note", "Amount", "Status"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>
                {b.payments.map((p) => (
                  <tr key={p.id}>
                    <td style={td}>{p.date}</td>
                    <td style={td}>{p.method}</td>
                    <td style={{ ...td, color: "var(--text-3)" }}>{p.note}</td>
                    <td style={{ ...td, fontWeight: 500 }}>{fmtVND(p.amount)}</td>
                    <td style={td}><span style={{ background: "rgba(45,106,79,0.10)", color: "var(--success)", fontFamily: "Inter", fontSize: 11, fontWeight: 600, padding: "3px 9px" }}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ padding: 28, fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No transactions recorded yet.</p>
        )}

        {tab === "Add-on services" && (
          b.addons?.length ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Service", "Price"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>
                {b.addons.map((a) => (
                  <tr key={a.id}><td style={td}>{a.label}</td><td style={{ ...td, fontWeight: 500 }}>{fmtVND(a.price)}</td></tr>
                ))}
                <tr><td style={{ ...td, fontWeight: 600 }}>Total add-ons</td><td style={{ ...td, fontWeight: 600 }}>{fmtVND(b.pricing.addonsTotal)}</td></tr>
              </tbody>
            </table>
          ) : <p style={{ padding: 28, fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No add-on services on this booking.</p>
        )}

        {tab === "Amenities" && (
          <div style={{ padding: "18px 20px", display: "flex", flexWrap: "wrap", gap: 10 }}>
            {amenities.map((a) => (
              <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: 7, border: "1px solid var(--border)", padding: "7px 12px", fontFamily: "Inter", fontSize: 13, color: "var(--text-2)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--olive)" }} />{a}
              </span>
            ))}
          </div>
        )}

        {tab === "Deposit" && (
          <div style={{ padding: "22px 24px", maxWidth: 480 }}>
            <Row k="Deposit required" v={fmtVND(b.deposit.required)} />
            <Row k="Deposit paid" v={fmtVND(b.deposit.paid)} accent="var(--success)" />
            <div style={{ height: 8, background: "var(--bg-3)", borderRadius: 4, overflow: "hidden", margin: "12px 0 8px" }}>
              <div style={{ width: `${b.deposit.required ? Math.min(100, (b.deposit.paid / b.deposit.required) * 100) : 100}%`, height: "100%", background: "var(--olive)" }} />
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>
              {b.deposit.paid >= b.deposit.required ? "Deposit fully settled." : `Outstanding deposit: ${fmtVND(b.deposit.required - b.deposit.paid)}`}
            </p>
          </div>
        )}

        {tab === "Change log" && (
          <div style={{ padding: "18px 22px" }}>
            {b.changeLog.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 14, marginBottom: 14, borderBottom: i < b.changeLog.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--olive)", marginTop: 5, flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text)" }}>{c.text}</p>
                  <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{c.ts}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* bottom: breakdown · customer + promo · general info */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        <Panel title="Payment">
          <Row k="Subtotal" v={fmtVND(b.pricing.subtotal)} />
          {b.pricing.promo > 0 && <Row k="Promotion" v={"−" + fmtVND(b.pricing.promo)} accent="var(--success)" />}
          <Row k="Add-ons" v={fmtVND(b.pricing.addonsTotal)} />
          <Row k="VAT (10%)" v={fmtVND(b.pricing.vat)} />
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
            <Row k="Total" v={fmtVND(b.pricing.total)} strong accent="var(--olive)" />
            <Row k="Deposit paid" v={`${fmtVND(b.deposit.paid)} / ${fmtVND(b.deposit.required)}`} accent={b.deposit.paid >= b.deposit.required ? "var(--success)" : "var(--danger)"} />
            <Row k="Outstanding" v={fmtVND(outstanding)} strong accent={outstanding ? "var(--danger)" : "var(--success)"} />
          </div>
        </Panel>

        <div style={{ display: "grid", gap: 16 }}>
          <Panel title="Customer">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Avatar initials={b.customer.initials} size={40} gold />
              <div>
                <p style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{b.customer.name}</p>
                <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>{b.customer.email}</p>
              </div>
            </div>
            <Row k="Guests" v={`${b.guests} ${b.guests > 1 ? "people" : "person"}`} />
          </Panel>
          <Panel title="Promotions">
            {b.promo ? <Row k={b.promo.code} v={b.promo.label} accent="var(--success)" /> : <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No promotion applied.</p>}
          </Panel>
        </div>

        <Panel title="General info">
          <Row k="Contract" v={<span style={{ color: "var(--olive)" }}>#{b.id}</span>} />
          <Row k="Building" v={b.buildingName} />
          <Row k="Service" v={b.unitKind} />
          <Row k="Unit" v={b.unitLabel} />
          <Row k="Dates" v={`${b.start} → ${b.end}`} />
          <Row k="Time" v={b.time} />
          {b.note && <div style={{ marginTop: 4 }}><p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>Note</p><p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-2)" }}>{b.note}</p></div>}
        </Panel>
      </div>
    </AdminLayout>
  );
}
