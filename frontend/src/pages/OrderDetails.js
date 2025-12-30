import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout'; 
import CancelOrderModal from '../components/CancelOrderModal';

function OrderDetails() {
  const { order_number } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [orderAddress, setOrderAddress] = useState(null);
  const [total, setTotal] = useState(0);

  const [showCancelModal, setShowCancelModal] = useState(false);
const handleCloseModal = () => setShowCancelModal(false);

  useEffect(() => {
    // Fetch Order Items
    fetch(`http://127.0.0.1:8000/api/order/order_by_number/${order_number}/`)
      .then(res => res.json())
      .then(data => {
        setOrderItems(data);
        let totalAmount = 0;
        data.forEach(item => {
          totalAmount += parseFloat(item.food.item_price) * item.quantity;
        });
        setTotal(totalAmount);
      });

    // Fetch Order Address
    fetch(`http://127.0.0.1:8000/api/order_address/${order_number}/`)
      .then(res => res.json())
      .then(data => setOrderAddress(data));
  }, [order_number]);

  return (
     <PublicLayout>
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">
  <i className="fas fa-receipt me-2"></i>
  Order #{order_number} Details
</h3>
      <div className="row">
        {/* Order Items */}
        <div className="col-md-8">
          {orderItems.map((item, index) => (
            <div key={index} className="card mb-3 shadow-sm rounded-3 border-0">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={`http://127.0.0.1:8000${item.food.image}`} className="img-fluid rounded" alt={item.food.item_name} />
                </div>
                <div className="col-md-8 p-3">
                  <h5>{item.food.item_name} </h5>
                  <p>{item.food.item_description}</p>
                  <p><strong>Price:</strong> ₹{item.food.item_price}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Order Summary */}
        <div className="col-md-4">
          {orderAddress && (
             <div className="card p-4 shadow-sm border-0 rounded-3 bg-light">
            {/* <div className="card p-3">  aesa rakhna ho design toh aesa bhi rakh sakte ho*/}
              <h5 className="fw-semibold text-dark mb-3">
  <i className="fas fa-map-marker-alt me-2 text-danger"></i>Delivery Details
</h5>
              <p><strong>Date:</strong> {new Date(orderAddress.order_time).toLocaleString()}</p>
              <p><strong>Address:</strong> {orderAddress.address}</p>
              <p><strong>Status:</strong> {orderAddress.order_final_status || "Waiting for Confirmation"}</p>
              <p>
  <strong>Payment Mode:</strong>
  <span className="badge bg-info text-dark ms-2">{orderAddress.payment_mode}</span>
</p>
              <p><strong>Total:</strong> ₹{total}</p>

              {/* Actions */}
             <a href={`http://127.0.0.1:8000/api/invoice/${order_number}/`} target="_blank" className="btn btn-primary w-100 my-2">
  <i className="fas fa-file-invoice me-2"></i> Invoice
</a>
    {orderAddress && (
  <>
    <CancelOrderModal
      show={showCancelModal}
      handleClose={handleCloseModal}
      orderNumber={order_number}
      paymentMode={orderAddress.payment_mode}
    />

    {(orderAddress.order_final_status === null || 
      orderAddress.order_final_status === "Order Confirmed" || 
      orderAddress.order_final_status === "Food being Prepared") ? (
        <a onClick={() => setShowCancelModal(true)} className="btn btn-danger w-100">
  <i className="fas fa-times-circle me-2"></i> Cancel Order
</a>

    ) : (
        <p className="text-danger mt-2">
          ❌ Order cannot be cancelled (Current Status: {orderAddress.order_final_status})
        </p>
    )}
  </>
)}
            </div>
          )}
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}

export default OrderDetails;
