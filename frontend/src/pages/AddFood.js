import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/axios';

function AddFood() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    item_description: '',
    item_quantity: '',
    item_price: '',
    image: null,
  });

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('add-fetch-category/');
        setCategories(res.data);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  /* ================= SUBMIT FORM ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("category", formData.category);
    data.append("item_name", formData.item_name);
    data.append("item_description", formData.item_description);
    data.append("item_quantity", formData.item_quantity);
    data.append("item_price", formData.item_price);
    data.append("image", formData.image);

    try {
      const res = await api.post(
        "add-fetch-food/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);

      setFormData({
        category: '',
        item_name: '',
        item_description: '',
        item_quantity: '',
        item_price: '',
        image: null,
      });

    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("Server error");
      }
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body px-4 py-5">

                <h4 className="text-center mb-1">
                  <i className="fas fa-hamburger text-primary me-2"></i>
                  Add Food Item
                </h4>
                <p className="text-muted text-center mb-4 small">
                  Fill in the details below to list a new dish
                </p>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="row">
                    <div className="col-md-8">

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Food Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="form-select"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.category_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Item Name</label>
                        <input
                          type="text"
                          name="item_name"
                          value={formData.item_name}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea
                          name="item_description"
                          value={formData.item_description}
                          onChange={handleChange}
                          className="form-control"
                          rows="3"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Quantity</label>
                        <input
                          type="text"
                          name="item_quantity"
                          value={formData.item_quantity}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Price (₹)</label>
                        <input
                          type="number"
                          step=".01"
                          name="item_price"
                          value={formData.item_price}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold">Image</label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="form-control"
                          accept="image/*"
                          required
                        />
                      </div>

                      <div className="text-center">
                        <button type="submit" className="btn btn-success px-4">
                          <i className="fas fa-plus me-2"></i>
                          Add Food Item
                        </button>
                      </div>
                    </div>

                    <div className="col-md-4 d-flex justify-content-center align-items-center">
                      <i className="fas fa-pizza-slice" style={{ fontSize: '140px', color: '#e5e5e5' }}></i>
                    </div>

                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddFood;
