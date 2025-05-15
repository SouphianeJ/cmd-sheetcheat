// hooks/usePrompts.ts
import { useState, useEffect } from 'react';
import { Prompt } from '@/types/prompt';

function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const res = await fetch('/api/prompts');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Prompt[] = await res.json();
        setPrompts(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPrompts();
  }, []);

  return { prompts, loading, error };
}

export default usePrompts;