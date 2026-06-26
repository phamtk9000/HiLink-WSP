import { useMemo, useState } from "react";
import { AdminLayout } from "../../components/admin.jsx";
import { BarChart, DonutChart, ChartCard } from "../../components/charts.jsx";
import { PageHead, Modal, Field, INP, BtnPrimary, Pill, tone } from "../../components/adminUI.jsx";
import { LEAD_STAGES } from "../../data/adminData.js";
import { useLeads, updateLeadStage } from "../../data/leadsStore.js";

const STAGE_TONE = { New: tone.blue, Contacted: tone.amber, "Tour booked": tone.olive, Proposal: tone.amber, Won: tone.green, Lost: tone.red };
const SOURCE_TONE = { "Website form": tone.blue, Referral: tone.green, "Google Ads": tone.amber, "Walk-in": tone.olive, "Find my space": tone.olive, Enquiry: tone.blue };

export default function AdminLeads() {
  const leads = useLeads();
  const [open, setOpen] = useState(null);
  const [drag, setDrag] = useState(null);

  const move = (id, stage) => updateLeadStage(id, stage);

  const insights = useMemo(() => {
    const total = leads.length;
    const won = leads.filter((l) => l.stage === "Won").length;
    const lost = leads.filter((l) => l.stage === "Lost").length;
    const active = total - won - lost;
    const winRate = won + lost ? Math.round((won / (won + lost)) * 100) : 0;
    const byStage = LEAD_STAGES.map((s) => ({ label: s.split(" ")[0], value: leads.filter((l) => l.stage === s).length }));
    const sources = [...new Set(leads.map((l) => l.source))];
    const bySource = sources.map((s) => ({ label: s, value: leads.filter((l) => l.source === s).length }));
    const winBySource = sources.map((s) => {
      const w = leads.filter((l) => l.source === s && l.stage === "Won").length;
      const closed = leads.filter((l) => l.source === s && (l.stage === "Won" || l.stage === "Lost")).length;
      return { label: s.split(" ")[0], value: closed ? Math.round((w / closed) * 100) : 0 };
    });
    return { total, won, active, winRate, byStage, bySource, winBySource };
  }, [leads]);

  const kpis = [
    ["Total leads", insights.total, "var(--text-2)"],
    ["In pipeline", insights.active, "var(--olive)"],
    ["Won", insights.won, "var(--success)"],
    ["Win rate", insights.winRate + "%", insights.winRate >= 50 ? "var(--success)" : "var(--warning)"],
  ];

  return (
    <AdminLayout>
      <PageHead title="Marketing & Leads" sub="Website enquiries & outreach — pipeline and conversion insight" />

      {/* insight KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
        {kpis.map(([l, v, col]) => (
          <div key={l} style={{ background: "#FFF", border: "1px solid var(--border)", padding: "16px 18px" }}>
            <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</p>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: col }}>{v}</p>
          </div>
        ))}
      </div>

      {/* insight charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, marginBottom: 22 }}>
        <ChartCard title="Pipeline funnel (by stage)"><BarChart data={insights.byStage} color="var(--olive)" /></ChartCard>
        <ChartCard title="Leads by source"><DonutChart data={insights.bySource} size={150} /></ChartCard>
        <ChartCard title="Win rate by source (%)"><BarChart data={insights.winBySource} color="var(--success)" /></ChartCard>
      </div>

      {/* pipeline kanban */}
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>Pipeline</p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${LEAD_STAGES.length}, minmax(180px, 1fr))`, gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {LEAD_STAGES.map((stage) => {
          const col = leads.filter((l) => l.stage === stage);
          return (
            <div key={stage} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag) { move(drag, stage); setDrag(null); } }}
              style={{ background: "rgba(15,15,15,0.02)", border: "1px solid var(--border)", minHeight: 160, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "9px 12px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 700, color: "var(--text-2)" }}>{stage}</span>
                <span style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", background: "#FFF", border: "1px solid var(--border)", padding: "1px 7px" }}>{col.length}</span>
              </div>
              <div style={{ padding: 8, display: "grid", gap: 8 }}>
                {col.map((l) => (
                  <div key={l.id} draggable onDragStart={() => setDrag(l.id)} onDragEnd={() => setDrag(null)} onClick={() => setOpen(l)}
                    style={{ background: "#FFF", border: "1px solid var(--border)", padding: "10px 12px", cursor: "grab", opacity: drag === l.id ? 0.4 : 1 }}>
                    <p style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{l.name}</p>
                    <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", marginBottom: 7 }}>{l.company}</p>
                    <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-2)", marginBottom: 7 }}>{l.interest}</p>
                    <Pill label={l.source} {...(SOURCE_TONE[l.source] || tone.grey)} />
                  </div>
                ))}
                {!col.length && <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", padding: "8px 4px" }}>Drag leads here</p>}
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", marginTop: 10 }}>Drag a card between columns to move it through the pipeline — insights update live.</p>

      {open && (
        <Modal title={open.name} onClose={() => setOpen(null)}>
          <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-2)", marginBottom: 4 }}>{open.company}</p>
          <p style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>{[open.email, open.phone].filter(Boolean).join(" · ")} · enquired {open.date}</p>
          <div style={{ display: "grid", gap: 12 }}>
            <Field label="Interest"><p style={{ fontFamily: "Inter", fontSize: 14, color: "var(--text)" }}>{open.interest}</p></Field>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><Field label="Source"><Pill label={open.source} {...(SOURCE_TONE[open.source] || tone.grey)} /></Field></div>
              <div style={{ flex: 1 }}><Field label="Stage"><select value={open.stage} onChange={(e) => { move(open.id, e.target.value); setOpen({ ...open, stage: e.target.value }); }} style={INP}>{LEAD_STAGES.map((s) => <option key={s}>{s}</option>)}</select></Field></div>
            </div>
            <BtnPrimary full onClick={() => setOpen(null)}>Save</BtnPrimary>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
