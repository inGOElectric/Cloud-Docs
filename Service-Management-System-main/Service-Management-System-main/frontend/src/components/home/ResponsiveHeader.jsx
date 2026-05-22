import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function ResponsiveHeader() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ✅ DYNAMIC STYLES (INSIDE COMPONENT) */

  const headerStyle = {
    width: "100%",
    height: isMobile ? "70px" : "200px",
    backgroundColor: "#01263B",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "0 16px" : "0 40px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const logoStyle = {
    height: isMobile ? "45px" : "100px",
  };

  const navLink = {
    color: "white",
    textDecoration: "none",
    fontSize: isMobile ? "14px" : "34px",
    fontWeight: 600,
  };

  const navDesktop = {
    display: "flex",
    gap: isMobile ? "16px" : "60px",
  };

  return (
    <header style={headerStyle}>
      
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="Logo" style={logoStyle} />
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>

        {/* DESKTOP NAV */}
        {!isMobile && (
          <>
            <nav style={navDesktop}>
              <Link to="/slots-availability" style={navLink}>
                Slots Availability
              </Link>
              <Link to="/test-ride" style={navLink}>
                Book Test Ride
              </Link>
              <Link to="/test-ride-feedback" style={navLink}>
                Feedback
              </Link>
            </nav>

            {/* LOGIN ICON */}
            <div style={{ position: "relative" }}>
              <div
                style={menuIcon}
                onClick={() => setLoginOpen(!loginOpen)}
              >
                <span style={bar}></span>
                <span style={bar}></span>
                <span style={bar}></span>
              </div>

              {loginOpen && (
                <div style={dropdownStyle}>
                  <div
                    style={dropdownItem}
                    onClick={() => navigate("/login/customer")}
                  >
                    Customer Login
                  </div>
                  <div
                    style={dropdownItem}
                    onClick={() => navigate("/login/staff")}
                  >
                    Staff Login
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* MOBILE MENU */}
        {isMobile && (
          <div style={menuIcon} onClick={() => setOpen(!open)}>
            <span style={bar}></span>
            <span style={bar}></span>
            <span style={bar}></span>
          </div>
        )}

        {/* MOBILE DROPDOWN */}
        {isMobile && open && (
          <div style={mobileMenu}>
            <Link to="/slots-availability" style={mobileLink}>
              Slots availability 
            </Link>
            <Link to="/test-ride" style={mobileLink}>
              Book Test Ride
            </Link>
            <Link to="/test-ride-feedback" style={mobileLink}>
              Feedback
            </Link>

            <div
              style={mobileLink}
              onClick={() => navigate("/login/customer")}
            >
              Customer Login
            </div>

            <div
              style={mobileLink}
              onClick={() => navigate("/login/staff")}
            >
              Staff Login
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* STATIC STYLES */

const menuIcon = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  cursor: "pointer",
};

const bar = {
  width: "22px",
  height: "2px",
  backgroundColor: "white",
  borderRadius: "2px",
};

const dropdownStyle = {
  position: "absolute",
  top: "50px",
  right: 0,
  backgroundColor: "#01263B",
  borderRadius: "8px",
  minWidth: "180px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
};

const dropdownItem = {
  padding: "12px 16px",
  color: "white",
  cursor: "pointer",
};

const mobileMenu = {
  position: "absolute",
  top: "70px",
  right: "16px",
  backgroundColor: "#01263B",
  borderRadius: "10px",
  width: "220px",
  display: "flex",
  flexDirection: "column",
};

const mobileLink = {
  padding: "14px",
  color: "white",
  textDecoration: "none",
  cursor: "pointer",
};