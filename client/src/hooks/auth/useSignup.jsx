import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const signup = async ({ firstName, lastName, email, password }) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return false;
      } else {
        toast.success(data.message);
        // Auto Login
        if (data.data && data.data.token) {
          await authLogin(data.data.token, data.data.user);
        }
        return true;
      }
    } catch (err) {
      toast.error("Signup failed. Try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};

export default useSignup;
