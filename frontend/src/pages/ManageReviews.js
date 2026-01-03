import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/all-reviews/')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setAllReviews(data);
      });
  }, []);

  const deleteReview = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const res = await fetch(`http://127.0.0.1:8000/api/delete_review/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter(r => r.id !== id));
      } else {
        toast.error("Failed to delete review");
      }
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="container mt-4">
        <h3 className="text-center mb-4 text-primary">
          <i className="fas fa-star me-2"></i>Manage Reviews
        </h3>

        <div className="card shadow">
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Food Item</th>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No reviews found</td>
                  </tr>
                ) : (
                  currentReviews.map((r, index) => (
                    <tr key={r.id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{r.food}</td>
                      <td>{r.user}</td>
                      <td>
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fa-star ${i < r.rating ? 'fas text-warning' : 'far'}`}
                          ></i>
                        ))}
                      </td>
                      <td>{r.comment || '-'}</td>
                      <td>{new Date(r.created_at).toLocaleString()}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteReview(r.id)}>
                          <i className="fas fa-trash-alt me-1"></i>Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="mt-3 d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button onClick={() => handlePageChange(page)} className="page-link">{page}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageReviews;
