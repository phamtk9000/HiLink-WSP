import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, lazy, Suspense } from "react";
import { Navbar } from "./components/index.jsx";
import Homepage from "./screens/Homepage.jsx";
import SpacesExplorer from "./screens/SpacesExplorer.jsx";
import AboutPage from "./screens/AboutPage.jsx";
import MembershipPage from "./screens/MembershipPage.jsx";
import { HilinkOfficePage, HilinkDeskPage, HilinkRoamPage, HilinkVirtualPage } from "./screens/MembershipDetail.jsx";
import { MeetingRoomsPage, EventSpacesPage } from "./screens/SpaceEnquiry.jsx";
import { MeetingRoomsLanding, MeetingRoomsLocation, MeetingRoomsWorkspace, EventVenuesLanding, EventVenuesLocation, EventVenuesWorkspace } from "./screens/VenuePages.jsx";
import { ForumPage, ArticlePage } from "./screens/ForumPage.jsx";
import {
  SpaceDetail, LoginScreen, RegisterScreen,
  Dashboard, MyBookings, Invoices, LiveAvailability, PortalPlaceholder,
  Settings, Documents, SupportPage,
} from "./screens/Screens.jsx";
import { BookViewing, RequestCallback, SubmitInquiry, ReserveWorkspace, RequestCustomOffer } from "./screens/BookingPortal.jsx";
import RecommendationTool, { PublicRecommendationTool } from "./screens/RecommendationTool.jsx";
import { TermsPage, PrivacyPage, CookiePage, AccessibilityPage } from "./screens/LegalPages.jsx";
import TenantPortal from "./screens/TenantPortal.jsx";
import BookingFlow from "./screens/BookingFlow.jsx";
// Admin portal is lazy-loaded — it stays out of the member-facing bundle for speed.
const AdminDashboard    = lazy(() => import("./screens/admin/AdminDashboard.jsx"));
const AdminSpaces       = lazy(() => import("./screens/admin/AdminSpaces.jsx"));
const AdminCalendar     = lazy(() => import("./screens/admin/AdminCalendar.jsx"));
const AdminCustomers    = lazy(() => import("./screens/admin/AdminCustomers.jsx"));
const AdminMeetingRooms = lazy(() => import("./screens/admin/AdminMeetingRooms.jsx"));
const AdminPayments     = lazy(() => import("./screens/admin/AdminPayments.jsx"));
const AdminInvoices     = lazy(() => import("./screens/admin/AdminInvoices.jsx"));
const AdminSupport      = lazy(() => import("./screens/admin/AdminSupport.jsx"));
const AdminTickets      = lazy(() => import("./screens/admin/AdminTickets.jsx"));
const AdminVisitors     = lazy(() => import("./screens/admin/AdminVisitors.jsx"));
const AdminDocuments    = lazy(() => import("./screens/admin/AdminDocuments.jsx"));
const AdminLeads        = lazy(() => import("./screens/admin/AdminLeads.jsx"));
const AdminBookings     = lazy(() => import("./screens/admin/AdminBookings.jsx"));
const AdminBookingDetail = lazy(() => import("./screens/admin/AdminBookingDetail.jsx"));
const AdminFloor        = lazy(() => import("./screens/admin/AdminFloor.jsx"));
const AdminBilling      = lazy(() => import("./screens/admin/AdminBilling.jsx"));
import { AuthProvider, ProtectedRoute, AdminRoute } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { SplashProvider, useSplash } from "./context/SplashContext.jsx";

const PR = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;
const AR = ({ children }) => <AdminRoute>{children}</AdminRoute>;

