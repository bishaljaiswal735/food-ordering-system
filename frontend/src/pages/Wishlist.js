import React, { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWishlist } from '../context/WishlistContext';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem('userId');
  const { wishlistCount, setWishlistCount } = useWishlist();

  const fetchWishlist = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`);
      const data = await res.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

 const removeFromWishlist = async (foodId) => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/wishlist/remove/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, food_id: foodId })
    });

    if (res.ok) {
      toast.success('Removed from Wishlist');
      fetchWishlist();
      // Update context
  const updated = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`);
  const updatedList = await updated.json();
  setWishlistCount(updatedList.length);
    } else {
      toast.error('Failed to remove item');
    }
  } catch (err) {
    toast.error('Error while removing from wishlist');
  }
};

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <PublicLayout>
      <div className="container py-5">
        <h2 className="mb-4">My Wishlist</h2>
        <div className="row">
          {wishlist.length === 0 ? (
            <p>No items in wishlist.</p>
          ) :wishlist.map((item) => (
  <div className="col-md-4 mb-4" key={item.food_id}>
    <div className="card h-100">
      <div className="position-relative">
        <img
          src={`http://127.0.0.1:8000${item.image}`}
          className="card-img-top"
          style={{ height: '180px', objectFit: 'cover' }}
          alt={item.item_name}
        />
        <i
          className="fas fa-heart position-absolute top-0 end-0 m-2 text-danger"
          style={{
            cursor: 'pointer',
            fontSize: '20px',
            background: 'white',
            borderRadius: '50%',
            padding: '5px'
          }}
         onClick={() => removeFromWishlist(item.food_id)}

          title="Remove from wishlist"
        ></i>
      </div>
      <div className="card-body">
        <h5 className="card-title">
          <Link to={`/food/${item.food_id}`}>{item.item_name}</Link>
        </h5>
        <p className="card-text text-muted">{item.item_description?.slice(0, 40)}...</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">Rs. {item.item_price}</span>
          <Link to={`/food/${item.food_id}`} className="btn btn-outline-primary btn-sm">
            Order Now
          </Link>
        </div>
      </div>
    </div>
  </div>
))

          }
        </div>
      </div>
      <ToastContainer />
    </PublicLayout>
  );
}

export default Wishlist;
