// ─────────────────────────────────────────────────────────────────────────────
//  Admin/operations mock data + derivations. Static collections for CRM, support,
//  visitors, documents, leads, equipment; dashboard series; and KPI helpers that
//  derive live numbers from the booking store. Swap arrays for API calls later.
// ─────────────────────────────────────────────────────────────────────────────
import { fmtVND } from "./booking.js";
import { listLeads } from "./leadsStore.js";

export const PLANS = ["Hot Desk", "Dedicated Desk", "Private Office", "Virtual Office"];

export const MEMBERS = [
  { id: "M-1001", name: "Thành Nguyễn",  company: "NovaTech",      email: "thanh.nguyen@novatech.vn", phone: "+84 90 111 2233", plan: "Private Office", since: "2024-03-01", status: "Active",   initials: "TN", notes: "Prefers Floor 1 corner office. Invoices to finance@novatech.vn.", prefs: ["Quiet zone", "Standing desk"] },
  { id: "M-1002", name: "Kim Hoa",       company: "FinBridge",     email: "kim.hoa@finbridge.vn",     phone: "+84 91 222 3344", plan: "Dedicated Desk", since: "2024-06-12", status: "Active",   initials: "KH", notes: "", prefs: ["Window seat"] },
  { id: "M-1003", name: "Ana Trần",      company: "Studio LFA",    email: "ana.tran@studiolfa.com",   phone: "+84 93 333 4455", plan: "Hot Desk",       since: "2025-01-08", status: "Active",   initials: "AT", notes: "Design studio, often books meeting rooms on Fridays.", prefs: ["Near printer"] },
  { id: "M-1004", name: "Karen Fennel",  company: "APAC Group",    email: "karen.f@apacgroup.com",    phone: "+84 94 444 5566", plan: "Private Office", since: "2023-11-20", status: "Active",   initials: "KF", notes: "Anchor tenant — full floor renewal due Q3.", prefs: ["Reception greeting"] },
  { id: "M-1005", name: "Jack Reed",     company: "Freelance",     email: "jack.reed@gmail.com",      phone: "+84 96 555 6677", plan: "Hot Desk",       since: "2025-02-14", status: "Paused",   initials: "JR", notes: "Travelling Q2, paused membership.", prefs: [] },
  { id: "M-1006", name: "Lê Thu Hà",     company: "Self-employed", email: "ha.le@gmail.com",          phone: "+84 97 666 7788", plan: "Virtual Office", since: "2024-09-02", status: "Active",   initials: "LH", notes: "", prefs: ["Mail forwarding weekly"] },
  { id: "M-1007", name: "Đặng Minh",     company: "MD Ventures",   email: "minh.dang@gmail.com",      phone: "+84 98 777 8899", plan: "Dedicated Desk", since: "2025-03-30", status: "Active",   initials: "ĐM", notes: "", prefs: [] },
  { id: "M-1008", name: "Sarah Chen",    company: "APAC Mobility", email: "sarah.chen@apac.com",      phone: "+84 99 888 9900", plan: "Private Office", since: "2024-12-01", status: "Pending",  initials: "SC", notes: "Onboarding in progress, deposit pending.", prefs: ["Parking x2"] },
];
// membership rank + editable preference note (normalised once)
const RANK_BY_PLAN = { "Private Office": "Platinum", "Dedicated Desk": "Gold", "Hot Desk": "Silver", "Virtual Office": "Bronze" };
MEMBERS.forEach((m) => { m.rank = m.rank || RANK_BY_PLAN[m.plan] || "Silver"; m.prefNote = m.prefNote || (m.prefs || []).join(", "); });
export const RANKS = ["Bronze", "Silver", "Gold", "Platinum"];

// ── Live support chats (handover from the automated bot to a human agent) ─────
export const SUPPORT_CHATS = [
  { id: "C-01", member: "Kim Hoa", company: "FinBridge", initials: "KH", status: "Waiting", unread: 2, updated: "10:42",
    messages: [
      { from: "bot", text: "Hi! I'm HiBot 🤖 How can I help?", time: "10:38" },
      { from: "client", text: "The WiFi in Phòng 102 keeps dropping.", time: "10:39" },
      { from: "bot", text: "I couldn't resolve this automatically — connecting you to our team.", time: "10:40" },
      { from: "client", text: "Thanks, it's quite urgent, we have a call at 11.", time: "10:42" },
    ] },
  { id: "C-02", member: "Ana Trần", company: "Studio LFA", initials: "AT", status: "Open", unread: 0, updated: "09:15",
    messages: [
      { from: "client", text: "Can I extend my meeting room booking by 1 hour?", time: "09:10" },
      { from: "agent", text: "Sure Ana — I've extended Phòng 103 until 12:00. Anything else?", time: "09:14" },
      { from: "client", text: "Perfect, thank you!", time: "09:15" },
    ] },
  { id: "C-03", member: "Đặng Minh", company: "MD Ventures", initials: "ĐM", status: "Bot", unread: 0, updated: "Yesterday",
    messages: [
      { from: "client", text: "What time does the lounge close?", time: "Yesterday" },
      { from: "bot", text: "Our lounges are open 24/7 for members 🌙. Resolved automatically.", time: "Yesterday" },
    ] },
  { id: "C-04", member: "Sarah Chen", company: "APAC Mobility", initials: "SC", status: "Waiting", unread: 1, updated: "08:50",
    messages: [
      { from: "client", text: "My access card isn't working at the 2nd floor door.", time: "08:48" },
      { from: "bot", text: "Escalating to the front desk team now.", time: "08:50" },
    ] },
];