/* ── Splash screen overlay ── */
const SplashScreen = () => (
  <motion.div
    key="splash"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
    style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(135deg, #1C1710 0%, #2A2118 50%, #1C1710 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column",
    }}
  >
    {/* Subtle warm radial glow behind logo */}
    <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-60%)", width:400, height:400, background:"radial-gradient(circle, rgba(168,143,92,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />

    {/* Logo mark + wordmark */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ display: "flex", alignItems: "center", gap: 20, position:"relative" }}
    >
      {/* HiLink Premium Workspace logo — transparent trim, no border/box */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        <img src="/workspace-photos/logo-workspace-trim.png" alt="HiLink Premium Workspace" style={{ height:96, width:"auto", display:"block", border:"none", outline:"none" }}/>
      </div>
    </motion.div>

    {/* Tagline */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      style={{
        fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.22em",
        textTransform: "uppercase", color: "rgba(248,246,241,0.3)", marginTop: 24,
      }}
    >
      Premium Workspaces · Hanoi
    </motion.p>

    {/* Gold progress bar */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(168,143,92,0.15)" }}>
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.6, ease: "linear" }}
        style={{ height: "100%", background: "var(--gold)" }}
      />
    </div>
  </motion.div>
);

/* Scroll to top on every route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
};

/* Inner app — has access to useSplash (inside SplashProvider) */
const AppInner = () => {
  const { show: splash } = useSplash();
  return (
    <BrowserRouter>
        <ScrollToTop />
      <LanguageProvider>
        <AuthProvider>
          {/* Splash renders above everything */}
          <AnimatePresence>{splash && <SplashScreen key="splash" />}</AnimatePresence>

          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public */}
              <Route path="/"                    element={<Homepage />} />
              <Route path="/spaces"              element={<SpacesExplorer />} />
              <Route path="/spaces/:id"          element={<SpaceDetail />} />
              <Route path="/membership"               element={<MembershipPage />} />
              <Route path="/membership/office"         element={<HilinkOfficePage />} />
              <Route path="/membership/desk"           element={<HilinkDeskPage />} />
              <Route path="/membership/roam"           element={<HilinkRoamPage />} />
              <Route path="/membership/virtual"        element={<HilinkVirtualPage />} />
              <Route path="/spaces/meeting-rooms"      element={<MeetingRoomsPage />} />
              <Route path="/spaces/event-spaces"       element={<EventSpacesPage />} />
              <Route path="/meeting-rooms"                       element={<MeetingRoomsLanding />} />
              <Route path="/meeting-rooms/:district"              element={<MeetingRoomsLocation />} />
              <Route path="/meeting-rooms/:district/:workspace"   element={<MeetingRoomsWorkspace />} />
              <Route path="/event-venues"                         element={<EventVenuesLanding />} />
              <Route path="/event-venues/:district"               element={<EventVenuesLocation />} />
              <Route path="/event-venues/:district/:workspace"    element={<EventVenuesWorkspace />} />
              <Route path="/recommend"           element={<PublicRecommendationTool />} />
              <Route path="/login"               element={<LoginScreen />} />
              <Route path="/register"            element={<RegisterScreen />} />
              <Route path="/about"               element={<AboutPage />} />
              <Route path="/forum"               element={<ForumPage />} />
              <Route path="/forum/:slug"         element={<ArticlePage />} />
              <Route path="/terms"               element={<TermsPage />} />
              <Route path="/privacy"             element={<PrivacyPage />} />
              <Route path="/cookies"             element={<CookiePage />} />
              <Route path="/accessibility"       element={<AccessibilityPage />} />

              {/* Portal — core */}
              <Route path="/portal/dashboard"    element={<PR><Dashboard /></PR>} />
              <Route path="/portal/book"         element={<PR><BookingFlow /></PR>} />
              <Route path="/portal/bookings"     element={<PR><MyBookings /></PR>} />
              <Route path="/portal/invoices"     element={<PR><Invoices /></PR>} />
              <Route path="/portal/availability" element={<PR><LiveAvailability /></PR>} />
              <Route path="/portal/settings"     element={<PR><Settings /></PR>} />
              <Route path="/portal/documents"    element={<PR><Documents /></PR>} />
              <Route path="/portal/support"      element={<PR><SupportPage /></PR>} />

              {/* Portal — Book & Enquire */}
              <Route path="/portal/book-viewing" element={<PR><BookViewing /></PR>} />
              <Route path="/portal/callback"     element={<PR><RequestCallback /></PR>} />
              <Route path="/portal/inquiry"      element={<PR><SubmitInquiry /></PR>} />
              <Route path="/portal/reserve"      element={<PR><ReserveWorkspace /></PR>} />
              <Route path="/portal/custom-offer" element={<PR><RequestCustomOffer /></PR>} />

              {/* Portal — Tools */}
              <Route path="/portal/recommend"    element={<PR><RecommendationTool /></PR>} />

              {/* Portal — Tenant */}
              <Route path="/portal/tenant"       element={<PR><TenantPortal /></PR>} />

              {/* Admin / Operations portal */}
              <Route path="/admin"                element={<AR><AdminDashboard /></AR>} />
              <Route path="/admin/dashboard"      element={<AR><AdminDashboard /></AR>} />
              <Route path="/admin/calendar"       element={<AR><AdminCalendar /></AR>} />
              <Route path="/admin/bookings"       element={<AR><AdminBookings /></AR>} />
              <Route path="/admin/bookings/:id"   element={<AR><AdminBookingDetail /></AR>} />
              <Route path="/admin/spaces"         element={<AR><AdminSpaces /></AR>} />
              <Route path="/admin/floor"          element={<AR><AdminFloor /></AR>} />
              <Route path="/admin/meeting-rooms"  element={<AR><AdminMeetingRooms /></AR>} />
              <Route path="/admin/customers"      element={<AR><AdminCustomers /></AR>} />
              <Route path="/admin/leads"          element={<AR><AdminLeads /></AR>} />
              <Route path="/admin/visitors"       element={<AR><AdminVisitors /></AR>} />
              <Route path="/admin/support"        element={<AR><AdminSupport /></AR>} />
              <Route path="/admin/tickets"        element={<AR><AdminTickets /></AR>} />
              <Route path="/admin/payments"       element={<AR><AdminPayments /></AR>} />
              <Route path="/admin/invoices"       element={<AR><AdminInvoices /></AR>} />
              <Route path="/admin/documents"      element={<AR><AdminDocuments /></AR>} />
              <Route path="/admin/billing"        element={<AR><AdminBilling /></AR>} />

              <Route path="*"                    element={<Homepage />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

const App = () => (
  <SplashProvider>
    <AppInner />
  </SplashProvider>
);

export default App;
