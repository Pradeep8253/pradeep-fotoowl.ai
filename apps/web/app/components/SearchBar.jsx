'use client';

import React, { useState } from 'react';

export function SearchBar({ onSearch, initialQuery = '', initialType = 'photo' }) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch({ query: query.trim(), type });
    }
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Search for amazing media..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select 
        className="type-select"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="photo">Photos</option>
        <option value="video">Videos</option>
      </select>
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}
