import { useState } from "react";
import { AdminLayout } from "../../components/admin.jsx";
import { LineChart, BarChart, DonutChart, ChartCard, MultiLineChart } from "../../components/charts.jsx";
import { useBookings, fmtVND, getBuildings } from "../../data/booking.js";
import { computeKPIs, seriesFor, TREND_YEARS } from "../../data/adminData.js";

// compact KPI tile with optional trend delta
const Kpi = ({ label, value, delta, deltaColor, icon, accent }) => (
  <div style={{ background: "#FFF", border: "1px solid var(--border)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)" }}>{label}</span>
      <span style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: accent.bg, color: accent.color, fontSize: 14 }}>{icon}</span>
    </div>
    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>{value}</span>
    {delta && <span style={{ fontFamily: "Inter", fontSize: 11, color: deltaColor || "var(--text-3)" }}>{delta}</span>}
  </div>
);

const QA_FORMS = {
  "Create Booking":      [["Member", "text"], ["Space", "text"], ["Date", "date"]],
  "Add Member":          [["Full name", "text"], ["Email", "text"], ["Plan", "text"]],
  "Issue Invoice":       [["Member", "text"], ["Amount (₫)", "number"], ["Due date", "date"]],
  "Block Room":          [["Room", "text"], ["From", "date"], ["To", "date"]],
  "Create Announcement": [["Title", "text"], ["Message", "textarea"]],
};

export default function AdminDashboard() {
  const bookings = useBookings();
  const buildings = getBuildings();
  const [location, setLocation] = useState("All");
  const k = computeKPIs(bookings, location);
  const [year, setYear] = useState(TREND_YEARS[TREND_YEARS.length - 1]);
  const [action, setAction] = useState(null);
  const [done, setDone] = useState(false);
  const s = seriesFor(year);

  // grouped KPIs: revenue/occupancy first, then membership/activity, then attention
  const kpis = [
    { label: "Today's Revenue",  value: fmtVND(k.todaysRevenue), delta: "settled payments today", icon: "₫", accent: { bg: "rgba(168,143,92,0.12)", color: "var(--gold)" } },
    { label: "Monthly Revenue",  value: fmtVND(k.monthlyRevenue), delta: "▲ 8% vs last month", deltaColor: "var(--success)", icon: "◈", accent: { bg: "rgba(168,143,92,0.12)", color: "var(--gold)" } },
    { label: "Occupancy Rate",   value: k.occupancyRate + "%", delta: "▲ 5 pts", deltaColor: "var(--success)", icon: "◉", accent: { bg: "rgba(61,74,46,0.10)", color: "var(--olive)" } },
    { label: "Meeting Room Util.", value: k.meetingUtilisation + "%", delta: `${k.meetingRoomCount} rooms · booked-days ÷ capacity`, icon: "▦", accent: { bg: "rgba(61,74,46,0.10)", color: "var(--olive)" } },
    { label: "Active Members",   value: k.activeMembers, delta: "▲ 3 this month", deltaColor: "var(--success)", icon: "◍", accent: { bg: "rgba(37,99,235,0.10)", color: "#2563EB" } },
    { label: "New Bookings",     value: k.newBookings, delta: "via member portal", icon: "＋", accent: { bg: "rgba(37,99,235,0.10)", color: "#2563EB" } },
    { label: "Pending Enquiries", value: k.pendingEnquiries, delta: "awaiting follow-up", deltaColor: "var(--warning)", icon: "✉", accent: { bg: "rgba(181,134,42,0.12)", color: "var(--warning)" } },
    { label: "Open Support Tickets", value: k.openTickets, delta: k.openTickets ? "needs attention" : "all clear", deltaColor: k.openTickets ? "var(--danger)" : "var(--success)", icon: "◌", accent: { bg: "rgba(192,57,43,0.10)", color: "var(--danger)" } },
  ];

  return (
    <AdminLayout>
      {/* header with location filter + year selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-3)" }}>Operations overview · {location === "All" ? "all HiLink locations" : location}</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: "8px 12px", border: "1px solid var(--border)", background: "#FFF", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }}>
            <option value="All">All locations</option>
            {buildings.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>
          <div style={{ display: "flex", border: "1px solid var(--border)", background: "#FFF" }}>
            {TREND_YEARS.map((yr) => (
              <button key={yr} onClick={() => setYear(yr)} style={{ padding: "8px 18px", background: year === yr ? "var(--olive)" : "transparent", color: year === yr ? "#FFF" : "var(--text-3)", border: "none", cursor: "pointer", fontFamily: "Inter", fontSize: 13, fontWeight: year === yr ? 600 : 400 }}>{yr}</button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 22 }}>
        {kpis.map((p) => <Kpi key={p.label} {...p} />)}
      </div>

      {/* primary charts: revenue + occupancy span the row (12 months) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 16, marginBottom: 16 }}>
        <ChartCard title={`Revenue Trend · ${year} (₫M)`}><LineChart data={s.revenue} color="var(--gold)" fill="rgba(168,143,92,0.12)" fmt={(n) => "₫" + n + "M"} /></ChartCard>
        <ChartCard title={`Occupancy Trend · ${year} (%)`}><LineChart data={s.occupancy} color="var(--olive)" fmt={(n) => n + "%"} /></ChartCard>
      </div>

      {/* secondary charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, marginBottom: 24 }}>
        <ChartCard title={`Membership Growth · ${year}`}><BarChart data={s.membership} color="var(--success)" /></ChartCard>
        <ChartCard title={`Location Performance · ${year} (₫M)`}><MultiLineChart series={s.location} fmt={(n) => "₫" + n + "M"} /></ChartCard>
        <ChartCard title="Booking Sources"><DonutChart data={k.bookingSources} /></ChartCard>
      </div>

      {/* quick actions */}
      <div style={{ background: "#FFF", border: "1px solid var(--border)", padding: "18px 20px" }}>
        <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Quick actions</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.keys(QA_FORMS).map((a) => (
            <button key={a} onClick={() => { setAction(a); setDone(false); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "var(--bg)", border: "1px solid var(--border)", cursor: "pointer", fontFamily: "Inter", fontSize: 13, fontWeight: 500, color: "var(--text)" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--olive)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
              <span style={{ color: "var(--olive)", fontSize: 15 }}>＋</span>{a}
            </button>
          ))}
        </div>
      </div>

      {action && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setAction(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFF", border: "1px solid var(--border)", padding: 28, maxWidth: 420, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{action}</h2>
              <button onClick={() => setAction(null)} style={{ background: "none", border: "none", fontSize: 22, color: "var(--text-3)", cursor: "pointer" }}>×</button>
            </div>
            {done ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(45,106,79,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--success)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p style={{ fontFamily: "Inter", fontSize: 14, color: "var(--text)" }}>{action} — saved</p>
                <button onClick={() => setAction(null)} style={{ marginTop: 16, background: "var(--olive)", color: "#FFF", border: "none", padding: "9px 20px", cursor: "pointer", fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}>Done</button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {QA_FORMS[action].map(([label, type]) => (
                  <div key={label}>
                    <label style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", display: "block", marginBottom: 5 }}>{label}</label>
                    {type === "textarea"
                      ? <textarea rows={3} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", fontFamily: "Inter", fontSize: 13, color: "var(--text)", resize: "vertical" }} />
                      : <input type={type} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }} />}
                  </div>
                ))}
                <button onClick={() => setDone(true)} style={{ marginTop: 4, background: "var(--olive)", color: "#FFF", border: "none", padding: "11px", cursor: "pointer", fontFamily: "Inter", fontSize: 14, fontWeight: 600 }}>{action}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
