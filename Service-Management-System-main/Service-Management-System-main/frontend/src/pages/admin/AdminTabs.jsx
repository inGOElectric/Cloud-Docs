import { useAdminTabs } from "../../context/AdminTabsContext";

// EXISTING PAGES (DO NOT TOUCH THEM)
import Overview from "../../pages/admin/Overview";
import ServiceBookings from "../../pages/admin/ServiceBookings";
import JobCards from "../../pages/admin/JobCards";
import Complaints from "../../pages/admin/Complaints";
import Customers from "../../pages/admin/Customers";
import Vehicles from "../../pages/admin/Vehicles";
import WorkLogs from "../../pages/admin/WorkLogs";

const MAP = {
  overview: Overview,
  "service-bookings": ServiceBookings,
  "job-cards": JobCards,
  complaints: Complaints,
  customers: Customers,
  vehicles: Vehicles,
  "work-logs": WorkLogs
};

export default function AdminTabContent() {
  const { tabs, activeTab } = useAdminTabs();

  return (
    <div style={{ padding: "16px" }}>
      {tabs.map(tab => {
        const Component = MAP[tab.component];
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
