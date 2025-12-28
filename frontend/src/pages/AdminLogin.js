import React, {useState} from 'react'
import {FaUser,FaLock,FaSignInAlt} from 'react-icons/fa'
import '../styles/admin.css'
import {toast , ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const AdminLogin = () => {
  const [username ,setUserName] = useState('')
  const[password,setPassword] = useState('')
  const handleLogin = async (e) =>
  {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:8000/api/admin-login/',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({username,password})
    });
    const data = await response.json() 
    if(response.ok){
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        toast.success(data.message);
      setTimeout(() => {
        window.location.href = '/admindashboard';
      },2000)
    }
    else {
      console.log("hello how are you ")
      toast.error(data.message);
    }
    
  };
  return (
  <div
    className="d-flex justify-content-center align-items-center vh-100"
    style={{ backgroundImage: "url('/images/adminback.jpg')" }}
  >
    <div
      className="card p-4 shadow-lg"
      style={{ maxWidth: "400px", width: "100%" }}
    >
      <h4 className="text-center mb-4">
        <FaUser className="me-2 icon-fix" /> Login
      </h4>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">
            <FaUser className="me-1 icon-fix" /> UserName
          </label>
          <input
            type="text"
            className="form-control"
            value = {username}
            placeholder="Enter admin username"
            onChange={(e) => {setUserName(e.target.value)}}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            <FaLock className="me-1 icon-fix" /> Password
          </label>
          <input
            type="password"
            className="form-control"
            value = {password}
            placeholder="Enter password"
            onChange={(e) => {setPassword(e.target.value)}}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3">
          <FaSignInAlt className="me-1 icon-fix" /> Login
        </button>
      </form>
    </div>
    <ToastContainer position = 'top-right' autoClose = {2000}/>
  </div>

  )
}

export default AdminLogin
