// Lightweight hand-rolled SVG charts — no external deps, themed via CSS vars.
// Responsive (scale to container via viewBox) and interactive: hovering a point
// or bar reveals a tooltip with the exact value.
import { useState } from "react";

const niceMax = (v) => {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / pow) * pow;
};

// SVG tooltip drawn inside the chart so it scales with the viewBox
function Tip({ x, yTop, W, title, rows }) {
  const lines = [title, ...rows.map((r) => r.text)];
  const tw = Math.max(58, ...lines.map((l) => l.length * 6.4)) + 16;
  const th = 16 + lines.length * 14;
  let tx = x - tw / 2;
  tx = Math.max(2, Math.min(W - tw - 2, tx));
  const ty = Math.max(2, yTop - th - 10);
  return (
    <g pointerEvents="none">
      <rect x={tx} y={ty} width={tw} height={th} rx={5} fill="#1C1710" opacity="0.94" />
      <text x={tx + 9} y={ty + 15} fontFamily="Inter" fontSize={10.5} fontWeight="700" fill="#FFF">{title}</text>
      {rows.map((r, i) => (
        <g key={i}>
          {r.color && <rect x={tx + 9} y={ty + 22 + i * 14} width={7} height={7} rx={1.5} fill={r.color} />}
          <text x={tx + (r.color ? 21 : 9)} y={ty + 28 + i * 14} fontFamily="Inter" fontSize={10.5} fill="rgba(255,255,255,0.92)">{r.text}</text>
        </g>
      ))}
    </g>
  );
}

// ── Line / area chart ─────────────────────────────────────────────────────────
export function LineChart({ data, height = 200, color = "var(--olive)", fill = "rgba(61,74,46,0.10)", fmt = (n) => n }) {
  const [hi, setHi] = useState(null);
  const W = 560, H = height, pad = { t: 16, r: 16, b: 26, l: 46 };
  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const x = (i) => pad.l + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v) => pad.t + ih - (v / max) * ih;
  const pts = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const area = `${pad.l},${pad.t + ih} ${pts} ${x(data.length - 1)},${pad.t + ih}`;
  const band = iw / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} onMouseLeave={() => setHi(null)}>
      {[0, 0.5, 1].map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih * g} y2={pad.t + ih * g} stroke="rgba(15,15,15,0.07)" />
          <text x={pad.l - 8} y={pad.t + ih * g + 4} textAnchor="end" fontFamily="Inter" fontSize={10} fill="var(--text-3)">{fmt(Math.round(max * (1 - g)))}</text>
        </g>
      ))}
      <polygon points={area} fill={fill} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {hi !== null && <line x1={x(hi)} x2={x(hi)} y1={pad.t} y2={pad.t + ih} stroke={color} strokeDasharray="3 3" opacity="0.5" />}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.value)} r={hi === i ? 4.5 : 2.6} fill={color} />
          <text x={x(i)} y={H - 8} textAnchor="middle" fontFamily="Inter" fontSize={10} fill="var(--text-3)">{d.label}</text>
        </g>
      ))}
      {data.map((d, i) => (
        <rect key={"h" + i} x={x(i) - band / 2} y={pad.t} width={band} height={ih} fill="transparent" onMouseEnter={() => setHi(i)} />
      ))}
      {hi !== null && <Tip x={x(hi)} yTop={y(data[hi].value)} W={W} title={data[hi].label} rows={[{ text: String(fmt(data[hi].value)) }]} />}
    </svg>
  );
}

