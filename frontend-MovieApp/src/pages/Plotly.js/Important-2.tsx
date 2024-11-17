import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { Typography, useMediaQuery, useTheme } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraphWithMaterialUISliders: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Generate labels for each day but format to display every 5th day and monthly label
  const labels = Array.from({ length: 500 }, (_, i) => {
    const month = (i % 12) + 1;
    const year = Math.floor(i / 12) + 2026;
    const day = (i % 30) + 1;
    return `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
  });

  // Filtered labels to display every 5th day and monthly format for better readability
  const displayLabels = labels.map((label, index) => {
    const day = parseInt(label.split("-")[2]);
    return day === 1 || day % 5 === 0 ? label : "";
  });

  const activations = Array.from(
    { length: 500 },
    (_, i) => 300 * (1 - Math.exp(-i / 50))
  ); // S-curve growth
  const solver = Array.from({ length: 500 }, (_, i) => i * 2); // Linear growth

  const [xRange, setXRange] = useState<number[]>([0, 499]);
  const [yRange, setYRange] = useState<number[]>([0, 1000]);

  const data = {
    labels: displayLabels.slice(xRange[0], xRange[1] + 1),
    datasets: [
      {
        label: "Activations",
        data: activations.slice(xRange[0], xRange[1] + 1),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        pointRadius: 0,
      },
      {
        label: "LSR Solver",
        data: solver.slice(xRange[0], xRange[1] + 1),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        min: yRange[0],
        max: yRange[1],
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ padding: isSmallScreen ? 2 : 4 }}
    >
      {/* Top row with y-axis slider and graph */}
      <Box display="flex" flexDirection="row" alignItems="center" width="100%">
        {/* Y-axis slider on the left */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mr={2}
          mt={isSmallScreen ? -1 : -2}
        >
          <Slider
            value={yRange}
            min={0}
            max={1000}
            onChange={(event, value) => setYRange(value as number[])}
            valueLabelDisplay="auto"
            orientation="vertical"
            step={50}
            marks
            sx={{
              height: isSmallScreen ? 150 : isMediumScreen ? 200 : 250,
            }}
          />
        </Box>

        {/* Line chart in the center */}
        <Box
          width={isSmallScreen ? "100%" : "600px"}
          height={isSmallScreen ? "300px" : "400px"}
        >
          <Line data={data} options={options} />
        </Box>
      </Box>

      {/* X-axis slider below the graph */}
      <Box
        width={isSmallScreen ? "100%" : "600px"}
        mt={1}
        ml={isSmallScreen ? 0 : 2}
      >
        <Slider
          value={xRange}
          min={0}
          max={499}
          onChange={(event, value) => setXRange(value as number[])}
          valueLabelDisplay="auto"
          step={1}
          marks
          sx={{
            width: "90%",
          }}
        />
      </Box>
    </Box>
  );
};

export default LineGraphWithMaterialUISliders;
