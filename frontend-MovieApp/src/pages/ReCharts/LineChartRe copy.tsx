// InteractiveLineChart.tsx
import React, { useState } from "react";
import Plot from "react-plotly.js";

const InteractiveLineChart: React.FC = () => {
  // Initial data
  const xValues = Array.from({ length: 100 }, (_, i) => i + 1); // [1, 2, ..., 100]
  const yValues1 = xValues.map((x) => Math.sin(x / 10) * 50 + 50); // Sinusoidal for Activations
  const yValues2 = xValues.map((x) => Math.cos(x / 10) * 50 + 50); // Cosine for LSR Solver

  // State for axis ranges
  const [xRange, setXRange] = useState<[number, number]>([0, 100]);
  const [yRange, setYRange] = useState<[number, number]>([0, 100]);

  // Handlers for slider changes
  const handleXRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...xRange] as [number, number];
    newRange[index] = Number(event.target.value);
    setXRange(newRange);
  };

  const handleYRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...yRange] as [number, number];
    newRange[index] = Number(event.target.value);
    setYRange(newRange);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Left Y-axis slider */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={yRange[0]}
          onChange={(e) => handleYRangeChange(e, 0)}
          style={{ transform: "rotate(-90deg)", marginBottom: "20px" }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={yRange[1]}
          onChange={(e) => handleYRangeChange(e, 1)}
          style={{ transform: "rotate(-90deg)", marginBottom: "20px" }}
        />
      </div>

      {/* Plotly chart */}
      <div style={{ width: "80vw", height: "60vh" }}>
        <Plot
          data={[
            {
              x: xValues,
              y: yValues1,
              mode: "lines+markers",
              name: "Activations",
              line: { color: "green" },
            },
            {
              x: xValues,
              y: yValues2,
              mode: "lines+markers",
              name: "LSR Solver",
              line: { color: "blue" },
            },
          ]}
          layout={{
            title: "Interactive Line Chart with X and Y Sliders",
            xaxis: {
              title: "Time",
              range: xRange, // Dynamic X-axis range
            },
            yaxis: {
              title: "Count",
              range: yRange, // Dynamic Y-axis range
            },
            showlegend: true,
          }}
          config={{
            responsive: true,
          }}
          // style={{ width: '80vw', height: '60vh' }}
        />
      </div>

      {/* Bottom X-axis slider */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={xRange[0]}
          onChange={(e) => handleXRangeChange(e, 0)}
          style={{ width: "80vw", marginBottom: "10px" }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={xRange[1]}
          onChange={(e) => handleXRangeChange(e, 1)}
          style={{ width: "80vw" }}
        />
      </div>
    </div>
  );
};

export default InteractiveLineChart;
