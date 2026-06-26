// ─────────────────────────────────────────────────────────────────────────────
//  HiLink booking store
//  Frontend-only mock data layer for the booking + admin features. Shaped so the
//  helper functions below can later be swapped for real `fetch()` calls (e.g. into
//  PropFlow) without touching any screen. All money is in VND (integer dong).
// ─────────────────────────────────────────────────────────────────────────────

export const fmtVND = (n) => "₫" + Math.round(n || 0).toLocaleString("en-US");

// Deterministic 0..1 pseudo-random from a string — keeps seeded availability and
// bookings stable across reloads so the floor map and calendar always agree.
const rand = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 1000) / 1000;
};

// ── Catalogs ────────────────────────────────────────────────────────────────
export const ADDONS = [
  { id: "tea",      label: "Tea & coffee service", price: 150000 },
  { id: "av",       label: "AV / projector setup",  price: 300000 },
  { id: "catering", label: "Catering (per person)", price: 120000 },
  { id: "parking",  label: "Reserved parking",      price: 200000 },
];

export const PROMOS = [
  { code: "HILINK10",  label: "10% off",        type: "percent", value: 10 },
  { code: "WELCOME",   label: "₫500,000 off",   type: "fixed",   value: 500000 },
  { code: "FREEHOURS", label: "Free 20 hours",  type: "fixed",   value: 0 },
];

export const VAT_RATE = 0.10;

const TENANTS = [
  { name: "Thành Nguyễn", email: "thanh.nguyen@gmail.com",  initials: "TN" },
  { name: "Kim Hoa",      email: "kim.hoa@novatech.vn",     initials: "KH" },
  { name: "Ana Trần",     email: "ana.tran@studiolfa.com",  initials: "AT" },
  { name: "Karen Fennel", email: "karen.f@apacgroup.com",   initials: "KF" },
  { name: "Jack Reed",    email: "jack.reed@gmail.com",     initials: "JR" },
  { name: "Đặng Minh",    email: "minh.dang@gmail.com",     initials: "ĐM" },
  { name: "Jason Bourne", email: "jason.bourne@gmail.com",  initials: "JB" },
  { name: "Lê Thu Hà",    email: "ha.le@finbridge.vn",      initials: "LH" },
];

// ── Floor plan template (stylised SVG layout, viewBox 1000 x 640) ────────────
// Returns bookable rooms, individually-selectable seats, and non-interactive decor.
const planFor = (buildingId, idx) => {
  const base = idx * 100;                 // 100 / 200 / 300
  const p = (n) => `${buildingId}-f${idx}-${n}`;
  const seedKey = (n) => `${buildingId}${idx}${n}`;

  const rooms = [
    { id: p("r1"), label: `Phòng ${base + 1}`, kind: "Private Office", capacity: 6, x: 40,  y: 300, w: 210, h: 150, monthly: 45000000 },
    { id: p("r2"), label: `Phòng ${base + 2}`, kind: "Private Office", capacity: 4, x: 270, y: 300, w: 200, h: 150, monthly: 32000000 },
    { id: p("r3"), label: `Phòng ${base + 3}`, kind: "Meeting Room",   capacity: 8, x: 40,  y: 480, w: 320, h: 140, monthly: 0, hourly: 350000 },
    { id: p("r4"), label: `Phòng ${base + 4}`, kind: "Focus Cabin",    capacity: 2, x: 830, y: 60,  w: 140, h: 160, monthly: 0, hourly: 120000 },
  ];

  // Open flexible-desk zone (top-left): 12 hot desks in a 2×6 grid
  const openCols = [95, 160, 225, 290, 355, 420];
  const openRows = [110, 200];
  let seatN = 0;
  const seats = [];
  openRows.forEach((y) => openCols.forEach((x) => {
    seatN++;
    seats.push({ id: p(`d${seatN}`), label: `Bàn ${base + seatN}`, kind: "Hot Desk", zone: "open", x, y, daily: 650000, monthly: 8500000 });
  }));
  // Shared worktable (right): 6 dedicated desks around a long table
  const shCols = [610, 700, 790];
  const shRows = [460, 600];
  shRows.forEach((y) => shCols.forEach((x) => {
    seatN++;
    seats.push({ id: p(`d${seatN}`), label: `Bàn ${base + seatN}`, kind: "Dedicated Desk", zone: "shared", x, y, daily: 850000, monthly: 11000000 });
  }));

  // Seed a static availability state for seats so the live map looks realistic.
  seats.forEach((s) => {
    const r = rand(seedKey(s.id));
    s.baseStatus = r < 0.55 ? "available" : r < 0.72 ? "reserved" : "occupied";
  });

  const decor = [
    { kind: "zone",  x: 40,  y: 40,  w: 430, h: 220, label: "Khu bàn linh hoạt" },
    { kind: "zone",  x: 560, y: 400, w: 300, h: 200, label: "Bàn làm việc chung" },
    { kind: "zone",  x: 510, y: 50,  w: 300, h: 320, label: "Sảnh chờ" },
    { kind: "table", x: 600, y: 510, w: 200, h: 60 },
    { kind: "sofa",  x: 540, y: 90,  w: 110, h: 150 },
    { kind: "sofa",  x: 690, y: 90,  w: 100, h: 60  },
    { kind: "desk",  x: 70,  y: 330, w: 90,  h: 50  },
    { kind: "desk",  x: 300, y: 330, w: 90,  h: 50  },
    { kind: "rtable", cx: 130, cy: 555, r: 38 },
    { kind: "plant", x: 490, y: 600 },
    { kind: "plant", x: 980, y: 250 },
  ];

  return { viewBox: "0 0 1000 640", rooms, seats, decor };
};

