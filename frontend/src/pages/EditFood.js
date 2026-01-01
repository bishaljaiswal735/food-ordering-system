import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import api from "../api/axios"; // Axios instance
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditFood() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null); // Only store new selected image

  const [formData, setFormData] = useState({
    category: "",
    item_name: "",
    item_description: "",
    item_quantity: "",
    item_price: "",
    image: "", // old image URL for preview
    is_available: false,
  });

  // Fetch food details + categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodRes = await api.get(`food-detail/${id}/`);
        setFormData(foodRes.data);

        const catRes = await api.get("add-fetch-category/");
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox
  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, is_available: e.target.checked });
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    // Append all fields except image
    payload.append("category", formData.category);
    payload.append("item_name", formData.item_name);
    payload.append("item_description", formData.item_description);
    payload.append("item_quantity", formData.item_quantity);
    payload.append("item_price", formData.item_price);
    payload.append("is_available", formData.is_available); // will be boolean string automatically

    // Only append new image if selected
    if (image) {
      payload.append("image", image);
    }

    try {
      const res = await api.patch(`food-detail/${id}/`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message || "Food updated successfully");
      setTimeout(() => navigate("/admin/managefood"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update food item");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center mb-4">Edit Food Item</h3>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-8">
                  {/* Category */}
                  <div className="form-group mb-3">
                    <label>Food Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Name */}
                  <div className="form-group mb-3">
                    <label>Item Name</label>
                    <input
                      type="text"
                      name="item_name"
                      value={formData.item_name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="form-group mb-3">
                    <label>Description</label>
                    <textarea
                      name="item_description"
                      value={formData.item_description}
                      onChange={handleChange}
                      className="form-control"
                      rows="3"
                      required
                    />
                  </div>

                  {/* Quantity */}
                  <div className="form-group mb-3">
                    <label>Quantity</label>
                    <input
                      type="text"
                      name="item_quantity"
                      value={formData.item_quantity}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="form-group mb-3">
                    <label>Price</label>
                    <input
                      type="text"
                      name="item_price"
                      value={formData.item_price}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  {/* Availability */}
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.is_available}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label">
                      {formData.is_available ? "Available" : "Not Available"}
                    </label>
                  </div>

                  {/* Image */}
                  <div className="form-group mb-3">
                    <label>Change Image (optional)</label>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="form-control"
                          accept="image/*"
                        />
                      </div>
                      <div className="col-md-6 text-center">
                        {formData.image && !image && (
                          <img
                            src={`http://127.0.0.1:8000${formData.image}`}
                            alt="Preview"
                            className="img-fluid"
                            style={{
                              maxHeight: "100px",
                              border: "1px solid #ccc",
                              padding: "4px",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                        {image && (
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="img-fluid"
                            style={{
                              maxHeight: "100px",
                              border: "1px solid #ccc",
                              padding: "4px",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">
                      Update Food Item
                    </button>
                  </div>
                </div>

                <div className="col-md-4 d-flex align-items-center justify-content-center">
                  <i
                    className="fa fa-edit"
                    style={{ fontSize: "150px", color: "#e5e5e5" }}
                  ></i>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditFood;
