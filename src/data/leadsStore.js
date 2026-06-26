// Lightweight reactive leads store (localStorage-backed) shared by the public
// enquiry surfaces (space detail + Find my space) and the admin pipeline.
// Self-contained on purpose — importing this from the public bundle must NOT
// pull in the rest of adminData.
import { useSyncExternalStore } from "react";

const SEED_LEADS = [
  { id: "L-501", name: "Phạm Quang", company: "BlueOcean",     email: "quang@blueocean.vn", phone: "", source: "Website form", interest: "Private Office (6 pax)",     stage: "New",        date: "2026-06-14", note: "" },
  { id: "L-502", name: "Mai Linh",   company: "Linh & Co",     email: "mai@linhco.vn",      phone: "", source: "Referral",     interest: "Dedicated Desk x3",        stage: "Contacted",  date: "2026-06-12", note: "" },
  { id: "L-503", name: "John Park",  company: "Seoul Tech",    email: "john@seoultech.kr",  phone: "", source: "Google Ads",   interest: "Meeting Room (recurring)", stage: "Tour booked", date: "2026-06-10", note: "" },
  { id: "L-504", name: "Vũ Hằng",    company: "Hằng Studio",   email: "hang@studio.vn",     phone: "", source: "Website form", interest: "Hot Desk",                 stage: "Proposal",   date: "2026-06-08", note: "" },
  { id: "L-505", name: "Acme Ltd",   company: "Acme",          email: "ops@acme.com",       phone: "", source: "Walk-in",      interest: "Event Space",              stage: "Won",        date: "2026-06-05", note: "" },
  { id: "L-506", name: "Trần Bảo",   company: "Bảo Logistics", email: "bao@logi.vn",        phone: "", source: "Website form", interest: "Private Office (4 pax)",    stage: "Lost",       date: "2026-06-02", note: "" },
];

const KEY = "hilink_leads_v1";
let _leads = null;
const subs = new Set();

const load = () => {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch { /* ignore */ }
  return SEED_LEADS.map((l) => ({ ...l }));
};
const ensure = () => { if (!_leads) _leads = load(); return _leads; };
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(_leads)); } catch { /* quota */ } };
const emit = () => { persist(); subs.forEach((f) => f()); };

export const listLeads = () => ensure();

export const addLead = (p = {}) => {
  ensure();
  const lead = {
    id: "L-" + Date.now().toString().slice(-7),
    name: p.name || "Website visitor",
    company: p.company || "—",
    email: p.email || "",
    phone: p.phone || "",
    source: p.source || "Website form",
    interest: p.interest || "General enquiry",
    stage: "New",
    date: new Date().toISOString().slice(0, 10),
    note: p.note || "",
  };
  _leads = [lead, ..._leads];
  emit();
  return lead;
};

export const updateLeadStage = (id, stage) => {
  ensure();
  _leads = _leads.map((l) => (l.id === id ? { ...l, stage } : l));
  emit();
};

const subscribe = (cb) => { subs.add(cb); ensure(); return () => subs.delete(cb); };
export const useLeads = () => useSyncExternalStore(subscribe, listLeads, listLeads);