// ── HiLink 15 Tôn Thất Tùng — real F15 floor plan (image + positioned hotspots) ───────
// xPct/yPct are the centre of each room as a % of the floor-plan image, so the
// interactive hotspots line up over the architectural drawing. Every "Hi" cabin
// is rented as an entire private room.
const CG_PHOTOS = [
  "/workspace-photos/DSC05749.jpg",
  "/workspace-photos/DSC05809.jpg",
  "/workspace-photos/235510ecf59fb755c102c0f4b2254ba63925f069-1800x1200.avif",
  "/workspace-photos/7f697d83c67bd824c915269932304e1e50668dd0-1800x1200.avif",
  "/workspace-photos/243c49f00a48d32d863d816c31aab29bdc8974cb-2048x1366.avif",
  "/workspace-photos/99afc4a54ee410cee61fa7b5043edb056288b1ed-2048x1366.avif",
];
const caugiayF15 = () => {
  const cabin = (n, xPct, yPct, capacity, monthly) => ({
    id: `caugiay-f15-hi${String(n).padStart(2, "0")}`, label: `Hi.${String(n).padStart(2, "0")}`,
    kind: "Private Office", capacity, monthly, photo: CG_PHOTOS[(n - 1) % CG_PHOTOS.length],
    xPct, yPct, entireRoom: true,
  });
  const rooms = [
    cabin(1, 19, 58, 10, 38000000), cabin(2, 19, 50, 8, 32000000), cabin(3, 21, 43, 6, 26000000),
    cabin(4, 22, 36, 8, 30000000), cabin(5, 23, 28, 4, 20000000),
    cabin(6, 35.5, 27, 6, 26000000), cabin(8, 44, 30, 4, 18000000), cabin(7, 49, 33, 4, 18000000),
    cabin(9, 57, 28, 4, 18000000), cabin(10, 60, 33, 6, 24000000), cabin(11, 72, 28, 8, 30000000), cabin(12, 84, 28, 10, 36000000),
    cabin(13, 85, 41, 6, 24000000), cabin(14, 85, 49.5, 4, 18000000), cabin(15, 85, 53.5, 3, 15000000),
    cabin(16, 85, 58, 3, 15000000), cabin(17, 84.5, 63, 4, 18000000), cabin(18, 83, 67.5, 5, 20000000),
    { id: "caugiay-f15-m4",  label: "M4",  kind: "Meeting Room", capacity: 6,  hourly: 300000, photo: CG_PHOTOS[2], xPct: 33.5, yPct: 42 },
    { id: "caugiay-f15-m10", label: "M10", kind: "Meeting Room", capacity: 14, hourly: 600000, photo: CG_PHOTOS[3], xPct: 54,   yPct: 50 },
    { id: "caugiay-f15-m6",  label: "M6",  kind: "Meeting Room", capacity: 8,  hourly: 400000, photo: CG_PHOTOS[4], xPct: 74,   yPct: 53.5 },
  ];
  rooms.forEach((r) => { r.baseStatus = rand("cg" + r.id) < 0.62 ? "available" : "occupied"; });
  const markers = [
    { label: "R",     kind: "Reception",            xPct: 42,   yPct: 65 },
    { label: "LR",    kind: "Locker Area",          xPct: 19.5, yPct: 70 },
    { label: "PA/PB", kind: "Print / Phone Booth",  xPct: 65.5, yPct: 65.5 },
  ];
  return { image: "/workspace-photos/CNN15_FloorPlan.jpg", aspect: 2062 / 2500, rooms, seats: [], markers };
};

