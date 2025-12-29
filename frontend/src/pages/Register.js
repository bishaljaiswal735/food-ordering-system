import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    password: '',
    repeatpassword: '',
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
    const { first_name, last_name, mobile, email, password, repeatpassword } = formData;

    if (password !== repeatpassword) {
      setMessage('Password and Confirm Password do not match.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/add-fetch-user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, mobile, email, password })
      });

      const data = await response.json();
      if (response.ok) {
       toast.success('You have successfully registered!');
setTimeout(() => {
  navigate('/login');
}, 2000); // wait for toast to show
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
    }
  };

  return (
    <PublicLayout>
       <ToastContainer position="top-right" autoClose={2000} />
      <div className="container py-5">
        <div className="row shadow-lg rounded-4 overflow-hidden">
          {/* Left: Registration Form */}
          <div className="col-md-6 bg-white p-4">
            <h3 className="mb-4 text-center">
              <i className="fas fa-user-plus me-2 text-primary"></i>Register
            </h3>
            {message && <div className="alert alert-info text-center">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" name="first_name" className="form-control" placeholder="First Name" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <input type="text" name="last_name" className="form-control" placeholder="Last Name" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <input type="email" name="email" className="form-control" placeholder="Email" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <input type="text" name="mobile" className="form-control" placeholder="Mobile Number" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <input type="password" name="password" className="form-control" placeholder="Password" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <input type="password" name="repeatpassword" className="form-control" placeholder="Repeat Password" required onChange={handleChange} />
                </div>
                <div className="col-12 d-grid mt-3">
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-user-check me-2"></i>Register Now
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Static Image */}
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
            <div className="text-center px-3">
              <img
                src="/images/registration.png" // change path if needed
                alt="Register Illustration"
                className="img-fluid"
              />
              <h5 className="mt-3">Registration is fast, secure and free.</h5>
              <p className="text-muted small">Join our food family and enjoy delicious food delivered to your door!</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default Register;
