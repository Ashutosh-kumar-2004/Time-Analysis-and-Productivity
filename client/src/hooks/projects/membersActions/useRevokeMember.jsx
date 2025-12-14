import { useState } from "react";
import axios from "axios";
import { useProjectContext } from "../../../context/project/ProjectContext";

export const useRevokeMember = () => {
  const { project, setProject } = useProjectContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const revokeMember = async (memberId) => {
    if (!project) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/projects/${project._id}/members/revoke`,
        { memberId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local UI
      setProject((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, data.revokedMember],
        suspendedMembers: prev.suspendedMembers.filter(
          (m) => m._id !== memberId
        ),
      }));

      setLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { revokeMember, loading, error };
};
