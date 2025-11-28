import { useState } from "react";
import { toast } from "react-toastify";

const useSignup = () => {
  const [loading, setLoading] = useState(false);

  const signup = async ({ firstName, lastName, email, password }) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
    } catch (err) {
      toast.error("Signup failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};

export default useSignup;
