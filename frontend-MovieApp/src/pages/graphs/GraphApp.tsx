import React, { useState } from 'react';
import Table from './Table';
import Graph from './CumulativeGraph';
import Indicator from './Indicator';
import {data} from '../../../src/helpers/data';

const GraphApp: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const handleRowClick = (country: string) => {
    setSelectedCountry(country);
  };

  const handleIndicatorClick = (country: string) => {
    setSelectedCountry(country);
  };

  return (
    
    <div className="flex">
      {/* Table */}
      <div className="w-1/3">
        <Table data={data} onRowClick={handleRowClick} selectedCountry={selectedCountry} />
      </div>

      {/* Graph */}
      <div className="w-1/3">
        <Graph data={data} selectedCountry={selectedCountry} />
      </div>

      {/* Indicator */}
      <div className="w-1/3">
        <Indicator
          countries={data.map((d) => d.country)}
          onIndicatorClick={handleIndicatorClick}
          selectedCountry={selectedCountry}
        />
      </div>
    </div>
  );
};

export default GraphApp;
