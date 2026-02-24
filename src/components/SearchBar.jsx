import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ onSearch, loading }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) onSearch(query.trim());
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search YouTube videos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                />
                <button type="submit" className="search-btn" disabled={loading || !query.trim()}>
                    {loading ? <span className="spinner" /> : 'Search'}
                </button>
            </div>
        </form>
    );
}
