import React, { useEffect, useState } from 'react';
import './searchfunction.css';

const Search = ({ searchTerm, setSearchTerm }) => {
    const [inputValue, setInputValue] = useState(searchTerm);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 300); // Delay for 300ms before updating the search term

        return () => clearTimeout(timer); // Clean up the timer
    }, [inputValue, setSearchTerm]);

    return (
        <div className="search-container">
            <label htmlFor="search-input" className="visually-hidden">Search for veteran:</label>
            <input
                id="search-input"
                type="text"
                className="search-input"
                placeholder="Search for veteran..."
                value={inputValue}
                onChange={handleInputChange}
            />
            <button 
                className="clear-button"
                onClick={() => setInputValue('')}>x
            </button>
        </div>
    );
};

export default Search;
