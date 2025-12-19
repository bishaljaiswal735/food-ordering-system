import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaThLarge,
  FaUsers,
  FaEdit,
  FaSearch,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";
import "../styles/admin.css";

const AdminSidebar = (props) => {
  const [openMenus, setOpenMenus] = useState({
    category: false,
    food: false,
    orders: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className="sidebar">
      {/* Admin Profile */}
      <div className="admin-profile">
        <img src="/images/admin.png" alt="Admin" />
        <h4>Admin</h4>
      </div>

      <Link to="/admin-dashboard" className="menu-item">
        <FaThLarge /> Dashboard
      </Link>

      <Link to="/admin-users" className="menu-item">
        <FaUsers /> Reg Users
      </Link>

      {/* Food Category */}
      <button className="menu-item" onClick={() => toggleMenu("category")}>
        <FaEdit /> Food Category
      </button>

      {openMenus.category && (
        <div className="submenu">
          <Link to="/add-category">Add Category</Link>
          <Link to="/manage-category">Manage Category</Link>
        </div>
      )}

      {/* Food Item */}
      <button className="menu-item" onClick={() => toggleMenu("food")}>
        <FaEdit /> Food Item
      </button>

      {openMenus.food && (
        <div className="submenu">
          <Link to="/add-food">Add Food</Link>
          <Link to="/manage-food">Manage Food</Link>
        </div>
      )}

      {/* Orders */}
      <button className="menu-item" onClick={() => toggleMenu("orders")}>
        <FaShoppingCart /> Orders
      </button>

      {openMenus.orders && (
        <div className="submenu">
          <Link to="/pending-orders">Pending Orders</Link>
          <Link to="/completed-orders">Completed Orders</Link>
        </div>
      )}

      <Link to="/search" className="menu-item">
        <FaSearch /> Search
      </Link>

      <Link to="/manage-reviews" className="menu-item">
        <FaStar /> Manage Reviews
      </Link>
    </div>
  );
};

export default AdminSidebar;
