// CancelOrderModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function CancelOrderModal({ show, handleClose, orderNumber, paymentMode }) {
  const [remark, setRemark] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!remark.trim()) {
      setError('Please provide a reason for cancellation.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cancel_order/${orderNumber}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remark })
      });

      const result = await response.json();

      if (response.ok) {
        let msg = result.message;
        if (paymentMode === 'online') {
          msg += '\nSince you paid online, your amount will be refunded to your account within 2 days.';
        }
        setMessage(msg);
        setRemark('');
        setError('');
      } else {
        setError(result.message || 'Failed to cancel order.');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cancel Order #{orderNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message ? (
          <div className="alert alert-success">{message}</div>
        ) : (
          <Form>
            <Form.Group controlId="remarkTextarea">
              <Form.Label>Reason for cancellation</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter reason here..."
              />
            </Form.Group>
            {error && <div className="text-danger mt-2">{error}</div>}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        {!message && <Button variant="danger" onClick={handleSubmit}>Cancel Order</Button>}
      </Modal.Footer>
    </Modal>
  );
}

export default CancelOrderModal;
