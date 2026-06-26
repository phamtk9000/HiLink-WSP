import { useState } from "react";
import { isUnitFreeOn, fmtVND } from "../data/booking.js";

// status → colors (matches design tokens)
const COLORS = {
  available: { stroke: "var(--success)", fill: "rgba(45,106,79,0.10)",  glyph: "var(--success)" },
  selecting: { stroke: "var(--success)", fill: "rgba(45,106,79,0.55)",  glyph: "#FFFFFF" },
  reserved:  { stroke: "var(--warning)", fill: "rgba(181,134,42,0.12)", glyph: "var(--warning)" },
  occupied:  { stroke: "rgba(15,15,15,0.25)", fill: "rgba(15,15,15,0.06)", glyph: "rgba(15,15,15,0.40)" },
};

const priceLabel = (u) => u.monthly ? `${fmtVND(u.monthly)}/tháng` : u.hourly ? `${fmtVND(u.hourly)}/giờ` : u.daily ? `${fmtVND(u.daily)}/ngày` : "";

const ChairGlyph = ({ color }) => (
  <g>
    <rect x={-6} y={-3} width={12} height={10} rx={2.5} fill={color} />
    <rect x={-7.5} y={-8} width={15} height={4} rx={2} fill={color} />
    <line x1={0} y1={7} x2={0} y2={11} stroke={color} strokeWidth={1.6} />
    <line x1={-4} y1={11} x2={4} y2={11} stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </g>
);

// ── Image-based floor (real architectural plan + positioned hotspots) ─────────
function ImageFloorplan({ floor, date, selected, onToggle, onOccupiedClick }) {
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState(null);
  const { plan } = floor;
  const baseW = 760;

  const statusOf = (r) => selected.includes(r.id) ? "selecting" : (!isUnitFreeOn(r.id, date) || r.baseStatus === "occupied") ? "occupied" : "available";

  const Hotspot = ({ r, isSeat }) => {
    const st = statusOf(r); const c = COLORS[st];
    const occupied = st === "occupied";
    const isHover = hover === r.id;
    const dot = isSeat ? 16 : 20 + Math.min(10, r.capacity || 0);
    const handle = () => occupied ? onOccupiedClick?.(r) : onToggle?.(r.id, isSeat ? "seat" : "room");
    const clickable = !occupied || !!onOccupiedClick;
    return (
      <div style={{ position: "absolute", left: `${r.xPct}%`, top: `${r.yPct}%`, transform: "translate(-50%,-50%)", zIndex: isHover ? 25 : 10 }}
        onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}>
        <button onClick={handle} style={{
          width: dot, height: dot, borderRadius: "50%", cursor: clickable ? "pointer" : "not-allowed",
          background: c.fill, border: `2px solid ${c.stroke}`, color: st === "selecting" ? "#FFF" : c.stroke,
          fontFamily: "Inter", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isHover ? "0 2px 10px rgba(0,0,0,0.18)" : "0 1px 3px rgba(0,0,0,0.12)", transition: "transform 0.1s", transform: isHover ? "scale(1.18)" : "scale(1)",
        }}>{st === "selecting" ? "✓" : ""}</button>
        {isHover && (
          <div style={{ position: "absolute", left: "50%", bottom: "calc(100% + 8px)", transform: "translateX(-50%)", width: 190, background: "#FFF", border: "1px solid var(--border-gold)", boxShadow: "0 10px 30px rgba(0,0,0,0.22)", zIndex: 40, overflow: "hidden" }}>
            {r.photo && <div style={{ height: 92, background: `#EAE3D2 url(${encodeURI(r.photo)}) center/cover no-repeat` }} />}
            <div style={{ padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{r.label}</span>
                <span style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 600, color: occupied ? "var(--danger)" : "var(--success)" }}>{occupied ? "Đã thuê" : "Còn trống"}</span>
              </div>
              <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginBottom: 6 }}>{r.kind} · {r.capacity} {r.capacity > 1 ? "pax" : "chỗ"}{isSeat ? " · single slot" : " · trọn phòng"}</p>
              <p style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "var(--gold)" }}>{priceLabel(r)}</p>
              {occupied && onOccupiedClick && <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--olive)", marginTop: 4 }}>Click to view occupant →</p>}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: "relative", border: "1px solid var(--border)", background: "#FBFAF7", overflow: "auto", maxHeight: 640 }}>
      <div style={{ position: "absolute", right: 14, bottom: 14, display: "flex", flexDirection: "column", gap: 6, zIndex: 30 }}>
        {[["+", () => setZoom((z) => Math.min(2.2, z + 0.2))], ["−", () => setZoom((z) => Math.max(0.6, z - 0.2))]].map(([t, fn]) => (
          <button key={t} onClick={fn} style={{ width: 34, height: 34, background: "#FFF", border: "1px solid var(--border)", cursor: "pointer", fontSize: 18, color: "var(--text)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>{t}</button>
        ))}
      </div>
      <div style={{ position: "relative", width: baseW * zoom, maxWidth: "none" }}>
        <img src={plan.image} alt={floor.label} style={{ width: "100%", display: "block" }} />
        {plan.markers?.map((m) => (
          <div key={m.label} title={m.kind} style={{ position: "absolute", left: `${m.xPct}%`, top: `${m.yPct}%`, transform: "translate(-50%,-50%)", zIndex: 5 }}>
            <div style={{ padding: "2px 7px", background: "rgba(255,255,255,0.85)", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "Inter", fontSize: 9, color: "var(--text-3)", whiteSpace: "nowrap" }}>{m.label}</div>
          </div>
        ))}
        {plan.rooms.map((r) => <Hotspot key={r.id} r={r} isSeat={false} />)}
        {plan.seats?.map((s) => <Hotspot key={s.id} r={s} isSeat={true} />)}
      </div>
    </div>
  );
}

