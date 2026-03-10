import { useState } from "react";
import { Link } from "react-router-dom";
import loginImage from "../assets/Login-image.jpeg"; // change this to your image path

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12 bg-pink-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-md"
        >
          {/* Logo / Brand */}
          <div className="flex justify-center mb-6">
            <h2 className="text-2xl font-bold text-pink-600">🧶 CozyCrochet</h2>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome Back 💖
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Login to continue shopping handmade goodies
          </p>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Register */}
          <p className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-pink-500 font-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block w-1/2">
        <img
          src={loginImage}
          alt="Login"
          className="h-full w-full object-cover"
        />
      </div>

    </div>
  );
};

export default Login;
