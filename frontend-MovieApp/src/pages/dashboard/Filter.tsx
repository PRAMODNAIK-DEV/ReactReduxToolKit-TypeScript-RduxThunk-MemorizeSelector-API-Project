import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilter } from "../../features/analytics/analyticsSlice";
import ScalableDropdown from '../dummy/SearchableDropdown';
const Filter: React.FC = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setCategory(selectedValue);

    // Dispatch the setFilter action immediately with the new category
    dispatch(
      setFilter({
        category: selectedValue === "10" ? "All" : `${selectedValue}`, // Map 10 to 'All' and 3/4/5 to 'Top X'
        startDate: "",
        endDate: "",
        minValue: 0,
        maxValue: Number.MAX_SAFE_INTEGER,
      })
    );
  };

  return (
    <div className="h-screen w-64 bg-gray-100 p-6 shadow-lg fixed top-0 left-0">
      <h2 className="text-2xl font-semibold mb-4">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <label htmlFor="category" className="block text-lg font-medium mb-2">
          Category:
        </label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="10">All</option>
          <option value="3">Top 3</option>
          <option value="4">Top 4</option>
          <option value="5">Top 5</option>
          {/* Add more categories */}
        </select>
      </div>
      <ScalableDropdown />
      {/* Date Range Filter */}
      {/* <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Start Date:</label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="block w-full p-2 border border-gray-300 rounded-md" 
        />
        <label className="block text-lg font-medium mt-4 mb-2">End Date:</label>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="block w-full p-2 border border-gray-300 rounded-md" 
        />
      </div> */}

      {/* Value Range Filter */}
      {/* <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Min Value:</label>
        <input 
          type="number" 
          value={minValue} 
          onChange={(e) => setMinValue(e.target.value)} 
          className="block w-full p-2 border border-gray-300 rounded-md" 
        />
        <label className="block text-lg font-medium mt-4 mb-2">Max Value:</label>
        <input 
          type="number" 
          value={maxValue} 
          onChange={(e) => setMaxValue(e.target.value)} 
          className="block w-full p-2 border border-gray-300 rounded-md" 
        />
      </div> */}
      
    </div>
  );
};

export default Filter;
