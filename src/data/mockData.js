export const SPACES = [
  { id:"1", name:"Horizon Hot Desk", type:"Hot Desk", floor:12, capacity:1, price:89000, pricePerDay:650000, pricePerMonth:8500000, tier:"offpeak", availability:"available", amenities:["WiFi","Coffee","Printing"], description:"Open-plan workspace with panoramic Hanoi skyline views. Ergonomic seating, 1Gbps fibre, and specialty coffee bar." },
  { id:"2", name:"Skyline Suite", type:"Private Office", floor:15, capacity:6, price:450000, pricePerDay:3200000, pricePerMonth:45000000, tier:"peak", availability:"limited", amenities:["WiFi","Coffee","Phone Booth","Printing","Parking","Reception"], description:"Fully enclosed executive suite with floor-to-ceiling glass, standing desk, lounge area, and dedicated reception." },
  { id:"3", name:"Boardroom Alpha", type:"Meeting Room", floor:14, capacity:12, price:350000, pricePerDay:2800000, pricePerMonth:null, tier:"standard", availability:"available", amenities:["WiFi","Printing","Reception"], description:"State-of-the-art boardroom with 85″ 4K display, video conferencing bridge, and acoustic wall panels." },
  { id:"4", name:"Focus Pod B2", type:"Hot Desk", floor:12, capacity:1, price:95000, pricePerDay:700000, pricePerMonth:9000000, tier:"standard", availability:"available", amenities:["WiFi","Coffee","Phone Booth"], description:"Semi-private focus pod ideal for deep work. Acoustic treatment, adjustable lighting, and natural airflow." },
  { id:"5", name:"Executive Corner", type:"Private Office", floor:15, capacity:10, price:680000, pricePerDay:5500000, pricePerMonth:72000000, tier:"peak", availability:"occupied", amenities:["WiFi","Coffee","Parking","Reception"], description:"270° corner suite with private lounge, kitchenette, and VIP reception. The most prestigious address in Hanoi." },
  { id:"6", name:"Collab Hub", type:"Meeting Room", floor:14, capacity:8, price:280000, pricePerDay:2200000, pricePerMonth:null, tier:"offpeak", availability:"available", amenities:["WiFi","Coffee","Printing"], description:"Dynamic workshop space with movable furniture, writable walls, and living plant installations." },
  { id:"7", name:"Virtual Gold", type:"Virtual Office", floor:null, capacity:null, price:299000, pricePerDay:null, pricePerMonth:3500000, tier:"offpeak", availability:"available", amenities:["Reception","Printing"], description:"Premium Tôn Thất Tùng business address with mail handling, call forwarding, and 5 day passes per month." },
  { id:"8", name:"Panorama Desk", type:"Hot Desk", floor:15, capacity:1, price:115000, pricePerDay:850000, pricePerMonth:11000000, tier:"peak", availability:"limited", amenities:["WiFi","Coffee","Parking"], description:"Top-floor window seat with direct Hoàn Kiếm Lake views. The most sought-after desk in the building." },
  { id:"9", name:"Innovation Lab", type:"Meeting Room", floor:12, capacity:20, price:520000, pricePerDay:4200000, pricePerMonth:null, tier:"standard", availability:"available", amenities:["WiFi","Printing","Parking","Reception"], description:"Large-format workshop with dual projectors, breakout pods, and full event A/V production capabilities." },
];

export const TESTIMONIALS = [
  { name:"Tran Minh Duc", role:"CEO, NovaTech", text:"HiLink redefined what a workspace can be. The attention to detail is extraordinary.", avatar:"TD" },
  { name:"Sarah Chen", role:"Regional Director, APAC", text:"My go-to base whenever I'm in Hanoi. Nothing else comes close.", avatar:"SC" },
  { name:"Pham Lan Anh", role:"Founder, Studio LFA", text:"The atmosphere is unlike anything else — it actively fuels creativity.", avatar:"PL" },
];

