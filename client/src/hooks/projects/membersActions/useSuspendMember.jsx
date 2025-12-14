import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

export const useSuspendMember = () => {
  const { project, setProject } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const suspendMember = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/projects/${project._id}/members/suspend`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Backend returns the suspended member
      const suspendedMember = res.data.suspendedMember;

      // Update project context to reflect changes
      const updatedProject = {
        ...project,
        teamMembers: project.teamMembers.filter((m) => m._id !== userId),
        suspendedMembers: [...project.suspendedMembers, suspendedMember],
      };
      setProject(updatedProject);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { suspendMember, loading, error };
};
