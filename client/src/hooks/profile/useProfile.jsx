import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export function useProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); 
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/profile/details`, {
        headers: getAuthHeaders(),
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload) => {
    try {
      console.log(payload)
      const res = await axios.put(`${API_URL}/profile/update-profile-data-personal-details`, payload, {
        headers: getAuthHeaders(),
      });
      setData(res.data);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { data, loading, fetchProfile, updateProfile };
}
