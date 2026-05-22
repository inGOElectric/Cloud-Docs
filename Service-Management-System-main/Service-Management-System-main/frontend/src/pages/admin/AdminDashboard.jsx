import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import AdminTabs from "../../components/admin/AdminTabs";
import { AdminTabsProvider } from "../../context/AdminTabsContext";

export default function AdminDashboard() {
  return (
    <AdminTabsProvider>
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-main">
          <AdminTopbar />
          <AdminTabs />

          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminTabsProvider>
  );
}
