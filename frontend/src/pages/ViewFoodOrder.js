import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewFoodOrder() {
  const { order_number } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/order-view-detail/${order_number}/`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(() => toast.error("Failed to load order details"));
  }, [order_number]);

  if (!data) return <AdminLayout><p className="text-center mt-5">Loading...</p></AdminLayout>;

  const { order, foods, order_address } = data;
 const user = order[0]?.user;

  const statusOptions = [
  "Order Confirmed",
  "Food being Prepared",
  "Food Pickup",
  "Food Delivered",
  "Order Cancelled"
];

const currentStatus = order.order_final_status || "";  // e.g., "Order Confirmed"

// Filter options: show only statuses after current one
const visibleOptions = statusOptions.slice(statusOptions.indexOf(currentStatus) + 1);

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="container mt-4">
        <h3 className="mb-3 text-center">Order Details #{order.order_number}</h3>

        <div className="row">
          <div className="col-md-6">
            <h5>User Info</h5>
            <table className="table table-bordered">
              <tbody>
                <tr><th>First Name</th><td>{user?.first_name}</td></tr>
                <tr><th>Last Name</th><td>{user?.last_name}</td></tr>
                <tr><th>Email</th><td>{user?.email}</td></tr>
                <tr><th>Mobile</th><td>{user?.mobile}</td></tr>
                <tr><th>Address</th><td>{order_address.address}</td></tr>
                <tr><th>Order Time</th><td>{order_address.order_time}</td></tr>
                <tr><th>Final Status</th><td>{order_address.order_final_status || "Pending"}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="col-md-6">
            <h5>Ordered Foods</h5>
            <table className="table table-bordered">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Price</th></tr>
              </thead>
              <tbody>
                {foods.map((food, idx) => (
                  <tr key={idx}>
                    <td><img src={`http://127.0.0.1:8000${food.image}`} width="60" alt="food" /></td>
                    <td>{food.item_name}</td>
                    <td>{food.item_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h5 className="mt-4">Tracking History</h5>
        {/* <table className="table table-bordered">
          <thead>
            <tr><th>#</th><th>Status</th><th>Remark</th><th>Date</th></tr>
          </thead>
          <tbody>
            {tracking.length === 0 ? (
              <tr><td colSpan="4" className="text-center">No tracking history yet</td></tr>
            ) : (
              tracking.map((track, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{track.status}</td>
                  <td>{track.remark}</td>
                  <td>{new Date(track.status_date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table> */}

{/* 
{order.order_final_status !== "Food Delivered" && (
  <div className="mt-4">
    <h5>Update Order Status</h5>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const status = e.target.status.value;
        const remark = e.target.remark.value;

        fetch("http://127.0.0.1:8000/api/update-order-status/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_number: order.order_number,
            status,
            remark,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.message) {
              toast.success(res.message);
              setTimeout(() => window.location.reload(), 1000);
            } else {
              toast.error(res.error || "Failed to update status");
            }
          })
          .catch(() => toast.error("Server error"));
      }}
    >
      <div className="mb-3">
        <label>Status</label>
        <select name="status" className="form-control" required>
  {visibleOptions.map((status, index) => (
    <option key={index} value={status}>{status}</option>
  ))}
</select>
      </div>

      <div className="mb-3">
        <label>Remark</label>
        <textarea name="remark" className="form-control" rows="3" required></textarea>
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-success">
          Update Status
        </button>
      </div>
    </form>
  </div>
)} */}


      </div>
    </AdminLayout>
  );
}

export default ViewFoodOrder;
