import { useState, useMemo } from "react";
import { AdminLayout } from "../../components/admin.jsx";
import Floorplan, { FloorLegend } from "../../components/Floorplan.jsx";
import { getBuildings, getFloor, fmtVND, todayISO } from "../../data/booking.js";

const WORKSPACE_TYPES = ["Hot Desk", "Dedicated Desk", "Private Office", "Meeting Room", "Focus Cabin"];
const SPACE_STATUSES = ["Available", "Occupied", "Reserved", "Maintenance", "Out of Service"];
const STATUS_COLOR = {
  "Available":     { color: "var(--success)", bg: "rgba(45,106,79,0.10)" },
  "Occupied":      { color: "var(--danger)",  bg: "rgba(192,57,43,0.10)" },
  "Reserved":      { color: "var(--warning)", bg: "rgba(181,134,42,0.12)" },
  "Maintenance":   { color: "#2563EB",        bg: "rgba(37,99,235,0.10)" },
  "Out of Service":{ color: "var(--text-3)",  bg: "rgba(15,15,15,0.07)" },
};
const priceOf = (u) => u.monthly ? fmtVND(u.monthly) + "/mo" : u.daily ? fmtVND(u.daily) + "/day" : u.hourly ? fmtVND(u.hourly) + "/hr" : "—";