// ── OBC 60 Lý Thái Tổ — real OBC floor plan (image + hotspots) ─────────────
// Sells single slots (individual desks + focus pods) and has 2 meeting rooms.
const LT_PHOTOS = [
  "/workspace-photos/DSC05749.jpg",
  "/workspace-photos/DSC05809.jpg",
  "/workspace-photos/235510ecf59fb755c102c0f4b2254ba63925f069-1800x1200.avif",
  "/workspace-photos/243c49f00a48d32d863d816c31aab29bdc8974cb-2048x1366.avif",
];
const lythaitoFloor = () => {
  const seats = [];
  // 5 open coworking round tables, 4 single seats each (N/S/W/E around the centre).
  // Coordinates are read off the real OBC furniture plan (page KT-01 bố trí nội thất).
  const tables = [[58, 47], [35, 50], [43, 59], [48, 73], [65, 86]];
  const off = [[0, -5.5], [0, 5.5], [-5, 0.6], [5, 0.6]];
  let n = 0;
  tables.forEach((t, ti) => off.forEach((o, oi) => {
    n++;
    seats.push({ id: `lythaito-d${n}`, label: `Seat ${n}`, kind: "Hot Desk", capacity: 1,
      daily: 250000, monthly: 3200000, photo: LT_PHOTOS[(ti + oi) % LT_PHOTOS.length],
      xPct: +(t[0] + o[0]).toFixed(1), yPct: +(t[1] + o[1]).toFixed(1) });
  }));
  // 5 focus pods (single slots) — the column of small circles beside the core
  [49, 53, 57, 61, 65].forEach((y, i) => seats.push({
    id: `lythaito-p${i + 1}`, label: `Pod ${i + 1}`, kind: "Focus Pod", capacity: 1,
    daily: 180000, monthly: 2400000, photo: LT_PHOTOS[i % LT_PHOTOS.length], xPct: 68, yPct: y,
  }));
  seats.forEach((s) => { s.baseStatus = rand("lt" + s.id) < 0.58 ? "available" : "occupied"; });

  // 2 meeting rooms: MR1 = enclosed round-table room (left), MR2 = conference table (top)
  const rooms = [
    { id: "lythaito-m1", label: "Meeting Room 1", kind: "Meeting Room", capacity: 4, hourly: 250000, photo: LT_PHOTOS[2], xPct: 25, yPct: 33 },
    { id: "lythaito-m2", label: "Meeting Room 2", kind: "Meeting Room", capacity: 6, hourly: 450000, photo: LT_PHOTOS[3], xPct: 55, yPct: 26 },
  ];
  rooms.forEach((r) => { r.baseStatus = rand("lt" + r.id) < 0.6 ? "available" : "occupied"; });

  const markers = [
    { label: "Reception", kind: "Lễ tân",      xPct: 70, yPct: 63 },
    { label: "Stairs",    kind: "Cầu thang",   xPct: 74, yPct: 22 },
    { label: "Lobby",     kind: "Sảnh thang",  xPct: 88, yPct: 34 },
  ];
  return { image: "/workspace-photos/OBC_60LyThaiTo.png", aspect: 1754 / 1986, rooms, seats, markers };
};

// ── Buildings & floors ────────────────────────────────────────────────────────
export const BUILDINGS = [
  {
    id: "lythaito", name: "OBC 60 Lý Thái Tổ", district: "Hoàn Kiếm, Hà Nội",
    address: "60 Lý Thái Tổ, Hoàn Kiếm, Hà Nội",
    floors: [{ id: "lythaito-f1", idx: 1, label: "Tầng trệt", plan: lythaitoFloor() }],
  },
  {
    id: "caugiay", name: "HiLink 15 Tôn Thất Tùng", district: "Đống Đa, Hà Nội",
    address: "15 Tôn Thất Tùng, Đống Đa, Hà Nội",
    floors: [{ id: "caugiay-f15", idx: 15, label: "Tầng 15", plan: caugiayF15() }],
  },
];

