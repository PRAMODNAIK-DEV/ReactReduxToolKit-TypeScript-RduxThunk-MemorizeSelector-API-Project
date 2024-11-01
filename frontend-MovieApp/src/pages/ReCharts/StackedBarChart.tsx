import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// import {data} from '../../helpers/data';

const data = [
    {
      date: '19-Apr-2024',
      "KOREA, REPUBLIC OF": 8,
      "MEXICO": 6,
      "NETHERLANDS": 3,
      "POLAND": 8,
      "ROMANIA": 7,
      "SPAIN": 10,
      "TAIWAN": 5,
      "TURKEY": 9,
      "UNITED KINGDOM": 8,
      "UNITED STATES": 30,
    },
    {
        date: '19-Apr-2024',
        "KOREA, REPUBLIC OF": 8,
        "MEXICO": 6,
        "NETHERLANDS": 3,
        "POLAND": 8,
        "ROMANIA": 7,
        "SPAIN": 10,
        "TAIWAN": 5,
        "TURKEY": 9,
        "UNITED KINGDOM": 8,
        "UNITED STATES": 30,
      },
      {
        date: '19-Apr-2024',
        "KOREA, REPUBLIC OF": 8,
        "MEXICO": 6,
        "NETHERLANDS": 3,
        "POLAND": 8,
        "ROMANIA": 7,
        "SPAIN": 10,
        "TAIWAN": 5,
        "TURKEY": 9,
        "UNITED KINGDOM": 8,
        "UNITED STATES": 30,
      },
      {
        date: '19-Apr-2024',
        "KOREA, REPUBLIC OF": 8,
        "MEXICO": 6,
        "NETHERLANDS": 3,
        "POLAND": 8,
        "ROMANIA": 7,
        "SPAIN": 10,
        "TAIWAN": 5,
        "TURKEY": 9,
        "UNITED KINGDOM": 8,
        "UNITED STATES": 30,
      },
      {
        date: '19-Apr-2024',
        "KOREA, REPUBLIC OF": 8,
        "MEXICO": 6,
        "NETHERLANDS": 3,
        "POLAND": 8,
        "ROMANIA": 7,
        "SPAIN": 10,
        "TAIWAN": 5,
        "TURKEY": 9,
        "UNITED KINGDOM": 8,
        "UNITED STATES": 30,
      },
      {
        date: '19-Apr-2024',
        "KOREA, REPUBLIC OF": 8,
        "MEXICO": 6,
        "NETHERLANDS": 3,
        "POLAND": 8,
        "ROMANIA": 7,
        "SPAIN": 10,
        "TAIWAN": 5,
        "TURKEY": 9,
        "UNITED KINGDOM": 8,
        "UNITED STATES": 30,
      },
      {
        date: '19-Apr-2024',
        "KOREA, REPUBLIC OF": 8,
        "MEXICO": 6,
        "NETHERLANDS": 3,
        "POLAND": 8,
        "ROMANIA": 7,
        "SPAIN": 10,
        "TAIWAN": 5,
        "TURKEY": 9,
        "UNITED KINGDOM": 8,
        "UNITED STATES": 30,
      },
    // Add more data points according to the activation dates in the dataset
  ];

const StackedBarChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={800}
        height={400}
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* Each Bar component represents a different country */}
        <Bar dataKey="KOREA, REPUBLIC OF" stackId="a" fill="#8884d8" />
        <Bar dataKey="MEXICO" stackId="a" fill="#82ca9d" />
        <Bar dataKey="NETHERLANDS" stackId="a" fill="#ffc658" />
        <Bar dataKey="POLAND" stackId="a" fill="#ff8042" />
        <Bar dataKey="ROMANIA" stackId="a" fill="#00C49F" />
        <Bar dataKey="SPAIN" stackId="a" fill="#FFBB28" />
        <Bar dataKey="TAIWAN" stackId="a" fill="#0088FE" />
        <Bar dataKey="TURKEY" stackId="a" fill="#FF8042" />
        <Bar dataKey="UNITED KINGDOM" stackId="a" fill="#FFBB28" />
        <Bar dataKey="UNITED STATES" stackId="a" fill="#00C49F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;
