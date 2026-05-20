// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import API from '../services/api';
// import {
//   Package,
//   DollarSign,
//   ShoppingCart,
//   Plus,
//   Trash2,
//   Edit,
//   Upload,
//   X,
//   ImagePlus
// } from 'lucide-react';

// const initialForm = {
//   title: '',
//   description: '',
//   category: 'Laptops',
//   price: '',
//   stockQuantity: '',
//   images: []
// };

// const VendorDashboard = () => {
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState(initialForm);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [imageError, setImageError] = useState('');
//   const fileInputRef = useRef(null);

//   const fetchVendorData = async () => {
//     try {
//       setLoading(true);
//       const [productsRes, ordersRes] = await Promise.all([
//         API.get('/products/vendor/my-products'),
//         API.get('/orders/vendor-orders')
//       ]);
//       setProducts(productsRes.data.data);
//       setOrders(ordersRes.data.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVendorData();
//   }, []);

//   const revenue = useMemo(() => {
//     return orders.reduce((acc, order) => acc + order.totalPrice, 0);
//   }, [orders]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Convert file to base64 string
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     setImageError('');

//     // Limit to 4 images total
//     if (imagePreviews.length + files.length > 4) {
//       setImageError('You can upload a maximum of 4 images.');
//       return;
//     }

//     // Validate each file
//     for (const file of files) {
//       if (!file.type.startsWith('image/')) {
//         setImageError('Only image files are allowed.');
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setImageError('Each image must be under 5MB.');
//         return;
//       }
//     }

//     try {
//       const base64Results = await Promise.all(files.map(fileToBase64));

//       const newPreviews = files.map((file, i) => ({
//         name: file.name,
//         src: base64Results[i]
//       }));

//       setImagePreviews((prev) => [...prev, ...newPreviews]);
//       setForm((prev) => ({
//         ...prev,
//         images: [...prev.images, ...base64Results]
//       }));
//     } catch (err) {
//       setImageError('Failed to process images. Please try again.');
//     }

//     // Reset file input so same file can be re-selected
//     e.target.value = '';
//   };

//   const removeImage = (index) => {
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//     setForm((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const resetForm = () => {
//     setForm(initialForm);
//     setImagePreviews([]);
//     setImageError('');
//     setEditingId(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (form.images.length === 0) {
//       setImageError('Please upload at least one product image.');
//       return;
//     }

//     try {
//       const payload = {
//         ...form,
//         price: Number(form.price),
//         stockQuantity: Number(form.stockQuantity)
//       };

//       if (editingId) {
//         await API.put(`/products/${editingId}`, payload);
//       } else {
//         await API.post('/products', payload);
//       }

//       resetForm();
//       setShowForm(false);
//       fetchVendorData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await API.delete(`/products/${id}`);
//       fetchVendorData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingId(product._id);
//     setForm({
//       title: product.title,
//       description: product.description,
//       category: product.category,
//       price: product.price,
//       stockQuantity: product.stockQuantity,
//       images: product.images
//     });
//     // Show existing images as previews
//     setImagePreviews(
//       product.images.map((src, i) => ({ name: `image-${i + 1}`, src }))
//     );
//     setShowForm(true);
//   };

//   const updateOrderStatus = async (id, status) => {
//     try {
//       await API.patch(`/orders/${id}/status`, { status });
//       fetchVendorData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="h-12 w-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-7xl mx-auto">

//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
//             <p className="text-gray-500 mt-1">Manage your products and orders</p>
//           </div>
//           <button
//             onClick={() => {
//               if (showForm) {
//                 resetForm();
//               }
//               setShowForm(!showForm);
//             }}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
//           >
//             <Plus size={20} />
//             Add Product
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div className="bg-white rounded-2xl shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Products</p>
//                 <h2 className="text-3xl font-bold mt-2">{products.length}</h2>
//               </div>
//               <Package className="text-blue-600" size={32} />
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Orders</p>
//                 <h2 className="text-3xl font-bold mt-2">{orders.length}</h2>
//               </div>
//               <ShoppingCart className="text-green-600" size={32} />
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Revenue</p>
//                 <h2 className="text-3xl font-bold mt-2">${revenue.toFixed(2)}</h2>
//               </div>
//               <DollarSign className="text-yellow-600" size={32} />
//             </div>
//           </div>
//         </div>

