import ExcelJS from "exceljs";

function formatDate(date: string): string {
    // Convert "YYYY-MM-DD" to "DD-MM-YYYY"
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
}

function convertHexColor(hexCode: string): string {
    // Remove '#' if it exists in the hex code
    return hexCode.startsWith("#") ? hexCode.slice(1) : hexCode;
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
        const newRow = worksheet.addRow([
            row.study_id,
            row.Total_Sites,
            formatDate(row.FSA_Date), // Format the FSA Date
            row.p25,
            row.p25_date,
            row.p50,
            row.p50_date,
            row.p90,
            row.p90_date,
            row.p100,
            row.p100_date,
        ]);

        // Center-align every cell in the row
        newRow.eachCell((cell) => {
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });
    });

    // Add a blank row after the first table
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
            formatDate(row.country_fsa), // Format the FSA Date
            row.p25,
            row.country_p25_date,
            row.p50,
            row.country_p50_date,
            row.p90,
            row.country_p90_date,
            row.p100,
            row.country_p100_date,
        ]);

        // Center-align every cell in the row
        newRow.eachCell((cell) => {
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        // Apply color to specific date columns
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
    // Adjust Column Widths Separately for Each Table
    // ------------------------
    const adjustColumnWidths = (data: any[][], startIndex: number) => {
        const columns = data[0].map((_, colIndex) => {
            const maxLength = data.reduce((max, row) => {
                const cellValue = row[colIndex] !== undefined ? row[colIndex].toString() : "";
                return Math.max(max, cellValue.length);
            }, 0);
            return maxLength + 2; // Add padding
        });

        columns.forEach((width, colIndex) => {
            worksheet.getColumn(startIndex + colIndex).width = width;
        });
    };

    adjustColumnWidths(
        [firstTableHeader, ...firstTableData.map((row) => [
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
            formatDate(row.FSA_Date),
        ])],
        1
    );

    adjustColumnWidths(
        [secondTableHeader, ...secondTableData.map((row) => [
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
        ])],
        1
    );

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
