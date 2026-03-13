import axiosInstance from "../api/axiosConfig";

export const googleAuthService = {
  // Initiate Google login
  initiateGoogleLogin: () => {
    window.location.href = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/google`;
  },

  // Handle OAuth callback and set token
  handleGoogleCallback: (token, userInfo) => {
    if (token) {
      localStorage.setItem("userToken", token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      return true;
    }
    return false;
  },

  // Verify token on mount
  verifyToken: async (token) => {
    try {
      const response = await axiosInstance.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      return null;
    }
  },
};