//         {/* Product Form */}
//         {showForm && (
//           <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">
//             <h2 className="text-2xl font-bold mb-6">
//               {editingId ? 'Edit Product' : 'Add Product'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <input
//                 type="text"
//                 name="title"
//                 placeholder="Product Title"
//                 value={form.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <textarea
//                 name="description"
//                 placeholder="Description"
//                 value={form.description}
//                 onChange={handleChange}
//                 required
//                 rows={4}
//                 className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                 <select
//                   name="category"
//                   value={form.category}
//                   onChange={handleChange}
//                   className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option>Mobile Phones</option>
//                   <option>Laptops</option>
//                   <option>Audio</option>
//                   <option>Wearables</option>
//                   <option>Accessories</option>
//                 </select>

//                 <input
//                   type="number"
//                   name="price"
//                   placeholder="Price"
//                   value={form.price}
//                   onChange={handleChange}
//                   required
//                   min="0.01"
//                   step="0.01"
//                   className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <input
//                   type="number"
//                   name="stockQuantity"
//                   placeholder="Stock"
//                   value={form.stockQuantity}
//                   onChange={handleChange}
//                   required
//                   min="0"
//                   className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Image Upload Section */}
//               <div>
//                 <p className="text-sm font-medium text-gray-700 mb-3">
//                   Product Images <span className="text-gray-400 font-normal">(up to 4, max 5MB each)</span>
//                 </p>

//                 {/* Image Previews */}
//                 {imagePreviews.length > 0 && (
//                   <div className="flex flex-wrap gap-3 mb-4">
//                     {imagePreviews.map((img, index) => (
//                       <div key={index} className="relative w-24 h-24">
//                         <img
//                           src={img.src}
//                           alt={img.name}
//                           className="w-24 h-24 object-cover rounded-xl border border-gray-200"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index)}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition"
//                         >
//                           <X size={12} />
//                         </button>
//                       </div>
//                     ))}

//                     {/* Add more slot */}
//                     {imagePreviews.length < 4 && (
//                       <button
//                         type="button"
//                         onClick={() => fileInputRef.current?.click()}
//                         className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition"
//                       >
//                         <ImagePlus size={22} />
//                         <span className="text-xs mt-1">Add more</span>
//                       </button>
//                     )}
//                   </div>
//                 )}

//                 {/* Upload Button (shown when no images yet) */}
//                 {imagePreviews.length === 0 && (
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="w-full border-2 border-dashed border-gray-300 rounded-xl py-10 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition"
//                   >
//                     <Upload size={32} className="mb-2" />
//                     <span className="font-medium">Click to upload images</span>
//                     <span className="text-sm mt-1">PNG, JPG, WEBP up to 5MB each</span>
//                   </button>
//                 )}

//                 {/* Hidden file input */}
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />

//                 {imageError && (
//                   <p className="text-red-500 text-sm mt-2">{imageError}</p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
//               >
//                 {editingId ? 'Update Product' : 'Create Product'}
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Products */}
//         <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">
//           <h2 className="text-2xl font-bold mb-6">Your Products</h2>
//           <div className="space-y-5">
//             {products.map((product) => (
//               <div
//                 key={product._id}
//                 className="border rounded-2xl p-5 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between"
//               >
//                 <div className="flex gap-5">
//                   <img
//                     src={product.images?.[0]}
//                     alt={product.title}
//                     className="w-28 h-28 rounded-xl object-cover bg-gray-100"
//                   />
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800">{product.title}</h3>
//                     <p className="text-gray-500 mt-2">{product.category}</p>
//                     <p className="text-blue-600 font-bold text-lg mt-2">${product.price}</p>
//                     <p className="text-sm text-gray-500 mt-1">Stock: {product.stockQuantity}</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => handleEdit(product)}
//                     className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded-xl flex items-center gap-2"
//                   >
//                     <Edit size={18} />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product._id)}
//                     className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-xl flex items-center gap-2"
//                   >
//                     <Trash2 size={18} />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Orders */}
//         <div className="bg-white rounded-2xl shadow-sm p-8">
//           <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div key={order._id} className="border rounded-2xl p-5">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
//                   <div>
//                     <p className="font-semibold text-gray-800">{order.customer?.name}</p>
//                     <p className="text-sm text-gray-500">{order.customer?.email}</p>
//                   </div>
//                   <div>
//                     <select
//                       value={order.status}
//                       onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                       className="border rounded-xl px-4 py-2"
//                     >
//                       <option>Pending</option>
//                       <option>Confirmed</option>
//                       <option>Shipped</option>
//                       <option>Delivered</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="space-y-3">
//                   {order.items.map((item) => (
//                     <div key={item._id} className="flex justify-between text-sm border rounded-xl p-3">
//                       <span>{item.title} × {item.quantity}</span>
//                       <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default VendorDashboard;




import React, { useEffect, useMemo, useRef, useState } from "react";
import API from "../services/api";
import {
  Package,
  DollarSign,
  ShoppingCart,
  Plus,
  Trash2,
  Edit,
  Upload,
  X,
  ImagePlus,
} from "lucide-react";

