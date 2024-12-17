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
import { daily_activation_cumulativeDummy, dateLabelsDummy, LSR_Daily_Rand_CumulativeDummy } from "../../DummyGraphData";

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

  // const labels = Array.from({ length: 300 }, (_, i) => {
  //   const month = (i % 12) + 1;
  //   const year = Math.floor(i / 12) + 2026;
  //   return `${year}-${month < 10 ? `0${month}` : month}`;
  // });

  // const activations = Array.from(
  //   { length: 300 },
  //   (_, i) => 300 * (1 - Math.exp(-i / 50))
  // );
  // const solver = Array.from({ length: 300 }, (_, i) => i * 2);

  const labels = dateLabelsDummy;
  const activations = daily_activation_cumulativeDummy;
  const solver = LSR_Daily_Rand_CumulativeDummy;

  // Calculate dynamic max values for Y-axes
  const maxActivations = Math.max(...activations);
  const maxSolver = Math.max(...solver);

  const [xRange, setXRange] = useState<number[]>([0, 300]);
  const [yLeftRange, setYLeftRange] = useState<number[]>([0, maxActivations]);
  const [yRightRange, setYRightRange] = useState<number[]>([0, maxSolver]);

  // Dynamic step calculation for sliders
  const calculateStep = (maxValue: number) => Math.max(Math.ceil(maxValue / 2), 1);
  const yStep = calculateStep(Math.max(maxActivations, maxSolver));

  const handleYRangeChange = (event: Event, value: number | number[]) => {
    const [min, max] = value as number[];

    // Update yLeftRange and yRightRange logically but independently
    const newYLeftRange = [
      Math.min(min, maxActivations),
      Math.min(max, maxActivations),
    ];

    const newYRightRange = [
      Math.min(min, maxSolver),
      Math.min(max, maxSolver),
    ];

    setYLeftRange(newYLeftRange);
    setYRightRange(newYRightRange);
  };

  const data = {
    labels: labels.slice(xRange[0], xRange[1] + 1),
    datasets: [
      {
        label: "Activations",
        data: activations.slice(xRange[0], xRange[1] + 1),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "yLeft",
        borderWidth: 3,
        pointRadius: 2,
        pointHoverRadius: 6,
        fill: true,
      },
      {
        label: "LSR Solver",
        // Replace 0 values with null to completely hide the line at these points
        data: solver.slice(xRange[0], xRange[1] + 1).map((value) => (value === 0 ? null : value)),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "yRight",
        borderWidth: 3,
        pointRadius: 2,
        pointHoverRadius: 6,
        fill: false, // Set to false to ensure no filled area is shown for LSR Solver
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) =>
            tooltipItems[0] ? labels[tooltipItems[0].dataIndex] : "",
          label: (tooltipItem) => {
            const value = Number(tooltipItem.raw);
            return `Value: ${value}`;
          },
        },
        // Skip tooltips for points with zero value
        filter: (tooltipItem) => tooltipItem.raw !== 0,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          callback: function (value: number | string) {
            return labels[Number(value)];
          },
        },
      },
      yLeft: {
        type: "linear",
        position: "left",
        min: yLeftRange[0],
        max: yLeftRange[1],
        title: {
          display: true,
          text: "Activations",
        },
        grid: {
          drawOnChartArea: true,
        },
      },
      yRight: {
        type: "linear",
        position: "right",
        min: yRightRange[0],
        max: yRightRange[1],
        title: {
          display: true,
          text: "LSR Solver",
        },
        grid: {
          drawOnChartArea: false,
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
        <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
          <Typography>Y-Axis Scale</Typography>
          <Slider
            value={[Math.min(yLeftRange[0], yRightRange[0]), Math.max(yLeftRange[1], yRightRange[1])]}
            min={0}
            max={Math.max(maxActivations, maxSolver)}
            onChange={handleYRangeChange}
            valueLabelDisplay="auto"
            orientation="vertical"
            step={2}
            marks
            sx={{ height: 300 }}
          />
        </Box>

        <Box
          width={isSmallScreen ? "100%" : "600px"}
          height={isSmallScreen ? "300px" : "400px"}
        >
          <Line data={data} options={options} />
        </Box>
      </Box>

      <Box width={isSmallScreen ? "100%" : "600px"} mt={2}>
        <Slider
          value={xRange}
          min={0}
          max={labels.length - 1}
          onChange={(event, value) => setXRange(value as number[])}
          valueLabelDisplay="auto"
          step={10}
          marks
          sx={{ width: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default LineGraphWithMaterialUISliders;
