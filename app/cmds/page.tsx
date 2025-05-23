'use client';

import { useState, useEffect, useMemo } from 'react'; // Import useState and useMemo
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '@/app/context/AuthContext'; // Import useAuth
import CmdList from '@/components/CmdList';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import Link from 'next/link';
import useCmds from '@/hooks/useCmds';
// import { Cmd } from '@/types/cmd'; // If needed directly

export default function CmdsPage() {
  const { cmds, loading, error } = useCmds();
  const [selectedTag, setSelectedTag] = useState('All'); // State for the selected tag
  const { user, loadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/auth');
    }
  }, [user, loadingAuth, router]);

  if (loadingAuth) {
    return <p>Chargement...</p>; // Or a loading spinner
  }

  if (!user) {
    // This will likely not be reached if the redirect happens,
    // but it's good practice for clarity or if redirect is delayed.
    return <p>Redirection vers la page de connexion...</p>;
  }

  // Extract unique tags for the filter.
  const allTags = useMemo(() => {
    return Array.from(new Set(cmds.flatMap(p => p.tags)));
  }, [cmds]);

  // Callback function for TagFilter
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
  };

  // Filter cmds based on the selected tag
  const filteredCmds = useMemo(() => {
    if (selectedTag === 'All') {
      return cmds;
    }
    return cmds.filter(cmd => cmd.tags.includes(selectedTag));
  }, [cmds, selectedTag]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="w-full">
          <SearchBar />
        </div>
        <Link href="/cmds/new" className="button primary">
          Add Cmd
        </Link>
      </div>
      
      {/* Pass the handleTagSelect function to the onTagSelect prop */}
      <TagFilter tags={allTags} onTagSelect={handleTagSelect} /> 
      
      {loading && <p className="text-center mt-4">Loading cmds...</p>}
      {error && <p className="text-center error-message mt-4">Error: {error}</p>}
      
      {!loading && !error && <CmdList cmds={filteredCmds} />}
      
      {!loading && !error && cmds.length > 0 && filteredCmds.length === 0 && (
        <p className="text-center mt-4">
          No cmds found for the tag "{selectedTag}".
        </p>
      )}
      {!loading && !error && cmds.length === 0 && (
        <p className="text-center mt-4">
          No cmds yet. Why not add one?
        </p>
      )}
    </div>
  );
}