import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, getUserProfile } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import MyOrders from "./MyOrderPage";
import { User, Mail, LogOut, Settings } from "lucide-react";

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
    if (user?._id) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user?._id]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FBF9F6] py-10 px-4 sm:px-6 lg:px-8 font-display">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Account</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section: Profile Card */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-white shadow-sm border border-slate-100 rounded-3xl p-8 sticky top-24">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <User size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                <div className="flex items-center text-slate-500 mt-2 gap-2">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                {user.isAdmin && (
                  <span className="mt-3 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    Admin User
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <button
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-100 transition-colors font-medium border border-slate-200"
                >
                  <Settings size={18} />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 px-4 rounded-xl hover:bg-red-100 transition-colors font-medium border border-red-100"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: Orders */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <MyOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
