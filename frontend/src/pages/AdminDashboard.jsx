import React, { useEffect, useMemo, useState } from 'react';
import API from '../services/api';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [ordersRes, productsRes] = await Promise.all([
        API.get('/orders'),
        API.get('/products')
      ]);

      setOrders(ordersRes.data.data);
      setProducts(productsRes.data.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, order) => acc + order.totalPrice, 0);
  }, [orders]);

  const totalCustomers = useMemo(() => {
    const unique = new Set(
      orders.map(order => order.customer?._id)
    );

    return unique.size;
  }, [orders]);

  const lowStockProducts = products.filter(
    (product) => product.stockQuantity < 5
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Platform overview and analytics
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Revenue
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  ${totalRevenue.toFixed(2)}
                </h2>
              </div>

              <DollarSign size={32} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Orders
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {orders.length}
                </h2>
              </div>

              <ShoppingCart size={32} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Products
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {products.length}
                </h2>
              </div>

              <Package size={32} className="text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Customers
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalCustomers}
                </h2>
              </div>

              <Users size={32} className="text-orange-600" />
            </div>
          </div>

        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Recent Orders
            </h2>

            <span className="text-sm text-gray-500">
              {orders.length} Orders
            </span>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="border-b text-left text-sm text-gray-500">

                  <th className="pb-4 font-medium">
                    Customer
                  </th>

                  <th className="pb-4 font-medium">
                    Transaction ID
                  </th>

                  <th className="pb-4 font-medium">
                    Amount
                  </th>

                  <th className="pb-4 font-medium">
                    Payment
                  </th>

                  <th className="pb-4 font-medium">
                    Status
                  </th>

                  <th className="pb-4 font-medium">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b last:border-none"
                  >

                    <td className="py-5">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {order.customer?.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.customer?.email}
                        </p>
                      </div>
                    </td>

                    <td className="py-5 text-sm text-gray-600">
                      {order.transactionId}
                    </td>

                    <td className="py-5 font-semibold">
                      ${order.totalPrice.toFixed(2)}
                    </td>

                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'Confirmed'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="py-5 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Low Stock Products
            </h2>

            <span className="text-sm text-red-500">
              {lowStockProducts.length} Warning
            </span>

          </div>

          {lowStockProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No low stock products
            </div>
          ) : (
            <div className="space-y-4">

              {lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                >

                  <div className="flex items-center gap-5">

                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-20 h-20 rounded-xl object-cover bg-gray-100"
                    />

                    <div>
                      <h3 className="font-bold text-gray-800">
                        {product.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold">
                      Only {product.stockQuantity} left
                    </span>
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;