// Leads now live in a reactive store so public enquiries flow into the pipeline.
export { listLeads, useLeads, addLead, updateLeadStage } from "./leadsStore.js";
export const LEAD_STAGES = ["New", "Contacted", "Tour booked", "Proposal", "Won", "Lost"];

export const TICKET_CATEGORIES = ["Internet", "Cleaning", "Air Conditioning", "Access Card", "Furniture", "General"];
export const TICKET_STATES = ["New", "Assigned", "In Progress", "Resolved", "Closed"];
export const STAFF = ["Lan (Facilities)", "Minh (IT)", "Hoa (Front desk)", "Tuấn (Maintenance)"];
export const TICKETS = [
  { id: "T-9001", title: "WiFi dropping in Phòng 102", category: "Internet",         member: "Kim Hoa",      space: "Phòng 102", priority: "High",   status: "In Progress", assignee: "Minh (IT)",        created: "2026-06-15", notes: "Router reset; monitoring." },
  { id: "T-9002", title: "AC too cold on Floor 2",      category: "Air Conditioning", member: "Karen Fennel", space: "Tầng 2",    priority: "Medium", status: "Assigned",    assignee: "Tuấn (Maintenance)", created: "2026-06-15", notes: "" },
  { id: "T-9003", title: "Replace broken chair",        category: "Furniture",        member: "Ana Trần",     space: "Bàn 12",    priority: "Low",    status: "New",         assignee: "",                 created: "2026-06-14", notes: "" },
  { id: "T-9004", title: "Access card not working",     category: "Access Card",      member: "Đặng Minh",    space: "Lobby",     priority: "High",   status: "Resolved",    assignee: "Hoa (Front desk)", created: "2026-06-13", notes: "Re-encoded card; confirmed working." },
  { id: "T-9005", title: "Meeting room needs cleaning", category: "Cleaning",         member: "Thành Nguyễn", space: "Phòng 103", priority: "Medium", status: "Closed",      assignee: "Lan (Facilities)", created: "2026-06-11", notes: "Done." },
];

export const VISITORS = [
  { id: "V-301", guest: "David Lim",    host: "Thành Nguyễn",  arrival: "2026-06-16 09:30", status: "Checked in",  method: "QR code",   company: "Lim Partners" },
  { id: "V-302", guest: "Ngọc Anh",     host: "Karen Fennel",  arrival: "2026-06-16 11:00", status: "Expected",    method: "Reception", company: "VN Capital" },
  { id: "V-303", guest: "Robert Tan",   host: "Kim Hoa",       arrival: "2026-06-15 14:15", status: "Checked out", method: "QR code",   company: "Tan & Co" },
  { id: "V-304", guest: "Lê Hồng",      host: "Ana Trần",      arrival: "2026-06-15 10:00", status: "Checked out", method: "Reception", company: "Freelance" },
];

export const DOCUMENTS = [
  { id: "D-01", name: "NovaTech — Office Lease Agreement", type: "Contract",            member: "Thành Nguyễn", version: "v3", date: "2024-03-01", size: "412 KB" },
  { id: "D-02", name: "APAC Group — Membership Agreement", type: "Membership Agreement", member: "Karen Fennel", version: "v2", date: "2023-11-20", size: "188 KB" },
  { id: "D-03", name: "Invoice MMT01001",                   type: "Invoice",             member: "Thành Nguyễn", version: "v1", date: "2026-06-01", size: "96 KB" },
  { id: "D-04", name: "Fire Safety Compliance Certificate", type: "Compliance",          member: "—",            version: "v1", date: "2026-01-15", size: "1.2 MB" },
  { id: "D-05", name: "FinBridge — Desk Agreement",         type: "Membership Agreement", version: "v1", member: "Kim Hoa", date: "2024-06-12", size: "150 KB" },
];

export const EQUIPMENT = [
  { id: "E-1", room: "Phòng 103", item: "85\" 4K TV",            status: "Operational" },
  { id: "E-2", room: "Phòng 103", item: "Conference speaker",    status: "Operational" },
  { id: "E-3", room: "Phòng 203", item: "Projector",             status: "Maintenance" },
  { id: "E-4", room: "Phòng 203", item: "Whiteboard",            status: "Operational" },
  { id: "E-5", room: "Phòng 303", item: "Video conf. camera",    status: "Operational" },
];

