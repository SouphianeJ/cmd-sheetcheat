// hooks/useCmds.ts
import { useState, useEffect } from 'react';
import { Cmd } from '@/types/cmd';

function useCmds() {
  const [cmds, setCmds] = useState<Cmd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCmds() {
      try {
        const res = await fetch('/api/cmds');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Cmd[] = await res.json();
        setCmds(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCmds();
  }, []);

  return { cmds, loading, error };
}

export default useCmds;