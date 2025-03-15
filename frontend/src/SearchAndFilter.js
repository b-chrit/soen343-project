import { useEffect, useRef, useState } from "react";
import { Search, Filter } from "lucide-react";

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  resetFilters
}) {
  const searchRef = useRef(null);
  const filterRef = useRef(null);

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsSearchActive(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Filter Button */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center space-x-2"
      >
        <Filter className="w-4 h-4" />
        <span>Filter</span>
      </button>

      {/* Search Input */}
      <div ref={searchRef} className="relative">
        {isSearchActive ? (
          <input
            type="text"
            autoFocus
            placeholder="Search"
            className="border border-gray-300 py-2 px-4 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <button
            onClick={() => setIsSearchActive(true)}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center space-x-2"
          >
            <span>Search</span>
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div
          ref={filterRef}
          className="bg-white shadow-md p-4 rounded-lg absolute top-20 left-1/2 transform -translate-x-1/2 w-80 z-10"
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Category
            </label>
            <input
              type="text"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              placeholder="Filter by category"
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="bg-black text-white py-2 px-6 rounded-lg w-full transition-all duration-300 ease-in-out transform hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="bg-red-500 text-white py-2 px-6 rounded-lg w-full transition-all duration-300 ease-in-out transform hover:bg-white hover:text-red-500 hover:scale-105 hover:shadow-lg"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
