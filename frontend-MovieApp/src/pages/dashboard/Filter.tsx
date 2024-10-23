// Filter.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilter } from "../../features/analytics/analyticsSlice";

const Filter: React.FC = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setCategory(selectedValue); // Update the state to reflect the selection

    // Dispatch the setFilter action immediately with the new category
    dispatch(
      setFilter({
        category: selectedValue === "10" ? "All" : `${selectedValue}`, // Map 10 to 'All' and 3/4/5 to 'Top X'
        startDate: "", // Additional filters can be set here if needed
        endDate: "",
        minValue: 0,
        maxValue: Number.MAX_SAFE_INTEGER,
      })
    );
  };

  return (
    <div className="mb-4">
      {/* Category Filter */}
      <label htmlFor="category" className="mr-2">
        Category:
      </label>
      
      <select
        id="category"
        value={category}
        onChange={handleCategoryChange}
        className="p-2 border"
      >
        <option value="10">All</option>
        <option value="3">Top 3</option>
        <option value="4">Top 4</option>
        <option value="5">Top 5</option>
        {/* Add more categories */}
      </select>

      {/* Date Range Filter */}
      {/* <div className="mt-4">
        <label className="mr-2">Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border" />
        <label className="ml-4 mr-2">End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border" />
      </div> */}

      {/* Value Range Filter */}
      {/* <div className="mt-4">
        <label className="mr-2">Min Value:</label>
        <input type="number" value={minValue} onChange={(e) => setMinValue(e.target.value)} className="p-2 border" />
        <label className="ml-4 mr-2">Max Value:</label>
        <input type="number" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} className="p-2 border" />
      </div> */}

      <div className="mt-4">
        {/* <button
          onClick={handleFilterChange}
          className="mt-4 p-2 bg-blue-500 text-white"
        >
          Apply Filter
        </button> */}
      </div>
    </div>
  );
};

export default Filter;
