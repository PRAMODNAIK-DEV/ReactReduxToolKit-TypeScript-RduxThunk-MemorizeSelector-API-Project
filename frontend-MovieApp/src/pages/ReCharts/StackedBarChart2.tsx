import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import dayjs from "dayjs";

// Define the data type
type DataItem = {
  date: string; // YYYY-MM-DD format
  [key: string]: number | string;               //This index signature allows us to add as many dynamic key-value pairs as we want.
};

// This function will generate random daily values for six countries over a 60-day period.
const generateCumulativeData = () => {
 
    // This function will create 65 items( each item for one day starting from 2024-07-15 and each day will have properties like DataItem type where  [key: string]: number | string; dynamic type will allows to have as many countries we want)
  const rawData: DataItem[] = Array.from({ length: 120 }, (_, i) => {
    const date = dayjs("2024-07-15").add(i, "day").format("YYYY-MM-DD");

    // So here each day will have 6 items in the stack if the value of the item is 0 then will not be considered in the stack.
    return {
      date,
      argentina: Math.floor(Math.random() * 5),
      australia: Math.floor(Math.random() * 4),
      belgium: Math.floor(Math.random() * 2),
      bulgaria: Math.floor(Math.random() * 2),
      china: Math.floor(Math.random() * 3),
      denmark: Math.floor(Math.random() * 2),
    };
  });

  console.log(rawData);

  // Initialize cumulativeData as an empty array and populate it iteratively
  const cumulativeData: DataItem[] = [];

  rawData.forEach((item, index) => {
    if (index === 0) {
      // First item remains as is
      cumulativeData.push(item);
    } else {
      const previousItem = cumulativeData[index - 1];
      const cumulativeItem: DataItem = { date: item.date };

      //This will calculate the cumulative value for each country separately.
      Object.keys(item).forEach((key) => {
        if (key !== "date") {
          cumulativeItem[key] =
            (previousItem[key] as number) + (item[key] as number);
        }
      });

      cumulativeData.push(cumulativeItem);
    }
  });

  return cumulativeData;
};

const data = generateCumulativeData();


// Colors for each country
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#d0ed57",
  "#8dd1e1",
  "#ff8042",
];

const CumulativeStackedBarChart: React.FC = () => {
  const keys = Object.keys(data[0]).filter((key) => key !== "date"); // Get all the country keys

  // Custom tick formatter for X-axis to display only the day number as a string
  // const dayTickFormatter = (tick: string) => {
  //   const date = dayjs(tick);
  //   return date.date().toString(); // Convert day to string
  // };

  // Function to render custom X-axis labels with month centered below each month's range
  const renderCustomAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const date = dayjs(payload.value);
    const day = date.date();
    const month = date.format("MMM");

    // Show day label for each day
    return (
      <>
      {/* Here the x-axis and y-axis will have a default value as 0 (Origin) to change the position add some pixel */ }
        
        <text   
          x={x} 
          y={y + 10} 
          textAnchor="middle" 
          fontSize={10}
        >        
          {day}
        </text>


        {/* Show month label only for the middle day of each month. i.e, In place below day 15 */}
        {day === 15 && (
          <text
            x={x}
            y={y + 30}          // Here y-axis is for handling Vertical Spaceing for x-axis
            textAnchor="middle"
            fontSize={12}
            fontWeight="bold"
          >
            {month}
          </text>
        )}
      </>
    );
  };

  // Calculate the cumulative total for each day, ignoring keys with values <= 0
  const calculateCumulativeTotal = (item: DataItem) => {    //Ex: const item = { date: "2024-07-16", argentina: 15, australia: 10, belgium: 5 }; but date is ignored because we are mapping over keys, which does not have date props.
    return keys.reduce(   //The reduce function will sum all the country values in the stack and returns the total.
      (total, key) => total + ((item[key] as number) > 0 ? (item[key] as number) : 0),
      0
    );
  };

  return (
    // {/* ResponsiveContainer makes the chart responsive to the container size.*/}
    <ResponsiveContainer width="100%" height={500}>
      {/* Inside the BarChart, Recharts automatically iterates over each object in the data array. For each object, it determines the corresponding x-axis position based on the date key. */}
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
        barCategoryGap="1%" // Adds a small gap between days
        barGap={0} // Stacks bars without gaps within a day
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={true} // This will add the tick lines on bottom of each stack mark the x-axis values.
          tick={renderCustomAxisTick} // Custom render tick
          interval={1} // If 0 it will Ensure every day is labeled or  Ensure all ticks are rendered. Non zero(say 1) then it will give one gap between the bars label. For ex: the 1st bar will get the label 2nd will skipped and 3rd will get the label and so on.
        />
        <YAxis />
        <Tooltip /> {/* displays details on hover. */}
        {/* Dynamically generated Bars */}
        {/*The below map will be executed for each item in the data array one by one and again each item will be redered for stacked bar for each country as each item will have all the countries: some_values(int).*/}
        {keys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a" // Important to make to stacked bars.
            fill={COLORS[index % COLORS.length]}            
            hide={(data.every((item) => item[key] as number <= 0))} // Hide bars for countries with only 0 values, Here data is whole dataset.
          >
            {/* Add cumulative label only to the last bar in the stack */}
            {index === keys.length - 1 && (
              <LabelList
                dataKey={(dataItem: any) => calculateCumulativeTotal(dataItem)}     // dataItem is not the entire dataset; it is instead the data for that specific stacked bar, which corresponds to a particular country and a specific date in the stacked bar chart.
                position="top"
                formatter={(value: any) => `${value}`}     // This will be the cumulative value returned by dataKey (i.e from calculateCumulativeTotal() funciton), This will decide how the cumulative value will be displayed on the chart.
                fill="#000"
                fontSize={12}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CumulativeStackedBarChart;