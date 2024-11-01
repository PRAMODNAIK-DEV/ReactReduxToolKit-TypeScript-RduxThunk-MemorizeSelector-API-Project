import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import dayjs from "dayjs";

type DataItem = {
  date: string;
  argentina?: number;
  australia?: number;
  belgium?: number;
  bulgaria?: number;
  china?: number;
  denmark?: number;
  [key: string]: string | number | undefined; // Allow dynamic access
};

const generateCumulativeData = (): DataItem[] => {
  const rawData = Array.from({ length: 60 }, (_, i) => {
    const date = dayjs("2024-07-15").add(i, "day").format("YYYY-MM-DD");
    return {
      date,
      argentina: Math.floor(Math.random() * 5),
      australia: Math.floor(Math.random() * 4),
      belgium: Math.floor(Math.random() * 2),
      bulgaria: Math.floor(Math.random() * 2),
      china: Math.floor(Math.random() * 3),
      denmark: Math.floor(Math.random() * 2),
    } as DataItem;
  });

  const cumulativeData: DataItem[] = [];
  rawData.forEach((item, index) => {
    const cumulativeItem: DataItem = { ...item }; // Explicitly tell TypeScript this is a DataItem

    if (index !== 0) {
      Object.keys(item).forEach((key) => {
        if (key !== "date") {
          cumulativeItem[key] =
            ((cumulativeData[index - 1][key] as number) || 0) + ( item[key] as number);
        }
      });
    }

    cumulativeData.push(cumulativeItem);
  });

  return cumulativeData;
};

const data = generateCumulativeData();
const countries = Object.keys(data[0]).filter((key) => key !== "date");

const CumulativeStackedBarChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current as SVGSVGElement);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 50, left: 40 };

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data.map((d) =>
            countries.reduce((sum, country) => {
              const value = d[country] as number | undefined;
              return sum + (value || 0);
            }, 0)
          )
        ) || 0,
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal<string>()
      .domain(countries)
      .range(d3.schemeCategory10);

    const stack = d3
      .stack<DataItem>()
      .keys(countries)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedData = stack(data);

    svg
      .append("g")
      .selectAll<SVGGElement, d3.SeriesPoint<DataItem>>("g")
      .data(stackedData)
      .join("g")
      .attr("fill", ({ key }) => color(key) as string)
      .selectAll<SVGRectElement, d3.SeriesPoint<DataItem>>("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d.data.date) as number)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((d) => dayjs(d).date().toString()));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("g")
      .attr("transform", `translate(${width - margin.right},${height / 2})`)
      .selectAll("text")
      .data(countries)
      .join("text")
      .attr("y", (_, i) => i * 20)
      .attr("fill", (d) => color(d) as string)
      .text((d) => d);
  }, []);

  return (
    <>
      <svg ref={svgRef} width="900" height="500"></svg>
    </>
  );
};

export default CumulativeStackedBarChart;
