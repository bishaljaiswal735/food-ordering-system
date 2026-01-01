import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SearchOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/search-orders/?q=${searchTerm}`);
      const data = await res.json();
      setResults(data);
      setSubmitted(true);
    } catch (error) {
      toast.error("Failed to fetch search results");
    }
  };

  return (
   <AdminLayout>
  <ToastContainer />
  <div className="container mt-4">
    {/* Page Title */}
    <h4 className="text-center text-dark mb-4">
      <i className="fas fa-search me-2 text-primary"></i>
      Search Orders
    </h4>

    {/* Search Form */}
    <form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control w-50 shadow-sm rounded-start"
        placeholder="Enter Order Number"
        required
      />
      <button className="btn btn-info rounded-end ms-2 px-4" type="submit">
        <i className="fas fa-search me-1"></i> Search
      </button>
    </form>

    {/* Search Results */}
    {submitted && (
      <>
        <h6 className="text-center text-secondary mb-3">
          Results for "<span className="fw-bold">{searchTerm}</span>"
        </h6>

        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Order Number</th>
                    <th>Order Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length > 0 ? (
                    results.map((order, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{order.order_number}</td>
                        <td>{new Date(order.order_time).toLocaleString()}</td>
                        <td>
                          <a
                            href={`/admin/order-view/${order.order_number}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="fas fa-eye me-1"></i> View
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        No record found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
</AdminLayout>

  );
}

export default SearchOrders;
