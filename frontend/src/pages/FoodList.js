import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/FoodList.css';


function FoodList() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
const [maxPrice, setMaxPrice] = useState(500); // You can adjust max as needed

  const [currentPage, setCurrentPage] = useState(1);
  const foodsPerPage = 9;

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/add-fetch-food/')
      .then(res => res.json())
      .then(data => {
        setFoods(data);
        setFilteredFoods(data);
      });

    fetch('http://127.0.0.1:8000/api/add-fetch-category/')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters(search, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilters(search, category);
  };

  const applyFilters = (searchTerm, category) => {
  let result = foods;

  if (searchTerm) {
    result = result.filter(food =>
      food.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (category !== 'All') {
    result = result.filter(food => food.category_name === category);
  }

  // ✅ Filter by price range
  result = result.filter(food =>
    parseFloat(food.item_price) >= minPrice && parseFloat(food.item_price) <= maxPrice
  );

  setFilteredFoods(result);
  setCurrentPage(1);
};





  // Pagination logic
  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood);
  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <PublicLayout>
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="mb-4 text-center">Find Your Delicious Foods Here..</h2>

          <div className="row mb-4">
            <div className="col-md-8">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search your favorite food"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="fa fa-search"></i>
                  </button>
                </div>

                

              </form>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="All">📂 All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.category_name}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>


<div className="row mb-4">
  <div className="col-md-12">
    <label className="form-label fw-bold my-2">
      Filter by Price: ₹{minPrice} - ₹{maxPrice}
    </label>

    
    <Slider
      range
      min={0}
      max={500}
      defaultValue={[minPrice, maxPrice]}
      onChange={(value) => {
        setMinPrice(value[0]);
        setMaxPrice(value[1]);
        applyFilters(search, selectedCategory);
      }}
    />
  </div>
</div>

          </div>

          <div className="row">
            {currentFoods.map((food) => (
              <div key={food.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow food-card">
                 
                  <img
                    src={`http://127.0.0.1:8000${food.image}`}
                    className="card-img-top"
                    alt={food.item_name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />

                  <div className="card-body">
                    <h5 className="card-title">{food.item_name}</h5>
                    <p className="card-text text-muted">
                      {food.item_description.slice(0, 60)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-success fw-bold">
                        ₹{food.item_price}
                      </span>
                      {food.is_available ? (
                      <Link
  to={`/food/${food.id}`}
  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
>
  <i className="fas fa-shopping-basket"></i> Order Now
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
            {currentFoods.length === 0 && (
            <div className="text-center mt-4 text-muted">
  <i className="fas fa-search-minus fa-2x mb-2"></i>
  <p>No matching food found. Try adjusting filters.</p>
</div>
            )}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4 d-flex justify-content-center">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                  <button className="page-link" onClick={() => paginate(1)}>First</button>
                </li>
                <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>Prev</button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">Page {currentPage} of {totalPages}</span>
                </li>
                <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                </li>
                <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                  <button className="page-link" onClick={() => paginate(totalPages)}>Last</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

export default FoodList;
