import { useState } from "react";
import axios from "axios";

export default function useProfileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  const uploadProfilePic = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // if you use cookies for auth
      });

      setUrl(res.data.url);
      setLoading(false);
      return res.data.url;
    } catch (err) {
      console.error(err);
      setError("Upload failed");
      setLoading(false);
      return null;
    }
  };

  return { url, loading, error, uploadProfilePic };
}
