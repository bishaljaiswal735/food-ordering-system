import React, { useState , useEffect} from 'react';
import PublicLayout from '../components/PublicLayout';
import '../styles/track.css';
import { useParams } from 'react-router-dom';


function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingData, setTrackingData] = useState([]);
  const [error, setError] = useState('');
  const { orderNumber: paramOrderNumber } = useParams();


  useEffect(() => {
  if (paramOrderNumber) {
    setOrderNumber(paramOrderNumber);
    handleTrack(paramOrderNumber); // Auto trigger on param
  }
}, [paramOrderNumber]);

  const handleTrack = async (passedOrder = orderNumber) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/track_order/${passedOrder}/`);
    if (res.ok) {
      const data = await res.json();
      setTrackingData(data);
      setError('');
    } else {
      setError('Order not found or not placed yet.');
      setTrackingData([]);
    }
  } catch (err) {
    console.error(err);
    setError('An error occurred.');
  }
};

  const getBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'order placed': return 'bg-secondary';
      case 'order confirmed': return 'bg-info';
      case 'food being prepared': return 'bg-warning';
      case 'order pickup for delivery': return 'bg-primary';
      case 'order delivered': return 'bg-success';
      case 'order cancelled': return 'bg-danger';
      default: return 'bg-dark';
    }
  };

  return (
    <PublicLayout>
      <div className="container mt-4">
       <h3 className="mb-4"><i className="fas fa-map-marker-alt me-2"></i>Track Your Order</h3>

<div className="input-group mb-3 shadow-sm">
  <span className="input-group-text bg-white">
    <i className="fas fa-receipt text-muted"></i>
  </span>
  <input
    type="text"
    className="form-control"
    placeholder="Enter Order Number"
    value={orderNumber}
    onChange={(e) => setOrderNumber(e.target.value)}
  />
</div>

<button onClick={() => handleTrack(orderNumber)} className="btn btn-primary mb-4">
  <i className="fas fa-truck me-2"></i> Track
</button>


        {error && <div className="alert alert-danger">{error}</div>}

        {trackingData.length > 0 && (
          <div className="card p-4 shadow-sm rounded-4 border-0">
  <h5 className="mb-4 text-primary">
    <i className="fas fa-stream me-2"></i>Order Status Timeline
  </h5>

            {/* Timeline */}
             <div className="d-flex justify-content-between align-items-center mb-5 position-relative px-2">
    <div className="timeline-line"></div>
    {trackingData.map((entry, index) => (
                <div key={index} className="text-center flex-fill timeline-step">
        <div
          className={`icon text-white ${getBadge(entry.status)} mx-auto mb-2`}
        >
          <i className="fas fa-check"></i>
        </div>
        <small className="d-block fw-bold">{entry.status}</small>
        <small className="text-muted">{new Date(entry.status_date).toLocaleString()}</small>
      </div>
              ))}

              
            </div>

            {/* Details */}
            <h6 className="mb-2">Detailed History</h6>
            <ul className="list-group">
              {trackingData.map((entry, index) => (
                <li key={index} className="list-group-item">
                  <span className={`badge ${getBadge(entry.status)} me-2`}>{entry.status}</span>
                  {entry.remark}
                  <br />
                  <small className="text-muted">{new Date(entry.status_date).toLocaleString()}</small>
                  {entry.order_cancelled_by_user && (
                    <span className="badge bg-danger ms-2">Cancelled by user</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          
        )}
      </div>
    </PublicLayout>
  );
}

export default TrackOrder;
