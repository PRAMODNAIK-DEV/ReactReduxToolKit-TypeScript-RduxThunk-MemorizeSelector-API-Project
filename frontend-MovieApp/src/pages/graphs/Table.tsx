import React, { useState } from 'react';
import { useTable, Column } from 'react-table';

// Define the Data interface for each row
interface Data {
  country: string;
  sites: number;
  medianCtaToFsa: number;
  activationDate: string;
  p25: number;
  p25Date: string;
  p50: number;
  p50Date: string;
  p90: number;
  p90Date: string;
  p100: number;
  p100Date: string;
}

// Define the TableProps interface
interface TableProps {
  data: Data[];
  onRowClick: (country: string) => void;
  selectedCountry: string;
}

const Table: React.FC<TableProps> = ({ data, onRowClick, selectedCountry }) => {
  // Define the columns for react-table
  const columns: Column<Data>[] = React.useMemo(
    () => [
      { Header: 'Country', accessor: 'country' },
      { Header: 'Sites', accessor: 'sites' },
      { Header: 'Median CTA to FSA', accessor: 'medianCtaToFsa' },
      { Header: 'Activation Date', accessor: 'activationDate' },
      { Header: 'P25', accessor: 'p25' },
      { Header: 'p25 Date', accessor: 'p25Date' },
      { Header: 'p50', accessor: 'p50' },
      { Header: 'p50 Date', accessor: 'p50Date' },
      { Header: 'p90', accessor: 'p90' },
      { Header: 'p90 Date', accessor: 'p90Date' },
      { Header: 'p100', accessor: 'p100' },
      { Header: 'p100 Date', accessor: 'p100Date' },
    ],
    []
  );

  // Pass columns and data to useTable
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    
    <table {...getTableProps()} className="min-w-full border-collapse border">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} className="border p-2">
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const isSelected = row.original.country === selectedCountry;
          return (
            <tr
              {...row.getRowProps()}
              className={`cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
              onClick={() => onRowClick(row.original.country)}
            >
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()} className="border p-2">
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
