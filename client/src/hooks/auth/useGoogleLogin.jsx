import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../config/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Extract user info
      const userInfo = {
        email: user.email,
        firstName: user.displayName ? user.displayName.split(" ")[0] : "User",
        lastName: user.displayName
          ? user.displayName.split(" ").slice(1).join(" ")
          : "",
        avatar: user.photoURL,
      };

      // Send to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google login failed on server");
      }

      // Save token
      localStorage.setItem("token", data.data.token);

      toast.success("Login successful");
      navigate("/dashboard");
      return data.data;
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error(error.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return { googleLogin, loading };
};

export default useGoogleLogin;
