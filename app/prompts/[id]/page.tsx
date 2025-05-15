// app/prompts/[id]/page.tsx
'use client'; // Keep if you have client-side interactions, or convert to RSC

import React, { useEffect, useState } from 'react';
import { Prompt } from '@/types/prompt';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

interface Props {
  params: { id: string };
}

const PromptDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // State for delete operation
  const router = useRouter(); // Initialize router

  useEffect(() => {
    if (id) {
      const fetchPromptDetail = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/prompts/${id}`);
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }
          const data: Prompt = await res.json();
          setPrompt(data);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPromptDetail();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!prompt) return;

    // Confirmation dialog
    if (window.confirm(`Are you sure you want to delete the prompt "${prompt.title}"?`)) {
      setIsDeleting(true);
      setError(null);
      try {
        const res = await fetch(`/api/prompts/${prompt.id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          // Navigate to prompts list and refresh
          router.push('/prompts');
          router.refresh(); // Ensures data is refetched on the list page
        } else {
          const errorData = await res.json().catch(() => ({ message: 'Failed to delete prompt. Server returned an error.' }));
          throw new Error(errorData.message || 'Failed to delete prompt.');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while deleting.');
        setIsDeleting(false);
      }
    }
  };

  if (loading) return <p className="text-center text-light-gray mt-8">Loading prompt details...</p>;
  if (error && !isDeleting) return <p className="text-center text-red-400 mt-8">Error: {error}</p>; // Show general errors if not deleting
  if (!prompt) return <p className="text-center text-gray-500 mt-8">Prompt not found.</p>;

  return (
    <div>
      {error && isDeleting && <p className="text-center text-red-400 my-4">Error deleting prompt: {error}</p>} {/* Show delete specific error */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-3xl font-bold text-neon-green">{prompt.title}</h2>
        <div className="flex gap-2 flex-wrap">
          <Link
              href={`/prompts/${prompt.id}/edit`}
                        >
              Edit Prompt
          </Link>
          <button             onClick={handleDelete}
            disabled={isDeleting}
                      >
            {isDeleting ? 'Deleting...' : 'Delete Prompt'}
          </button>
        </div>
      </div>
      <p className="mb-4 text-lg text-gray-300 whitespace-pre-wrap">{prompt.content}</p>
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-neon-green">Tags:</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {prompt.tags.map((tag) => (
              <span key={tag} className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-light-gray">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptDetailPage;