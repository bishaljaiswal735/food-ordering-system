import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function OrdersNotConfirmed() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders-not-confirmed/")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => toast.error("Failed to fetch orders"));
  }, []);

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="container mt-4">
        <h3 className="text-center text-primary mb-4">Detail of Order Not Confirmed</h3>
        <div className="card shadow">
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Order Number</th>
                  <th>Order Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="4" className="text-center">No orders found.</td></tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td>{order.order_number}</td>
                      <td>{new Date(order.order_time).toLocaleString()}</td>
                      <td>
                         <Link
                            to={`/admin/order-view/${order.order_number}`}
                            className="btn btn-sm btn-info"
                          >
                            View Details
                          </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default OrdersNotConfirmed;
