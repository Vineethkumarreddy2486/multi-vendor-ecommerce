import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  updateQuantity
} from '../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 25;

  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <ShoppingBag size={60} className="mx-auto text-gray-300 mb-4" />

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything yet.
          </p>

          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          <h1 className="text-3xl font-bold text-gray-800">
            Shopping Cart
          </h1>

          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row gap-5"
            >
              <img
                src={item.images?.[0]}
                alt={item.title}
                className="w-full sm:w-40 h-40 object-cover rounded-xl bg-gray-100"
              />

              <div className="flex-1">
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.category}
                    </p>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <p className="text-blue-600 text-2xl font-bold mt-4">
                  ${item.price}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-4 mt-5">
                  <span className="text-sm text-gray-600">Quantity:</span>

                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item._id,
                            quantity: Math.max(1, item.quantity - 1)
                          })
                        )
                      }
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>

                    <span className="px-5 py-2">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item._id,
                            quantity: item.quantity + 1
                          })
                        )
                      }
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? 'Free' : `$${shipping}`}
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center mt-4 text-blue-600 hover:underline text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;