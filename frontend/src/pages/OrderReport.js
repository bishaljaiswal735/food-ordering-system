import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { ToastContainer, toast } from 'react-toastify';

function OrderReport() {
  const [formData, setFormData] = useState({ from_date: '', to_date: '', status: 'all' });
  const [orders, setOrders] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrders([]);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/orders-between-dates/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
      else toast.error(data.error || 'Something went wrong');
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="container mt-4">
        <h4 className="mb-4 text-center text-primary">Between Dates Reports</h4>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row mb-3">
            <div className="col-md-4">
              <label>From Date</label>
              <input type="date" name="from_date" onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4">
              <label>To Date</label>
              <input type="date" name="to_date" onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4">
              <label>Status</label>
              <select name="status" onChange={handleChange} className="form-control">
                <option value="all">All</option>
                <option value="not_confirmed">Not Confirmed</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Food being Prepared">Food being Prepared</option>
                <option value="Food Pickup">Food Pickup</option>
                <option value="Food Delivered">Food Delivered</option>
                <option value="Order Cancelled">Order Cancelled</option>
              </select>
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </form>

        {orders.length > 0 && (
          <div className="card shadow">
            <div className="card-body table-responsive">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Order Number</th>
                    <th>Order Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td>{order.order_number}</td>
                      <td>{new Date(order.order_time).toLocaleString()}</td>
                      <td>
                        <a href={`/admin-order/view/${order.order_number}`} className="btn btn-sm btn-info">
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default OrderReport;