export const BOOKINGS_UPCOMING = [
  { id:"b1", room:"Meeting Room A3", floor:14, date:"Jan 28, 2025", time:"09:00 – 11:00", duration:"2 hrs", price:700000, status:"Confirmed" },
  { id:"b2", room:"Skyline Suite", floor:15, date:"Jan 30, 2025", time:"14:00 – 17:00", duration:"3 hrs", price:1350000, status:"Confirmed" },
  { id:"b3", room:"Horizon Hot Desk", floor:12, date:"Feb 3, 2025", time:"08:00 – 18:00", duration:"1 day", price:650000, status:"Pending" },
];
export const BOOKINGS_PAST = [
  { id:"b4", room:"Boardroom Alpha", floor:14, date:"Jan 20, 2025", time:"10:00 – 12:00", duration:"2 hrs", price:700000, status:"Completed" },
  { id:"b5", room:"Focus Pod B2", floor:12, date:"Jan 18, 2025", time:"09:00 – 18:00", duration:"1 day", price:700000, status:"Completed" },
  { id:"b6", room:"Executive Corner", floor:15, date:"Jan 15, 2025", time:"13:00 – 16:00", duration:"3 hrs", price:2040000, status:"Completed" },
  { id:"b7", room:"Collab Hub", floor:14, date:"Jan 10, 2025", time:"09:00 – 11:00", duration:"2 hrs", price:560000, status:"Completed" },
  { id:"b8", room:"Panorama Desk", floor:15, date:"Jan 8, 2025", time:"08:00 – 18:00", duration:"1 day", price:850000, status:"Completed" },
];
export const BOOKINGS_CANCELLED = [
  { id:"b9", room:"Skyline Suite", floor:15, date:"Jan 12, 2025", time:"10:00 – 14:00", duration:"4 hrs", price:1800000, status:"Cancelled" },
];

export const INVOICES = [
  { id:"INV-2025-001", space:"Skyline Suite", period:"Jan 28–31", amount:4500000, status:"Pending" },
  { id:"INV-2025-002", space:"Meeting Room A3", period:"Jan 20", amount:700000, status:"Paid" },
  { id:"INV-2024-098", space:"Executive Corner", period:"Jan 15", amount:2040000, status:"Paid" },
  { id:"INV-2024-097", space:"Virtual Gold", period:"Jan 2025", amount:3500000, status:"Overdue" },
  { id:"INV-2024-096", space:"Focus Pod B2", period:"Jan 18", amount:700000, status:"Paid" },
  { id:"INV-2024-095", space:"Collab Hub", period:"Jan 10", amount:560000, status:"Paid" },
  { id:"INV-2024-094", space:"Panorama Desk", period:"Jan 8", amount:850000, status:"Paid" },
  { id:"INV-2024-093", space:"Innovation Lab", period:"Dec 20", amount:2080000, status:"Paid" },
];

export const MONTHLY_SPEND = [
  { month:"Aug", amount:2800000 },
  { month:"Sep", amount:3200000 },
  { month:"Oct", amount:2600000 },
  { month:"Nov", amount:3800000 },
  { month:"Dec", amount:3900000 },
  { month:"Jan", amount:4200000 },
];

export const RECENT_ACTIVITY = [
  { icon:"calendar", text:"Booked Skyline Suite", sub:"Floor 15 · Jan 28, 09:00", time:"2h ago", color:"var(--gold)" },
  { icon:"receipt", text:"Invoice INV-2025-001 issued", sub:"₫4,500,000 · Due Feb 5", time:"2h ago", color:"var(--warning)" },
  { icon:"check", text:"Checked out of Meeting Room A3", sub:"Floor 14 · Jan 20, 12:00", time:"8d ago", color:"var(--success)" },
  { icon:"refresh", text:"Plan renewed — Pro Member", sub:"Next renewal Jun 15, 2025", time:"12d ago", color:"var(--gold)" },
  { icon:"dollar", text:"Invoice INV-2024-096 paid", sub:"₫700,000 via bank transfer", time:"13d ago", color:"var(--success)" },
];

export const GRADIENTS = [
  "linear-gradient(135deg,#1a3a5c,#0d2440)",
  "linear-gradient(135deg,#2d1a4a,#1a0d2e)",
  "linear-gradient(135deg,#1a4a2d,#0d2e1a)",
  "linear-gradient(135deg,#3a2d1a,#24180d)",
  "linear-gradient(135deg,#5c2a1a,#3a160d)",
  "linear-gradient(135deg,#1a4a4a,#0d2e2e)",
  "linear-gradient(135deg,#4a1a3a,#2e0d24)",
  "linear-gradient(135deg,#3a3a1a,#24240d)",
  "linear-gradient(135deg,#2a1a4a,#160d2e)",
  "linear-gradient(135deg,#1a2d4a,#0d1e30)",
  "linear-gradient(135deg,#4a3a1a,#2e240d)",
  "linear-gradient(135deg,#1a4a3a,#0d2e24)",
];

