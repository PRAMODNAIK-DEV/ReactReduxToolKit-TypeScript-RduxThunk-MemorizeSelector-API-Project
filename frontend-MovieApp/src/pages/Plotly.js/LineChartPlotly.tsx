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

  const labels = Array.from({ length: 500 }, (_, i) => {
    const month = (i % 12) + 1;
    const year = Math.floor(i / 12) + 2026;
    const day = (i % 30) + 1;
    return `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
  });

  const displayLabels = labels.map((label, index) => {
    const day = parseInt(label.split("-")[2]);
    const month = parseInt(label.split("-")[1]);
    if (day % 2 !== 0) {
      return `${day}`;
    } else if (day === 30) {
      return `${label.split("-")[0]}-${label.split("-")[1]}`;
    } else {
      return "";
    }
  });

  const activations = Array.from(
    { length: 500 },
    (_, i) => 300 * (1 - Math.exp(-i / 50))
  );
  const solver = Array.from({ length: 500 }, (_, i) => i * 2);

  const [xRange, setXRange] = useState<number[]>([0, 300]);
  const [yRange, setYRange] = useState<number[]>([0, 1000]);

  const data = {
    labels: labels.slice(xRange[0], xRange[1] + 1), // Use full `labels` for accurate tooltips
    datasets: [
      {
        label: "Activations",
        data: activations.slice(xRange[0], xRange[1] + 1),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 3, // Thick line
        pointRadius: 2, // Points always visible
        pointHoverRadius: 6, // Larger points on hover
        fill: true,
      },
      {
        label: "LSR Solver",
        data: solver.slice(xRange[0], xRange[1] + 1),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 3, // Thick line
        pointRadius: 2, // Points always visible
        pointHoverRadius: 6, // Larger points on hover
        fill: true,
      },
    ],
  };
  
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        mode: "nearest",
        intersect: false,
        callbacks: {
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            const rawLabel = labels[index];
            const [year, month, day] = rawLabel.split("-").map(Number);
            const monthNames = [
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ];
            return `${day}-${monthNames[month - 1]}-${year}`;
          },
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
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
        },
        ticks: {
          autoSkip: false, // Ensure all points are shown
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 8,
            family: "Arial",
            style: "normal",
            weight: "bold",
          },
          callback: function (value: string | number, index: number) {
            const rawLabel = labels[Number(value)];
            const [year, month, day] = rawLabel.split("-").map(Number);
            const monthNames = [
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ];
            return `${day}-${monthNames[month - 1]}`;
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
          display: true,
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
      <Box display="flex" flexDirection="row" alignItems="center" width="100%">
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
              height: isSmallScreen ? 200 : isMediumScreen ? 250 : 300,
              "& .MuiSlider-thumb": {
                width: 10,
                height: 10,
              },
              "& .MuiSlider-track": {
                width: 5,
              },
              "& .MuiSlider-rail": {
                width: 5,
              },
            }}
          />
        </Box>

        <Box
          width={isSmallScreen ? "100%" : "600px"}
          height={isSmallScreen ? "300px" : "400px"}
        >
          <Line data={data} options={options} />
        </Box>
      </Box>

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
            width: "100%",
            "& .MuiSlider-thumb": {
              width: 12,
              height: 12,
            },
            "& .MuiSlider-track": {
              height: 6,
            },
            "& .MuiSlider-rail": {
              height: 6,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LineGraphWithMaterialUISliders;
