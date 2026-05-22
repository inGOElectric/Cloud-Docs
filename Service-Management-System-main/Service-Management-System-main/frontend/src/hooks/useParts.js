import { useState, useEffect } from "react";
import { saveParts, getPartsByJobCard } from "../api/parts";

export const useParts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchParts = async (jobCardId) => {
    setLoading(true);
    try {
      const res = await getPartsByJobCard(jobCardId);
      setParts(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setParts([]);
    } finally {
      setLoading(false);
    }
  };

  const submitParts = async (jobCardId, partsData) => {
    try {
      await saveParts(jobCardId, partsData);
      await fetchParts(jobCardId);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  return { parts, loading, error, fetchParts, submitParts };
};
