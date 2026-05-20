import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  return (
    <Link to={`/products/${product._id}`} className="block">
      <div className="bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          <h3 className="font-semibold text-gray-800 mt-2 text-sm line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500">
              {product.ratings?.average || 0} ({product.ratings?.count || 0})
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-blue-600 font-bold">${product.price}</span>
            {user?.role === 'customer' && (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700"
              >
                <ShoppingCart size={14} /> Add
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;