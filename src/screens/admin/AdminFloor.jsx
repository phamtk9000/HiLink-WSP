import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../components/admin.jsx";
import Floorplan, { FloorLegend } from "../../components/Floorplan.jsx";
import { Avatar } from "../../components/index.jsx";
import { Modal, Field, tone, Pill } from "../../components/adminUI.jsx";
import { getBuildings, getFloor, todayISO, isUnitFreeOn, useBookings, fmtVND } from "../../data/booking.js";
import { MEMBERS } from "../../data/adminData.js";

export default function AdminFloor() {
  const navigate = useNavigate();
  const bookings = useBookings();
  const buildings = getBuildings();
  const [buildingId, setBuildingId] = useState(buildings[0].id);
  const [floorId, setFloorId] = useState(buildings[0].floors[0].id);
  const [date, setDate] = useState(todayISO());
  const [occupant, setOccupant] = useState(null);

  const building = buildings.find((b) => b.id === buildingId);
  const floor = getFloor(floorId);
  const units = [...floor.plan.rooms, ...(floor.plan.seats || [])];
  const free = units.filter((u) => isUnitFreeOn(u.id, date) && u.baseStatus !== "occupied").length;

  // when an occupied hotspot is clicked, find who is using it
  const showOccupant = (unit) => {
    const active = bookings.find((b) => b.unitId === unit.id && b.status !== "cancelled" && b.start <= date && b.end >= date)
      || bookings.find((b) => b.unitId === unit.id && b.status !== "cancelled");
    const member = active ? MEMBERS.find((m) => m.name === active.customer.name) : null;
    setOccupant({ unit, booking: active, member });
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Live Floor Map</h1>
        <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>Hover a space for details · click an occupied space to see who's using it</p>
      </div>

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
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        {[["Available", free, "var(--success)"], ["Occupied / held", units.length - free, "var(--danger)"], ["Total units", units.length, "var(--text-2)"]].map(([l, c, col]) => (
          <div key={l} style={{ background: "#FFF", border: "1px solid var(--border)", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{c}</span>
            <span style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 14 }}><FloorLegend /></div>
      <Floorplan floor={floor} date={date} selected={[]} onOccupiedClick={showOccupant} />

      {occupant && (
        <Modal title={occupant.unit.label} onClose={() => setOccupant(null)} width={440}>
          {occupant.booking ? (
            <>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <Avatar initials={occupant.booking.customer.initials} size={44} gold />
                <div>
                  <p style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{occupant.booking.customer.name}</p>
                  <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>{occupant.member?.company || occupant.booking.customer.email}</p>
                </div>
                <span style={{ marginLeft: "auto" }}><Pill label="Occupied" {...tone.red} /></span>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {[["Space", `${occupant.unit.label} · ${occupant.unit.kind}`], ["Period", `${occupant.booking.start} → ${occupant.booking.end}`], ["Time", occupant.booking.time], ["Contract", "#" + occupant.booking.id], ["Value", fmtVND(occupant.booking.pricing.total)]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                    <span style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>{k}</span>
                    <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate(`/admin/bookings/${occupant.booking.id}`)} style={{ marginTop: 16, width: "100%", background: "var(--olive)", color: "#FFF", border: "none", padding: "11px", cursor: "pointer", fontFamily: "Inter", fontSize: 14, fontWeight: 600 }}>Open booking</button>
            </>
          ) : (
            <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>This space is marked occupied/held, but has no linked booking in the system (e.g. a manual hold).</p>
          )}
        </Modal>
      )}
    </AdminLayout>
  );
}
const tab = (on) => ({ padding: "8px 16px", border: `1px solid ${on ? "var(--olive)" : "var(--border)"}`, background: on ? "rgba(61,74,46,0.07)" : "#FFF", color: on ? "var(--olive)" : "var(--text-3)", fontFamily: "Inter", fontSize: 13, fontWeight: on ? 600 : 400, cursor: "pointer" });