const ALL_FLOORS = BUILDINGS.flatMap((b) => b.floors.map((f) => ({ ...f, buildingId: b.id, buildingName: b.name })));
const ALL_ROOMS = ALL_FLOORS.flatMap((f) => f.plan.rooms.map((r) => ({ ...r, floorId: f.id, floorLabel: f.label, buildingId: f.buildingId, buildingName: f.buildingName })));
// rooms + single slots (seats/pods) — used to seed activity across every bookable unit
const SEED_UNITS = ALL_FLOORS.flatMap((f) => [...f.plan.rooms, ...(f.plan.seats || [])].map((r) => ({ ...r, floorId: f.id, floorLabel: f.label, buildingId: f.buildingId, buildingName: f.buildingName })));

export const getBuildings = () => BUILDINGS;
export const getBuilding  = (id) => BUILDINGS.find((b) => b.id === id);
export const getFloor     = (id) => ALL_FLOORS.find((f) => f.id === id);
export const getUnit = (id) => {
  for (const f of ALL_FLOORS) {
    const r = f.plan.rooms.find((x) => x.id === id); if (r) return { ...r, type: "room", floorId: f.id, floorLabel: f.label, buildingId: f.buildingId, buildingName: f.buildingName };
    const s = f.plan.seats.find((x) => x.id === id); if (s) return { ...s, type: "seat", floorId: f.id, floorLabel: f.label, buildingId: f.buildingId, buildingName: f.buildingName };
  }
  return null;
};

// ── Date helpers ──────────────────────────────────────────────────────────────
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const todayISO = () => iso(new Date());
export const overlaps = (aS, aE, bS, bE) => aS <= bE && bS <= aE;

// ── Seeded bookings (power the admin calendar + detail) ────────────────────────
const buildSchedule = (start, total, periods) => {
  const out = [];
  const per = Math.round(total / periods);
  let s = new Date(start);
  const states = ["Paid", "Pending", "Overdue", "Partial"];
  for (let i = 0; i < periods; i++) {
    const e = addDays(s, 90);
    out.push({
      id: `pp${i + 1}`, start: iso(s), end: iso(addDays(e, -1)),
      due: iso(addDays(s, -10)), amount: per,
      discount: i === 1 ? 500000 : 0,
      status: states[i % states.length],
    });
    s = e;
  }
  return out;
};

const seedBookings = () => {
  const out = [];
  const monthStart = new Date(); monthStart.setDate(1);
  let n = 0;
  SEED_UNITS.forEach((room) => {
    const isSeat = room.kind === "Hot Desk" || room.kind === "Focus Pod";
    // ~60% of rooms and ~40% of single slots carry a current booking; deterministic by id
    const r = rand("bk" + room.id);
    if (r > (isSeat ? 0.40 : 0.62)) return;
    const tenant = TENANTS[Math.floor(r * TENANTS.length) % TENANTS.length];
    const startOffset = Math.floor(r * 12);
    const len = 4 + Math.floor(r * 16);
    const start = addDays(monthStart, startOffset);
    const end = addDays(start, len);
    const statusPick = r < 0.25 ? "pending" : r < 0.45 ? "partial" : "confirmed";
    const subtotal = room.monthly ? room.monthly : (room.hourly || 350000) * 8 * (len);
    const promo = r < 0.4 ? PROMOS[0] : null;
    const promoAmt = promo ? Math.round(subtotal * 0.1) : 0;
    const addonPick = r < 0.5 ? [ADDONS[0], ADDONS[1]] : [ADDONS[3]];
    const addonsTotal = addonPick.reduce((a, x) => a + x.price, 0);
    const taxable = subtotal - promoAmt + addonsTotal;
    const vat = Math.round(taxable * VAT_RATE);
    const total = taxable + vat;
    const depositReq = 3000000;
    const depositPaid = statusPick === "confirmed" ? 3000000 : statusPick === "partial" ? 2000000 : 0;
    n++;
    out.push({
      id: `MMT0${1000 + n}`,
      unitId: room.id, unitType: isSeat ? "seat" : "room", unitLabel: room.label, unitKind: room.kind,
      buildingId: room.buildingId, buildingName: room.buildingName,
      floorId: room.floorId, floorLabel: room.floorLabel,
      customer: tenant, guests: 1 + Math.floor(r * 3),
      start: iso(start), end: iso(end),
      time: "09:00 – 18:00",
      status: statusPick,
      pricing: { subtotal, promo: promoAmt, addonsTotal, taxable, vat, total },
      promo, addons: addonPick,
      deposit: { required: depositReq, paid: depositPaid },
      schedule: buildSchedule(start, total, 4),
      payments: depositPaid ? [{ id: "tx1", date: iso(addDays(start, -5)), amount: depositPaid, method: "Bank transfer", status: "Success", note: "Deposit" }] : [],
      changeLog: [
        { ts: iso(addDays(start, -7)) + " 09:14", text: `Booking created for ${tenant.name}` },
        ...(depositPaid ? [{ ts: iso(addDays(start, -5)) + " 16:02", text: `Deposit ${fmtVND(depositPaid)} received` }] : []),
      ],
      note: r < 0.5 ? "Phòng không có TV, điều hoà" : "",
      source: ["Member portal", "Walk-in", "Website", "Partner"][Math.floor(r * 7) % 4],
    });
  });
  return out;
};

