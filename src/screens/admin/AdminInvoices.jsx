import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../components/admin.jsx";
import { PageHead, TH, TD, Pill, Search, SEL, tone } from "../../components/adminUI.jsx";
import { useBookings, fmtVND, todayISO } from "../../data/booking.js";
import { MEMBERS } from "../../data/adminData.js";

const STATUS_TONE = { Draft: tone.grey, Issued: tone.blue, Paid: tone.green, Overdue: tone.red };
const PLAN_FEE = { "Private Office": 38000000, "Dedicated Desk": 7500000, "Hot Desk": 3200000, "Virtual Office": 1500000 };

export default function AdminInvoices() {
  const navigate = useNavigate();
  const bookings = useBookings();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [toast, setToast] = useState("");

  const today = todayISO();
  const invoices = useMemo(() => {
    const fromBookings = bookings.filter((b) => b.status !== "cancelled").map((b) => {
      const paid = b.payments.reduce((a, p) => a + p.amount, 0);
      let st = "Issued";
      if (paid >= b.pricing.total) st = "Paid";
      else if (b.status === "pending" && b.start < today) st = "Overdue";
      return { id: "INV-" + b.id, type: "Booking", ref: b.id, customer: b.customer.name, issued: b.start, vat: b.pricing.vat, total: b.pricing.total, status: st };
    });
    const fromMembers = MEMBERS.filter((m) => m.status === "Active").map((m, i) => {
      const fee = PLAN_FEE[m.plan] || 3200000; const vat = Math.round(fee * 0.1);
      return { id: "MINV-" + m.id, type: "Membership", ref: m.id, customer: m.name, issued: "2026-06-01", vat, total: fee + vat, status: i % 3 === 0 ? "Issued" : "Paid" };
    });
    return [...fromBookings, ...fromMembers];
  }, [bookings, today]);

  const rows = invoices.filter((inv) => {
    if (status !== "All" && inv.status !== status) return false;
    if (type !== "All" && inv.type !== type) return false;
    if (q && !`${inv.id} ${inv.customer} ${inv.ref}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const act = (label, inv) => { setToast(`${label} — ${inv.id}`); setTimeout(() => setToast(""), 2200); };

  return (
    <AdminLayout>
      <PageHead title="Invoice Management" sub="Auto-generated booking & membership invoices · VAT 10%" />

      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search value={q} onChange={setQ} placeholder="Search invoice no., customer or reference…" />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={SEL}>{["All", "Draft", "Issued", "Paid", "Overdue"].map((s) => <option key={s}>{s}</option>)}</select>
        <select value={type} onChange={(e) => setType(e.target.value)} style={SEL}>{["All", "Booking", "Membership"].map((s) => <option key={s}>{s}</option>)}</select>
        <span style={{ marginLeft: "auto", fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", alignSelf: "center" }}>{rows.length} invoices</span>
      </div>

      <div style={{ border: "1px solid var(--border)", background: "#FFF" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>{["Invoice", "Type", "Customer", "Issued", "VAT", "Total", "Status", "Actions"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((inv, i) => (
                <tr key={inv.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 ? "rgba(15,15,15,0.01)" : "transparent" }}>
                  <td style={{ ...TD, color: "var(--olive)", cursor: inv.type === "Booking" ? "pointer" : "default" }} onClick={() => inv.type === "Booking" && navigate(`/admin/bookings/${inv.ref}`)}>{inv.id}</td>
                  <td style={{ ...TD, color: "var(--text-3)" }}>{inv.type}</td>
                  <td style={TD}>{inv.customer}</td>
                  <td style={{ ...TD, color: "var(--text-3)" }}>{inv.issued}</td>
                  <td style={{ ...TD, color: "var(--text-3)" }}>{fmtVND(inv.vat)}</td>
                  <td style={{ ...TD, fontWeight: 600 }}>{fmtVND(inv.total)}</td>
                  <td style={TD}><Pill label={inv.status} {...(STATUS_TONE[inv.status] || tone.grey)} /></td>
                  <td style={TD}>
                    <span style={{ display: "inline-flex", gap: 6 }}>
                      {["PDF", "Email", "Credit note"].map((a) => <button key={a} onClick={() => act(a, inv)} style={{ border: "1px solid var(--border)", background: "#FFF", padding: "4px 9px", cursor: "pointer", fontFamily: "Inter", fontSize: 11, color: "var(--text-2)" }}>{a}</button>)}
                    </span>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={8} style={{ padding: 36, textAlign: "center", fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No invoices match.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--text)", color: "#FFF", padding: "10px 20px", fontFamily: "Inter", fontSize: 13, zIndex: 300 }}>{toast} (demo)</div>}
    </AdminLayout>
  );
}
