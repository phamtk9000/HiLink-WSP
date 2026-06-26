import { useMemo, useState } from "react";
import { AdminLayout } from "../../components/admin.jsx";
import { PageHead, TH, TD, Pill, Modal, Field, INP, BtnPrimary, Search, tone } from "../../components/adminUI.jsx";
import { TICKETS, TICKET_CATEGORIES, TICKET_STATES, STAFF } from "../../data/adminData.js";

const ST_TONE = { New: tone.blue, Assigned: tone.amber, "In Progress": tone.olive, Resolved: tone.green, Closed: tone.grey };
const PRIO_TONE = { High: tone.red, Medium: tone.amber, Low: tone.grey };
const OPEN_STATES = ["New", "Assigned", "In Progress"];
const niceDay = (d) => new Date(d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

export default function AdminTickets() {
  const [tickets, setTickets] = useState(() => TICKETS.map((t) => ({ ...t })));
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState("Open");   // default hides resolved/closed
  const [open, setOpen] = useState(null);
  const [creating, setCreating] = useState(false);

  // resolved/closed are only shown when the admin actively queries or filters
  const querying = q.trim() !== "" || status !== "Open" || cat !== "All";
  const rows = useMemo(() => tickets.filter((t) => {
    if (!querying && !OPEN_STATES.includes(t.status)) return false;
    if (status === "Open" ? !OPEN_STATES.includes(t.status) : status !== "All" && t.status !== status) return false;
    if (cat !== "All" && t.category !== cat) return false;
    if (q && !`${t.id} ${t.title} ${t.member} ${t.space}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [tickets, q, cat, status, querying]);

  // group by created day, newest first
  const groups = useMemo(() => {
    const byDay = {};
    rows.forEach((t) => { (byDay[t.created] = byDay[t.created] || []).push(t); });
    return Object.keys(byDay).sort((a, b) => (a < b ? 1 : -1)).map((day) => ({ day, items: byDay[day] }));
  }, [rows]);

  const update = (id, patch) => setTickets((ts) => ts.map((t) => t.id === id ? { ...t, ...patch } : t));
  const openCount = tickets.filter((t) => OPEN_STATES.includes(t.status)).length;

  return (
    <AdminLayout>
      <PageHead title="Tickets" sub={`${openCount} open issues · resolved & closed are hidden unless you search or filter`}
        right={<BtnPrimary onClick={() => setCreating(true)}>＋ New ticket</BtnPrimary>} />

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <Search value={q} onChange={setQ} placeholder="Search all tickets (incl. resolved/closed)…" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ padding: "9px 11px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13 }}><option>All</option>{TICKET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: "9px 11px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13 }}>{["Open", "All", ...TICKET_STATES].map((s) => <option key={s}>{s}</option>)}</select>
        {querying && <button onClick={() => { setQ(""); setCat("All"); setStatus("Open"); }} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontFamily: "Inter", fontSize: 13 }}>Reset to open</button>}
      </div>

      {groups.length ? groups.map(({ day, items }) => (
        <div key={day} style={{ marginBottom: 18 }}>
          <p style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 700, color: "var(--text-2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{niceDay(day)} <span style={{ color: "var(--text-3)", fontWeight: 400 }}>· {items.length}</span></p>
          <div style={{ border: "1px solid var(--border)", background: "#FFF" }}>
            {items.map((t, i) => (
              <div key={t.id} onClick={() => setOpen(t)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
                <Pill label={t.priority} {...(PRIO_TONE[t.priority] || tone.grey)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t.title}</p>
                  <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)" }}>{t.id} · {t.category} · {t.member} · {t.space}</p>
                </div>
                <span style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)" }}>{t.assignee || "Unassigned"}</span>
                <Pill label={t.status} {...(ST_TONE[t.status] || tone.grey)} />
              </div>
            ))}
          </div>
        </div>
      )) : (
        <div style={{ border: "1px solid var(--border)", background: "#FFF", padding: 40, textAlign: "center", fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>
          {querying ? "No tickets match your query." : "No open tickets 🎉 — search or change the status filter to see resolved/closed issues."}
        </div>
      )}

      {open && (
        <Modal title={open.title} onClose={() => setOpen(null)} width={520}>
          <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>{open.id} · {open.category} · {open.member} · {open.space} · opened {niceDay(open.created)}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <Field label="Status"><select value={open.status} onChange={(e) => { update(open.id, { status: e.target.value }); setOpen({ ...open, status: e.target.value }); }} style={INP}>{TICKET_STATES.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Assign staff"><select value={open.assignee} onChange={(e) => { update(open.id, { assignee: e.target.value }); setOpen({ ...open, assignee: e.target.value }); }} style={INP}><option value="">Unassigned</option>{STAFF.map((s) => <option key={s}>{s}</option>)}</select></Field>
          </div>
          <Field label="Internal notes"><textarea defaultValue={open.notes} rows={3} onBlur={(e) => update(open.id, { notes: e.target.value })} style={{ ...INP, resize: "vertical" }} /></Field>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px", border: "1px dashed var(--border)", cursor: "pointer", fontFamily: "Inter", fontSize: 13, color: "var(--text-2)" }}>
              ⬆ Upload photo<input type="file" accept="image/*" style={{ display: "none" }} onChange={() => update(open.id, { hasPhoto: true })} />
            </label>
            {open.hasPhoto && <span style={{ marginLeft: 10, fontFamily: "Inter", fontSize: 12, color: "var(--success)" }}>Photo attached ✓</span>}
          </div>
          <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginTop: 12 }}>Marking a ticket Resolved or Closed removes it from the default day view.</p>
        </Modal>
      )}

      {creating && (
        <Modal title="New ticket" onClose={() => setCreating(false)}>
          <NewTicket onSave={(t) => { setTickets((ts) => [{ id: "T-" + (9000 + ts.length + 1), status: "New", assignee: "", created: new Date().toISOString().slice(0, 10), ...t }, ...ts]); setCreating(false); }} />
        </Modal>
      )}
    </AdminLayout>
  );
}

function NewTicket({ onSave }) {
  const [f, setF] = useState({ title: "", category: TICKET_CATEGORIES[0], member: "", space: "", priority: "Medium", notes: "" });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Field label="Title"><input value={f.title} onChange={(e) => set("title", e.target.value)} style={INP} /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="Category"><select value={f.category} onChange={(e) => set("category", e.target.value)} style={INP}>{TICKET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field></div>
        <div style={{ flex: 1 }}><Field label="Priority"><select value={f.priority} onChange={(e) => set("priority", e.target.value)} style={INP}>{["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}</select></Field></div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="Member"><input value={f.member} onChange={(e) => set("member", e.target.value)} style={INP} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Space"><input value={f.space} onChange={(e) => set("space", e.target.value)} style={INP} /></Field></div>
      </div>
      <BtnPrimary full onClick={() => f.title && onSave(f)}>Create ticket</BtnPrimary>
    </div>
  );
}