// ── Persisted store with subscription ──────────────────────────────────────────
import { useSyncExternalStore } from "react";

const KEY = "hilink_bookings_v5";
let _bookings = null;
const listeners = new Set();

const load = () => {
  if (_bookings) return _bookings;
  try {
    const raw = localStorage.getItem(KEY);
    _bookings = raw ? JSON.parse(raw) : seedBookings();
  } catch { _bookings = seedBookings(); }
  return _bookings;
};
const persist = () => {
  try { localStorage.setItem(KEY, JSON.stringify(_bookings)); } catch { /* ignore quota */ }
  listeners.forEach((l) => l());
};

export const listBookings = () => [...load()];
export const getBooking = (id) => load().find((b) => b.id === id) || null;

// availability for a unit on a given date: false if any confirmed/partial booking overlaps
export const isUnitFreeOn = (unitId, dateISO) =>
  !load().some((b) => b.unitId === unitId && b.status !== "cancelled" && overlaps(b.start, b.end, dateISO, dateISO));

export const createBooking = (draft) => {
  const list = load();
  const id = "MMT0" + (1000 + list.length + Math.floor(Math.random() * 900));
  const booking = {
    id, status: "pending", payments: [], source: draft.source || "Member portal",
    changeLog: [{ ts: new Date().toISOString().slice(0, 16).replace("T", " "), text: `Booking created via ${draft.source || "member portal"}` }],
    schedule: buildSchedule(new Date(draft.start), draft.pricing.total, 1),
    ...draft,
  };
  _bookings = [booking, ...list];
  persist();
  return booking;
};

export const recordPayment = (id, payment) => {
  _bookings = load().map((b) => b.id === id
    ? { ...b, status: "confirmed",
        deposit: { ...b.deposit, paid: b.deposit.required },
        payments: [...b.payments, payment],
        changeLog: [...b.changeLog, { ts: new Date().toISOString().slice(0, 16).replace("T", " "), text: `Payment ${fmtVND(payment.amount)} via ${payment.method}` }] }
    : b);
  persist();
};

const stamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

// generic patch with an automatic change-log entry
export const updateBooking = (id, patch, logText) => {
  _bookings = load().map((b) => b.id === id
    ? { ...b, ...patch, changeLog: [...b.changeLog, { ts: stamp(), text: logText || "Booking updated" }] }
    : b);
  persist();
};

export const cancelBooking = (id) => updateBooking(id, { status: "cancelled" }, "Booking cancelled");

export const refundBooking = (id, amount) => {
  _bookings = load().map((b) => b.id === id
    ? { ...b, status: "cancelled",
        payments: [...b.payments, { id: "rf" + Date.now(), date: todayISO(), amount: -Math.abs(amount), method: "Refund", status: "Refunded", note: "Refund issued" }],
        changeLog: [...b.changeLog, { ts: stamp(), text: `Refund ${fmtVND(amount)} issued` }] }
    : b);
  persist();
};

// React binding — getSnapshot must return a STABLE reference between renders
// (return the cached array, which is only reassigned in createBooking/recordPayment),
// otherwise useSyncExternalStore loops infinitely.
const subscribe = (cb) => { listeners.add(cb); return () => listeners.delete(cb); };
const getSnapshot = () => load();
export const useBookings = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
