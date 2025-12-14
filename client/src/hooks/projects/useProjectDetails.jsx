import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export function useProjectDetails(projectId) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchProjectDetails = async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/projects/get-all-project-details/${projectId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      setProject(res.data.projects[0]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  return {
    project,
    loading,
    fetchProjectDetails,
  };
}
