import React, { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';

function ProfilePage() {
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/user/${userId}/`)
      .then(res => res.json())
      .then(data => setFormData(data));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://127.0.0.1:8000/api/user/${userId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name
      })
    });

    const result = await res.json();
    console.log(res.status)
    setMessage( res.status === 200 ? "Updated Successfully" : 'Something went wrong');
  };

  return (
    <PublicLayout>
      <div className="container mt-4">
        <h3 className="text-center mb-4 text-primary fw-bold">
  <i className="fas fa-user-circle me-2"></i>My Profile
</h3>
        {message && <div className="alert alert-info">{message}</div>}
<form onSubmit={handleSubmit} className="card p-4 shadow-sm rounded-4 border-0 bg-light">
        {/* <form onSubmit={handleSubmit} className="card p-4 shadow"> */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-semibold mb-1">First Name</label>
              <input type="text" className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-semibold mb-1">Last Name</label>
              <input type="text" className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-semibold mb-1">Email</label>
              <input type="email" className="form-control" value={formData.email} disabled />
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-semibold mb-1">Mobile Number</label>
              <input type="text" className="form-control" value={formData.mobile} disabled />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
  <i className="fas fa-save me-2"></i>Update Profile
</button>
        </form>
      </div>
    </PublicLayout>
  );
}

export default ProfilePage;
