import { useAdminTabs } from "../../context/AdminTabsContext";

/*  REAL JOB CARDS DASHBOARD */
import AdminDashboard from "../../pages/dashboard/AdminDashboard.jsx";

/* OTHER ADMIN PAGES */
import Overview from "../../pages/admin/Overview.jsx";
import ServiceBookings from "../../pages/admin/ServiceBookings.jsx";
import Complaints from "../../pages/admin/Complaints.jsx";
import Customers from "../../pages/admin/Customers.jsx";
import Vehicles from "../../pages/admin/Vehicles.jsx";
import WorkLogs from "../../pages/admin/WorkLogs.jsx";
import TestRidesPanel from "../../pages/admin/TestRidesPanel.jsx";
import Technicians from "../../pages/admin/Technicians.jsx";   



const COMPONENT_MAP = {
  overview: Overview,
  "service-bookings": ServiceBookings, // 
  "job-cards": AdminDashboard,
  complaints: Complaints,
  customers: Customers,
  vehicles: Vehicles,
  "work-logs": WorkLogs,
  "test-rides": TestRidesPanel,
  technicians: Technicians,  
};


export default function AdminTabContent() {
  const { tabs, activeTab } = useAdminTabs();

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",
        padding: "16px",
         background: "#01263B",   
      }}
    >
      {tabs.map(tab => {
        const Component = COMPONENT_MAP[tab.component];
        if (!Component) return null;

        return (
          <div
            key={tab.id}
            style={{ display: tab.id === activeTab ? "block" : "none" }}
          >
            <Component />
          </div>
        );
      })}
    </div>
  );
}
