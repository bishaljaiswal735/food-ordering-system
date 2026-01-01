import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";
import api from "../api/axios";

function ManageFood() {
  const [foods, setFoods] = useState([]);
  const [allFoods, setAllFoods] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const foodsPerPage = 5;

  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoods = foods.slice(indexOfFirstFood, indexOfLastFood);
  const totalPages = Math.ceil(foods.length / foodsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  /* ================= FETCH FOODS ================= */
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await api.get("add-fetch-food/");
        setFoods(res.data);
        setAllFoods(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load food items");
      }
    };

    fetchFoods();
  }, []);

  /* ================= DELETE FOOD ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;

    try {
      const res = await api.delete(`food-detail/${id}/`);
      toast.success(res.data.message);
      setFoods((prev) => prev.filter((food) => food.id !== id));
    } catch (error) {
      toast.error("Failed to delete food item");
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = (term) => {
    const keyword = term.toLowerCase();
    if (!keyword) {
      setFoods(allFoods);
    } else {
      const filtered = allFoods.filter((f) =>
        f.item_name.toLowerCase().includes(keyword)
      );
      setFoods(filtered);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="container mt-4">
        <h3 className="text-center mb-4 text-primary">
          Manage Food Items
        </h3>

        <h5 className="text-end text-muted">
          <i className="fas fa-database me-2"></i> Total Food Items:{" "}
          <span className="badge bg-success">{foods.length}</span>
        </h5>

        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by food item name..."
            onChange={(e) => handleSearch(e.target.value)}
          />

          <CSVLink
            data={foods}
            filename={"food_list.csv"}
            className="btn btn-success"
          >
            <i className="fas fa-file-csv me-2"></i> Export to CSV
          </CSVLink>
        </div>

        <div className="card shadow">
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Category Name</th>
                  <th>Item Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {foods.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No food items found.
                    </td>
                  </tr>
                ) : (
                  currentFoods.map((food, index) => (
                    <tr key={food.id}>
                      <td>{index + 1}</td>
                      <td>
                        {food.category_name ||
                          food.category?.category_name}
                      </td>
                      <td>{food.item_name}</td>
                      <td>
                        <Link
                          to={`/admin/food-edit/${food.id}`}
                          className="btn btn-sm btn-info me-2"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(food.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-3 d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <li
                        key={page}
                        className={`page-item ${
                          page === currentPage ? "active" : ""
                        }`}
                      >
                        <button
                          onClick={() => handlePageChange(page)}
                          className="page-link"
                        >
                          {page}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageFood;
