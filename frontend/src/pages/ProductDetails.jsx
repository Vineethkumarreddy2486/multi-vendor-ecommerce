// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { addToCart } from '../store/cartSlice';
// import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
// import API from '../services/api';
// import ReviewCard from '../components/ReviewCard';
// import { ShoppingCart, Heart, Star } from 'lucide-react';

// const ProductDetails = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [error, setError] = useState('');

//   const wishlistItems = useSelector((state) => state.wishlist.items);
//   const isWishlisted = wishlistItems.some((item) => item._id === product?._id);

//   const fetchProduct = async () => {
//     try {
//       setLoading(true);
//       const { data } = await API.get(`/products/${id}`);
//       setProduct(data.data);
//       setSelectedImage(data.data.images?.[0]);
//     } catch (err) {
//       setError('Failed to load product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   const handleAddToCart = () => {
//     for (let i = 0; i < quantity; i++) {
//       dispatch(addToCart(product));
//     }
//   };

//   const handleWishlist = () => {
//     if (isWishlisted) {
//       dispatch(removeFromWishlist(product._id));
//     } else {
//       dispatch(addToWishlist(product));
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         {error || 'Product not found'}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">

//         {/* Images */}
//         <div>
//           <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
//             <img
//               src={selectedImage}
//               alt={product.title}
//               className="w-full h-[450px] object-cover"
//             />
//           </div>

//           <div className="flex gap-3">
//             {product.images?.map((img, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedImage(img)}
//                 className={`border rounded-lg overflow-hidden w-20 h-20 ${
//                   selectedImage === img ? 'border-blue-600' : 'border-gray-200'
//                 }`}
//               >
//                 <img src={img} alt="" className="w-full h-full object-cover" />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-3">
//             {product.title}
//           </h1>

//           <div className="flex items-center gap-2 mb-4">
//             <div className="flex items-center text-yellow-500">
//               <Star size={18} fill="currentColor" />
//               <span className="ml-1 text-sm font-medium">
//                 {product.ratings?.average || 0}
//               </span>
//             </div>
//             <span className="text-gray-400 text-sm">
//               ({product.ratings?.count || 0} reviews)
//             </span>
//           </div>

//           <p className="text-4xl font-bold text-blue-600 mb-6">
//             ${product.price}
//           </p>

//           <p className="text-gray-600 leading-relaxed mb-6">
//             {product.description}
//           </p>

//           <div className="mb-6">
//             <span
//               className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 product.stockQuantity > 0
//                   ? 'bg-green-100 text-green-600'
//                   : 'bg-red-100 text-red-600'
//               }`}
//             >
//               {product.stockQuantity > 0
//                 ? `In Stock (${product.stockQuantity})`
//                 : 'Out of Stock'}
//             </span>
//           </div>

//           {/* Quantity */}
//           <div className="flex items-center gap-4 mb-8">
//             <span className="font-medium text-gray-700">Quantity:</span>
//             <div className="flex items-center border rounded-lg overflow-hidden">
//               <button
//                 onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
//                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
//               >
//                 -
//               </button>
//               <span className="px-6 py-2">{quantity}</span>
//               <button
//                 onClick={() =>
//                   setQuantity((prev) =>
//                     prev < product.stockQuantity ? prev + 1 : prev
//                   )
//                 }
//                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-4">
//             <button
//               onClick={handleAddToCart}
//               disabled={product.stockQuantity === 0}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
//             >
//               <ShoppingCart size={20} />
//               Add to Cart
//             </button>

//             <button
//               onClick={handleWishlist}
//               className={`border p-3 rounded-xl transition ${
//                 isWishlisted
//                   ? 'border-red-500 text-red-500 bg-red-50'
//                   : 'border-gray-300 hover:border-red-500 hover:text-red-500'
//               }`}
//             >
//               <Heart
//                 size={22}
//                 fill={isWishlisted ? 'currentColor' : 'none'}
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Reviews */}
//       <div className="max-w-7xl mx-auto mt-10">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">
//           Customer Reviews
//         </h2>

//         {product.reviews && product.reviews.length > 0 ? (
//           <div className="space-y-4">
//             {product.reviews.map((review) => (
//               <ReviewCard key={review._id} review={review} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl p-8 text-center text-gray-500">
//             No reviews yet
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;





import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import API from '../services/api';
import ReviewCard from '../components/ReviewCard';
import { ShoppingCart, Heart, Star } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item._id === product?._id);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.data);
      setSelectedImage(data.data.images?.[0]);
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/${id}`);
      setReviews(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      await API.post(`/reviews/${id}`, { rating, comment });
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviews();
      fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-[450px] object-cover"
            />
          </div>
          <div className="flex gap-3">
            {product.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`border rounded-lg overflow-hidden w-20 h-20 ${
                  selectedImage === img ? 'border-blue-600' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.title}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-yellow-500">
              <Star size={18} fill="currentColor" />
              <span className="ml-1 text-sm font-medium">{product.ratings?.average || 0}</span>
            </div>
            <span className="text-gray-400 text-sm">({product.ratings?.count || 0} reviews)</span>
          </div>

          <p className="text-4xl font-bold text-blue-600 mb-6">${product.price}</p>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="mb-4">
            <span className="text-sm text-gray-500">Category: </span>
            <span className="text-sm font-medium text-gray-700">{product.category}</span>
          </div>

          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.stockQuantity > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Sold by: <span className="font-medium text-gray-700">{product.vendor?.name}</span>
          </p>

          {/* Quantity */}
          {user?.role === 'customer' && (
            <div className="flex items-center gap-4 mb-8">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="px-6 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev < product.stockQuantity ? prev + 1 : prev)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          {user?.role === 'customer' && (
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`border p-3 rounded-xl transition ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart size={22} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto mt-10 bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Customer Reviews ({reviews.length})
        </h2>

        {/* Review Form - only for customers */}
        {isAuthenticated && user?.role === 'customer' && (
          <form onSubmit={handleReviewSubmit} className="mb-8 bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Write a Review</h3>

            {reviewError && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-3">
                {reviewError}
              </div>
            )}
            {reviewSuccess && (
              <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm mb-3">
                {reviewSuccess}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience with this product..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;