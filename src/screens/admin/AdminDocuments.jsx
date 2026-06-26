import { useState } from "react";
import { AdminLayout } from "../../components/admin.jsx";
import { PageHead, TH, TD, Pill, Search, SEL, BtnPrimary, tone } from "../../components/adminUI.jsx";
import { DOCUMENTS } from "../../data/adminData.js";

const TYPES = ["Contract", "Membership Agreement", "Invoice", "Compliance"];
const TYPE_TONE = { Contract: tone.olive, "Membership Agreement": tone.blue, Invoice: tone.amber, Compliance: tone.green };
const ICON = { Contract: "▤", "Membership Agreement": "✎", Invoice: "₫", Compliance: "✓" };

export default function AdminDocuments() {
  const [docs, setDocs] = useState(DOCUMENTS);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [toast, setToast] = useState("");

  const rows = docs.filter((d) => {
    if (type !== "All" && d.type !== type) return false;
    if (q && !`${d.name} ${d.member} ${d.type}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const upload = (e) => {
    const name = e.target.files?.[0]?.name || "New document.pdf";
    setDocs((ds) => [{ id: "D-" + (ds.length + 1).toString().padStart(2, "0"), name, type: "Contract", member: "—", version: "v1", date: new Date().toISOString().slice(0, 10), size: "—" }, ...ds]);
    setToast("Uploaded " + name); setTimeout(() => setToast(""), 2200);
  };
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 1800); };

  return (
    <AdminLayout>
      <PageHead title="Document Management" sub={`${docs.length} documents · version-controlled store`}
        right={<label style={{ cursor: "pointer" }}><BtnPrimary>＋ Upload document</BtnPrimary><input type="file" style={{ display: "none" }} onChange={upload} /></label>} />

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <Search value={q} onChange={setQ} placeholder="Search documents, owner…" />
        <select value={type} onChange={(e) => setType(e.target.value)} style={SEL}><option>All</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
      </div>

      <div style={{ border: "1px solid var(--border)", background: "#FFF" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>{["Document", "Type", "Owner", "Version", "Updated", "Size", ""].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 ? "rgba(15,15,15,0.01)" : "transparent" }}>
                  <td style={TD}><span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><span style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: (TYPE_TONE[d.type] || tone.grey).bg, color: (TYPE_TONE[d.type] || tone.grey).color }}>{ICON[d.type] || "▤"}</span><span style={{ fontWeight: 600 }}>{d.name}</span></span></td>
                  <td style={TD}><Pill label={d.type} {...(TYPE_TONE[d.type] || tone.grey)} /></td>
                  <td style={{ ...TD, color: "var(--text-3)" }}>{d.member}</td>
                  <td style={TD}><span style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => flash(`${d.id} version history (demo)`)}>{d.version} <span style={{ color: "var(--text-3)", fontSize: 11 }}>history</span></span></td>
                  <td style={{ ...TD, color: "var(--text-3)" }}>{d.date}</td>
                  <td style={{ ...TD, color: "var(--text-3)" }}>{d.size}</td>
                  <td style={TD}><button onClick={() => flash(`Downloading ${d.name} (demo)`)} style={{ border: "1px solid var(--border)", background: "#FFF", padding: "5px 12px", cursor: "pointer", fontFamily: "Inter", fontSize: 12, color: "var(--text-2)" }}>Download</button></td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={7} style={{ padding: 36, textAlign: "center", fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No documents match.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--text)", color: "#FFF", padding: "10px 20px", fontFamily: "Inter", fontSize: 13, zIndex: 300 }}>{toast}</div>}
    </AdminLayout>
  );
}