// ─── Extended space data for detail pages ─────────────────────────────────────
export const SPACE_DETAILS = {
  "1": {
    images: [
      "/workspace-photos/235510ecf59fb755c102c0f4b2254ba63925f069-1800x1200.avif",
      "/workspace-photos/7f697d83c67bd824c915269932304e1e50668dd0-1800x1200.avif",
      "/workspace-photos/9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif",
      "/workspace-photos/2063289b5ed54b17130343c5c069f1e527a9c10a-6531x4354.avif",
    ],
    manager: { name:"Nguyen Thi Lan", role:"Floor Manager", hours:"Mon–Fri · 08:00–20:00", phone:"+84 24 3936 9101", avatar:"NL" },
    travel: [
      { label:"Hoàn Kiếm Lake", distance:"4 mins' walk" },
      { label:"Hàng Bông Metro", distance:"6 mins' walk" },
      { label:"Old Quarter", distance:"8 mins' walk" },
    ],
  },
  "2": {
    images: [
      "/workspace-photos/DSC05997.jpg",
      "/workspace-photos/IFT_0287_78.jpg",
      "/workspace-photos/a57e2c5781bc65cf0e2a061375bf32119341b3b2-2048x1366.avif",
      "/workspace-photos/DSC06008.jpg",
    ],
    manager: { name:"Tran Van Minh", role:"General Manager", hours:"Mon–Fri · 07:00–22:00", phone:"+84 24 3936 9102", avatar:"TM" },
    travel: [
      { label:"Cầu Giấy District Centre", distance:"2 mins' walk" },
      { label:"Kim Mã Bus Terminal", distance:"5 mins' walk" },
      { label:"Daewoo Hotel", distance:"7 mins' walk" },
    ],
  },
  "3": {
    images: [
      "/workspace-photos/ad7f4d6f9e6ba26fc29098d62b6911062f900bf1-2048x1365.avif",
      "/workspace-photos/761e2d35fafc758157f6414d741bde04927cf465-6720x4480.avif",
      "/workspace-photos/DSC06052%281%29.jpg",
      "/workspace-photos/Meeting%20room%206%20copy.jpg",
    ],
    manager: { name:"Le Thi Hoa", role:"Events Coordinator", hours:"Mon–Sat · 08:00–18:00", phone:"+84 24 3936 9103", avatar:"LH" },
    travel: [
      { label:"Lý Thường Kiệt Street", distance:"1 min' walk" },
      { label:"Hanoi Opera House", distance:"10 mins' walk" },
      { label:"Hoàn Kiếm Lake", distance:"12 mins' walk" },
    ],
  },
};
// Default detail for spaces without specific data
export const DEFAULT_SPACE_DETAIL = {
  images: [
    "/workspace-photos/235510ecf59fb755c102c0f4b2254ba63925f069-1800x1200.avif",
    "/workspace-photos/a57e2c5781bc65cf0e2a061375bf32119341b3b2-2048x1366.avif",
    "/workspace-photos/9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif",
    "/workspace-photos/2063289b5ed54b17130343c5c069f1e527a9c10a-6531x4354.avif",
  ],
  manager: { name:"Pham Thi Thu", role:"Site Manager", hours:"Mon–Fri · 08:00–18:00", phone:"+84 24 3936 9100", avatar:"PT" },
  travel: [
    { label:"Hoàn Kiếm Lake", distance:"8 mins' walk" },
    { label:"Nearest Metro", distance:"10 mins' walk" },
    { label:"Old Quarter", distance:"12 mins' walk" },
  ],
};

