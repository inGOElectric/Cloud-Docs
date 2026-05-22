import { useAdminTabs } from "../../context/AdminTabsContext";

export default function AdminTabsBar() {
  const { tabs, activeTab, setActiveTab, closeTab } = useAdminTabs();

  return (
    <div className="admin-tabs-bar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`admin-tab ${
            activeTab === tab.id ? "active" : ""
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="admin-tab-label">{tab.title}</span>

          {tab.closable && (
            <span
              className="admin-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              ×
            </span>
          )}
        </div>
      ))}
    </div>
  );
}