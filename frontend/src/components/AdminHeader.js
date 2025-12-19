import React from "react";
import { FaBars, FaBell, FaSignOutAlt } from "react-icons/fa";

const AdminHeader = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
      
      {/* Left: Brand */}
      <span className="navbar-brand fw-semibold">
        🍴 Food Ordering System
      </span>

      {/* Right: Icons (desktop) */}
      <div className="d-none d-lg-flex align-items-center ms-auto gap-3">
        <FaBell style={{ cursor: "pointer" }} />
        <button className="btn btn-outline-danger btn-sm">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Hamburger (mobile only) */}
      <button
        className="navbar-toggler border-0 d-lg-none ms-auto"
        type="button"
      >
        <FaBars />
      </button>

    </nav>
  );
};

export default AdminHeader;