// ─── News articles for The Forum ──────────────────────────────────────────────
export const ARTICLES = [
  {
    id:"a1", slug:"future-of-flexible-workspaces-hanoi",
    category:"Insight", readTime:"5 min read",
    title:"The Future of Flexible Workspaces in Hanoi",
    excerpt:"As Vietnam's startup ecosystem matures, demand for premium flexible offices is reshaping the city's real estate landscape.",
    body:`Vietnam's capital is undergoing a quiet revolution. Over the past three years, the number of premium flexible workspace operators in Hanoi has grown by over 40%, driven by an influx of international businesses seeking a foothold in Southeast Asia's fastest-growing economy.\n\nAt the heart of this shift is a fundamental change in how companies think about office space. The pandemic accelerated what was already an emerging trend: businesses no longer want to be locked into 10-year leases for space they might not fully utilise. Instead, they want flexibility — the ability to scale up or down as their headcount changes, to offer employees choice in where they work, and to access premium amenities without the capital expenditure of fitting out their own space.\n\nFor Hanoi specifically, the opportunity is significant. The city's growing diplomatic quarter in Ba Đình, the tech corridor forming along Cầu Giấy, and the international business hub around the Old Quarter all represent distinct demand centres with different workspace needs. A consulting team visiting from Singapore wants something very different from a 30-person startup that's just raised its Series A.\n\nThe workspace operators that will thrive are those who understand these distinctions and build their offerings accordingly — combining excellent physical design with genuine service, and location intelligence with operational flexibility.`,
    author:"HiLink Editorial", date:"May 15, 2025",
    image:"/workspace-photos/235510ecf59fb755c102c0f4b2254ba63925f069-1800x1200.avif",
  },
  {
    id:"a2", slug:"guide-to-productive-remote-work-vietnam",
    category:"Guide", readTime:"8 min read",
    title:"The Professional's Guide to Working Remotely in Vietnam",
    excerpt:"Visa options, workspace etiquette, connectivity, and everything else you need to know before setting up shop in Hanoi or HCMC.",
    body:`Vietnam has quietly become one of Asia's most attractive destinations for location-independent professionals and internationally mobile teams. Strong infrastructure investment, a highly educated workforce, and a cost of living that remains considerably lower than comparable cities in the region make it compelling on paper. But making it work in practice requires understanding a few key nuances.\n\nOn the visa front, the e-visa programme now allows most nationalities to enter for 90 days, with the option to extend within the country. For those planning to stay longer, the business visa (DN) route — typically sponsored by a registered Vietnamese entity — remains the most reliable path to a longer-term presence.\n\nConnectivity in major cities is generally excellent. Hanoi and Ho Chi Minh City both have widespread fibre infrastructure, and mobile data speeds are competitive with most developed markets. The challenge tends to be finding workspace that combines reliable connectivity with an environment conducive to focused work — which is precisely the gap that premium flexible operators are increasingly filling.\n\nFor workspace etiquette: Vietnamese business culture places significant value on relationship-building and face time. If you're using a shared workspace as a base for client meetings, investing in a proper private office or at minimum a dedicated desk (rather than a drop-in hot desk) signals seriousness and stability that local partners will notice and appreciate.`,
    author:"Sarah Chen", date:"Apr 28, 2025",
    image:"/workspace-photos/DSC05997.jpg",
  },
  {
    id:"a3", slug:"member-story-novatech",
    category:"Member Story", readTime:"4 min read",
    title:"How NovaTech Scaled from 2 to 50 Without a Single Lease",
    excerpt:"NovaTech CEO Tran Minh Duc shares how HiLink became the infrastructure behind their Hanoi growth story.",
    body:`When Tran Minh Duc co-founded NovaTech in early 2023, the company had two employees, one product in beta, and a strong conviction that they didn't want to sign an office lease. "We'd seen too many startups get burned by fixed costs in uncertain times," he says. "We wanted every decision to be reversible."\n\nThey started with two hot desks on HiLink's Floor 12. Within six months, as the team grew and investor meetings became a weekly occurrence, they graduated to a dedicated four-desk pod. A year after that, they took a private office on Floor 15 for a team of twelve.\n\nToday, NovaTech occupies a custom-configured suite with eighteen workstations, two dedicated meeting rooms, and what Duc describes as "the best views in Hanoi." Their headcount has grown to 50, they've closed a $4M Series A, and they've never signed a lease longer than three months.\n\n"The flexibility is the point," Duc explains. "But what kept us here specifically is the service. When we had an investor fly in from Singapore on 24 hours notice and needed a boardroom configured for a presentation, the team made it happen. You can't put a price on that."`,
    author:"HiLink Editorial", date:"Apr 10, 2025",
    image:"/workspace-photos/ad7f4d6f9e6ba26fc29098d62b6911062f900bf1-2048x1365.avif",
  },
  {
    id:"a4", slug:"workspace-design-focus-productivity",
    category:"Design", readTime:"6 min read",
    title:"Why Workspace Design Is the Most Underrated Productivity Tool",
    excerpt:"Light, acoustics, furniture ergonomics, and spatial flow — the hidden variables that determine whether your team does their best work.",
    body:`Most conversations about productivity focus on habits, tools, and time management. Very few focus on the physical environment in which work happens — despite the fact that decades of research consistently show environment to be one of the most significant determinants of cognitive performance.\n\nThe variables that matter most are perhaps counterintuitive. Natural light, for instance, has been shown in multiple studies to improve sleep quality, alertness, and mood in office workers — yet a majority of commercial office floors still rely primarily on artificial lighting. Acoustic quality matters enormously for focused work: open-plan offices without proper sound absorption consistently produce higher levels of reported distraction and lower self-rated productivity.\n\nAt HiLink, these insights shaped the design brief for all three of our Hanoi floors from the outset. Floor 12 is oriented for collaboration — higher ambient noise, movable furniture, writable walls. Floor 14 is our boardroom and meeting floor, designed for impression and presentation. Floor 15 is our focus floor: window seats, acoustic panels between workstations, and a strict quiet policy in the central work area.\n\nThe result is a workspace that serves different needs without compromise — because the best workspace isn't one-size-fits-all. It's one that understands what different kinds of work actually require.`,
    author:"HiLink Design Team", date:"Mar 22, 2025",
    image:"/workspace-photos/a57e2c5781bc65cf0e2a061375bf32119341b3b2-2048x1366.avif",
  },
  {
    id:"a5", slug:"hanoi-ba-dinh-neighbourhood-guide",
    category:"Neighbourhood", readTime:"5 min read",
    title:"Ba Đình After Hours: A Neighbourhood Guide for HiLink Members",
    excerpt:"From pho shops that open at 6am to rooftop bars with lake views — your guide to the blocks around our Hanoi locations.",
    body:`The neighbourhood around HiLink's Hanoi locations is one of the most historically significant and practically convenient in the city. Ba Đình district sits at the confluence of the Old Quarter, the diplomatic quarter, and Hoàn Kiếm — which means within a ten-minute walk of our front door you have access to everything from government ministries to century-old pho shops.\n\nFor breakfast, the pho stall on Lý Thường Kiệt that opens at 5:30am has been there for three generations and serves what many members consider the best bowl in Hanoi. Don't overthink the menu — order the special and ask for extra ginger.\n\nFor a mid-morning coffee break, Cộng Cà Phê on Triệu Việt Vương does the best cà phê trứng (egg coffee) in a location that's become something of an institution for the city's creative class. Expect to run into other HiLink members there.\n\nFor lunch, the bún chả at Hương Liên on Lê Văn Hưu is famous partly because it's where Barack Obama ate during his 2016 Vietnam visit. It's worth the small queue.\n\nFor evening, the rooftop at Press Club on Lý Thường Kiệt has lake views, a sophisticated wine list, and the kind of quiet that makes it perfect for end-of-day client conversations. Booking recommended for weekends.`,
    author:"HiLink Community", date:"Mar 5, 2025",
    image:"/workspace-photos/9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif",
  },
  {
    id:"a6", slug:"choosing-right-workspace-type",
    category:"Guide", readTime:"7 min read",
    title:"Hot Desk, Dedicated Desk, or Private Office? A Decision Guide",
    excerpt:"The real cost differences, productivity tradeoffs, and when each workspace type makes sense for different stages of your business.",
    body:`One of the most common questions we get from prospective members is some version of "what's the right workspace for us?" The honest answer is that it depends on three things: team size, work patterns, and the nature of your client interactions.\n\nHot desks make sense when your team is small (1-3 people), your schedules are genuinely flexible, and you don't frequently host clients at your workspace. The cost advantage is real — a hot desk at HiLink starts at ₫89,000/hour or around ₫8.5M/month for unlimited access — but the trade-off is that you won't have a consistent seat, and you'll need to be disciplined about not using your workspace as a storage solution.\n\nDedicated desks are the inflection point for most growing teams. You get the community and amenity access of a shared workspace, but with a fixed seat, monitor, and lockable storage. For teams of 2-8 people who are in the office most days, this tends to be the sweet spot: community access, fixed costs, and enough stability to actually personalise your workspace.\n\nPrivate offices are the right answer when your work involves frequent confidential conversations, when you're regularly hosting clients, or when your team size makes a dedicated desk solution impractical. Our private suites on Floor 15 start at ₫45M/month for a six-person configuration and go up to full-floor arrangements for larger teams.\n\nThe meta-advice: start smaller than you think you need. It's easy to scale up within HiLink — we've designed the membership structure to make that transition seamless. What's harder to undo is overcommitting to space you then feel pressure to justify.`,
    author:"HiLink Advisory", date:"Feb 18, 2025",
    image:"/workspace-photos/7f697d83c67bd824c915269932304e1e50668dd0-1800x1200.avif",
  },
];