export default function AdminSpaces() {
  const buildings = getBuildings();
  const [buildingId, setBuildingId] = useState(buildings[0].id);
  const [floorId, setFloorId] = useState(buildings[0].floors[0].id);
  const [typeFilter, setTypeFilter] = useState("All");
  const [overrides, setOverrides] = useState({});   // { unitId: { status, capacity, price } } — demo-local edits
  const [edit, setEdit] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const building = buildings.find((b) => b.id === buildingId);
  const floor = getFloor(floorId);

  const units = useMemo(() => {
    const rooms = floor.plan.rooms.map((r) => ({ ...r, type: r.kind, cap: r.capacity }));
    const seats = floor.plan.seats.map((s) => ({ ...s, type: s.kind, cap: 1 }));
    return [...rooms, ...seats].map((u) => ({ ...u, status: overrides[u.id]?.status || "Available" }));
  }, [floor, overrides]);

  const counts = WORKSPACE_TYPES.map((t) => ({ type: t, n: units.filter((u) => u.type === t).length }));
  const rows = typeFilter === "All" ? units : units.filter((u) => u.type === typeFilter);

  const setStatus = (id, status) => setOverrides((o) => ({ ...o, [id]: { ...o[id], status } }));

  const th = { padding: "11px 14px", textAlign: "left", fontFamily: "Inter", fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" };
  const td = { padding: "11px 14px", fontFamily: "Inter", fontSize: 13, color: "var(--text)", whiteSpace: "nowrap" };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Floor &amp; Space Management</h1>
        <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>Manage physical inventory, capacity, pricing and status</p>
      </div>

      {/* building + floor + tools */}
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {buildings.map((b) => (
            <button key={b.id} onClick={() => { setBuildingId(b.id); setFloorId(b.floors[0].id); }} style={tab(buildingId === b.id)}>{b.name}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {building.floors.map((f) => (
            <button key={f.id} onClick={() => setFloorId(f.id)} style={tab(floorId === f.id)}>{f.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid var(--border)", background: "#FFF", cursor: "pointer", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }}>
            ⬆ {uploaded ? "Floor plan uploaded" : "Upload floor plan"}
            <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={() => setUploaded(true)} />
          </label>
          <button onClick={() => setEdit({ id: "new", label: "New space", type: "Hot Desk", cap: 1, status: "Available" })} style={{ padding: "8px 14px", border: "none", background: "var(--olive)", color: "#FFF", cursor: "pointer", fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}>＋ Add space</button>
        </div>
      </div>

      {/* workspace-type catalog */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 18 }}>
        {counts.map(({ type, n }) => (
          <button key={type} onClick={() => setTypeFilter(typeFilter === type ? "All" : type)} style={{ textAlign: "left", background: typeFilter === type ? "rgba(61,74,46,0.07)" : "#FFF", border: `1px solid ${typeFilter === type ? "var(--olive)" : "var(--border)"}`, padding: "12px 14px", cursor: "pointer" }}>
            <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>{type}</p>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{n}</p>
          </button>
        ))}
      </div>

      {/* inventory table */}
      <div style={{ border: "1px solid var(--border)", background: "#FFF", overflow: "hidden", marginBottom: 22 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Space", "Type", "Capacity", "Pricing", "Status", ""].map((h) => <th key={h} style={th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {rows.map((u, i) => { const sc = STATUS_COLOR[u.status]; return (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 ? "rgba(15,15,15,0.01)" : "transparent" }}>
                  <td style={{ ...td, fontWeight: 600 }}>{u.label}</td>
                  <td style={{ ...td, color: "var(--text-3)" }}>{u.type}</td>
                  <td style={td}>{overrides[u.id]?.capacity ?? u.cap} pax</td>
                  <td style={td}>{overrides[u.id]?.price ?? priceOf(u)}</td>
                  <td style={td}>
                    <select value={u.status} onChange={(e) => setStatus(u.id, e.target.value)} style={{ border: `1px solid ${sc.color}`, background: sc.bg, color: sc.color, fontFamily: "Inter", fontSize: 12, fontWeight: 600, padding: "4px 8px", cursor: "pointer" }}>
                      {SPACE_STATUSES.map((s) => <option key={s} value={s} style={{ color: "var(--text)", background: "#FFF" }}>{s}</option>)}
                    </select>
                  </td>
                  <td style={td}><button onClick={() => setEdit(u)} style={{ border: "1px solid var(--border)", background: "#FFF", padding: "5px 12px", cursor: "pointer", fontFamily: "Inter", fontSize: 12, color: "var(--text-2)" }}>Edit</button></td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      </div>

      {/* interactive floor editor preview */}
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>Interactive Floor Editor — {floor.label}</p>
      <div style={{ marginBottom: 12 }}><FloorLegend /></div>
      <Floorplan floor={floor} date={todayISO()} selected={[]} />

      {/* capacity / pricing edit modal */}
      {edit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setEdit(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFF", border: "1px solid var(--border)", padding: 28, maxWidth: 400, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{edit.id === "new" ? "Add space" : edit.label}</h2>
              <button onClick={() => setEdit(null)} style={{ background: "none", border: "none", fontSize: 22, color: "var(--text-3)", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <Lbl t="Type"><select defaultValue={edit.type} style={inp}>{WORKSPACE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Lbl>
              <Lbl t="Capacity (pax)"><input type="number" defaultValue={edit.cap} style={inp} onChange={(e) => edit.id !== "new" && setOverrides((o) => ({ ...o, [edit.id]: { ...o[edit.id], capacity: e.target.value } }))} /></Lbl>
              <Lbl t="Pricing"><input defaultValue={edit.id !== "new" ? priceOf(edit) : ""} placeholder="e.g. ₫8,500,000/mo" style={inp} onChange={(e) => edit.id !== "new" && setOverrides((o) => ({ ...o, [edit.id]: { ...o[edit.id], price: e.target.value } }))} /></Lbl>
              <Lbl t="Status"><select defaultValue={edit.status} style={inp} onChange={(e) => edit.id !== "new" && setStatus(edit.id, e.target.value)}>{SPACE_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Lbl>
              <button onClick={() => setEdit(null)} style={{ marginTop: 4, background: "var(--olive)", color: "#FFF", border: "none", padding: "11px", cursor: "pointer", fontFamily: "Inter", fontSize: 14, fontWeight: 600 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const tab = (on) => ({ padding: "8px 16px", border: `1px solid ${on ? "var(--olive)" : "var(--border)"}`, background: on ? "rgba(61,74,46,0.07)" : "#FFF", color: on ? "var(--olive)" : "var(--text-3)", fontFamily: "Inter", fontSize: 13, fontWeight: on ? 600 : 400, cursor: "pointer" });
const inp = { width: "100%", padding: "9px 12px", border: "1px solid var(--border)", fontFamily: "Inter", fontSize: 13, color: "var(--text)" };
const Lbl = ({ t, children }) => (<div><label style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", display: "block", marginBottom: 5 }}>{t}</label>{children}</div>);
