import ExcelJS from "exceljs";

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
        "P25",
        "P25 Date",
        "P50",
        "P50 Date",
        "P90",
        "P90 Date",
        "P100",
        "P100 Date",
        "FSA Date",
    ];
    const firstTableRows = [firstTableHeader, ...firstTableData.map(Object.values)];

    const firstTableStartRow = 1;
    firstTableRows.forEach((row) => worksheet.addRow(row));

    // ------------------------
    // Add Blank Row
    // ------------------------
    const blankRowIndex = firstTableRows.length + 1;
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
    const secondTableRows = [secondTableHeader, ...secondTableData.map(Object.values)];

    const secondTableStartRow = blankRowIndex + 1;
    secondTableRows.forEach((row) => worksheet.addRow(row));

    // ------------------------
    // Column Width Adjustment
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
            worksheet.getColumn(startIndex + colIndex).width = Math.max(
                worksheet.getColumn(startIndex + colIndex).width || 0,
                width
            );
        });
    };

    adjustColumnWidths(firstTableRows, 1);
    adjustColumnWidths(secondTableRows, 1);

    // ------------------------
    // Styling for Headers
    // ------------------------
    const styleHeader = (rowIndex: number, fillColor: string) => {
        const headerRow = worksheet.getRow(rowIndex);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // White text
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

    styleHeader(firstTableStartRow, "FF4CAF50"); // Green for the first table
    styleHeader(secondTableStartRow, "FFFFA726"); // Orange for the second table

    // ------------------------
    // Styling for Data Rows
    // ------------------------
    const styleDataRows = (startRow: number, endRow: number) => {
        for (let i = startRow; i <= endRow; i++) {
            const row = worksheet.getRow(i);
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
                cell.alignment = { vertical: "middle", horizontal: "center" };
            });
        }
    };

    styleDataRows(firstTableStartRow + 1, blankRowIndex - 1);
    styleDataRows(secondTableStartRow + 1, worksheet.lastRow?.number || 0);

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
