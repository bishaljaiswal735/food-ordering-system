import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { FaUsers, FaList, FaEdit, FaThLarge, FaFile, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import './admin.css';

function AdminSidebar() {
  const [openMenus, setOpenMenus] = useState({
    category: false,
    food: false,
    orders: false,
    reports: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };
  

  return (
    <div className="bg-dark text-white sidebar">
      <div className="sidebar-heading p-3 text-center border-bottom">
        
        <img src="/images/admin.png" className="img-fluid rounded-circle mb-2" width="70" alt="admin" />
        <h6 className="mb-0">Admin</h6>
       
        
      </div>
      <div className="list-group list-group-flush">

        <Link to="/admin-dashboard" className="list-group-item list-group-item-action bg-dark text-white">
          <FaThLarge /> Dashboard
        </Link>

        <Link to="/admin-users" className="list-group-item list-group-item-action bg-dark text-white">
          <FaUsers /> Reg Users
        </Link>

        {/* Food Category */}
        <button onClick={() => toggleMenu('category')} className="list-group-item bg-dark text-white border-0 w-100 text-start">
          <FaEdit /> Food Category {openMenus.category ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openMenus.category && (
          <div className="ps-4">
            <Link to="/admin/addcategory" className="list-group-item bg-dark text-white border-0">Add Category</Link>
            <Link to="/admin/managecategory" className="list-group-item bg-dark text-white border-0">Manage Category</Link>
          </div>
        )}

        {/* Food Menu */}
        <button onClick={() => toggleMenu('food')} className="list-group-item bg-dark text-white border-0 w-100 text-start">
          <FaEdit /> Food Menu {openMenus.food ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openMenus.food && (
          <div className="ps-4">
            <Link to="/admin/addfood" className="list-group-item bg-dark text-white border-0">Add Food</Link>
            <Link to="/admin/managefood" className="list-group-item bg-dark text-white border-0">Manage Food</Link>
          </div>
        )}

        {/* Orders */}
        <button onClick={() => toggleMenu('orders')} className="list-group-item bg-dark text-white border-0 w-100 text-start">
          <FaList /> Orders {openMenus.orders ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openMenus.orders && (
          <div className="ps-4">
            <Link to="/admin/orders/new" className="list-group-item bg-dark text-white border-0">Not Confirmed</Link>
            <Link to="/admin/orders/confirmed" className="list-group-item bg-dark text-white border-0">Confirmed</Link>
            <Link to="/admin/orders/preparing" className="list-group-item bg-dark text-white border-0">Being Prepared</Link>
            <Link to="/admin/ordes/pickup" className="list-group-item bg-dark text-white border-0">Food Pickup</Link>
            <Link to="/admin/orders/delivered" className="list-group-item bg-dark text-white border-0">Delivered</Link>
            <Link to="/admin/orders/cancelled" className="list-group-item bg-dark text-white border-0">Cancelled</Link>
            <Link to="/admin/orders/all" className="list-group-item bg-dark text-white border-0">All Orders</Link>
          </div>
        )}

        {/* Reports */}
        <button onClick={() => toggleMenu('reports')} className="list-group-item bg-dark text-white border-0 w-100 text-start">
          <FaFile /> Reports {openMenus.reports ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openMenus.reports && (
          <div className="ps-4">
            <Link to="/admin/report-datewise" className="list-group-item bg-dark text-white border-0">B/w Dates</Link>
            
          </div>
        )}

         <Link to="/admin-order/search" className="list-group-item list-group-item-action bg-dark text-white border-0">
          <FaSearch /> Search
        </Link>
        <Link to="/admin-reviews" className="list-group-item list-group-item-action bg-dark text-white">
          <FaSearch /> Manage Reviews
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebar;
