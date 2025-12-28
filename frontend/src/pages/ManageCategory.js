import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from "react-csv";
import api from '../api/axios'; // Axios instance with refresh logic
import { toast } from 'react-toastify';

function ManageCategory() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const categoriesPerPage = 5; // adjust as needed
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("add-fetch-category/"); // Axios handles token & refresh
      setCategories(response.data);
      setAllCategories(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await api.delete(`category-detail/${id}/`);
      toast.success(response.data.message || "Category deleted successfully");
      setCategories(categories.filter(cat => cat.id !== id));
      setAllCategories(allCategories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Error deleting category");
    }
  };

  // Search categories
  const handleSearch = (term) => {
    const keyword = term.toLowerCase();
    if (!keyword) {
      setCategories(allCategories);
    } else {
      const filtered = allCategories.filter(
        (u) => u.category_name.toLowerCase().includes(keyword)
      );
      setCategories(filtered);
    }
    setCurrentPage(1); // reset to first page on search
  };

  return (
    <AdminLayout>
      <h3 className="text-center text-primary mb-4">
        <i className="fas fa-list-alt me-2"></i> Manage Food Category
      </h3>

      <h5 className="text-end text-muted">
        <i className="fas fa-database me-2"></i> Total Categories:{" "}
        <span className="badge bg-success">{categories.length}</span>
      </h5>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by category name..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        
        <CSVLink
          data={categories}
          filename={"category_list.csv"}
          className="btn btn-success"
          target="_blank"
        >
          <i className="fas fa-file-csv me-2"></i> Export to CSV
        </CSVLink>
      </div>

      <table className="table table-bordered table-hover table-striped">
        <thead className="table-dark">
          <tr>
            <th>S.No</th>
            <th>Category Name</th>
            <th>Creation Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((cat, index) => (
            <tr key={cat.id}>
              <td>{index + 1}</td>
              <td>{cat.category_name}</td>
              <td>{new Date(cat.creation_date).toLocaleString()}</td>
              <td>
                <Link
                  to={`/admin-category/edit/${cat.id}`}
                  className="btn btn-sm btn-primary me-2"
                >
                  <i className="fas fa-edit me-1"></i> Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(cat.id)}
                >
                  <i className="fas fa-trash-alt me-1"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-3 d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button onClick={() => handlePageChange(page)} className="page-link">
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </AdminLayout>
  );
}

export default ManageCategory;
