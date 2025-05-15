'use client';

import { useState, useMemo } from 'react'; // Import useMemo
import PromptList from '@/components/PromptList';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import Link from 'next/link';
import usePrompts from '@/hooks/usePrompts';
import { Prompt } from '@/types/prompt'; // Import Prompt type

export default function HomePage() {
  const { prompts, loading, error } = usePrompts();
  const [selectedTag, setSelectedTag] = useState('All'); // State for the selected tag

  // Extract unique tags for the filter.
  const allTags = useMemo(() => {
    return Array.from(new Set(prompts.flatMap(p => p.tags)));
  }, [prompts]);

  // Callback function for TagFilter
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
  };

  // Filter prompts based on the selected tag
  const filteredPrompts = useMemo(() => {
    if (selectedTag === 'All') {
      return prompts;
    }
    return prompts.filter(prompt => prompt.tags.includes(selectedTag));
  }, [prompts, selectedTag]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="w-full">
          <SearchBar /> {/* SearchBar logic will be separate for now */}
        </div>
        <Link href="/prompts/new" className="button primary">
          Add Prompt
        </Link>
      </div>
      
      <TagFilter tags={allTags} onTagSelect={handleTagSelect} />
      
      {loading && <p className="text-center mt-4">Loading prompts...</p>}
      {error && <p className="text-center error-message mt-4">Error: {error}</p>}
      
      {!loading && !error && <PromptList prompts={filteredPrompts} />}
      
      {!loading && !error && prompts.length > 0 && filteredPrompts.length === 0 && (
        <p className="text-center mt-4">
          No prompts found for the tag "{selectedTag}".
        </p>
      )}
      {!loading && !error && prompts.length === 0 && (
        <p className="text-center mt-4">
          No prompts yet. Why not add one?
        </p>
      )}
    </div>
  );
}