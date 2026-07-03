import { useEffect, useRef, useState } from 'react';

/**
 * Polls an async fetcher every `intervalMs` and exposes the latest data.
 * Used to fake "live" updates against a plain REST backend (no websocket
 * yet) — see MeshTopology.jsx and Transactions.jsx.
 */
export function usePolling(fetcher, intervalMs = 2000, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const timer = useRef(null);
  const stopped = useRef(false);

  useEffect(() => {
    stopped.current = false;

    const tick = async () => {
      try {
        const result = await fetcher();
        if (!stopped.current) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!stopped.current) setError(err);
      } finally {
        if (!stopped.current) {
          timer.current = setTimeout(tick, intervalMs);
        }
      }
    };

    tick();
    return () => {
      stopped.current = true;
      clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error };
}
