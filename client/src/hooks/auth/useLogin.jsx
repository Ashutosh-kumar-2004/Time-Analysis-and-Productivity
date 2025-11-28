import { useState } from "react";
import { toast } from "react-toastify";

const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.data.token);  // jwt token

      toast.success("Login successful");
      setLoading(false);
      return data.data;
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;
