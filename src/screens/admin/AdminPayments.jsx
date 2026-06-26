import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../components/admin.jsx";
import { DonutChart } from "../../components/charts.jsx";
import { PageHead, TH, TD, Pill, Card, Search, SEL, tone } from "../../components/adminUI.jsx";
import { useBookings, fmtVND, refundBooking } from "../../data/booking.js";

const METHODS = ["Card", "QR Payment", "Bank Transfer", "Invoice"];
const FAILED = [
  { id: "FP-01", customer: "Sarah Chen", amount: 8500000, method: "Card", reason: "Card declined", date: "2026-06-15" },
  { id: "FP-02", customer: "Jack Reed", amount: 1200000, method: "QR Payment", reason: "Timed out", date: "2026-06-13" },
];

export default function AdminPayments() {
  const navigate = useNavigate();
  const bookings = useBookings();
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("All");
  const [verified, setVerified] = useState({});   // demo-local verification

  const active = bookings.filter((b) => b.status !== "cancelled");
  const txns = useMemo(() => bookings.flatMap((b) => b.payments.map((p, i) => ({
    ...p, key: b.id + "-" + i, ref: b.id, customer: b.customer.name,
    methodNorm: p.method.includes("QR") ? "QR Payment" : p.method.includes("Bank") ? "Bank Transfer" : p.method.includes("Refund") ? "Refund" : p.method.includes("Card") ? "Card" : "Invoice",
  }))).sort((a, b) => (a.date < b.date ? 1 : -1)), [bookings]);

  const rows = txns.filter((t) => {
    if (method !== "All" && t.methodNorm !== method) return false;
    if (q && !`${t.ref} ${t.customer} ${t.method}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const outstanding = active.reduce((a, b) => a + Math.max(0, b.pricing.total - b.payments.reduce((s, p) => s + p.amount, 0)), 0);
  const paidBookings = active.filter((b) => b.payments.reduce((s, p) => s + p.amount, 0) >= b.pricing.total).length;
  const methodMix = METHODS.map((m) => ({ label: m, value: txns.filter((t) => t.methodNorm === m && t.amount > 0).length })).filter((d) => d.value);

  const kpis = [
    ["Outstanding Payments", fmtVND(outstanding), "var(--warning)"],
    ["Paid Bookings", paidBookings, "var(--success)"],
    ["Refund Requests", FAILED.length, "var(--danger)"],
  ];

  return (
    <AdminLayout>
      <PageHead title="Payment Management" sub="Verify payments, manage refunds and failed transactions" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12, marginBottom: 18 }}>
        {kpis.map(([l, v, col]) => (
          <div key={l} style={{ background: "#FFF", border: "1px solid var(--border)", padding: "16px 18px" }}>
            <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</p>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: col }}>{v}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16, alignItems: "start" }}>
        <Card title="Transactions" right={null}>
          <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <Search value={q} onChange={setQ} placeholder="Search ref, customer, method…" />
            <select value={method} onChange={(e) => setMethod(e.target.value)} style={SEL}><option>All</option>{METHODS.map((m) => <option key={m}>{m}</option>)}<option>Refund</option></select>
          </div>
          <div style={{ overflowX: "auto", border: "1px solid var(--border)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>{["Date", "Ref", "Customer", "Method", "Amount", "Status", ""].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.key} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ ...TD, color: "var(--text-3)" }}>{t.date}</td>
                    <td style={{ ...TD, color: "var(--olive)", cursor: "pointer" }} onClick={() => navigate(`/admin/bookings/${t.ref}`)}>#{t.ref}</td>
                    <td style={TD}>{t.customer}</td>
                    <td style={TD}>{t.method}</td>
                    <td style={{ ...TD, fontWeight: 600, color: t.amount < 0 ? "var(--danger)" : "var(--text)" }}>{fmtVND(t.amount)}</td>
                    <td style={TD}><Pill label={t.amount < 0 ? "Refunded" : verified[t.key] ? "Verified" : t.status} {...(t.amount < 0 ? tone.red : verified[t.key] ? tone.green : tone.blue)} /></td>
                    <td style={TD}>
                      {t.amount > 0 && (verified[t.key]
                        ? <button onClick={() => refundBooking(t.ref, t.amount)} style={miniBtn("var(--danger)")}>Refund</button>
                        : <button onClick={() => setVerified((v) => ({ ...v, [t.key]: true }))} style={miniBtn("var(--olive)")}>Verify</button>)}
                    </td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan={7} style={{ padding: 30, textAlign: "center", fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No transactions.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        <div style={{ display: "grid", gap: 16 }}>
          <Card title="Payment methods">{methodMix.length ? <DonutChart data={methodMix} size={140} /> : <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No data.</p>}</Card>
          <Card title="Failed payments">
            {FAILED.map((f) => (
              <div key={f.id} style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{f.customer}</span>
                  <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "var(--danger)" }}>{fmtVND(f.amount)}</span>
                </div>
                <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)" }}>{f.method} · {f.reason} · {f.date}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
const miniBtn = (c) => ({ border: `1px solid ${c}`, background: "#FFF", color: c, padding: "4px 10px", cursor: "pointer", fontFamily: "Inter", fontSize: 12, fontWeight: 600 });
