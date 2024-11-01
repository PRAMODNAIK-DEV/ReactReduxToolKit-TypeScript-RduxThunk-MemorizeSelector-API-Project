import React from 'react';

interface IndicatorProps {
  countries: string[];
  onIndicatorClick: (country: string) => void;
  selectedCountry: string;
}

const Indicator: React.FC<IndicatorProps> = ({
  countries,
  onIndicatorClick,
  selectedCountry,
}) => {
  return (
    <div className="w-1/3">
    <div className="flex flex-col">
      {countries.map((country) => (
        <button
          key={country}
          onClick={() => onIndicatorClick(country)}
          className={`p-2 my-2 border ${
            selectedCountry === country ? 'bg-blue-500 text-white' : ''
          }`}
        >
          {country}
        </button>
      ))}
    </div>
    </div>
  );
};

export default Indicator;
