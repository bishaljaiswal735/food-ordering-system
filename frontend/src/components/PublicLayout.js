import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaHome, FaUtensils, FaShoppingCart, FaUser, FaSignInAlt, FaUserPlus, FaUserCircle, FaCogs, FaSignOutAlt, FaTruck, FaUserShield } from "react-icons/fa";
import '../styles/layout.css';
import { useLocation } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";


const PublicLayout = ({ children }) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const { cartCount, setCartCount } = useCart();
  const { wishlistCount, setWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const fetchCartCount = async () => {
    if (userId) {
      const res = await fetch(`http://127.0.0.1:8000/api/cart/cart-list/${userId}/`);
      const data = await res.json();
      setCartCount(data.length);
    }
  };

 



  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (userId) {
      setIsLoggedIn(true);
      setUserName(name);
      fetchCartCount();
      fetchWishlistCount();
      
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setCartCount(0);
    setWishlistCount(0);
    setIsLoggedIn(false);
    navigate("/login");
  };

  const fetchWishlistCount = async () => {
  if (userId) {
    const res = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`);
    const data = await res.json();
    setWishlistCount(data.length);
    
  }
};

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <FaUtensils className="me-2" />
            Food Ordering
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item mx-1">
                <Link className={`nav-link ${location.pathname === "/" ? "active-nav-link" : ""}`} to="/"><FaHome className="me-1" />Home</Link>
              </li>
              <li className="nav-item mx-1">
                <Link className={`nav-link ${location.pathname === "/foods" ? "active-nav-link" : ""}`} to="/foods"><FaUtensils className="me-1" />Menu</Link>
              </li>
              <li className="nav-item mx-1">
                <Link className={`nav-link ${location.pathname === "/track" ? "active-nav-link" : ""}`} to="/track"><FaTruck className="me-1" />Track</Link>
              </li>

              {!isLoggedIn ? (
                <>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/register" ? "active-nav-link" : ""}`} to="/register"><FaUserPlus className="me-1" />Register</Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/login" ? "active-nav-link" : ""}`} to="/login"><FaSignInAlt className="me-1" />Login</Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/admin" ? "active-nav-link" : ""}`} to="/admin"><FaUserShield className="me-1" />Admin</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/my-orders" ? "active-nav-link" : ""}`} to="/my-orders"><FaUser className="me-1" />My Orders</Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/cart" ? "active-nav-link" : ""}`} to="/cart">
                      <FaShoppingCart className="me-1" />
                      Cart
                      {cartCount > 0 && (
                        <span className="badge bg-light text-dark ms-1">({cartCount})</span>
                      )}
                    </Link>
                  </li>

 <li className="nav-item mx-1">
  <Link className={`nav-link ${location.pathname === "/wishlist" ? "active-nav-link" : ""}`} to="/wishlist">
    <FaHeart className="me-1" />
    Wishlist
    {wishlistCount > 0 && (
      <span className="badge bg-light text-dark ms-1">({wishlistCount})</span>
    )}
  </Link>
</li>

                  <li className="nav-item dropdown mx-1">
                    <a className="nav-link dropdown-toggle" href="#" id="accountDropdown" role="button" data-bs-toggle="dropdown">
                      <FaUserCircle className="me-1" />
                      {userName}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className={`dropdown-item ${location.pathname === "/profile" ? "active-dropdown" : ""}`} to="/profile"><FaUser className="me-2" />Profile</Link></li>
                      <li><Link className={`dropdown-item ${location.pathname === "/change-password" ? "active-dropdown" : ""}`} to="/change-password"><FaCogs className="me-2" />Settings</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <FaSignOutAlt className="me-2" />Logout
                        </button>
                      </li>
                    </ul>
                  </li>

                



                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div>{children}</div>

      <footer className="text-dark text-center py-3 mt-5">
        <div className="container">
          <p className="mb-0">&copy; 2025 Food Ordering System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
