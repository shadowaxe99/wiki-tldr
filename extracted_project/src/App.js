import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; // axios@0.21.1
import useDebounce from 'use-debounce/lib/useDebounce'; // use-debounce@6.0.0
import { SearchIcon } from '@heroicons/react/outline';  // heroicons@1.0.5

const Summary = ({ summary }) => (
  <div className="bg-gray-200 p-4 rounded shadow-md">
    <p className="text-gray-700">{summary}</p>
  </div>
);

Summary.propTypes = {
  summary: PropTypes.string.isRequired,
};

const SearchResults = ({ searchResults, setSearchResults, setWikiName }) => (
  <div className="bg-white shadow-md rounded">
    {searchResults.map((result) => (
      <div
        key={result.pageid}
        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
        onClick={() => setWikiName(result.title)}
      >
        <p className="text-sm text-gray-700">{result.title}</p>
      </div>
    ))}
  </div>
);

SearchResults.propTypes = {
  searchResults: PropTypes.array.isRequired,
  setSearchResults: PropTypes.func.isRequired,
  setWikiName: PropTypes.func.isRequired,
};

const App = () => {
  const [wikiName, setWikiName] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [debouncedSearchTerm] = useDebounce(wikiName, 500);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/summarize', { pageName: wikiName });
      if (response && response.ok) {
        setSummary(response.data.summary);
      } else {
        console.error('Error fetching summary');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search?query=${debouncedSearchTerm}`);
      if (response && response.ok) {
        setSearchResults(response.data.pages);
      } else {
        console.error('Error fetching search results');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const randomizePage = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/random`);

      if (response && response.ok) {
        setWikiName(response.data.title);
      } else {
        console.error('Error fetching random page');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Wiki TLDR</h1>
        <p className="text-lg text-center text-gray-600 mb-10">
          Get a TLDR summary of any Wikipedia page.
        </p>
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 relative">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wiki-name">
                  Wikipedia Page Name
                </label>
                <div className="relative">
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="wiki-name"
                    type="text"
                    placeholder="Enter Wikipedia page name"
                    autoComplete="off"
                    value={wikiName}
                    onChange={(e) => setWikiName(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
              {searchResults.length > 0 && (
                <SearchResults
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                  setWikiName={setWikiName}
                />
              )}
              <div className="flex items-center justify-between">
                <button
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  type="button"
                  onClick={handleSummarize}
                  disabled={loading}
                >
                  {loading ? 'Summarizing...' : 'Summarize'}
                </button>
                <button
                  className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  type="button"
                  onClick={randomizePage}
                  disabled={loading}
                >
                  Randomize
                </button>
              </div>
            </div>
            {summary && <Summary summary={summary} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
const handleSearch = async () => {
  try {
    // ... existing search logic ...
  } catch (error) {
    console.error('Error:', error);
    setErrorMessage('Failed to search. Please try again.');
  }
};

const randomizePage = async () => {
  setLoading(true);
  setErrorMessage('');
  try {
    const response = await axios.get('http://localhost:5000/random');
    if (response && response.ok) {
      setWikiName(response.data.pageName);
      setSummary(response.data.summary);
    } else {
      console.error('Error fetching random page');
      setErrorMessage('Failed to fetch random page. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    setErrorMessage('Failed to fetch random page. Please try again.');
  }
  setLoading(false);
};

// Loading indicator for summarize button
const summarizeButtonLabel = loading ? 'Summarizing...' : 'Summarize';

// Loading indicator for randomize button
const randomizeButtonLabel = loading ? 'Randomizing...' : 'Randomize';

// ... existing JSX ...

// Update the summarize button with loading indicator
<button
  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  type="button"
  onClick={handleSummarize}
  disabled={loading}
>
  {summarizeButtonLabel}
</button>

// Update the randomize button with loading indicator
<button
  className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  type="button"
  onClick={randomizePage}
  disabled={loading}
>
  {randomizeButtonLabel}
</button>

// ... rest of the JSX ...

const ITEMS_PER_PAGE = 10; // Number of search results per page

// New state variables for pagination
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);

// Function to calculate paginated search results
const paginatedResults = () => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return searchResults.slice(startIndex, endIndex);
};

// Function to handle page change
const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
};

// Update the handleSearch function to set total pages
// ... inside handleSearch function, after fetching search results ...
setTotalPages(Math.ceil(searchResults.length / ITEMS_PER_PAGE));

// Pagination UI
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center space-x-2 mt-4">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
      <button
        key={page}
        className={`px-4 py-2 border ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'}`}
        onClick={() => onPageChange(page)}
      >
        {page}
      </button>
    ))}
  </div>
);

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

// ... existing JSX ...

// Add Pagination component below search results
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
