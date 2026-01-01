import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from "react-csv";
import api from '../api/axios'; // Axios instance with token

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 5;

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('add-fetch-user/');
        setUsers(res.data);
        setAllUsers(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await api.delete(`user-detail/${id}/`);

      // Success response from backend
      toast.success(res.data.message || "User deleted");

      // Remove user from both arrays
      const updatedAllUsers = allUsers.filter(user => user.id !== id);
      const updatedUsers = users.filter(user => user.id !== id);

      setAllUsers(updatedAllUsers);
      setUsers(updatedUsers);

      // Adjust current page if it becomes empty
      const totalPagesAfterDelete = Math.ceil(updatedUsers.length / usersPerPage);
      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        setCurrentPage(totalPagesAfterDelete);
      } else if (totalPagesAfterDelete === 0) {
        setCurrentPage(1);
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  // Search users
  const handleSearch = (term) => {
    const keyword = term.toLowerCase();
    if (!keyword) {
      setUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (u) =>
          u.first_name.toLowerCase().includes(keyword) ||
          u.last_name.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword)
      );
      setUsers(filtered);
      setCurrentPage(1); // Reset page on search
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="container mt-4">
        <h3 className="text-center mb-4 text-primary">
          <i className="fas fa-users me-2"></i>User List
        </h3>
        <h5 className="text-end text-muted">
          Total Users: <span className="badge bg-success">{users.length}</span>
        </h5>

        <div className="card shadow">
          <div className="card-body table-responsive">

            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search by name or email..."
                onChange={(e) => handleSearch(e.target.value)}
              />
              <CSVLink
                data={users}
                filename={"user_list.csv"}
                className="btn btn-success"
                target="_blank"
              >
                Export to CSV
              </CSVLink>
            </div>

            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No users found</td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{indexOfFirstUser + index + 1}</td>
                      <td>{user.first_name}</td>
                      <td>{user.last_name}</td>
                      <td>{user.mobile}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUser(user.id)}
                        >
                          <i className="fas fa-trash-alt me-1"></i> Delete
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

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageUser;
