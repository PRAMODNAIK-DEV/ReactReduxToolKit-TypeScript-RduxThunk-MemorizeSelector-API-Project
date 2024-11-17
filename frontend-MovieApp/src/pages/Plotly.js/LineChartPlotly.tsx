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
  ChartOptions,
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

  // Generate labels with a pattern that fits the requirement
  const labels = Array.from({ length: 500 }, (_, i) => {
    const month = (i % 12) + 1;
    const year = Math.floor(i / 12) + 2026;
    const day = (i % 30) + 1;
    return `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
  });

  // Format labels to display on every odd day, and only the month label at the end of each month
  const displayLabels = labels.map((label, index) => {
    const day = parseInt(label.split("-")[2]);
    const month = parseInt(label.split("-")[1]);
    if (day % 2 !== 0) {
      return `${day}`; // Show only day for odd days
    } else if (day === 30) {
      return `${label.split("-")[0]}-${label.split("-")[1]}`; // Show only year-month for the last day
    } else {
      return ""; // Hide other days
    }
  });

  const activations = Array.from(
    { length: 500 },
    (_, i) => 300 * (1 - Math.exp(-i / 50))
  ); // S-curve growth
  const solver = Array.from({ length: 500 }, (_, i) => i * 2); // Linear growth

  const [xRange, setXRange] = useState<number[]>([0, 300]);
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

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins:{
      // datalabels: false,
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          display: false,
          // drawBorder: true,
        },
        ticks: {
          maxRotation: 0,
          minRotation: 45,
          font: { size: 8, family: "Arial", // Set the desired font family
            style: "normal", // Set the font style (normal, italic, etc.)
            weight: "bold", },
          autoSkip: false,
          callback: function (value: string | number, index: number) {
            const dateLabel = displayLabels[Number(value)]; // Convert value to number if necessary
            return index % 6 === 0 ? dateLabel : "";
          },
        },
      },
      y: {
        min: yRange[0],
        max: yRange[1],
        title: {
          display: true,
          text: "Count",
        },
        grid: {
          display: false,
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
              height: isSmallScreen ? 200 : isMediumScreen ? 250 : 300, // Height of the slider component
              '& .MuiSlider-thumb': {
                width: 10, // Size of the thumb
                height: 10,
              },
              '& .MuiSlider-track': {
                width: 5 // Thickness of the track
              },
              '& .MuiSlider-rail': {
                width: 5, // Thickness of the rail
              },
            }}
            
          />
        </Box>

        {/* Line chart in the center */}
        <Box
          width={isSmallScreen ? "100%" : "600px"}
          height={isSmallScreen ? "300px" : "400px"}
          // sx={{zIndex: 1}}
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
            width: "100%", // Adjusts the width for responsiveness
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
            },
            '& .MuiSlider-track': {
              height: 6,
            },
            '& .MuiSlider-rail': {        // This is a line behind
              height: 6,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LineGraphWithMaterialUISliders;
