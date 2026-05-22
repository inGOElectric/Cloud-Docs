import { useState, useEffect } from "react";
import { AdminTabsProvider } from "../context/AdminTabsContext";
import "../styles/admin-theme.css";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import AdminTabsBar from "../components/admin/AdminTabsBar";
import AdminTabContent from "../components/admin/AdminTabContent";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* Detect screen size */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Auto close sidebar on mobile */
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <AdminTabsProvider>
      <div
        className="admin-theme"
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
        }}
      >

        {/* SIDEBAR */}
        <div
          style={{
            position: isMobile ? "fixed" : "relative",
            left: 0,
            top: 0,
            height: "100%",
            zIndex: 1000,
            transform:
              isMobile && !sidebarOpen
                ? "translateX(-100%)"
                : "translateX(0)",
            transition: "transform 0.3s ease",
          }}
        >
          <AdminSidebar open={sidebarOpen} />
        </div>

        {/* OVERLAY (Mobile only) */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
          />
        )}

        {/* MAIN CONTENT */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            overflow: "auto",
          }}
        >
          <AdminTopbar
            onToggleSidebar={() =>
              setSidebarOpen((prev) => !prev)
            }
          />

          <AdminTabsBar />

          <AdminTabContent />
        </div>

      </div>
    </AdminTabsProvider>
  );
}