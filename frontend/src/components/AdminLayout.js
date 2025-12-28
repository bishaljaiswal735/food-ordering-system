import React, { useState , useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './admin.css';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function AdminLayout({ children }) {

const [sidebarOpen, setSidebarOpen] = useState(true); // 👈 Sidebar state
const [newOrders, setNewOrders] = useState(0);  // 🔔 Track new orders

// 👇 Collapse sidebar on smaller screens initially
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  };

  handleResize(); // Initial check
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

 // ✅ Fetch new orders count once
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard-metrics/")
      .then(res => res.json())
      .then(data => {
        setNewOrders(data.new_orders || 0);
      })
      .catch(err => console.error("Failed to fetch new orders:", err));
  }, []);
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="d-flex" id="wrapper">
      {/* Sidebar show/hide */}
      {sidebarOpen && <AdminSidebar />}

      <div
        id="page-content-wrapper"
        className={`flex-grow-1 ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}
      >

         {/* Toggle Button */}
        {/* <button className="btn btn-dark m-2" onClick={toggleSidebar}>
  {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
</button> */}

        <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} newOrders={newOrders} />

        <div className="container-fluid mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
