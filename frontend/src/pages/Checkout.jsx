import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import {
  CreditCard,
  MapPin,
  ShoppingBag,
  CheckCircle
} from 'lucide-react';

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }, [items]);

  const shipping = subtotal > 1000 ? 0 : 20;

  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) return;

    try {
      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      await API.post('/orders', {
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode
        }
      });

      dispatch(clearCart());

      setSuccess(true);

      setTimeout(() => {
        navigate('/orders');
      }, 2500);

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || 'Order failed'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-lg w-full text-center">

          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">

            <CheckCircle
              size={50}
              className="text-green-600"
            />

          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Placed Successfully
          </h1>

          <p className="text-gray-500 mb-6">
            Your payment was processed and your order
            has been confirmed.
          </p>

          <div className="animate-pulse text-blue-600 font-medium">
            Redirecting to your orders...
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Checkout Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Checkout
          </h1>

          <form
            onSubmit={handlePlaceOrder}
            className="space-y-10"
          >

            {/* Shipping */}
            <div>

              <div className="flex items-center gap-3 mb-5">

                <MapPin className="text-blue-600" />

                <h2 className="text-xl font-bold">
                  Shipping Address
                </h2>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={form.street}
                  onChange={handleChange}
                  required
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={form.zipCode}
                  onChange={handleChange}
                  required
                  className="border rounded-xl px-4 py-3"
                />

              </div>

            </div>

            {/* Payment */}
            <div>

              <div className="flex items-center gap-3 mb-5">

                <CreditCard className="text-blue-600" />

                <h2 className="text-xl font-bold">
                  Payment Details
                </h2>

              </div>

              <div className="space-y-5">

                <input
                  type="text"
                  name="cardName"
                  placeholder="Card Holder Name"
                  value={form.cardName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={form.cardNumber}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3"
                />

                <div className="grid grid-cols-2 gap-5">

                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={handleChange}
                    required
                    className="border rounded-xl px-4 py-3"
                  />

                  <input
                    type="password"
                    name="cvv"
                    placeholder="CVV"
                    value={form.cvv}
                    onChange={handleChange}
                    required
                    className="border rounded-xl px-4 py-3"
                  />

                </div>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50"
            >
              {loading
                ? 'Processing Payment...'
                : `Pay $${total.toFixed(2)}`}
            </button>

          </form>

        </div>

        {/* Summary */}
        <div className="bg-white rounded-3xl shadow-sm p-8 h-fit sticky top-10">

          <div className="flex items-center gap-3 mb-8">

            <ShoppingBag className="text-blue-600" />

            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>

          </div>

          <div className="space-y-5 mb-8">

            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4"
              >

                <img
                  src={item.images?.[0]}
                  alt={item.title}
                  className="w-20 h-20 rounded-xl object-cover bg-gray-100"
                />

                <div className="flex-1">

                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Qty: {item.quantity}
                  </p>

                  <p className="text-blue-600 font-bold mt-2">
                    $
                    {(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </p>

                </div>

              </div>
            ))}

          </div>

          <div className="space-y-4 border-t pt-6">

            <div className="flex justify-between text-gray-600">

              <span>Subtotal</span>

              <span>
                ${subtotal.toFixed(2)}
              </span>

            </div>

            <div className="flex justify-between text-gray-600">

              <span>Shipping</span>

              <span>
                {shipping === 0
                  ? 'Free'
                  : `$${shipping}`}
              </span>

            </div>

            <div className="flex justify-between text-2xl font-bold pt-4 border-t">

              <span>Total</span>

              <span className="text-blue-600">
                ${total.toFixed(2)}
              </span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;