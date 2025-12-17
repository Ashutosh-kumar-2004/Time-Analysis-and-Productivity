import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { usePersonalAnalysis } from "../../context/personalAnalysis/PersonalAnalysisContext";

const useActivityHistory = (initialLimit = 20) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    minFocusScore: "",
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Get refreshTrigger from context
  let refreshTrigger = 0;
  try {
    const context = usePersonalAnalysis();
    refreshTrigger = context.refreshTrigger;
  } catch (e) {
    // Ignore
  }

  const fetchActivities = useCallback(
    async (isLoadMore = false) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        let query = `?limit=${initialLimit}&page=${page}&sortBy=startTimestamp&sortOrder=desc`;

        if (filters.startDate) query += `&startDate=${filters.startDate}`;
        if (filters.endDate) query += `&endDate=${filters.endDate}`;
        if (filters.category)
          query += `&category=${filters.category.toLowerCase()}`;
        if (filters.minFocusScore)
          query += `&minFocusScore=${filters.minFocusScore}`;

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/time-entries${query}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          if (isLoadMore) {
            setActivities((prev) => [...prev, ...response.data.data]);
          } else {
            setActivities(response.data.data);
          }
          setHasMore(response.data.meta.hasMore);
        }
      } catch (err) {
        console.error("Fetch activity history error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [filters, page, initialLimit]
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchActivities(page > 1);
  }, [fetchActivities, page, refreshTrigger]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    activities,
    loading,
    error,
    filters,
    updateFilter,
    hasMore,
    loadMore,
    refetch: () => fetchActivities(false),
  };
};

export default useActivityHistory;
