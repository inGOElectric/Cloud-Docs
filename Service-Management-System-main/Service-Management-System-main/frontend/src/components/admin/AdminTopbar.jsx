export default function AdminTopbar({ onToggleSidebar }) {
  const isMobile = window.innerWidth < 768;

  return (
    <header
      style={{
        minHeight: "56px",                
        background: "#01263B",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",          
        alignItems: "center",
        padding: "8px 16px",
        color: "#ffffff",
        gap: "10px",
        flexWrap: "wrap",                
      }}
    >
      {/* MENU BUTTON */}
      <button
        onClick={onToggleSidebar}
        style={{
          fontSize: isMobile ? "24px" : "32px",   
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#ffffff",
        }}
      >
        ☰
      </button>

      {/* TITLE */}
      <h1
        style={{
          fontSize: isMobile ? "18px" : "26px",   
          margin: 0,
          color: "#ffffff",
          fontWeight: "600",

          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",                  
        }}
      >
        Admin Dashboard
      </h1>
    </header>
  );
}