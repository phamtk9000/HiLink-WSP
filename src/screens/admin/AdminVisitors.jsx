import { useState } from "react";
import { AdminLayout } from "../../components/admin.jsx";
import { PageHead, TH, TD, Pill, Modal, Field, INP, BtnPrimary, Search, Card, tone } from "../../components/adminUI.jsx";
import { VISITORS } from "../../data/adminData.js";
import { MEMBERS } from "../../data/adminData.js";

const ST_TONE = { Expected: tone.blue, "Checked in": tone.green, "Checked out": tone.grey };

// tiny deterministic QR-like glyph (decorative)
const QrGlyph = ({ seed = 7, size = 96 }) => {
  const n = 9, cell = size / n; let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const cells = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const edge = x < 3 && y < 3 || x > n - 4 && y < 3 || x < 3 && y > n - 4; if (edge ? (x === 0 || y === 0 || x === n - 1 || y === n - 1 || (x > 0 && x < (x < 3 ? 3 : n) )) && rnd() > 0.2 : rnd() > 0.5) cells.push([x, y]); }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ border: "1px solid var(--border)" }}>
      <rect width={size} height={size} fill="#FFF" />
      {cells.map(([x, y], i) => <rect key={i} x={x * cell} y={y * cell} width={cell} height={cell} fill="var(--text)" />)}
    </svg>
  );
};

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState(VISITORS);
  const [q, setQ] = useState("");
  const [reg, setReg] = useState(false);
  const [qr, setQr] = useState(null);

  const rows = visitors.filter((v) => !q || `${v.guest} ${v.host} ${v.company}`.toLowerCase().includes(q.toLowerCase()));
  const setStatus = (id, status) => setVisitors((vs) => vs.map((v) => v.id === id ? { ...v, status } : v));

  const today = visitors.filter((v) => v.status !== "Checked out").length;

  return (
    <AdminLayout>
      <PageHead title="Visitor Management" sub={`${today} visitors on site or expected today`}
        right={<BtnPrimary onClick={() => setReg(true)}>＋ Register visitor</BtnPrimary>} />

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <Search value={q} onChange={setQ} placeholder="Search guest, host, company…" />
      </div>

      <div style={{ border: "1px solid var(--border)", background: "#FFF" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>{["Visitor", "Host", "Arrival", "Method", "Status", "Actions"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((v, i) => (
                <tr key={v.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 ? "rgba(15,15,15,0.01)" : "transparent" }}>
                  <td style={TD}><span style={{ display: "block", fontWeight: 600 }}>{v.guest}</span><span style={{ fontSize: 11, color: "var(--text-3)" }}>{v.company}</span></td>
                  <td style={TD}>{v.host}</td>
                  <td style={{ ...TD, color: "var(--text-3)" }}>{v.arrival}</td>
                  <td style={TD}>{v.method}</td>
                  <td style={TD}><Pill label={v.status} {...(ST_TONE[v.status] || tone.grey)} /></td>
                  <td style={TD}>
                    <span style={{ display: "inline-flex", gap: 6 }}>
                      {v.status === "Expected" && <button onClick={() => setStatus(v.id, "Checked in")} style={miniBtn("var(--success)")}>Check in</button>}
                      {v.status === "Checked in" && <button onClick={() => setStatus(v.id, "Checked out")} style={miniBtn("var(--text-3)")}>Check out</button>}
                      <button onClick={() => setQr(v)} style={miniBtn("var(--olive)")}>QR</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {reg && (
        <Modal title="Register visitor" onClose={() => setReg(false)}>
          <RegForm onSave={(v) => { setVisitors((vs) => [{ id: "V-" + (300 + vs.length + 1), status: "Expected", ...v }, ...vs]); setReg(false); }} />
        </Modal>
      )}
      {qr && (
        <Modal title={`Visitor pass — ${qr.guest}`} onClose={() => setQr(null)} width={340}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block", padding: 12, background: "#FFF", border: "1px solid var(--border)" }}><QrGlyph seed={qr.id.length * 13 + 5} /></div>
            <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-2)", marginTop: 12 }}>Host: {qr.host}</p>
            <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>Scan at reception to check in · {qr.arrival}</p>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

function RegForm({ onSave }) {
  const [f, setF] = useState({ guest: "", company: "", host: MEMBERS[0].name, arrival: new Date().toISOString().slice(0, 16).replace("T", " "), method: "Reception" });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Field label="Guest name"><input value={f.guest} onChange={(e) => set("guest", e.target.value)} style={INP} /></Field>
      <Field label="Company"><input value={f.company} onChange={(e) => set("company", e.target.value)} style={INP} /></Field>
      <Field label="Host member"><select value={f.host} onChange={(e) => set("host", e.target.value)} style={INP}>{MEMBERS.map((m) => <option key={m.id}>{m.name}</option>)}</select></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="Arrival"><input value={f.arrival} onChange={(e) => set("arrival", e.target.value)} style={INP} /></Field></div>
        <div style={{ width: 130 }}><Field label="Method"><select value={f.method} onChange={(e) => set("method", e.target.value)} style={INP}><option>Reception</option><option>QR code</option></select></Field></div>
      </div>
      <BtnPrimary full onClick={() => f.guest && onSave(f)}>Register</BtnPrimary>
    </div>
  );
}
const miniBtn = (c) => ({ border: `1px solid ${c}`, background: "#FFF", color: c, padding: "4px 10px", cursor: "pointer", fontFamily: "Inter", fontSize: 12, fontWeight: 600 });
