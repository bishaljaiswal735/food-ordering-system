import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage() {
  const query = useQuery().get('q') || '';
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`http://127.0.0.1:8000/api/add-fetch-food/?q=${query}`)
        .then(res => res.json())
        .then(data => setFoods(data));
    }
  }, [query]);

  return (
    <PublicLayout>
      <div className="container py-4">
        <h3 className="text-center text-primary">Results for: "{query}"</h3>
        <div className="row mt-4">
          {foods.length === 0 ? (
            <p className="text-center">No foods found.</p>
          ) : (
            foods.map((food, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100">
                  <img
                    src={`http://127.0.0.1:8000${food.image}`}
                    className="card-img-top"
                    alt={food.item_name}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                    </h5>
                    <p className="card-text text-muted">
                      {food.item_description?.slice(0, 40)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Rs. {food.item_price}</span>

 {food.is_available ? (
                      <Link to={`/food/${food.id}`} className="btn btn-outline-primary btn-sm">
                        Order Now
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
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

export default SearchPage;
