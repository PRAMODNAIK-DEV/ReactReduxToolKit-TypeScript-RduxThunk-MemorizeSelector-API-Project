import ExcelJS from "exceljs";

function convertHexColor(hexCode: string): string {
    // Check if the color code starts with '#' and remove it
    if (hexCode.startsWith('#')) {
      return hexCode.slice(1);
    }
    // Return the code as-is if it doesn't start with '#'
    return hexCode;
  }

export async function downloadAPIDataInExcelWithCustomHeaders(
    firstTableData: any[],
    secondTableData: any[]
) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // ------------------------
    // First Table Data
    // ------------------------
    const firstTableHeader = [
        "Study ID",
        "Total Sites",
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
    worksheet.addRow(firstTableHeader);
    firstTableData.forEach((row) => {
        worksheet.addRow([
            row.study_id,
            row.Total_Sites,
            row.FSA_Date,
            row.p25,
            row.p25_date,
            row.p50,
            row.p50_date,
            row.p90,
            row.p90_date,
            row.p100,
            row.p100_date,
        ]);
    });

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
        // Add data row
        const newRow = worksheet.addRow([
            row.country,
            row.total_sites,
            row.median_first_site,
            row.country_fsa,
            row.p25,
            row.country_p25_date,
            row.p50,
            row.country_p50_date,
            row.p90,
            row.country_p90_date,
            row.p100,
            row.country_p100_date,
        ]);

        // Apply color to specific cells in the row
        const colorColumns = {
            "FSA Date": row.fsa_date_color,
            "P25 Date": row.p25_date_color,
            "P50 Date": row.p50_date_color,
            "P90 Date": row.p90_date_color,
            "P100 Date": row.p100_date_color,
        };

        const convertedColors = Object.fromEntries(
            Object.entries(colorColumns).map(([key, value]) => [key, convertHexColor(value)])
          );

        Object.entries(convertedColors).forEach(([columnName, color]) => {
            if (color) {
                const columnIndex = secondTableHeader.indexOf(columnName) + 1; // ExcelJS columns are 1-based
                const cell = newRow.getCell(columnIndex);
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: color },
                };
            }
        });
    });

    // ------------------------
    // Adjust Column Widths
    // ------------------------
    // Adjust column widths for the first table only
const adjustFirstTableColumnWidths = () => {
    const firstTableDataArray = [
        firstTableHeader,
        ...firstTableData.map((row) => [
            row.study_id,
            row.Total_Sites,
            row.p25,
            row.p25_date,
            row.p50,
            row.p50_date,
            row.p90,
            row.p90_date,
            row.p100,
            row.p100_date,
            row.FSA_Date,
        ]),
    ];

    const firstTableColumns = firstTableDataArray[0].map((_, colIndex) => {
        const maxLength = firstTableDataArray.reduce((max, row) => {
            const cellValue = row[colIndex] !== undefined ? row[colIndex].toString() : "";
            return Math.max(max, cellValue.length);
        }, 0);
        return maxLength + 2; // Add padding
    });

    firstTableColumns.forEach((width, colIndex) => {
        worksheet.getColumn(colIndex + 1).width = width;
    });
};

// Adjust column widths for the second table only
const adjustSecondTableColumnWidths = () => {
    const secondTableDataArray = [
        secondTableHeader,
        ...secondTableData.map((row) => [
            row.country,
            row.total_sites,
            row.median_first_site,
            row.country_fsa,
            row.p25,
            row.country_p25_date,
            row.p50,
            row.country_p50_date,
            row.p90,
            row.country_p90_date,
            row.p100,
            row.country_p100_date,
        ]),
    ];

    const secondTableColumns = secondTableDataArray[0].map((_, colIndex) => {
        const maxLength = secondTableDataArray.reduce((max, row) => {
            const cellValue = row[colIndex] !== undefined ? row[colIndex].toString() : "";
            return Math.max(max, cellValue.length);
        }, 0);
        return maxLength + 2; // Add padding
    });

    secondTableColumns.forEach((width, colIndex) => {
        worksheet.getColumn(colIndex + 1).width = width;
    });
};

// Apply adjustments
adjustSecondTableColumnWidths();
adjustFirstTableColumnWidths();

    // ------------------------
    // Styling for Headers
    // ------------------------
    const styleHeader = (rowIndex: number, fillColor: string) => {
        const headerRow = worksheet.getRow(rowIndex);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: fillColor },
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
    };

    styleHeader(1, "FF4CAF50"); // Green for the first table
    styleHeader(firstTableData.length + 3, "FFFFA726"); // Orange for the second table

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
