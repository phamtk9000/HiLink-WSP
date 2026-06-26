import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../components/admin.jsx";
import { Avatar } from "../../components/index.jsx";
import { useBookings, fmtVND, getBuildings } from "../../data/booking.js";

const payState = (b) => {
  const paid = b.payments.reduce((a, p) => a + p.amount, 0);
  const outstanding = Math.max(0, b.pricing.total - paid);
  let label = "Paid", color = "var(--success)", bg = "rgba(45,106,79,0.10)";
  if (paid <= 0) { label = "Unpaid"; color = "var(--danger)"; bg = "rgba(192,57,43,0.10)"; }
  else if (paid < b.pricing.total) { label = "Partial"; color = "#2563EB"; bg = "rgba(37,99,235,0.10)"; }
  const overdue = outstanding > 0 && b.status === "pending";
  return { paid, outstanding, label, color, bg, overdue };
};

const SORTS = {
  "Outstanding ↓": (a, b) => b._.outstanding - a._.outstanding,
  "Total ↓":       (a, b) => b.pricing.total - a.pricing.total,
  "Customer A–Z":  (a, b) => a.customer.name.localeCompare(b.customer.name),
  "Newest":        (a, b) => (a.start < b.start ? 1 : -1),
};

export default function AdminBilling() {
  const navigate = useNavigate();
  const bookings = useBookings();
  const buildings = getBuildings();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [loc, setLoc] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("Outstanding ↓");

  const all = useMemo(() => bookings.filter((b) => b.status !== "cancelled").map((b) => ({ ...b, _: payState(b) })), [bookings]);

  const rows = useMemo(() => {
    let r = all.filter((b) => {
      if (status === "Overdue" ? !b._.overdue : status !== "All" && b._.label !== status) return false;
      if (loc !== "All" && b.buildingName !== loc) return false;
      if (from && b.end < from) return false;
      if (to && b.start > to) return false;
      if (q) { const hay = `${b.id} ${b.customer.name} ${b.customer.email} ${b.unitLabel} ${b.buildingName}`.toLowerCase(); if (!hay.includes(q.toLowerCase())) return false; }
      return true;
    });
    return r.sort(SORTS[sort]);
  }, [all, q, status, loc, from, to, sort]);

  const sum = (sel) => rows.reduce((a, r) => a + sel(r), 0);
  const kpis = [
    ["Invoiced (filtered)", sum((r) => r.pricing.total), "var(--text-2)"],
    ["Collected", sum((r) => r._.paid), "var(--success)"],
    ["Outstanding", sum((r) => r._.outstanding), "var(--warning)"],
    ["Overdue", rows.filter((r) => r._.overdue).reduce((a, r) => a + r._.outstanding, 0), "var(--danger)"],
  ];

  const th = { padding: "11px 16px", textAlign: "left", fontFamily: "Inter", fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" };
  const td = { padding: "12px 16px", fontFamily: "Inter", fontSize: 13, color: "var(--text)", whiteSpace: "nowrap" };
  const sel = { padding: "9px 11px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13, color: "var(--text)" };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Payments &amp; Invoices</h1>
        <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>Search and reconcile receivables across all bookings</p>
      </div>

      {/* search bar — primary, full width */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 15 }}>⌕</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by invoice ref, customer, email, space or location…"
          style={{ width: "100%", padding: "12px 14px 12px 38px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 14, color: "var(--text)" }} />
      </div>

      {/* filter row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={sel}>{["All", "Paid", "Partial", "Unpaid", "Overdue"].map((s) => <option key={s}>{s}</option>)}</select>
        <select value={loc} onChange={(e) => setLoc(e.target.value)} style={sel}><option>All</option>{buildings.map((b) => <option key={b.id}>{b.name}</option>)}</select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={sel} />
        <span style={{ color: "var(--text-3)" }}>–</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={sel} />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={sel}>{Object.keys(SORTS).map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        {(q || status !== "All" || loc !== "All" || from || to) && <button onClick={() => { setQ(""); setStatus("All"); setLoc("All"); setFrom(""); setTo(""); }} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontFamily: "Inter", fontSize: 13 }}>Clear</button>}
      </div>

      {/* KPI summary reflects current filter */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12, marginBottom: 18 }}>
        {kpis.map(([l, v, col]) => (
          <div key={l} style={{ background: "#FFF", border: "1px solid var(--border)", padding: "14px 16px" }}>
            <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</p>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19, fontWeight: 600, color: col }}>{fmtVND(v)}</p>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", marginBottom: 8 }}>{rows.length} result{rows.length !== 1 ? "s" : ""}</p>
      <div style={{ border: "1px solid var(--border)", background: "#FFF" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Invoice ref", "Customer", "Space", "Location", "Total", "Paid", "Outstanding", "Payment"].map((h) => <th key={h} style={th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} onClick={() => navigate(`/admin/bookings/${r.id}`)} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", background: i % 2 ? "rgba(15,15,15,0.01)" : "transparent" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(61,74,46,0.04)"} onMouseLeave={(e) => e.currentTarget.style.background = i % 2 ? "rgba(15,15,15,0.01)" : "transparent"}>
                  <td style={{ ...td, color: "var(--olive)" }}>INV-{r.id}</td>
                  <td style={td}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Avatar initials={r.customer.initials} size={24} /><span>{r.customer.name}</span></span></td>
                  <td style={{ ...td, color: "var(--text-3)" }}>{r.unitLabel}</td>
                  <td style={{ ...td, color: "var(--text-3)" }}>{r.buildingName}</td>
                  <td style={{ ...td, fontWeight: 500 }}>{fmtVND(r.pricing.total)}</td>
                  <td style={{ ...td, color: "var(--success)" }}>{fmtVND(r._.paid)}</td>
                  <td style={{ ...td, fontWeight: 600, color: r._.outstanding ? "var(--danger)" : "var(--success)" }}>{fmtVND(r._.outstanding)}</td>
                  <td style={td}><span style={{ background: r._.bg, color: r._.color, fontFamily: "Inter", fontSize: 11, fontWeight: 600, padding: "3px 9px" }}>{r._.overdue ? "Overdue" : r._.label}</span></td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No matching invoices.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