const initialForm = {
  title: "",
  description: "",
  category: "Laptops",
  price: "",
  stockQuantity: "",
  images: [],
};

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageError, setImageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef(null);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        API.get("/products/vendor/my-products"),
        API.get("/orders/vendor-orders"),
      ]);
      setProducts(productsRes.data.data);
      setOrders(ordersRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const revenue = useMemo(() => {
    return orders.reduce((acc, order) => acc + order.totalPrice, 0);
  }, [orders]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const MAX = 800;
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          } else {
            width = Math.round((width * MAX) / height);
            height = MAX;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };

      img.onerror = reject;
      img.src = url;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setImageError("");

    if (imagePreviews.length + files.length > 4) {
      setImageError("You can upload a maximum of 4 images.");
      return;
    }

    for (const file of files) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setImageError("Only image files are allowed.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setImageError("Image size is too big. Please choose a smaller image.");
        return;
      }
    }

    try {
      const base64Results = await Promise.all(files.map(fileToBase64));
      const newPreviews = files.map((file, i) => ({ name: file.name, src: base64Results[i] }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...base64Results] }));
    } catch (err) {
      setImageError("Failed to process images. Please try again.");
    }

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImagePreviews([]);
    setImageError("");
    setSubmitError("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (form.images.length === 0) {
      setImageError("Please upload at least one product image.");
      return;
    }

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
      } else {
        await API.post("/products", payload);
      }

      resetForm();
      setShowForm(false);
      fetchVendorData();
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to save product. Image may be too large, try a smaller one.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchVendorData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      images: product.images,
    });
    setImagePreviews(product.images.map((src, i) => ({ name: `image-${i + 1}`, src })));
    setSubmitError("");
    setShowForm(true);
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await API.patch(`/orders/${id}/status`, { status });
      fetchVendorData();
    } catch (err) {
      console.error(err);
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
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your products and orders</p>
          </div>
          <button
            onClick={() => {
              if (showForm) resetForm();
              setShowForm(!showForm);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <h2 className="text-3xl font-bold mt-2">{products.length}</h2>
              </div>
              <Package className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <h2 className="text-3xl font-bold mt-2">{orders.length}</h2>
              </div>
              <ShoppingCart className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Revenue</p>
                <h2 className="text-3xl font-bold mt-2">${revenue.toFixed(2)}</h2>
              </div>
              <DollarSign className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5"  noValidate>
              <input
                type="text"
                name="title"
                placeholder="Product Title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Mobile Phones</option>
                  <option>Laptops</option>
                  <option>Audio</option>
                  <option>Wearables</option>
                  <option>Accessories</option>
                </select>

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="number"
                  name="stockQuantity"
                  placeholder="Stock"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Product Images{" "}
                  <span className="text-gray-400 font-normal">(up to 4, max 10MB each)</span>
                </p>

                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {imagePreviews.map((img, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={img.src}
                          alt={img.name}
                          className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition"
                      >
                        <ImagePlus size={22} />
                        <span className="text-xs mt-1">Add more</span>
                      </button>
                    )}
                  </div>
                )}

                {imagePreviews.length === 0 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl py-10 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition"
                  >
                    <Upload size={32} className="mb-2" />
                    <span className="font-medium">Click to upload images</span>
                    <span className="text-sm mt-1">PNG, JPG, WEBP up to 10MB each</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imageError && (
                  <p className="text-red-500 text-sm mt-2">{imageError}</p>
                )}
              </div>

              {/* Submit Error */}
              {submitError && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                {editingId ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        )}

        {/* Products */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">Your Products</h2>
          <div className="space-y-5">
            {products.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No products yet. Add your first product!</p>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-2xl p-5 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between"
                >
                  <div className="flex gap-5">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-28 h-28 rounded-xl object-cover bg-gray-100"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{product.title}</h3>
                      <p className="text-gray-500 mt-2">{product.category}</p>
                      <p className="text-blue-600 font-bold text-lg mt-2">${product.price}</p>
                      <p className="text-sm text-gray-500 mt-1">Stock: {product.stockQuantity}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded-xl flex items-center gap-2"
                    >
                      <Edit size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-xl flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          <div className="space-y-6">
            {orders.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="border rounded-2xl p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div>
                      <p className="font-semibold text-gray-800">{order.customer?.name}</p>
                      <p className="text-sm text-gray-500">{order.customer?.email}</p>
                    </div>
                    <div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="border rounded-xl px-4 py-2"
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between text-sm border rounded-xl p-3"
                      >
                        <span>{item.title} × {item.quantity}</span>
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;