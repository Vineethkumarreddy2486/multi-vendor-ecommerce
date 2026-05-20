// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../store/authSlice';
// import { clearCart } from '../store/cartSlice';
// import { ShoppingCart, Heart, Package, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';

// const Navbar = () => {
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const { items } = useSelector((state) => state.cart);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     dispatch(clearCart());
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
//       <Link to="/" className="text-xl font-bold tracking-wide">⚡ ElectroMart</Link>

//       <div className="flex items-center gap-4">
//         {!isAuthenticated ? (
//           <>
//             <Link to="/login" className="flex items-center gap-1 hover:text-blue-200">
//               <LogIn size={18} /> Login
//             </Link>
//             <Link to="/register" className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
//               <UserPlus size={18} /> Register
//             </Link>
//           </>
//         ) : (
//           <>
//             <span className="text-sm text-blue-200">Hi, {user?.name}</span>

//             {user?.role === 'customer' && (
//               <>
//                 <Link to="/wishlist" className="flex items-center gap-1 hover:text-blue-200">
//                   <Heart size={18} /> Wishlist
//                 </Link>
//                 <Link to="/orders" className="flex items-center gap-1 hover:text-blue-200">
//                   <Package size={18} /> Orders
//                 </Link>
//                 <Link to="/cart" className="flex items-center gap-1 hover:text-blue-200 relative">
//                   <ShoppingCart size={18} />
//                   Cart
//                   {items.length > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                       {items.length}
//                     </span>
//                   )}
//                 </Link>
//               </>
//             )}

//             {user?.role === 'vendor' && (
//               <Link to="/vendor/dashboard" className="flex items-center gap-1 hover:text-blue-200">
//                 <LayoutDashboard size={18} /> Dashboard
//               </Link>
//             )}

//             {user?.role === 'admin' && (
//               <Link to="/admin/dashboard" className="flex items-center gap-1 hover:text-blue-200">
//                 <LayoutDashboard size={18} /> Admin Panel
//               </Link>
//             )}

//             <button onClick={handleLogout} className="flex items-center gap-1 hover:text-blue-200">
//               <LogOut size={18} /> Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { clearCart } from '../store/cartSlice';

import {
  ShoppingCart,
  Heart,
  Package,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const cartCount = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());

    navigate('/login');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            ElectroMart
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <LogIn size={18} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-500">
                  Hi, <span className="font-semibold">{user?.name}</span>
                </span>

                {user?.role === 'customer' && (
                  <>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition"
                    >
                      <Heart size={18} />
                      Wishlist
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                    >
                      <Package size={18} />
                      Orders
                    </Link>

                    <Link
                      to="/cart"
                      className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                    >
                      <ShoppingCart size={18} />
                      Cart

                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {user?.role === 'vendor' && (
                  <Link
                    to="/vendor/dashboard"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                  >
                    <LayoutDashboard size={18} />
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t py-4 space-y-4">

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <LogIn size={18} />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <UserPlus size={18} />
                  Register
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  Hi, {user?.name}
                </p>

                {user?.role === 'customer' && (
                  <>
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Heart size={18} />
                      Wishlist
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Package size={18} />
                      Orders
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <ShoppingCart size={18} />
                      Cart ({cartCount})
                    </Link>
                  </>
                )}

                {user?.role === 'vendor' && (
                  <Link
                    to="/vendor/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <LayoutDashboard size={18} />
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;