// ── SVG-based floor (stylised plan for Enosta) ────────────────────────────────
function SvgFloorplan({ floor, date, selected, onToggle }) {
  const [zoom, setZoom] = useState(1);
  const { plan } = floor;
  const seatStatus = (s) => selected.includes(s.id) ? "selecting" : !isUnitFreeOn(s.id, date) ? "occupied" : s.baseStatus;
  const roomStatus = (r) => selected.includes(r.id) ? "selecting" : isUnitFreeOn(r.id, date) ? "available" : "occupied";

  return (
    <div style={{ position: "relative", border: "1px solid var(--border)", background: "#FBFAF7", overflow: "auto", maxHeight: 560 }}>
      <div style={{ position: "absolute", right: 14, bottom: 14, display: "flex", flexDirection: "column", gap: 6, zIndex: 5 }}>
        {[["+", () => setZoom((z) => Math.min(1.8, z + 0.2))], ["−", () => setZoom((z) => Math.max(0.6, z - 0.2))]].map(([t, fn]) => (
          <button key={t} onClick={fn} style={{ width: 34, height: 34, background: "#FFF", border: "1px solid var(--border)", cursor: "pointer", fontSize: 18, color: "var(--text)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>{t}</button>
        ))}
      </div>
      <svg viewBox={plan.viewBox} style={{ width: 1000 * zoom, maxWidth: "none", height: "auto", display: "block" }} xmlns="http://www.w3.org/2000/svg">
        {plan.decor.map((d, i) => {
          if (d.kind === "zone") return (
            <g key={i}>
              <rect x={d.x} y={d.y} width={d.w} height={d.h} rx={8} fill="rgba(168,143,92,0.05)" stroke="rgba(168,143,92,0.22)" strokeDasharray="4 4" />
              <text x={d.x + 12} y={d.y + 22} fontFamily="Inter, sans-serif" fontSize={13} fill="var(--text-3)">{d.label}</text>
            </g>
          );
          if (d.kind === "table")  return <rect key={i} x={d.x} y={d.y} width={d.w} height={d.h} rx={6} fill="#EDE7DA" stroke="rgba(15,15,15,0.10)" />;
          if (d.kind === "desk")   return <rect key={i} x={d.x} y={d.y} width={d.w} height={d.h} rx={4} fill="#E8E1D2" stroke="rgba(15,15,15,0.10)" />;
          if (d.kind === "sofa")   return <rect key={i} x={d.x} y={d.y} width={d.w} height={d.h} rx={12} fill="#E4DECF" stroke="rgba(15,15,15,0.08)" />;
          if (d.kind === "rtable") return <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#EDE7DA" stroke="rgba(15,15,15,0.10)" />;
          if (d.kind === "plant")  return <circle key={i} cx={d.x} cy={d.y} r={10} fill="rgba(45,106,79,0.30)" />;
          return null;
        })}
        {plan.rooms.map((r) => {
          const st = roomStatus(r); const c = COLORS[st];
          const clickable = st === "available" || st === "selecting";
          return (
            <g key={r.id} style={{ cursor: clickable ? "pointer" : "not-allowed" }} onClick={() => clickable && onToggle?.(r.id, "room")}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill={c.fill} stroke={c.stroke} strokeWidth={st === "selecting" ? 2.5 : 1.5} />
              <text x={r.x + 12} y={r.y + 26} fontFamily="Playfair Display, Georgia, serif" fontSize={15} fontWeight="600" fill={st === "occupied" ? "var(--text-3)" : "var(--text)"}>{r.label}</text>
              <text x={r.x + 12} y={r.y + 44} fontFamily="Inter, sans-serif" fontSize={11} fill="var(--text-3)">{r.kind} · {r.capacity} pax</text>
              {st === "occupied" && <text x={r.x + 12} y={r.y + r.h - 14} fontFamily="Inter, sans-serif" fontSize={11} fill="var(--danger)">Đã đặt</text>}
              {st === "selecting" && <text x={r.x + 12} y={r.y + r.h - 14} fontFamily="Inter, sans-serif" fontSize={11} fontWeight="600" fill="var(--success)">✓ Đang chọn</text>}
            </g>
          );
        })}
        {plan.seats.map((s) => {
          const st = seatStatus(s); const c = COLORS[st];
          const clickable = st === "available" || st === "selecting";
          return (
            <g key={s.id} transform={`translate(${s.x},${s.y})`} style={{ cursor: clickable ? "pointer" : "not-allowed" }} onClick={() => clickable && onToggle?.(s.id, "seat")}>
              <circle r={17} fill="#FFFFFF" stroke={c.stroke} strokeWidth={st === "selecting" ? 2.5 : 1.5} />
              {st === "selecting" && <circle r={17} fill={c.fill} />}
              <ChairGlyph color={c.glyph} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Floorplan({ floor, date, selected = [], onToggle, onOccupiedClick }) {
  return floor.plan.image
    ? <ImageFloorplan floor={floor} date={date} selected={selected} onToggle={onToggle} onOccupiedClick={onOccupiedClick} />
    : <SvgFloorplan floor={floor} date={date} selected={selected} onToggle={onToggle} />;
}

export const FloorLegend = () => (
  <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center", fontFamily: "Inter, sans-serif", fontSize: 12, color: "var(--text-3)" }}>
    {[["Có sẵn", "var(--success)", "rgba(45,106,79,0.10)"], ["Đang chọn", "var(--success)", "rgba(45,106,79,0.55)"], ["Đã giữ chỗ", "var(--warning)", "rgba(181,134,42,0.12)"], ["Không có sẵn", "rgba(15,15,15,0.25)", "rgba(15,15,15,0.06)"]].map(([l, stroke, fill]) => (
      <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
        <span style={{ width: 14, height: 14, borderRadius: "50%", background: fill, border: `1.5px solid ${stroke}`, display: "inline-block" }} />
        {l}
      </span>
    ))}
  </div>
);
