import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast } from 'react-toastify';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


const userId = parseInt(localStorage.getItem('userId'));

function FoodDetail() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(0);
const [comment, setComment] = useState('');
const [hoveredRating, setHoveredRating] = useState(0);
const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/food-detail/${id}/`)
      .then(res => res.json())
      .then(data => setFood(data));

    fetch(`http://127.0.0.1:8000/api/reviews/${id}/`)
    .then(res => res.json())
    .then(data => setReviews(data));
  }, [id]);

  const handleOrderNow = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    toast.warning('Please login first');
    navigate('/login');
    return;
  }

  console.log('Sending to backend:', { userId, foodId: food.id });

  const response = await fetch('http://127.0.0.1:8000/api/cart/add/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: parseInt(userId),     // convert to int for backend consistency
      foodId: food.id               // already a number
    }),
  });

  const data = await response.json();

  if (response.ok) {
    toast.success('Item added to cart');
    navigate('/cart');
  } else {
    toast.error(data.message || 'Something went wrong');
  }
};


const handleReviewSubmit = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    toast.warning('Please login first to submit a review.');
    navigate('/login');
    return;
  }

  if (rating < 1 || rating > 5) {
    toast.error('Please select a rating from 1 to 5.');
    return;
  }

  const payload = {
    user_id: parseInt(userId),
    food: parseInt(id),
    rating,
    comment,
  };

  const url = editId
    ? `http://127.0.0.1:8000/api/reviews_edit/${editId}/`
    : `http://127.0.0.1:8000/api/reviews/add/${id}/`;

  const method = editId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    toast.success(editId ? 'Review updated' : 'Review submitted');
    setComment('');
    setRating(0);
    setEditId(null);  // clear edit mode
    const updatedReviews = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`).then(res => res.json());
    setReviews(updatedReviews);
  } else {
    toast.error('Failed to submit review');
  }
};


const fetchReviews = async () => {
  const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`);
  const data = await res.json();
  setReviews(data);
};


const renderStars = (count, clickable = false) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <i
        key={i}
        className={`fa-star ${i <= (hoveredRating || count) ? 'fas text-warning' : 'far text-secondary'}`}
        style={{ cursor: clickable ? 'pointer' : 'default', fontSize: '20px', marginRight: '4px' }}
        onClick={clickable ? () => setRating(i) : undefined}
        onMouseEnter={clickable ? () => setHoveredRating(i) : undefined}
        onMouseLeave={clickable ? () => setHoveredRating(0) : undefined}
      ></i>
    );
  }

  return stars;
};

const handleEditReview = (rev) => {
  setRating(rev.rating);
  setComment(rev.comment);
  setEditId(rev.id); // for backend PUT request later
};


const handleDeleteReview = async (id) => {
  const confirmDelete = window.confirm('Are you sure to delete this review?');
  if (!confirmDelete) return;

  const res = await fetch(`http://127.0.0.1:8000/api/reviews_edit/${id}/`, {
    method: 'DELETE',
  });

  if (res.ok) {
    toast.success('Review deleted');
    fetchReviews(); // reload
  } else {
    toast.error('Failed to delete');
  }
};



  if (!food) return <div className="text-center my-5">Loading...</div>;

  return (
    <PublicLayout>
      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            
            <div className="col-md-5 text-center">
            <Zoom>
  <img
    alt={food.item_name}
    src={`http://127.0.0.1:8000${food.image}`}
    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
  />
</Zoom>
            </div>

            <div className="col-md-7">
              <h2>{food.item_name}</h2>
              <p className="text-muted">{food.item_description}</p>
              <p><strong>Category:</strong> {food.category_name}</p>
  <p><strong>Quantity:</strong> {food.item_quantity}</p>
              <h4 className="text-success">Rs. {food.item_price}</h4>
              <p className="mt-3">Shipping: <strong>Free</strong></p>
             
              {food.is_available ? (
              <button className="btn btn-warning btn-lg mt-3 px-4 d-flex align-items-center gap-2" onClick={handleOrderNow}>
  <i className="fas fa-cart-plus"></i> Add to Cart
</button>
) : (
  <div title="This item is not available right now. Please try again later.">
  <button
    className="btn btn-outline-secondary btn-sm"
    disabled
  >
    <i className="fas fa-times-circle me-1"></i> Currently Unavailable
  </button>
</div>

)}


            </div>
          </div>



<hr />
<div className="mt-5">
  <h4>Customer Reviews</h4>
  {reviews.length === 0 ? (
    <p className="text-muted fst-italic">No reviews yet. Be the first to share your thoughts!</p>
  ) : (
    reviews.map((rev) => (
      <div key={rev.id} className="border-bottom mb-3 pb-2">
         <div className="d-flex justify-content-between align-items-center">
          <div>
    <strong>{rev.user_name}</strong> <span className="ms-2">{renderStars(rev.rating)}</span>
  </div>

{rev.user === userId && (
        <div className="text-end">

          <i
            className="fas fa-edit text-primary me-2"
            style={{ cursor: 'pointer', fontSize: '14px' }}
            title="Edit"
            onClick={() => handleEditReview(rev)}
          ></i>
          <i
            className="fas fa-trash-alt text-danger"
            style={{ cursor: 'pointer', fontSize: '14px' }}
            title="Delete"
            onClick={() => handleDeleteReview(rev.id)}
          ></i>
        </div>
      )}
      </div>

        <p className="mb-1">{rev.comment}</p>
        <small className="text-muted">{new Date(rev.created_at).toLocaleString()}</small>
      </div>
    ))
  )}
</div>

<div className="mt-5">

  <h5 className="d-flex align-items-center gap-2">
  <i className="fas fa-pen"></i> Write a Review
</h5>

  <div className="mb-3">
  <label className="form-label">Your Rating</label>
  <div>{renderStars(rating, true)}</div>
</div>

  <div className="mb-3">
    <textarea
      className="form-control"
      placeholder="Write your review..."
      rows={3}
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />
  </div>

  <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleReviewSubmit}>
  <i className="fas fa-paper-plane"></i> Submit Review
</button>

</div>


        </div>
      </section>
    </PublicLayout>
  );
}

export default FoodDetail;
