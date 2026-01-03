import React, { useState } from 'react';
import { FaBell, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AdminHeader({ toggleSidebar, sidebarOpen, newOrders }) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);


const handleLogout = () => {
  // Remove user info
  localStorage.removeItem("adminUser");

  // Remove tokens
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // Redirect to login
  navigate("/adminlogin");
};

  
 
  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-3">
      {/* Sidebar Toggle Button */}
      <button className="btn btn-outline-dark me-3" onClick={toggleSidebar}>
        {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {/* Brand */}
      <span className="navbar-brand fw-semibold fs-5"><i className="fas fa-utensils me-2"></i> Food Ordering System</span>

      {/* Mobile toggle */}
      <button
        className="navbar-toggler ms-auto border-0"
        type="button"
        onClick={toggleNavbar}
      >
        <FaBars />
      </button>

      {/* Collapsible Items */}
      <div className={`collapse navbar-collapse ${isCollapsed ? 'show' : ''}`}>
        <ul className="navbar-nav ms-auto align-items-center gap-3">
          <li className="nav-item position-relative">
            <button
  className="btn btn-outline-secondary position-relative"
  onClick={() => {
    if (newOrders > 0) {
      navigate('orders/new');
    }
  }}
  title={newOrders > 0 ? 'View New Orders' : 'No new orders'}
>
  <FaBell />
  {newOrders > 0 && (
    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
      {newOrders}
    </span>
  )}
</button>

          </li>
          <li className="nav-item">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <FaSignOutAlt className="me-1" /> Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminHeader;
