import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* ================= PUBLIC PAGES ================= */
import HomePage from "./pages/HomePage";
import StaffLogin from "./pages/login/StaffLogin";
import CustomerLogin from "./pages/login/CustomerLogin";
import TestRide from "./pages/TestRide";
import BikeDetails from "./pages/BikeDetails";
import SlotsAvailability from "./pages/public/SlotsAvailability";
import LocationRoute from "./pages/LocationRoute";
import TestRideFeedback from "./pages/TestRideFeedback";

/* ================= CHATBOT ================= */
import ChatBot from "./components/ChatBot";

/* ================= AUTH ================= */
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CustomerForgotPassword from "./pages/CustomerForgotPassword";
import CustomerResetPassword from "./pages/CustomerResetPassword";

/* ================= CUSTOMER ================= */
import CustomerDashboard from "./pages/CustomerDashboard";
import BookService from "./pages/BookService";
import RaiseComplaint from "./pages/RaiseComplaint";
import CustomerDetail from "./pages/CustomerDetail";
import CustomerBookingDetail from "./pages/CustomerBookingDetail";

/* ================= JOB CARDS ================= */
import CreateJobCard from "./pages/CreateJobCard";
import JobCardDetail from "./pages/JobCardDetail";
import EditJobCard from "./pages/jobcard/EditJobCard";

/* ================= MEDIA ================= */
import MediaViewerPage from "./pages/MediaViewerPage";
import CustomerMediaViewer from "./pages/CustomerMediaViewer";

/* ================= STAFF DASHBOARDS ================= */
import ServiceAdvisorDashboard from "./pages/dashboard/ServiceAdvisorDashboard";
import TechnicianDashboard from "./pages/dashboard/TechnicianDashboard";
import TechnicianJobDetail from "./pages/dashboard/TechnicianJobDetail";
import SupplyChainDashboard from "./pages/dashboard/SupplyChainDashboard";
import SalesDashboard from "./pages/dashboard/SalesDashboard";

/* ================= ADMIN ================= */
import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/Overview";
import AdminServiceBookings from "./pages/admin/ServiceBookings";
import AdminJobCards from "./pages/admin/JobCards";
import AdminComplaints from "./pages/admin/Complaints";
import AdminCustomers from "./pages/admin/Customers";
import AdminTechnicians from "./pages/admin/Technicians";
import AdminAdvisors from "./pages/admin/Advisors";
import AdminSales from "./pages/admin/Sales";
import AdminSupplyChain from "./pages/admin/SupplyChain";
import AdminVehicles from "./pages/admin/Vehicles";
import AdminParts from "./pages/admin/Parts";
import AdminMedia from "./pages/admin/Media";
import AdminWorkLogs from "./pages/admin/WorkLogs";

/* ================= ROUTE GUARDS ================= */
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

/* ================= CONTEXT ================= */
import { AdminTabsProvider } from "./context/AdminTabsContext";

export default function App() {
  const location = useLocation();

  const hideChatbot =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.includes("/login");

  return (
    <>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login/customer" element={<CustomerLogin />} />
        <Route path="/login/staff" element={<StaffLogin />} />

        <Route path="/slots-availability" element={<SlotsAvailability />} />
        <Route path="/test-ride" element={<TestRide />} />
        <Route path="/bike/:id" element={<BikeDetails />} />
        <Route path="/location-route" element={<LocationRoute />} />
        <Route path="/test-ride-feedback" element={<TestRideFeedback />} />

        {/* ================= AUTH ================= */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/customer-forgot-password" element={<CustomerForgotPassword />} />
        <Route path="/customer-reset-password" element={<CustomerResetPassword />} />

        {/* ================= CUSTOMER MEDIA ================= */}
        <Route path="/customer/media/:mediaId" element={<CustomerMediaViewer />} />

        {/* ================= CUSTOMER DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/dashboard/customer/booking/:bookingId"
          element={
            <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerBookingDetail />
            </RoleBasedRoute>
          }
        />

        {/* ================= CUSTOMER ACTIONS ================= */}
        <Route
          path="/customer/book-service"
          element={
            <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
              <BookService />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/customer/raise-complaint"
          element={
            <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
              <RaiseComplaint />
            </RoleBasedRoute>
          }
        />

        {/* ================= STAFF DASHBOARDS ================= */}
        <Route
          path="/dashboard/service-advisor"
          element={
            <RoleBasedRoute allowedRoles={["SERVICE_ADVISOR"]}>
              <ServiceAdvisorDashboard />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/dashboard/technician"
          element={
            <RoleBasedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianDashboard />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/dashboard/technician/:technicianId"
          element={
            <RoleBasedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianDashboard />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/dashboard/technician/job/:bookingId"
          element={
            <RoleBasedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianJobDetail />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/dashboard/supply-chain"
          element={
            <RoleBasedRoute allowedRoles={["SUPPLY_CHAIN"]}>
              <SupplyChainDashboard />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/dashboard/sales"
          element={
            <RoleBasedRoute allowedRoles={["SALES"]}>
              <SalesDashboard />
            </RoleBasedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminTabsProvider>
                <AdminLayout />
              </AdminTabsProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />

          <Route path="service-bookings" element={<AdminServiceBookings />} />
          <Route path="job-cards" element={<AdminJobCards />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="technicians" element={<AdminTechnicians />} />
          <Route path="advisors" element={<AdminAdvisors />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="supply-chain" element={<AdminSupplyChain />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="parts" element={<AdminParts />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="work-logs" element={<AdminWorkLogs />} />
        </Route>

        {/* ================= JOB CARDS ================= */}
        <Route path="/job-cards/new" element={<CreateJobCard />} />

        <Route
          path="/job-cards/:id"
          element={
            <RoleBasedRoute allowedRoles={["ADMIN", "CUSTOMER"]}>
              <JobCardDetail />
            </RoleBasedRoute>
          }
        />

        <Route path="/job-cards/edit/:id" element={<EditJobCard />} />

        {/* ================= CUSTOMER DETAILS ================= */}
        <Route
          path="/customers/:id"
          element={
            <RoleBasedRoute allowedRoles={["ADMIN", "CUSTOMER"]}>
              <CustomerDetail />
            </RoleBasedRoute>
          }
        />

        {/* ================= MEDIA VIEWER ================= */}
        <Route
          path="/job-cards/:jobCardId/media/:mediaId"
          element={
            <RoleBasedRoute allowedRoles={["ADMIN", "TECHNICIAN", "CUSTOMER"]}>
              <MediaViewerPage />
            </RoleBasedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

     </Routes>

{/* 💬 CHATBOT */}
<ChatBot />

</>
  );
}