// ── Multi-series line chart (e.g. location performance) ─────────────────────────
export function MultiLineChart({ series, height = 200, fmt = (n) => n }) {
  const [hi, setHi] = useState(null);
  const W = 560, H = height, pad = { t: 16, r: 16, b: 26, l: 46 };
  const labels = series[0]?.data.map((d) => d.label) || [];
  const max = niceMax(Math.max(1, ...series.flatMap((s) => s.data.map((d) => d.value))));
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const x = (i) => pad.l + (labels.length === 1 ? iw / 2 : (i / (labels.length - 1)) * iw);
  const y = (v) => pad.t + ih - (v / max) * ih;
  const band = iw / labels.length;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} onMouseLeave={() => setHi(null)}>
        {[0, 0.5, 1].map((g) => (
          <g key={g}>
            <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih * g} y2={pad.t + ih * g} stroke="rgba(15,15,15,0.07)" />
            <text x={pad.l - 8} y={pad.t + ih * g + 4} textAnchor="end" fontFamily="Inter" fontSize={10} fill="var(--text-3)">{fmt(Math.round(max * (1 - g)))}</text>
          </g>
        ))}
        {hi !== null && <line x1={x(hi)} x2={x(hi)} y1={pad.t} y2={pad.t + ih} stroke="var(--text-3)" strokeDasharray="3 3" opacity="0.5" />}
        {series.map((s) => (
          <polyline key={s.name} points={s.data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ")} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {labels.map((l, i) => <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontFamily="Inter" fontSize={10} fill="var(--text-3)">{l}</text>)}
        {series.map((s) => hi !== null && <circle key={s.name + "c"} cx={x(hi)} cy={y(s.data[hi].value)} r={4} fill={s.color} />)}
        {labels.map((l, i) => <rect key={"h" + i} x={x(i) - band / 2} y={pad.t} width={band} height={ih} fill="transparent" onMouseEnter={() => setHi(i)} />)}
        {hi !== null && <Tip x={x(hi)} yTop={Math.min(...series.map((s) => y(s.data[hi].value)))} W={W} title={labels[hi]} rows={series.map((s) => ({ color: s.color, text: `${s.name}: ${fmt(s.data[hi].value)}` }))} />}
      </svg>
      <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
        {series.map((s) => (
          <span key={s.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 11, color: "var(--text-2)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />{s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Bar chart (vertical) ────────────────────────────────────────────────────
export function BarChart({ data, height = 200, color = "var(--gold)", fmt = (n) => n }) {
  const [hi, setHi] = useState(null);
  const W = 560, H = height, pad = { t: 16, r: 16, b: 26, l: 46 };
  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const bw = iw / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} onMouseLeave={() => setHi(null)}>
      {[0, 0.5, 1].map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih * g} y2={pad.t + ih * g} stroke="rgba(15,15,15,0.07)" />
          <text x={pad.l - 8} y={pad.t + ih * g + 4} textAnchor="end" fontFamily="Inter" fontSize={10} fill="var(--text-3)">{fmt(Math.round(max * (1 - g)))}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const h = (d.value / max) * ih;
        return (
          <g key={i} onMouseEnter={() => setHi(i)}>
            <rect x={pad.l + i * bw} y={pad.t} width={bw} height={ih} fill="transparent" />
            <rect x={pad.l + i * bw + bw * 0.2} y={pad.t + ih - h} width={bw * 0.6} height={h} rx={2} fill={d.color || color} opacity={hi === null || hi === i ? 1 : 0.55} />
            <text x={pad.l + i * bw + bw / 2} y={H - 9} textAnchor="middle" fontFamily="Inter" fontSize={10} fill="var(--text-3)">{d.label}</text>
          </g>
        );
      })}
      {hi !== null && <Tip x={pad.l + hi * bw + bw / 2} yTop={pad.t + ih - (data[hi].value / max) * ih} W={W} title={data[hi].label} rows={[{ text: String(fmt(data[hi].value)) }]} />}
    </svg>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────
const PALETTE = ["var(--gold)", "var(--olive)", "var(--success)", "var(--warning)", "#2563EB", "var(--danger)"];
export function DonutChart({ data, size = 160 }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = size / 2, ir = r * 0.6;
  let acc = 0;
  const arc = (frac) => { const a = 2 * Math.PI * frac - Math.PI / 2; return [r + r * Math.cos(a), r + r * Math.sin(a)]; };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, flexShrink: 0 }}>
        {data.map((d, i) => {
          const f0 = acc / total, f1 = (acc + d.value) / total; acc += d.value;
          const [x0, y0] = arc(f0), [x1, y1] = arc(f1);
          const large = f1 - f0 > 0.5 ? 1 : 0;
          const color = d.color || PALETTE[i % PALETTE.length];
          return <path key={i} d={`M ${r} ${r} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={color}><title>{`${d.label}: ${d.value} (${Math.round((d.value / total) * 100)}%)`}</title></path>;
        })}
        <circle cx={r} cy={r} r={ir} fill="#FFF" />
      </svg>
      <div style={{ display: "grid", gap: 6 }}>
        {data.map((d, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontSize: 12, color: "var(--text-2)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color || PALETTE[i % PALETTE.length] }} />
            {d.label}<span style={{ color: "var(--text-3)" }}>· {Math.round((d.value / total) * 100)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function ChartCard({ title, children, right }) {
  return (
    <div style={{ background: "#FFF", border: "1px solid var(--border)", padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{title}</p>
        {right}
      </div>
      {children}
    </div>
  );
}
