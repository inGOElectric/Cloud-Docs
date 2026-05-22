import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AdminTabsContext = createContext();

export function AdminTabsProvider({ children }) {
  const [tabs, setTabs] = useState([
    { id: "overview", title: "Overview", component: "overview" }
  ]);

  const [activeTab, setActiveTab] = useState("overview");

  const [adminNotifications, setAdminNotifications] = useState({
    bookings: false,
    complaints: false,
    testRides: false,
  });

  /* =====================================================
     FETCH ALL NOTIFICATIONS (BOOKINGS + COMPLAINTS + TEST RIDES)
  ====================================================== */

  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        // 1️⃣ Existing admin notifications (bookings + complaints)
        const adminRes = await client.get("/admin/notifications/status");

        // 2️⃣ Test ride unviewed count
        const testRideRes = await client.get(
          "/test-rides/unviewed-count"
        );

        setAdminNotifications(prev => ({
          ...prev,
          bookings: adminRes.data?.bookings || false,
          complaints: adminRes.data?.complaints || false,
          testRides: testRideRes.data?.count > 0,
        }));

      } catch (err) {
        console.error("Failed to fetch admin notifications", err);
      }
    };

    fetchNotificationStatus();
  }, []);

  /* =====================================================
     TAB LOGIC
  ====================================================== */

 const openTab = (id, title, component) => {
  setTabs(prev => {
    const exists = prev.find(t => t.id === id);
    if (exists) return prev;

    return [
      ...prev,
      { id, title, component, closable: true }
    ];
  });

  setActiveTab(id);
};

  const closeTab = (id) => {
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== id);

      if (activeTab === id && filtered.length) {
        setActiveTab(filtered[filtered.length - 1].id);
      }

      return filtered;
    });
  };

  return (
    <AdminTabsContext.Provider
      value={{
        tabs,
        activeTab,
        openTab,
        closeTab,
        setActiveTab,
        adminNotifications,
        setAdminNotifications,
      }}
    >
      {children}
    </AdminTabsContext.Provider>
  );
}

export const useAdminTabs = () => useContext(AdminTabsContext);
