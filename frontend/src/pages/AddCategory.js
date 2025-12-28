import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { refreshToken } from '../components/Refresh';
import { useNavigate } from "react-router-dom";


function AddCategory() {
  let token = localStorage.getItem("access")
  const navigate = useNavigate
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      let response = await fetch("http://127.0.0.1:8000/api/add-fetch-category/", {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category_name: categoryName }),
    });
    if(response.status === 401){
       token = await refreshToken();
       if (!token){
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate('adminlogin/')
        return; 
       }
    }
     response = await fetch("http://127.0.0.1:8000/api/add-fetch-category/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category_name: categoryName }),
      });
      
      const data = await response.json();

      if (response.status === 201) {
        toast.success(data.message);
        setCategoryName('');
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow-sm rounded bg-white">
            <h4 className="mb-4 text-dark">
              <i className="fas fa-plus-circle text-primary me-2"></i>
              Add Food Category
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-success">
                <i className="fas fa-plus me-2"></i>Add Category
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-4 text-center d-flex align-items-center justify-content-center">
          <i className="fas fa-utensils" style={{ fontSize: '180px', color: '#e5e5e5' }}></i>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddCategory;
