import React from 'react';
import { LabelProps } from 'recharts';

// This component renders the cumulative total label on top of each stacked bar
const renderCustomizedLabel = (props: LabelProps & { bars: any; data: any }) => {
  const { x, y, width, value, index, bars, data } = props;

  // Calculate the total value for each bar (stacked values sum)
  const totalValue = bars.reduce((sum: number, bar: any) => {
    // const barValue = data[index][bar.dataKey]; // Ensure `index` is defined
    // return sum + (barValue || 0);
  }, 0);

  return (
    <text
        // x={(typeof x === 'number' ? x : Number(x)) + (width ?? 0) / 2}
        y={(typeof y === 'number' ? y : Number(y)) - 5}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
    >
      {totalValue}
    </text>
  );
};

export default renderCustomizedLabel;
