# HiLink Workspaces

Marketing site + member portal + operations (admin) portal for HiLink premium
coworking spaces. Built with **React 19 + Vite 8 + React Router 7 + Framer
Motion**, plain inline-CSS styling (design tokens in `src/index.css`), and a
frontend-only mock data layer.

## Run locally

```bash
npm install
npm run dev      # start the dev server (Vite)
npm run build    # production build
npm run preview  # preview the production build
```

## Logging in

Authentication is mock/demo only — there is no backend. Sessions are kept in
`sessionStorage` (cleared when the browser tab closes). Role determines which
portal you land in.

### Demo accounts

Both accounts are shown on the sign-in screen and can be used either by typing
the credentials or with the one-tap **Demo access** buttons.

| Role   | Email               | Password     | Lands on                              |
|--------|---------------------|--------------|---------------------------------------|
| Admin  | `admin@hilink.vn`   | `Admin@123`  | `/admin` (Operations portal)          |
| Member | `member@hilink.vn`  | `Member@123` | `/portal/dashboard` (Member portal)   |

### How the login flow works

1. **Sign in** at `/login`.
   - Entering the exact credentials above signs you in with that account's role.
   - As a shortcut, any email beginning with `admin@` or `ops@` is also treated
     as an admin (handy for testing).
   - The **Member portal** / **Operations portal** demo buttons log you straight
     in without typing anything.
2. **Routing by role** after login:
   - Admins are redirected to `/admin` (the operations Dashboard).
   - Members go to `/portal/dashboard` (or back to the page they were trying to
     reach before being asked to sign in).
3. **Route protection** (`src/context/AuthContext.jsx`):
   - `ProtectedRoute` guards all `/portal/*` pages — unauthenticated users are
     sent to `/login`.
   - `AdminRoute` guards all `/admin/*` pages — it requires an authenticated user
     **with the `admin` role**; a signed-in member who tries an admin URL is
     redirected back to `/portal/dashboard`.
4. **Switching portals:** an admin sees an "Operations portal" link in the
   member sidebar, and the admin sidebar has a "Member view" link back. Sign out
   clears the session from both.

The two demo accounts are defined in `src/context/AuthContext.jsx`
(`DEMO_ACCOUNTS`); edit that array to change credentials or add roles.

## Project structure

```
src/
  App.jsx                  # routes (public, /portal/*, /admin/*)
  context/                 # AuthContext (roles + guards), Language, Splash
  components/
    index.jsx              # shared UI (Navbar, PortalSidebar, Btn, Chip, ...)
    admin.jsx              # AdminSidebar / AdminLayout / status palette
    Floorplan.jsx          # interactive floor map (SVG mode + real-image mode)
    charts.jsx             # lightweight SVG charts (line / bar / donut)
  data/
    booking.js             # buildings -> floors -> rooms/seats -> bookings store
    adminData.js           # members, leads, tickets, visitors, documents, KPIs
    mockData.js            # spaces, articles, member-portal mock content
  screens/
    Screens.jsx            # auth + member portal screens
    BookingFlow.jsx        # member booking wizard (location -> floor -> pay)
    admin/                 # AdminDashboard, AdminCalendar, AdminBookings,
                           # AdminBookingDetail, AdminSpaces, AdminFloor, AdminBilling
```

## Data & persistence

The booking store (`src/data/booking.js`) seeds demo bookings on first load and
persists to `localStorage` under the key `hilink_bookings_v1`. Bookings created
in the member flow, the admin calendar, or via admin actions all share this
store, so they appear consistently across the calendar, bookings list, billing,
and floor maps. **To reset the seeded data, clear that localStorage key.**

The helper functions in the data layer (`getBuildings`, `createBooking`,
`recordPayment`, `updateBooking`, ...) are the seam to swap for real API calls
later without changing any screen.

## Locations & floor plans

- **Enosta Space** -- three floors using a stylised SVG floor map.
- **HiLink Cau Giay** -- the real **F15** architectural plan
  (`public/workspace-photos/CNN15_FloorPlan.jpg`) with interactive hotspots over
  each cabin. Hovering a cabin shows a photo, capacity and price; every `Hi.xx`
  cabin is bookable as an entire private room.
