'use client';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import CmdList from '@/components/CmdList';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import Link from 'next/link';
import useCmds from '@/hooks/useCmds';
// import { Cmd } from '@/types/cmd'; // Cmd type is likely used by useCmds or CmdList

export default function HomePage() {
  const { user, loadingAuth } = useAuth();
  const router = useRouter();

  // Call all hooks at the top level, unconditionally
  const { cmds, loading: cmdsLoading, error: cmdsError } = useCmds();
  const [selectedTag, setSelectedTag] = useState('All');

  const allTags = useMemo(() => {
    if (!cmds) return [];
    return Array.from(new Set(cmds.flatMap(p => p.tags)));
  }, [cmds]);

  const filteredCmds = useMemo(() => {
    if (!cmds) return [];
    if (selectedTag === 'All') {
      return cmds;
    }
    return cmds.filter(cmd => cmd.tags.includes(selectedTag));
  }, [cmds, selectedTag]);

  // useEffect for redirection can remain as is, as it's a hook itself.
  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/auth');
    }
  }, [user, loadingAuth, router]);

  // Conditional rendering logic starts after all hooks have been called.
  if (loadingAuth) {
    return <p>Chargement...</p>;
  }

  if (!user) {
    return <p>Redirection vers la page de connexion...</p>;
  }

  // User is authenticated, render the page content
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
  };

  return (
    <div className="space-y-6">
      <p className="mb-4">Bonjour, {user.email} !</p> {/* Welcome message */}
      
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="w-full">
          <SearchBar />
        </div>
        <Link href="/cmds/new" className="button primary">
          Add Cmd
        </Link>
      </div>
      
      <TagFilter tags={allTags} onTagSelect={handleTagSelect} />
      
      {cmdsLoading && <p className="text-center mt-4">Loading cmds...</p>}
      {cmdsError && (
        <p className="text-center error-message mt-4">
          Error:{" "}
          {(cmdsError as unknown) instanceof Error
            ? ((cmdsError as unknown) as Error).message
            : String(cmdsError)}
        </p>
      )}
      
      {!cmdsLoading && !cmdsError && <CmdList cmds={filteredCmds} />}
      {!cmdsLoading && !cmdsError && cmds && cmds.length > 0 && filteredCmds.length === 0 && (
        <p className="text-center mt-4">
          No cmds found for the tag "{selectedTag}".
        </p>
      )}
      {!cmdsLoading && !cmdsError && (!cmds || cmds.length === 0) && (
        <p className="text-center mt-4">
          No cmds yet. Why not <Link href="/cmds/new" className="underline">add one</Link>?
        </p>
      )}
    </div>
  );
}