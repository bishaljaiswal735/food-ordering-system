// ✅ React Change Password Page (/change-password)
import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ChangePassword() {
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/change_password/${userId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <PublicLayout>
         <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mt-4">
        <h3 className="mb-4 text-primary">
  <i className="fas fa-key me-2"></i> Change Password
</h3>
       <form onSubmit={handleSubmit} className="card p-4 shadow-sm rounded-4">
  <h5 className="fw-bold text-secondary mb-4">Update Your Password</h5>

  <div className="mb-3">
    <label className="form-label fw-semibold">Current Password</label>
    <input
      type="password"
      name="currentPassword"
      className="form-control"
      value={formData.currentPassword}
      onChange={handleChange}
      placeholder="Enter current password"
      required
    />
  </div>

  <div className="mb-3">
    <label className="form-label fw-semibold">New Password</label>
    <input
      type="password"
      name="newPassword"
      className="form-control"
      value={formData.newPassword}
      onChange={handleChange}
      placeholder="Enter new password"
      required
    />
  </div>

  <div className="mb-4">
    <label className="form-label fw-semibold">Confirm New Password</label>
    <input
      type="password"
      name="confirmPassword"
      className="form-control"
      value={formData.confirmPassword}
      onChange={handleChange}
      placeholder="Re-type new password"
      required
    />
  </div>

  <button type="submit" className="btn btn-success w-100">
    <i className="fas fa-check-circle me-2"></i>Change Password
  </button>
</form>

      </div>
    </PublicLayout>
  );
}

export default ChangePassword;