// ── Dashboard series — 12 months, multiple years, deterministic (illustrative) ──
export const TREND_YEARS = [2024, 2025, 2026];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// stable pseudo-random in [0,1) from a seed + index
const wig = (seed, i) => { const x = Math.sin(seed * 12.9898 + i * 4.1357) * 43758.5453; return x - Math.floor(x); };
const mkSeries = (seed, base, growth, season, noise, clamp) => MONTHS.map((m, i) => {
  let v = base + growth * i + season * Math.sin((i / 12) * Math.PI * 2) + (wig(seed, i) - 0.5) * noise;
  if (clamp) v = Math.max(clamp[0], Math.min(clamp[1], v));
  return { label: m, value: Math.round(v) };
});

// returns the four 12-month datasets for a given year
export const seriesFor = (year) => {
  const k = Math.max(0, TREND_YEARS.indexOf(year)); // 0,1,2
  return {
    revenue:    mkSeries(year + 1, 150 + k * 55, 6.0, 12, 16),
    occupancy:  mkSeries(year + 2, 56 + k * 8, 1.0, 4, 5, [0, 100]),
    membership: mkSeries(year + 3, 108 + k * 38, 3.0, 0, 4),
    location: [
      { name: "OBC 60 Lý Thái Tổ", color: "var(--olive)", data: mkSeries(year + 4, 82 + k * 30, 3.6, 7, 9) },
      { name: "HiLink 15 Tôn Thất Tùng", color: "var(--gold)",  data: mkSeries(year + 5, 66 + k * 25, 3.0, 6, 9) },
    ],
  };
};
export const BOOKING_SOURCES = [
  { label: "Member portal", value: 46 },
  { label: "Walk-in",       value: 18 },
  { label: "Website",       value: 22 },
  { label: "Partner",       value: 14 },
];

// ── KPI derivations from the live booking store ─────────────────────────────
// Scoped by location ("All" or a building name). Revenue/occupancy/utilisation
// are derived from the booking store; sources come from each booking's `source`.
import { getBuildings } from "./booking.js";

const DAYS_IN_MONTH = 30, HRS_PER_DAY = 10;
const overlapsToday = (b, today) => b.start <= today && b.end >= today;

export const computeKPIs = (bookings, location = "All") => {
  const today = new Date().toISOString().slice(0, 10);
  const buildings = getBuildings().filter((b) => location === "All" || b.name === location);
  const inScope = (b) => location === "All" || b.buildingName === location;
  const active = bookings.filter((b) => b.status !== "cancelled" && inScope(b));

  const units = buildings.flatMap((b) => b.floors.flatMap((f) => [...f.plan.rooms, ...(f.plan.seats || [])]));
  const meetingRooms = units.filter((u) => u.kind === "Meeting Room");

  const monthlyRevenue = active.reduce((a, b) => a + (b.pricing?.total || 0), 0);
  const todaysRevenue = active.flatMap((b) => b.payments || []).filter((p) => p.date === today).reduce((a, p) => a + p.amount, 0);

  const occupiedUnits = units.filter((u) => active.some((b) => b.unitId === u.id && overlapsToday(b, today))).length;
  const occupancyRate = units.length ? Math.round((occupiedUnits / units.length) * 100) : 0;

  // meeting-room utilisation = booked room-days this month ÷ (rooms × days)
  const mrIds = new Set(meetingRooms.map((m) => m.id));
  const bookedRoomDays = active.filter((b) => mrIds.has(b.unitId)).reduce((a, b) => {
    const s = new Date(b.start), e = new Date(b.end);
    return a + Math.min(DAYS_IN_MONTH, Math.max(1, Math.round((e - s) / 86400000) + 1));
  }, 0);
  const meetingUtilisation = meetingRooms.length ? Math.min(100, Math.round((bookedRoomDays / (meetingRooms.length * DAYS_IN_MONTH)) * 100)) : 0;

  const sourceCounts = {};
  active.forEach((b) => { const s = b.source || "Member portal"; sourceCounts[s] = (sourceCounts[s] || 0) + 1; });
  const bookingSources = Object.entries(sourceCounts).map(([label, value]) => ({ label, value }));

  return {
    todaysRevenue, monthlyRevenue, occupancyRate,
    activeMembers: MEMBERS.filter((m) => m.status === "Active").length,
    meetingUtilisation,
    newBookings: active.filter((b) => (b.source || "") === "Member portal").length,
    pendingEnquiries: listLeads().filter((l) => l.stage === "New" || l.stage === "Contacted").length,
    openTickets: TICKETS.filter((t) => t.status !== "Resolved" && t.status !== "Closed").length,
    bookingSources: bookingSources.length ? bookingSources : BOOKING_SOURCES,
    meetingRoomCount: meetingRooms.length,
  };
};

export const fmtM = (n) => "₫" + n + "M";
export { fmtVND };
