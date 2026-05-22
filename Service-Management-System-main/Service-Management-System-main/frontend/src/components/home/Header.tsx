import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header style={headerStyle}>
      {/* LEFT: Logo */}
      <div style={leftStyle}>
        <img src={logo} alt="InGO Logo" style={logoStyle} />
      </div>

      {/* RIGHT: Navigation */}
      <nav style={navStyle}>
        <Link to="/slots-availability" style={navLink}>
          Slots-availability
        </Link>
        
       <Link to="/test-ride" style={navLink}>
         Book Test Ride
        </Link>

        <Link to="/test-ride-feedback" style={navLink}>
          Feedback
        </Link>
        {/* Hamburger / Login */}
        <div style={{ position: "relative" }}>
          <div
            style={loginWrapper}
            onClick={() => setOpen(!open)}
          >
            <div style={menuIcon}>
              <span style={bar}></span>
              <span style={bar}></span>
              <span style={bar}></span>
            </div>
          </div>

          {open && (
            <div style={dropdownStyle}>
              <div
                style={dropdownItem}
                onClick={() => {
                  setOpen(false);
                  navigate("/login/customer");
                }}
              >
                Customer Login
              </div>

              <div
                style={dropdownItem}
                onClick={() => {
                  setOpen(false);
                  navigate("/login/staff");
                }}
              >
                Staff Login
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

/* ===============================
   STYLES
=============================== */

const headerStyle = {
  height: "150px",
  backgroundColor: "#01263B",
  display: "flex",
  alignItems: "center",
  padding: "0 48px",
};

const leftStyle = {
  display: "flex",
  alignItems: "center",
};

const logoStyle = {
  height: "200px",
};

const navStyle = {
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "36px",
};

const navLink = {
  color: "white",
  textDecoration: "none",
  fontSize: "35px",
  fontWeight: 500,
  transition: "0.3s",
};

const loginWrapper = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
};

const menuIcon = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
};

const bar = {
  width: "18px",
  height: "2px",
  backgroundColor: "white",
  borderRadius: "2px",
};

/* ===============================
   DROPDOWN
=============================== */

const dropdownStyle = {
  position: "absolute" as const,
  right: 0,
  top: "60px",
  backgroundColor: "#2f2f2f",
  borderRadius: "8px",
  minWidth: "180px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
  overflow: "hidden",
  zIndex: 1000,
};

const dropdownItem = {
  padding: "14px 18px",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};
const ctaButton = {
  backgroundColor: "white",
  color: "black",
  padding: "10px 22px",
  borderRadius: "12px",
  textDecoration: "none",
  fontSize: "18px",
  fontWeight: 600,
  transition: "0.2s",
};