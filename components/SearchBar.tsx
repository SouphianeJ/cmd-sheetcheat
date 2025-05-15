'use client';

import { useState } from 'react';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Implement search logic here based on the search term
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search cmds..."
                value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;