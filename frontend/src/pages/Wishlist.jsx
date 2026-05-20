import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-3 mb-8">

          <div className="bg-red-100 p-3 rounded-xl">
            <Heart className="text-red-600" size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Wishlist
            </h1>

            <p className="text-gray-500 mt-1">
              Saved products for future purchase
            </p>
          </div>

        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-20 text-center">

            <Heart
              size={60}
              className="mx-auto text-gray-300 mb-5"
            />

            <h2 className="text-2xl font-bold text-gray-700 mb-3">
              Wishlist is empty
            </h2>

            <p className="text-gray-500">
              Save your favorite products here
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {items.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;