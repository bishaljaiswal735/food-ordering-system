import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

function PaymentPage() {
  const [paymentMode, setPaymentMode] = useState('');
  const [address, setAddress] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!paymentMode || !address) {
      alert('Please select a payment mode and enter your address');
      return;
    }

    if (paymentMode === 'online') {
      const { cardNumber, expiry, cvv } = cardDetails;
      if (!cardNumber || !expiry || !cvv) {
        alert('Please fill in all card details');
        return;
      }
    }

    const response = await fetch('http://127.0.0.1:8000/api/place_order/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
  userId: userId,
  address: address,
  paymentMode: paymentMode,
  cardNumber: paymentMode === 'online' ? cardDetails.cardNumber : '',
  expiry: paymentMode === 'online' ? cardDetails.expiry : '',
  cvv: paymentMode === 'online' ? cardDetails.cvv : ''
})
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
      navigate('/my-orders');
    }
  };

  return (
    <PublicLayout>
      <div className="container py-5">
        <h3 className="text-center text-primary mb-4">
  <i className="fas fa-credit-card me-2"></i>Checkout & Payment
</h3>

        <div className="card p-4 shadow-sm rounded-4">
          <div className="mb-3">
            <label className="form-label fw-semibold">Delivery Address</label>
<textarea
  className="form-control border-primary-subtle"
  rows="3"
  placeholder="Enter your full delivery address"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
></textarea>
          </div>


          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMode"
              value="cod"
              checked={paymentMode === 'cod'}
              onChange={() => setPaymentMode('cod')}
            />
            <label className="form-check-label">Cash on Delivery</label>
          </div>

          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMode"
              value="online"
              checked={paymentMode === 'online'}
              onChange={() => setPaymentMode('online')}
            />
            <label className="form-check-label">Online Payment</label>
          </div>



          {paymentMode === 'online' && (
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="1234 5678 **** ****"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Expiry</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">CVV</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="***"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                />
              </div>
            </div>
          )}

         <button className="btn btn-success mt-4 w-100" onClick={handlePlaceOrder}>
  <i className="fas fa-check-circle me-2"></i>Confirm & Place Order
</button>

        </div>
      </div>
    </PublicLayout>
  );
}

export default PaymentPage;
