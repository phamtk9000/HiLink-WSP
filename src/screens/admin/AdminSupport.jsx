import { useState } from "react";
import { AdminLayout } from "../../components/admin.jsx";
import { Avatar } from "../../components/index.jsx";
import { PageHead, Pill, tone } from "../../components/adminUI.jsx";
import { SUPPORT_CHATS } from "../../data/adminData.js";

const statusTone = { Waiting: tone.red, Open: tone.green, Bot: tone.grey };

export default function AdminSupport() {
  const [chats, setChats] = useState(() => SUPPORT_CHATS.map((c) => ({ ...c, messages: [...c.messages] })));
  const [activeId, setActiveId] = useState(chats[0]?.id);
  const [draft, setDraft] = useState("");
  const active = chats.find((c) => c.id === activeId);
  const waiting = chats.filter((c) => c.status === "Waiting").length;

  const send = () => {
    if (!draft.trim() || !active) return;
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setChats((cs) => cs.map((c) => c.id === activeId ? { ...c, status: "Open", unread: 0, updated: time, messages: [...c.messages, { from: "agent", text: draft.trim(), time }] } : c));
    setDraft("");
  };

  return (
    <AdminLayout>
      <PageHead title="Support" sub={`Live chat · ${waiting} conversation${waiting !== 1 ? "s" : ""} waiting for a human agent`} />

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 0, border: "1px solid var(--border)", background: "#FFF", height: 560, overflow: "hidden" }}>
        {/* conversation list */}
        <div style={{ borderRight: "1px solid var(--border)", overflowY: "auto" }}>
          {chats.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 14px", background: c.id === activeId ? "rgba(61,74,46,0.06)" : "#FFF", border: "none", borderBottom: "1px solid var(--border)", borderLeft: `3px solid ${c.id === activeId ? "var(--olive)" : "transparent"}`, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initials={c.initials} size={32} gold />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{c.member}</span>
                    <span style={{ fontFamily: "Inter", fontSize: 10, color: "var(--text-3)" }}>{c.updated}</span>
                  </div>
                  <p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "2px 0" }}>{c.messages[c.messages.length - 1]?.text}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Pill label={c.status} {...(statusTone[c.status] || tone.grey)} />
                    {c.unread > 0 && <span style={{ background: "var(--danger)", color: "#FFF", fontFamily: "Inter", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 7px" }}>{c.unread}</span>}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* thread */}
        {active ? (
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar initials={active.initials} size={34} gold />
              <div><p style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{active.member}</p><p style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-3)" }}>{active.company}</p></div>
              <span style={{ marginLeft: "auto" }}><Pill label={active.status} {...(statusTone[active.status] || tone.grey)} /></span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10, background: "var(--bg)" }}>
              {active.messages.map((m, i) => {
                const mine = m.from === "agent";
                const bot = m.from === "bot";
                return (
                  <div key={i} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                    <div style={{ background: mine ? "var(--olive)" : bot ? "rgba(15,15,15,0.05)" : "#FFF", color: mine ? "#FFF" : "var(--text)", border: mine ? "none" : "1px solid var(--border)", padding: "9px 13px", fontFamily: "Inter", fontSize: 13 }}>
                      {bot && <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", display: "block", marginBottom: 2 }}>HiBot</span>}
                      {m.text}
                    </div>
                    <p style={{ fontFamily: "Inter", fontSize: 10, color: "var(--text-3)", marginTop: 2, textAlign: mine ? "right" : "left" }}>{m.time}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", padding: 12, display: "flex", gap: 8 }}>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a reply as agent…" style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--border)", fontFamily: "Inter", fontSize: 13, color: "var(--text)" }} />
              <button onClick={send} style={{ background: "var(--olive)", color: "#FFF", border: "none", padding: "0 20px", cursor: "pointer", fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}>Send</button>
            </div>
          </div>
        ) : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", fontFamily: "Inter" }}>Select a conversation</div>}
      </div>
    </AdminLayout>
  );
}
