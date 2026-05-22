import { useAdminTabs } from "../../context/AdminTabsContext";
import client from "../../api/client";

export default function AdminSidebar({ open = true }) {
  return (
    <aside
      style={{
        width: open ? "240px" : "64px",
        transition: "width 0.25s ease",
        background: "#0f172a",
        color: "#fff",
        padding: "16px 8px",
        overflow: "hidden",
      }}
    >
      <h3 style={{ padding: "0 12px" }}>
        {open ? "ADMIN PANEL" : "🛠"}
      </h3>

      <Section title="Overview" open={open}>
        <Item id="overview" label="Overview" component="overview" open={open} />
      </Section>

      <Section title="Operations" open={open}>
        <Item
          id="service-bookings"
          label="Service Bookings"
          component="service-bookings"
          open={open}
        />

        <Item
          id="test-rides"
          label="Test Rides"
          component="test-rides"
          open={open}
        />

        <Item
          id="job-cards"
          label="Job Cards"
          component="job-cards"
          open={open}
        />

        <Item
          id="complaints"
          label="Complaints"
          component="complaints"
          open={open}
        />
      </Section>

      <Section title="Roles" open={open}>
        <Item id="customers" label="Customers" component="customers" open={open} />
        <Item id="technicians" label="Technicians" component="technicians" open={open} />
        <Item id="advisors" label="Advisors" component="advisors" open={open} />
        <Item id="sales" label="Sales" component="sales" open={open} />
      </Section>

      <Section title="System" open={open}>
        <Item id="vehicles" label="Vehicles" component="vehicles" open={open} />
        <Item id="parts" label="Parts" component="parts" open={open} />
        <Item id="media" label="Media" component="media" open={open} />
        <Item id="work-logs" label="Work Logs" component="work-logs" open={open} />
      </Section>
    </aside>
  );
}

/* ================= SECTION ================= */

function Section({ title, children, open }) {
  return (
    <div style={{ marginTop: "16px" }}>
      {open && (
        <div
          style={{
            fontSize: "12px",
            opacity: 0.6,
            padding: "0 12px",
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

/* ================= ITEM ================= */

function Item({ id, label, component, open }) {
  const {
    openTab,
    activeTab,
    adminNotifications,
    setAdminNotifications,
  } = useAdminTabs();

  const isActive = activeTab === id;

  const showDot =
    (id === "service-bookings" && adminNotifications?.bookings) ||
    (id === "complaints" && adminNotifications?.complaints) ||
    (id === "test-rides" && adminNotifications?.testRides);

  const handleClick = async () => {
    openTab(id, label, component);

    try {
      /* ================= TEST RIDES ================= */
      if (id === "test-rides" && adminNotifications?.testRides) {
        await client.put("/test-rides/mark-viewed");

        const res = await client.get("/test-rides/unviewed-count");

        setAdminNotifications(prev => ({
          ...prev,
          testRides: res.data.count > 0,
        }));
      }

      /* ================= SERVICE BOOKINGS ================= */
      if (id === "service-bookings" && adminNotifications?.bookings) {
        await client.patch("/admin/notifications/bookings/viewed");

        setAdminNotifications(prev => ({
          ...prev,
          bookings: false,
        }));
      }

      /* ================= COMPLAINTS ================= */
      if (id === "complaints" && adminNotifications?.complaints) {
        await client.patch("/admin/notifications/complaints/viewed");

        setAdminNotifications(prev => ({
          ...prev,
          complaints: false,
        }));
      }

    } catch (err) {
      console.error("Notification clear error:", err);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: "pointer",
        padding: "10px 12px",
        margin: "4px 0",
        borderRadius: "6px",
        background: isActive ? "#2563eb" : "transparent",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{open ? label : label[0]}</span>

      {showDot && (
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
          }}
        />
      )}
    </div>
  );
}
