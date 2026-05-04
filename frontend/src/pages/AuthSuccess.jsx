import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setGoogleUser, getUserProfile } from "../redux/slices/authSlice";
import { fetchCart } from "../redux/slices/cartSlice";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const name = searchParams.get("name");

    if (token && email) {
      try {
        // Store token in localStorage
        localStorage.setItem("userToken", token);

        // Dispatch Redux action with user data
        const userData = { email, name, _id: "" };
        dispatch(setGoogleUser(userData)); // ✅ Use the action

        // Fetch full profile and cart
        dispatch(getUserProfile()).then(() => {
          dispatch(fetchCart());
        });

        toast.success("Welcome! You're now logged in.");
        
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect to home
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 500);
      } catch (error) {
        console.error("Auth success error:", error);
        toast.error("Failed to complete login");
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;