import { useMemo, useState } from "react";
import { AdminLayout } from "../../components/admin.jsx";
import { Avatar } from "../../components/index.jsx";
import { PageHead, Search, SEL, TH, TD, Pill, Modal, Field, INP, BtnPrimary, tone } from "../../components/adminUI.jsx";
import { useBookings, fmtVND } from "../../data/booking.js";
import { MEMBERS, PLANS, RANKS, TICKETS } from "../../data/adminData.js";

const statusTone = { Active: tone.green, Paused: tone.amber, Pending: tone.blue };
const rankTone = { Platinum: tone.olive, Gold: tone.amber, Silver: tone.grey, Bronze: tone.grey };

export default function AdminCustomers() {
  const bookings = useBookings();
  const [members, setMembers] = useState(() => MEMBERS.map((m) => ({ ...m })));
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState("All");
  const [rank, setRank] = useState("All");
  const [status, setStatus] = useState("All");
  const [openId, setOpenId] = useState(null);
  const [tab, setTab] = useState("Bookings");

  const rows = useMemo(() => members.filter((m) => {
    if (plan !== "All" && m.plan !== plan) return false;
    if (rank !== "All" && m.rank !== rank) return false;
    if (status !== "All" && m.status !== status) return false;
    if (q && !`${m.name} ${m.company} ${m.email} ${m.id}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [members, q, plan, rank, status]);

  const open = members.find((m) => m.id === openId);
  const history = useMemo(() => {
    if (!open) return null;
    const bks = bookings.filter((b) => b.customer.name === open.name);
    const invoices = bks.map((b) => {
      const paid = b.payments.reduce((a, p) => a + p.amount, 0);
      return { id: "INV-" + b.id, total: b.pricing.total, paid, due: Math.max(0, b.pricing.total - paid), status: b.status };
    });
    const payments = bks.flatMap((b) => b.payments.map((p) => ({ ...p, ref: b.id })));
    const tickets = TICKETS.filter((t) => t.member === open.name);
    return { bks, invoices, payments, tickets };
  }, [open, bookings]);

  const saveNotes = (id, patch) => setMembers((ms) => ms.map((m) => m.id === id ? { ...m, ...patch } : m));

  return (
    <AdminLayout>
      <PageHead title="Customer Management" sub={`${rows.length} members`} />
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <Search value={q} onChange={setQ} placeholder="Search name, company, email…" />
        <select value={plan} onChange={(e) => setPlan(e.target.value)} style={SEL}><option>All</option>{PLANS.map((p) => <option key={p}>{p}</option>)}</select>
        <select value={rank} onChange={(e) => setRank(e.target.value)} style={SEL}><option>All</option>{RANKS.map((r) => <option key={r}>{r}</option>)}</select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={SEL}>{["All", "Active", "Paused", "Pending"].map((s) => <option key={s}>{s}</option>)}</select>
      </div>

      <div style={{ border: "1px solid var(--border)", background: "#FFF" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>{["Member", "Company", "Plan", "Rank", "Since", "Status", ""].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 ? "rgba(15,15,15,0.01)" : "transparent" }}>
                  <td style={TD}><span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Avatar initials={m.initials} size={30} gold /><span><span style={{ display: "block", fontWeight: 600 }}>{m.name}</span><span style={{ fontSize: 11, color: "var(--text-3)" }}>{m.email}</span></span></span></td>
                  <td style={{ ...TD, color: "var(--text-3)" }}>{m.company}</td>
                  <td style={TD}>{m.plan}</td>
                  <td style={TD}><Pill label={m.rank} {...(rankTone[m.rank] || tone.grey)} /></td>
                  <td style={{ ...TD, color: "var(--text-3)" }}>{m.since}</td>
                  <td style={TD}><Pill label={m.status} {...(statusTone[m.status] || tone.grey)} /></td>
                  <td style={TD}><button onClick={() => { setOpenId(m.id); setTab("Bookings"); }} style={{ border: "1px solid var(--border)", background: "#FFF", padding: "5px 12px", cursor: "pointer", fontFamily: "Inter", fontSize: 12, color: "var(--text-2)" }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && history && (
        <Modal title={open.name} onClose={() => setOpenId(null)} width={680}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
            <Avatar initials={open.initials} size={48} gold />
            <div>
              <p style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{open.company}</p>
              <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>{open.email} · {open.phone}</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}><Pill label={open.plan} {...tone.olive} /><Pill label={open.rank} {...(rankTone[open.rank] || tone.grey)} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 16 }}>
            {[["Bookings", history.bks.length], ["Invoices", history.invoices.length], ["Due", fmtVND(history.invoices.reduce((a, i) => a + i.due, 0))], ["Tickets", history.tickets.length]].map(([l, v]) => (
              <div key={l} style={{ border: "1px solid var(--border)", padding: "10px 12px" }}><p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)" }}>{l}</p><p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{v}</p></div>
            ))}
          </div>

          {/* tabs */}
          <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border)", marginBottom: 14 }}>
            {["Bookings", "Invoices", "Payments", "Tickets"].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter", fontSize: 13, fontWeight: tab === t ? 600 : 400, color: tab === t ? "var(--text)" : "var(--text-3)", borderBottom: `2px solid ${tab === t ? "var(--olive)" : "transparent"}`, marginBottom: -1 }}>{t}</button>
            ))}
          </div>
          <div style={{ minHeight: 90, marginBottom: 16 }}>
            {tab === "Bookings" && <List rows={history.bks.map((b) => [`${b.unitLabel} · ${b.buildingName}`, `${b.start} → ${b.end}`, fmtVND(b.pricing.total)])} empty="No bookings." />}
            {tab === "Invoices" && <List rows={history.invoices.map((i) => [i.id, i.status, fmtVND(i.total)])} empty="No invoices." />}
            {tab === "Payments" && <List rows={history.payments.length ? history.payments.map((p) => [p.date, p.method, fmtVND(p.amount)]) : history.invoices.map((i) => [i.id, i.due > 0 ? "Due" : "Paid", i.due > 0 ? fmtVND(i.due) : fmtVND(i.paid)])} empty="No payments." />}
            {tab === "Tickets" && <List rows={history.tickets.map((t) => [t.title, t.status, t.category])} empty="No tickets." />}
          </div>

          {/* editable notes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Internal note (editable)"><textarea defaultValue={open.notes} rows={3} onBlur={(e) => saveNotes(open.id, { notes: e.target.value })} style={{ ...INP, resize: "vertical" }} /></Field>
            <Field label="Preference note (editable)"><textarea defaultValue={open.prefNote} rows={3} onBlur={(e) => saveNotes(open.id, { prefNote: e.target.value })} style={{ ...INP, resize: "vertical" }} /></Field>
          </div>
          <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginTop: 8 }}>Notes save when you click away from the field.</p>
        </Modal>
      )}
    </AdminLayout>
  );
}

function List({ rows, empty }) {
  if (!rows.length) return <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)", padding: "8px 0" }}>{empty}</p>;
  return (
    <div style={{ border: "1px solid var(--border)" }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 12px", borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none", fontFamily: "Inter", fontSize: 13 }}>
          <span style={{ color: "var(--text)", fontWeight: 500 }}>{r[0]}</span>
          <span style={{ color: "var(--text-3)", flex: 1, textAlign: "center" }}>{r[1]}</span>
          <span style={{ color: "var(--text)", fontWeight: 600 }}>{r[2]}</span>
        </div>
      ))}
    </div>
  );
}
