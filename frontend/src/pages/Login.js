import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

function Login() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = formData;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userId', data.userId);  // storing user ID
        localStorage.setItem('userName', data.username);
        toast.success('✅ Login successful!');
        setTimeout(() => navigate('/'), 2000);
      } else {
         toast.error(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      toast.error('Server error. Try again.');
    }
  };

  return (
     <PublicLayout>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="text-center mb-4">
              <FaSignInAlt className="me-2" /> Login
            </h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow">
              <div className="mb-3">
                <input
                  type="text"
                  name="identifier"
                  className="form-control"
                  placeholder="Email or Mobile Number"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                />
                
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  <FaSignInAlt className="me-2" /> Login
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/register')}>
                  <FaUserPlus className="me-2" /> Register
                </button>
              </div>
            </form>
          </div>

          <div className="col-md-6 d-none d-md-block text-center">
            <img src="/images/login.png" alt="Login Illustration" className="img-fluid w-75 rounded-3 shadow" />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default Login;
