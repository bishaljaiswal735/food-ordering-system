import React, { useEffect, useState } from 'react';

function TopProducts() {
  const [topFoods, setTopFoods] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/top-selling-foods/')
      .then(res => res.json())
      .then(data => setTopFoods(data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="card shadow mt-4">
      <div className="card-header bg-success text-white">
        <i className="fas fa-star me-2"></i>Top 5 Selling Foods
      </div>
      <div className="card-body table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Food Item</th>
              <th>Total Sold</th>
            </tr>
          </thead>
          <tbody>
            {topFoods.map((food, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{food.food__item_name}</td>
                <td>{food.total_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopProducts;
