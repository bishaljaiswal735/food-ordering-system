import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import api from "../api/axios"; // your axios instance

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch category detail
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`category-detail/${id}/`);
        setCategoryName(res.data.category_name);
      } catch (err) {
        console.error(err);
        alert("Error fetching category data");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  // Update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.patch(`category-detail/${id}/`, { category_name: categoryName });
      alert(res.data.message || "Category updated successfully");
      navigate("/admin/managecategory");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-5">Loading...</p>;

  return (
    <AdminLayout>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body px-4 py-5">
                <h4 className="mb-4 text-center text-dark">
                  <i className="fas fa-pen-square text-info me-2"></i>
                  Edit Food Category
                </h4>

                <form onSubmit={handleUpdate}>
                  <div className="form-group mb-4">
                    <label className="form-label fw-semibold">Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-success px-4"
                      disabled={submitting}
                    >
                      <i className="fas fa-save me-2"></i>
                      {submitting ? "Updating..." : "Update Category"}
                    </button>
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

export default EditCategory;
