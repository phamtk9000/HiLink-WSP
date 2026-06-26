import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../components/admin.jsx";
import { PageHead, TH, TD, Pill, Modal, Field, INP, BtnPrimary, Card, tone } from "../../components/adminUI.jsx";
import { getBuildings, useBookings, isUnitFreeOn, updateBooking, cancelBooking, createBooking, fmtVND, todayISO } from "../../data/booking.js";
import { EQUIPMENT } from "../../data/adminData.js";

const eqTone = { Operational: tone.green, Maintenance: tone.amber, Faulty: tone.red };
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const VI_DOW = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function AdminMeetingRooms() {
  const navigate = useNavigate();
  const bookings = useBookings();
  const buildings = getBuildings();
  const [loc, setLoc] = useState("All");
  const [recur, setRecur] = useState(false);
  const [tfRoom, setTfRoom] = useState(null);     // room for the daily time-slot view
  const [tfDate, setTfDate] = useState(todayISO());

  const rooms = useMemo(() => buildings.flatMap((b) => b.floors.flatMap((f) =>
    f.plan.rooms.filter((r) => r.kind === "Meeting Room").map((r) => ({ ...r, building: b.name, floor: f.label, buildingId: b.id, floorId: f.id })))), [buildings]);

  const scoped = loc === "All" ? rooms : rooms.filter((r) => r.building === loc);
  const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
  const pending = bookings.filter((b) => b.unitKind === "Meeting Room" && b.status === "pending" && (loc === "All" || b.buildingName === loc));

  const bookingOn = (roomId, dISO) => bookings.find((b) => b.unitId === roomId && b.status !== "cancelled" && b.start <= dISO && b.end >= dISO);
  const utilOf = (roomId) => Math.round((days.filter((d) => bookingOn(roomId, iso(d))).length / days.length) * 100);

  const approve = (b) => updateBooking(b.id, { status: "confirmed" }, "Meeting room booking approved");
  const reject = (b) => cancelBooking(b.id);

  // group scoped rooms by building for the "classify by location" view
  const byBuilding = buildings.map((b) => ({ b, rooms: scoped.filter((r) => r.buildingId === b.id) })).filter((g) => g.rooms.length);

  // daily time-slot availability
  const tfRooms = scoped.length ? scoped : rooms;
  const activeRoom = tfRooms.find((r) => r.id === tfRoom) || tfRooms[0];
  const dayBookings = activeRoom ? bookings.filter((b) => b.unitId === activeRoom.id && b.status !== "cancelled" && b.start <= tfDate && b.end >= tfDate) : [];

  return (
    <AdminLayout>
      <PageHead title="Meeting Room Management" sub={`${scoped.length} meeting rooms · ${pending.length} awaiting approval`}
        right={<BtnPrimary onClick={() => setRecur(true)}>＋ Recurring reservation</BtnPrimary>} />

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {["All", ...buildings.map((b) => b.name)].map((l) => (
          <button key={l} onClick={() => setLoc(l)} style={tab(loc === l)}>{l === "All" ? "All locations" : l}</button>
        ))}
      </div>

      {/* occupancy / vacancy timeframe matrix, grouped by location */}
      <Card title="Occupancy & vacancy — next 14 days">
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 720 }}>
            <thead>
              <tr>
                <th style={{ ...TH, position: "sticky", left: 0, background: "#FFF", minWidth: 180 }}>Room</th>
                <th style={{ ...TH, textAlign: "center" }}>Util.</th>
                {days.map((d, i) => (
                  <th key={i} style={{ ...TH, textAlign: "center", padding: "6px 4px", color: d.getDay() === 0 ? "var(--danger)" : "var(--text-3)" }}>
                    <div style={{ fontSize: 9 }}>{VI_DOW[d.getDay()]}</div><div>{d.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byBuilding.map(({ b, rooms: rs }) => (
                <FragmentRows key={b.id} building={b.name} rooms={rs} days={days} bookingOn={bookingOn} utilOf={utilOf} navigate={navigate} />
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <Legend c="var(--success)" l="Vacant" /><Legend c="var(--danger)" l="Occupied" />
          <span style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)" }}>Click an occupied cell to open the booking</span>
        </div>
      </Card>

      {/* daily available time frame for a chosen room */}
      <Card title="Available time frame — by day">
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <select value={activeRoom?.id || ""} onChange={(e) => setTfRoom(e.target.value)} style={{ ...INP, width: "auto", minWidth: 220 }}>
            {tfRooms.map((r) => <option key={r.id} value={r.id}>{r.building} · {r.label} ({r.capacity}p)</option>)}
          </select>
          <input type="date" value={tfDate} onChange={(e) => setTfDate(e.target.value)} style={{ ...INP, width: "auto" }} />
          {activeRoom?.hourly && <span style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", alignSelf: "center" }}>{fmtVND(activeRoom.hourly)}/giờ</span>}
        </div>
        {activeRoom ? <HourTimeline bookings={dayBookings} navigate={navigate} /> : <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No meeting rooms in this location.</p>}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16, marginTop: 16 }}>
        <Card title="Approval workflow">
          {pending.length ? pending.map((b) => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{b.unitLabel} · {b.customer.name}</p>
                <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)" }}>{b.buildingName} · {b.start} → {b.end} · {b.time}</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => approve(b)} style={{ border: "none", background: "var(--success)", color: "#FFF", padding: "5px 12px", cursor: "pointer", fontFamily: "Inter", fontSize: 12, fontWeight: 600 }}>Approve</button>
                <button onClick={() => reject(b)} style={{ border: "1px solid var(--danger)", background: "#FFF", color: "var(--danger)", padding: "5px 12px", cursor: "pointer", fontFamily: "Inter", fontSize: 12, fontWeight: 600 }}>Reject</button>
              </div>
            </div>
          )) : <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>No bookings awaiting approval.</p>}
        </Card>

        <Card title="Equipment inventory">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>{["Room", "Equipment", "Status"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {EQUIPMENT.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ ...TD, color: "var(--text-3)" }}>{e.room}</td>
                  <td style={TD}>{e.item}</td>
                  <td style={TD}><Pill label={e.status} {...(eqTone[e.status] || tone.grey)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {recur && <RecurModal rooms={scoped.length ? scoped : rooms} onClose={() => setRecur(false)} onSave={(form) => {
        const room = (scoped.length ? scoped : rooms).find((r) => r.id === form.roomId);
        const subtotal = (room.hourly || 350000) * 4; const vat = Math.round(subtotal * 0.1);
        createBooking({
          unitId: room.id, unitType: "room", unitLabel: room.label, unitKind: "Meeting Room",
          buildingId: room.buildingId, buildingName: room.building, floorId: room.floorId, floorLabel: room.floor,
          customer: { name: form.name || "Recurring", email: "—", initials: "RC" }, guests: 1,
          start: form.start, end: form.start, time: form.time + ` · weekly ×${form.weeks}`,
          pricing: { subtotal, promo: 0, addonsTotal: 0, taxable: subtotal, vat, total: subtotal + vat },
          promo: null, addons: [], deposit: { required: 0, paid: 0 }, status: "pending", source: "Front desk",
        });
        setRecur(false);
      }} />}
    </AdminLayout>
  );
}

const OPEN_HR = 8, CLOSE_HR = 20;
const parseSlot = (t) => {
  const seg = (t || "").split("·")[0];
  const m = seg.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return [Math.max(OPEN_HR, +m[1] + +m[2] / 60), Math.min(CLOSE_HR, +m[3] + +m[4] / 60)];
};
function HourTimeline({ bookings, navigate }) {
  const span = CLOSE_HR - OPEN_HR;
  const pct = (h) => ((h - OPEN_HR) / span) * 100;
  const slots = bookings.map((b) => ({ b, t: parseSlot(b.time) })).filter((x) => x.t && x.t[1] > x.t[0]);
  // free gaps
  const busy = slots.map((s) => s.t).sort((a, b) => a[0] - b[0]);
  const free = []; let cur = OPEN_HR;
  busy.forEach(([s, e]) => { if (s > cur) free.push([cur, s]); cur = Math.max(cur, e); });
  if (cur < CLOSE_HR) free.push([cur, CLOSE_HR]);
  const fmtHr = (h) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
  return (
    <div>
      <div style={{ position: "relative", height: 46, background: "rgba(45,106,79,0.08)", border: "1px solid rgba(45,106,79,0.25)", borderRadius: 6, overflow: "hidden" }}>
        {slots.map(({ b, t }) => (
          <div key={b.id} onClick={() => navigate(`/admin/bookings/${b.id}`)} title={`${b.customer.name} · ${b.time}`}
            style={{ position: "absolute", top: 0, bottom: 0, left: pct(t[0]) + "%", width: (pct(t[1]) - pct(t[0])) + "%", background: "rgba(192,57,43,0.22)", borderLeft: "2px solid var(--danger)", borderRight: "2px solid var(--danger)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontSize: 10, fontWeight: 600, color: "var(--danger)", overflow: "hidden", whiteSpace: "nowrap" }}>
            {b.customer.name}
          </div>
        ))}
      </div>
      <div style={{ position: "relative", height: 16, marginTop: 2 }}>
        {Array.from({ length: span + 1 }, (_, i) => OPEN_HR + i).map((h) => (
          <span key={h} style={{ position: "absolute", left: pct(h) + "%", transform: "translateX(-50%)", fontFamily: "Inter", fontSize: 9, color: "var(--text-3)" }}>{h}</span>
        ))}
      </div>
      <div style={{ marginTop: 10, fontFamily: "Inter", fontSize: 12, color: "var(--text-2)" }}>
        {free.length ? <>Available: {free.map(([s, e], i) => <span key={i} style={{ display: "inline-block", background: "rgba(45,106,79,0.12)", color: "var(--success)", padding: "2px 8px", borderRadius: 20, marginRight: 6, fontWeight: 600 }}>{fmtHr(s)}–{fmtHr(e)}</span>)}</> : <span style={{ color: "var(--danger)" }}>Fully booked this day.</span>}
      </div>
    </div>
  );
}

function FragmentRows({ building, rooms, days, bookingOn, utilOf, navigate }) {
  return (
    <>
      <tr><td colSpan={days.length + 2} style={{ background: "rgba(15,15,15,0.03)", padding: "6px 14px", fontFamily: "Inter", fontSize: 11, fontWeight: 700, color: "var(--text-2)", position: "sticky", left: 0 }}>{building}</td></tr>
      {rooms.map((r) => {
        const util = utilOf(r.id);
        return (
          <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
            <td style={{ ...TD, position: "sticky", left: 0, background: "#FFF" }}><span style={{ fontWeight: 600 }}>{r.label}</span><span style={{ color: "var(--text-3)", fontSize: 11 }}> · {r.capacity}p · {r.hourly ? fmtVND(r.hourly) + "/h" : ""}</span></td>
            <td style={{ ...TD, textAlign: "center", fontWeight: 600, color: util > 70 ? "var(--danger)" : util > 35 ? "var(--warning)" : "var(--success)" }}>{util}%</td>
            {days.map((d, i) => {
              const dISO = d.toISOString().slice(0, 10);
              const bk = bookingOn(r.id, dISO);
              return <td key={i} title={bk ? `${bk.customer.name} (${bk.start}→${bk.end})` : "Vacant"} onClick={() => bk && navigate(`/admin/bookings/${bk.id}`)}
                style={{ padding: 2, textAlign: "center", cursor: bk ? "pointer" : "default" }}>
                <div style={{ height: 26, background: bk ? "rgba(192,57,43,0.18)" : "rgba(45,106,79,0.10)", border: `1px solid ${bk ? "var(--danger)" : "rgba(45,106,79,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontSize: 9, fontWeight: 700, color: bk ? "var(--danger)" : "transparent" }}>{bk ? bk.customer.initials : "·"}</div>
              </td>;
            })}
          </tr>
        );
      })}
    </>
  );
}

function RecurModal({ rooms, onClose, onSave }) {
  const [f, setF] = useState({ name: "", roomId: rooms[0]?.id, start: todayISO(), time: "14:00 – 15:00", weeks: 4 });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal title="Recurring reservation" onClose={onClose}>
      <div style={{ display: "grid", gap: 12 }}>
        <Field label="Booked by"><input value={f.name} onChange={(e) => set("name", e.target.value)} style={INP} placeholder="Member / team" /></Field>
        <Field label="Room"><select value={f.roomId} onChange={(e) => set("roomId", e.target.value)} style={INP}>{rooms.map((r) => <option key={r.id} value={r.id}>{r.building} · {r.label}</option>)}</select></Field>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><Field label="First date"><input type="date" value={f.start} onChange={(e) => set("start", e.target.value)} style={INP} /></Field></div>
          <div style={{ flex: 1 }}><Field label="Time"><input value={f.time} onChange={(e) => set("time", e.target.value)} style={INP} /></Field></div>
        </div>
        <Field label="Repeat weekly for (weeks)"><input type="number" min={1} value={f.weeks} onChange={(e) => set("weeks", e.target.value)} style={INP} /></Field>
        <BtnPrimary full onClick={() => onSave(f)}>Create recurring booking</BtnPrimary>
      </div>
    </Modal>
  );
}

const tab = (on) => ({ padding: "8px 16px", border: `1px solid ${on ? "var(--olive)" : "var(--border)"}`, background: on ? "rgba(61,74,46,0.07)" : "#FFF", color: on ? "var(--olive)" : "var(--text-3)", fontFamily: "Inter", fontSize: 13, fontWeight: on ? 600 : 400, cursor: "pointer" });
const Legend = ({ c, l }) => <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 11, color: "var(--text-3)" }}><span style={{ width: 12, height: 12, background: c === "var(--success)" ? "rgba(45,106,79,0.10)" : "rgba(192,57,43,0.18)", border: `1px solid ${c}` }} />{l}</span>;
