'use client';

import { useState } from 'react';

interface TagFilterProps {
  tags: string[];
  onTagSelect: (tag: string) => void; // Callback for filtering
}

// Ensure onTagSelect is destructured from props
const TagFilter: React.FC<TagFilterProps> = ({ tags, onTagSelect }) => { 
  const [activeTag, setActiveTag] = useState('All');

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    onTagSelect(tag); // This line was causing the error because onTagSelect was not in scope
  };

  return (
    <div className="tag-filter-container">
      {['All', ...tags].map((tag) => (
        <button
          key={tag}
          className={`tag-button ${activeTag === tag ? 'active' : ''}`}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;