import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../assets/Login-image.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, getUserProfile } from "../redux/slices/authSlice";
import { fetchCart } from "../redux/slices/cartSlice";
import GoogleLoginButton from "../components/Auth/GoogleLoginButton";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      // Fetch latest profile and cart data
      dispatch(getUserProfile()).then(() => {
        dispatch(fetchCart());
      });
      navigate("/");
    }
  }, [user, navigate, dispatch]);

  // Handle OAuth redirect callback
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const errorMsg = searchParams.get("error");

    if (token) {
      const email = searchParams.get("email");
      const name = searchParams.get("name");
      
      localStorage.setItem("userToken", token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          email,
          name,
          _id: "", // Will be fetched from profile
        })
      );

      // Fetch full user profile and cart
      dispatch(getUserProfile()).then(() => {
        dispatch(fetchCart());
      });

      // Clear the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      navigate("/");
      toast.success("Logged in successfully!");
    }

    if (errorMsg) {
      toast.error(`Login failed: ${errorMsg}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12 bg-pink-50">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 font-medium mb-4"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <GoogleLoginButton isLoading={loading} />

          <p className="text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pink-500 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block w-1/2">
        <img
          src={loginImage}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;