import { useAdminTabs } from "../../context/AdminTabsContext";

import AdminDashboard from "./AdminDashboard"; // 👈 your existing file
import Vehicles from "./Vehicles";
import WorkLogs from "./WorkLogs";

export default function AdminTabContent() {
  const { activeTab } = useAdminTabs();

  return (
    <>
      {activeTab === "overview" && <div>Overview</div>}
      {activeTab === "job-cards" && <AdminDashboard />}
      {activeTab === "vehicles" && <Vehicles />}
      {activeTab === "work-logs" && <WorkLogs />}
    </>
  );
}
