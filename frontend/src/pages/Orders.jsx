import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my-orders');
      setOrders(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'Confirmed':
        return 'bg-blue-100 text-blue-700';

      case 'Shipped':
        return 'bg-purple-100 text-purple-700';

      case 'Delivered':
        return 'bg-green-100 text-green-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm p-6"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <h2 className="font-semibold text-gray-800">
                      {order._id}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Transaction ID
                    </p>

                    <h2 className="font-semibold text-gray-800">
                      {order.transactionId}
                    </h2>
                  </div>

                  <div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">

                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between border rounded-xl p-4"
                    >

                      <div className="flex items-center gap-4">

                        <img
                          src={item.product?.images?.[0]}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                        />

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {item.title}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="font-bold text-blue-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-6 pt-5 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Payment Status
                    </p>

                    <p className="font-semibold text-green-600">
                      {order.paymentStatus}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="text-2xl font-bold text-gray-800">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;