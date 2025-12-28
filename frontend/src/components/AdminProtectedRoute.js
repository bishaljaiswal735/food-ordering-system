import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("access");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/admin-check/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setAuthorized(true);
        setLoading(false);
      })
      .catch(() => {
        localStorage.clear();
        setLoading(false);
      });
  }, []);

  if (loading) 
    return null;

  return authorized ? <Outlet /> : <Navigate to="/adminlogin" />;
};

export default AdminProtectedRoute;
