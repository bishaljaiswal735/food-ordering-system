import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import '../styles/home.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWishlist } from '../context/WishlistContext';



function Home() {
  const [foods, setFoods] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { wishlistCount, setWishlistCount } = useWishlist();
  const [ratings, setRatings] = useState({});
  const [hovered, setHovered] = useState(null);
  const userId = localStorage.getItem('userId');


  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/random_foods/')
      .then(res => res.json())
      .then(data => setFoods(data));
  }, []);






  // Fetch wishlist
  useEffect(() => {
    if (userId) {
      fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
        .then(res => res.json())
        .then(data => {
          const wishlistIds = data.map(item => item.food_id);
          setWishlist(wishlistIds);
        });
    }
  }, [userId]);


  useEffect(() => {
  const fetchAllRatings = async () => {
    const allRatings = {};
    for (let food of foods) {
      const res = await fetch(`http://127.0.0.1:8000/api/food-rating-summary/${food.id}/`);
      const data = await res.json();
      allRatings[food.id] = data;
    }
    setRatings(allRatings);
  };

  if (foods.length > 0) {
    fetchAllRatings();
  }
}, [foods]);




const toggleWishlist = async (foodId) => {
  if (!userId) {
    alert("Please log in to use wishlist.");
    return;
  }

  const isWishlisted = wishlist.includes(foodId);
  const endpoint = isWishlisted ? 'remove' : 'add';

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/wishlist/${endpoint}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, food_id: foodId }),
    });

     if (response.ok) {
      setWishlist(prev =>
        isWishlisted ? prev.filter(id => id !== foodId) : [...prev, foodId]
      );

      const updatedCount = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`);
  const wishlistData = await updatedCount.json();
  setWishlistCount(wishlistData.length);

      // ✅ Show toast
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } else {
      toast.error("Failed to update wishlist");
    }
  } catch (error) {
    console.error(`Error trying to ${endpoint} wishlist`, error);
    alert("Something went wrong.");
  }
};




 return (
  <PublicLayout>
    <section
  className="hero text-center py-5" style={{
    backgroundImage: "url('/images/bgimages.jpeg')" }}
>

  <div style={{
  backgroundColor: "rgba(0, 0, 0, 0.4)",  // dark overlay
  padding: "40px 20px",
  borderRadius: "10px",
  display: "inline-block"
}}>
      <div className="container">
        <h1 className="display-4">Quick & Hot Food, Delivered to You</h1>
        <p className="lead">Craving something tasty? Let's get it to your door!</p>
        <form method="GET" action="/search" className="d-flex justify-content-center mt-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
  <input
    type="text"
    name="q"
    placeholder="I would like to eat..."
    className="form-control rounded-start"
    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
  />
  <button className="btn btn-warning px-4" type="submit" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
    Search
  </button>
</form>

      </div>
      </div>
    </section>

    <div className="text-center bg-white py-2 text-muted">
  <i className="fas fa-truck text-primary me-2"></i>
  Serving Delicious Dishes Across <strong className="text-primary">Every Corner of Nepal</strong>
</div>




    <section className="popular py-5">
      <div className="container">
        <h2 className="text-center mb-4">
  Most Loved Dishes This Month
  <span className="badge bg-danger ms-2">Top Picks</span>
</h2>
        <div className="row">
          {foods.map((food, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card h-100 hovereffect">
                <div className="position-relative">
                <img
                  src={`http://127.0.0.1:8000${food.image}`}
                  className="card-img-top"
                  alt={food.item_name}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <i
                      className={`${wishlist.includes(food.id) ? "fas" : "far"} fa-heart heart-anim position-absolute top-0 end-0 m-2 text-danger`}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        background: "white",
                        borderRadius: "50%",
                        padding: "5px"
                      }}
                      title="Add to Wishlist"
                      onClick={() => toggleWishlist(food.id)}
                    ></i>
         

 
</div>
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                  </h5>
                  <p className="card-text text-muted">{food.item_description?.slice(0, 40)}...</p>

                   {ratings[food.id] && (
  <div
    className="rating-summary-wrapper position-relative mb-2"
    onMouseEnter={() => setHovered(food.id)}
    onMouseLeave={() => setHovered(null)}
  >
    <div>
      <span className="text-warning">
        {Array(Math.round(ratings[food.id].average)).fill().map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
        {Array(5 - Math.round(ratings[food.id].average)).fill().map((_, i) => (
          <i key={i} className="far fa-star"></i>
        ))}
      </span>
      <small className="text-muted ms-2">
        {ratings[food.id].average} ({ratings[food.id].total_reviews} ratings)
      </small>
    </div>

    {hovered === food.id && ratings[food.id].breakdown && (
     <div
  className="hover-popup position-absolute bg-white p-3 border rounded shadow"
  style={{ bottom: "100%", zIndex: 1000, width: "100%", marginBottom: "10px" }}
>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratings[food.id].breakdown[star] || 0;
          const percentage = ratings[food.id].total_reviews
            ? (count / ratings[food.id].total_reviews) * 100
            : 0;

          return (
            <div key={star} className="d-flex align-items-center mb-1">
              <small className="me-2" style={{ width: 50 }}>{star} star</small>
              <div className="progress flex-grow-1">
                <div
                  className="progress-bar bg-warning"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <small className="ms-2">{count}</small>
            </div>
          );
        })}
       
      </div>
    )}
  </div>
)}


                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Rs. {food.item_price}</span>
                  {food.is_available ? (
  <Link to={`/food/${food.id}`} className="btn btn-outline-primary btn-sm">
    <i className="fas fa-shopping-basket me-1"></i> Order Now
  </Link>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="how-it-works bg-dark text-white py-5">
      <div className="container text-center">
        <h2>Ordering in 3 Simple Steps</h2>
        <div className="row mt-4">
          <div className="col-md-4">
            <h4>1. Pick a dish you love</h4>
            <p>Explore hundreds of mouth-watering options and choose what you crave!</p>
          </div>
          <div className="col-md-4">
            <h4>2. Share your location</h4>
            <p>Tell us where you are, and we’ll handle the rest.</p>
          </div>
          <div className="col-md-4">
            <h4>3. Enjoy doorstep delivery</h4>
            <p>Relax while your meal arrives fast and fresh — pay when it’s delivered!</p>
          </div>
        </div>
        <p className="mt-3 text-warning">Pay easily with Cash on Delivery — hassle-free!</p>
      </div>
    </section>

    <section className="text-center py-5 bg-warning text-dark">
  <h4 className="mb-3">Ready to Satisfy Your Hunger?</h4>
  <Link to="/foods" className="btn btn-dark btn-lg">
    Browse Full Menu
  </Link>
</section>

<ToastContainer position="top-center" autoClose={2000} />
  </PublicLayout>
);

}

export default Home;
