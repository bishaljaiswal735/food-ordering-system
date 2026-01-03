import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaRupeeSign,
} from "react-icons/fa";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const { setCartCount } = useCart();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/cart/cart-list/${userId}/`)
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is always an array
        const itemsArray = Array.isArray(data) ? data : [];
        setCartItems(itemsArray);

        const total = itemsArray.reduce(
          (sum, item) => sum + parseFloat(item.food.item_price) * item.quantity,
          0
        );
        setGrandTotal(total);
      })
      .catch((err) => {
        console.error("Failed to fetch cart:", err);
        setCartItems([]);
        setGrandTotal(0);
      });
  }, [userId]);

  const updateQuantity = async (orderId, newQty) => {
    if (newQty < 1) return;

    const response = await fetch(
      `http://127.0.0.1:8000/api/cart/update-quantity/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, quantity: newQty }),
      }
    );

    if (response.ok) {
      const updated = await fetch(
        `http://127.0.0.1:8000/api/cart/cart-list/${userId}/`
      );
      const data = await updated.json();
      const itemsArray = Array.isArray(data) ? data : [];
      setCartItems(itemsArray);
      setCartCount(itemsArray.length);

      const total = itemsArray.reduce(
        (sum, item) => sum + parseFloat(item.food.item_price) * item.quantity,
        0
      );
      setGrandTotal(total);
    }
  };

  const deleteCartItem = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this item?"
    );
    if (!confirmDelete) return;

    const response = await fetch(
      `http://127.0.0.1:8000/api/cart/delete/${orderId}/`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const updated = await fetch(
        `http://127.0.0.1:8000/api/cart/cart-list/${userId}/`
      );
      const data = await updated.json();
      const itemsArray = Array.isArray(data) ? data : [];
      setCartItems(itemsArray);
      setCartCount(itemsArray.length);

      const total = itemsArray.reduce(
        (sum, item) => sum + parseFloat(item.food.item_price) * item.quantity,
        0
      );
      setGrandTotal(total);
    }
  };

  return (
    <PublicLayout>
      <div className="container py-5">
        <h2 className="mb-4 text-center">
          <FaShoppingCart className="me-2 text-primary" /> Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-muted">Your cart is empty.</p>
        ) : (
          <>
            <div className="row">
              {cartItems.map((item) => (
                <div className="col-md-6 mb-4" key={item.id}>
                  <div className="card shadow-sm border-0 h-100">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={`http://127.0.0.1:8000${item.food.image}`}
                          alt={item.food.item_name}
                          className="img-fluid rounded-start"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{item.food.item_name}</h5>
                          <p className="card-text text-muted small">
                            {item.food.item_description}
                          </p>
                          <p className="fw-bold text-success">
                            <FaRupeeSign className="me-1" />
                            {item.food.item_price}
                          </p>

                          <div className="d-flex align-items-center mb-2">
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus />
                            </button>
                            <span className="fw-bold px-2">
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-secondary ms-2"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <FaPlus />
                            </button>
                          </div>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteCartItem(item.id)}
                          >
                            <FaTrash className="me-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-4 mt-4 border-0 shadow-sm">
              <h4 className="text-end">
                Total: <FaRupeeSign className="me-1" />
                {grandTotal.toFixed(2)}
              </h4>
              <div className="text-end">
                <button
                  className="btn btn-primary mt-3 px-4 py-2"
                  onClick={() => navigate("/payment")}
                >
                  <FaShoppingCart className="me-2" /> Proceed to Payment
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  );
}

export default Cart;
