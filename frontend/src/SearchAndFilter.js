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
  resetFilters,
}) {
  const searchRef = useRef(null);
  const filterRef = useRef(null);

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    <div className="flex items-center space-x-4 relative">
      {/* Filter Button */}
      <div className="relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out 
          hover:bg-gray-300 hover:text-black hover:scale-105 hover:shadow-md focus:outline-none active:scale-95"
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>

        {/* Filter Modal */}
        {isFilterOpen && (
          <div
            ref={filterRef}
            className="absolute right-0 mt-2 bg-white shadow-2xl p-6 rounded-2xl w-80 z-10 transition-all duration-300 ease-in-out"
          >
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                placeholder="Filter by category"
                className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200"
              />
            </div>

            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-black text-white py-2 px-6 rounded-lg w-full transition-all duration-300 ease-in-out
                hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Apply
              </button>

              <button
                onClick={resetFilters}
                className="bg-red-500 text-white py-2 px-6 rounded-lg w-full transition-all duration-300 ease-in-out
                hover:bg-white hover:text-red-500 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div ref={searchRef} className="relative">
        {isSearchActive ? (
          <input
            type="text"
            autoFocus
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 py-2 px-4 rounded-lg w-64 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-black focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setIsSearchActive(true)}
            className="flex items-center space-x-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out
            hover:bg-gray-400 hover:text-black hover:scale-105 hover:shadow-md focus:outline-none active:scale-95"
          >
            <span>Search</span>
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
