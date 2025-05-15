// app/cmds/[id]/page.tsx
'use client'; // Keep if you have client-side interactions, or convert to RSC

import React, { useEffect, useState } from 'react';
import { Cmd } from '@/types/cmd';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

interface Props {
  params: { id: string };
}

const CmdDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [cmd, setCmd] = useState<Cmd | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // State for delete operation
  const router = useRouter(); // Initialize router

  useEffect(() => {
    if (id) {
      const fetchCmdDetail = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/cmds/${id}`);
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }
          const data: Cmd = await res.json();
          setCmd(data);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCmdDetail();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!cmd) return;

    // Confirmation dialog
    if (window.confirm(`Are you sure you want to delete the cmd "${cmd.title}"?`)) {
      setIsDeleting(true);
      setError(null);
      try {
        const res = await fetch(`/api/cmds/${cmd.id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          // Navigate to cmds list and refresh
          router.push('/cmds');
          router.refresh(); // Ensures data is refetched on the list page
        } else {
          const errorData = await res.json().catch(() => ({ message: 'Failed to delete cmd. Server returned an error.' }));
          throw new Error(errorData.message || 'Failed to delete cmd.');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while deleting.');
        setIsDeleting(false);
      }
    }
  };

  if (loading) return <p className="text-center text-light-gray mt-8">Loading cmd details...</p>;
  if (error && !isDeleting) return <p className="text-center text-red-400 mt-8">Error: {error}</p>; // Show general errors if not deleting
  if (!cmd) return <p className="text-center text-gray-500 mt-8">Cmd not found.</p>;

  return (
    <div>
      {error && isDeleting && <p className="text-center text-red-400 my-4">Error deleting cmd: {error}</p>} {/* Show delete specific error */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-3xl font-bold text-neon-green">{cmd.title}</h2>
        <div className="flex gap-2 flex-wrap">
          <Link
              href={`/cmds/${cmd.id}/edit`}
                        >
              Edit Cmd
          </Link>
          <button             onClick={handleDelete}
            disabled={isDeleting}
                      >
            {isDeleting ? 'Deleting...' : 'Delete Cmd'}
          </button>
        </div>
      </div>
      <p className="mb-4 text-lg text-gray-300 whitespace-pre-wrap">{cmd.content}</p>
      {cmd.tags && cmd.tags.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-neon-green">Tags:</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {cmd.tags.map((tag) => (
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

export default CmdDetailPage;