import React, { useEffect } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchAnalyticsData } from "../../features/analytics/analyticsThunk";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import Filter from "./Filter";
// import {fetchAnalyticsData} from '../features/analytics/analyticsThunk';

const DashBoard: React.FC = () => {
  const dispatch = useAppDispatch();

  const { data, filteredData,  loading, error } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalyticsData());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAnalyticsData());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  const displayData = Array.isArray(data) ? data.slice(0, 3) : [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">
          Cryptocurrency Dashboard
        </h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleRefresh}
        >
          Refresh Data
        </button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {displayData.map((coin, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-800">{coin.name}</h2>
            <p className="text-gray-600">Rank: #{coin.market_cap_rank}</p>
            <p className="text-gray-600">
              Price: ${coin.current_price.toLocaleString()}
            </p>
            <p className="text-gray-600">
              Market Cap: ${coin.market_cap.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Price Chart (Top 3 Cryptocurrencies)
        </h2>
        <LineChart width={600} height={300} data={displayData.slice(0, 3)}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" />
          <Line type="monotone" dataKey="current_price" stroke="#8884d8" />
        </LineChart>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-md rounded-lg p-4">
      <Filter />
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Top {filteredData.length} Cryptocurrencies by Market Cap
        </h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-left text-gray-700">Rank</th>
              <th className="py-2 text-left text-gray-700">Name</th>
              <th className="py-2 text-left text-gray-700">Price (USD)</th>
              <th className="py-2 text-left text-gray-700">Market Cap</th>
            </tr>
          </thead>
          <tbody>

            {/* Array.isArray(filteredData) --> This is for safe check otherwise give error filteredData is not a array */}
            { Array.isArray(filteredData) && filteredData.map((coin: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="py-2">{coin.market_cap_rank}</td>
                <td className="py-2">{coin.name}</td>
                <td className="py-2">${coin.current_price.toLocaleString()}</td>
                <td className="py-2">${coin.market_cap.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashBoard;
