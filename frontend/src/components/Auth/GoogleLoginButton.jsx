import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = ({ isLoading = false }) => {
  const handleGoogleLogin = () => {
    const apiUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      <FcGoogle size={20} />
      <span className="text-gray-700 font-medium">
        {isLoading ? "Signing in..." : "Continue with Google"}
      </span>
    </button>
  );
};

export default GoogleLoginButton;