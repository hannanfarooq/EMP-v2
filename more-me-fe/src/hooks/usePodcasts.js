// src/hooks/usePodcasts.js
import { useState, useEffect } from 'react';
import { getPodcasts } from '../api';

export const usePodcasts = (topic) => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPodcasts(topic);
        setPodcasts(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (topic) {
      fetchData();
    }
  }, [topic]);

  return { podcasts, loading, error };
};
