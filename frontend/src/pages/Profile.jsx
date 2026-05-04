import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, getUserProfile } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import MyOrders from "./MyOrderPage";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">

          {/* Left Section: Profile Card */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6 bg-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {user.name}
            </h1>
            <p className="text-gray-600 mb-4">
              {user.email}
            </p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Right Section: Orders */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrders />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
