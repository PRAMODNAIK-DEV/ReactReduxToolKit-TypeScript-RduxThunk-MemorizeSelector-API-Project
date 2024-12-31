import ExcelJS from "exceljs";

function convertHexColor(hexCode: string): string {
  return hexCode.startsWith("#") ? hexCode.slice(1) : hexCode;
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}

export async function downloadAPIDataInExcelWithCustomHeaders(
  firstTableData: any[],
  secondTableData: any[]
) {
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  worksheet.columns = Array(12) // Adjust this based on total columns
    .fill(null)
    .map(() => ({ width: 15 }));

  // ------------------------
  // First Table: Activation Category and Activation Date
  // ------------------------
  const firstTableHeader = ["Activation Category", "Activation Date"];

  worksheet.addRow(firstTableHeader);

  const activationData = [
    ["FSA_Date", firstTableData[0]?.FSA_Date],
    ["p25_date", firstTableData[0]?.p25_date],
    ["p50_date", firstTableData[0]?.p50_date],
    ["p90_date", firstTableData[0]?.p90_date],
    ["p100_date", firstTableData[0]?.p100_date],
  ];

  activationData.forEach(([key, value]) => {
    const newRow = worksheet.addRow([key, value]);

    newRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });
  });

  // Style First Table Header
  const firstHeaderRow = worksheet.getRow(1);
  firstHeaderRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4CAF50" }, // Green
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Adjust column widths for the first table
  worksheet.getColumn(1).width = 20; // Activation Category
  worksheet.getColumn(2).width = 15; // Activation Date

  // ------------------------
  // Add Blank Row
  // ------------------------
  worksheet.addRow([]);

  // ------------------------
  // Add Blank Row
  // ------------------------
  worksheet.addRow([]);

  // ------------------------
  // Second Table Data
  // ------------------------
  const secondTableHeader = [
    "Country",
    "Sites",
    "Median CTA to FSA",
    "FSA Date",
    "P25",
    "P25 Date",
    "P50",
    "P50 Date",
    "P90",
    "P90 Date",
    "P100",
    "P100 Date",
  ];

  worksheet.addRow(secondTableHeader);

  secondTableData.forEach((row) => {
    const newRow = worksheet.addRow([
      row.country,
      row.total_sites,
      row.median_first_site,
      formatDate(row.country_fsa),
      row.p25,
      row.country_p25_date,
      row.p50,
      row.country_p50_date,
      row.p90,
      row.country_p90_date,
      row.p100,
      row.country_p100_date,
    ]);

    newRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Apply color to specific cells in the row
    const colorColumns = {
      "FSA Date": row.fsa_date_color,
      "P25 Date": row.p25_date_color,
      "P50 Date": row.p50_date_color,
      "P90 Date": row.p90_date_color,
      "P100 Date": row.p100_date_color,
    };

    Object.entries(colorColumns).forEach(([columnName, color]) => {
      if (color) {
        const columnIndex = secondTableHeader.indexOf(columnName) + 1; // ExcelJS columns are 1-based
        const cell = newRow.getCell(columnIndex);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: convertHexColor(color) },
        };
      }
    });
  });

  // Adjust column widths for the second table
  secondTableHeader.forEach((_, colIndex) => {
    const maxLength = Math.max(
      ...secondTableData.map(
        (row) => row[secondTableHeader[colIndex]]?.toString().length || 0
      ),
      secondTableHeader[colIndex].length
    );
    worksheet.getColumn(colIndex + 1).width = maxLength + 2;
  });

  // Style the header row for the second table
  const secondHeaderRow = worksheet.getRow(firstTableData.length + 3);
  secondHeaderRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFA726" }, // Orange
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Ensure all cells in the worksheet have borders
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // ------------------------
  // Save and Download
  // ------------------------
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Data.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
}
