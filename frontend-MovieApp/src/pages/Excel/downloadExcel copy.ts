import ExcelJS from "exceljs";

// Function to generate Excel file
export async function generateExcelFile() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Sample data for the first table
    const firstTableData = [
        ["Study ID", "Total Sites", "P25", "P25 Date", "P50", "P50 Date", "P90", "P90 Date", "P100", "P100 Date", "FSA Date"],
        ["ST12345", 3, 0, "2024-11-22", 5, "2024-11-25", 15, "2024-11-30", 20, "2024-12-05", "2024-12-10"],
    ];

    // Sample data for the second table
    const secondTableHeader = ["Country", "Sites", "Median CTA to FSA", "FSA Date", "P25", "P25 Date", "P50", "P50 Date", "P90", "P90 Date", "P100", "P100 Date"];
    const secondTableData = [
        ["Australia", 2, 175, "2024-11-22", 10, "2024-11-25", 20, "2024-11-28", 30, "2024-12-02", 40, "2024-12-05"],
        ["Argentina", 1, 150, "2024-11-22", 8, "2024-11-26", 18, "2024-11-29", 28, "2024-12-03", 38, "2024-12-06"],
        ["India", 1, 34150, "2024-11-23", 8, "2024-11-26", 18, "2024-11-29", 28, "2024-12-03", 38, "2024-12-06"],
        ["US", 13, 150, "2024-11-23", 458, "2024-11-26", 184, "2024-11-29", 453, "2024-12-03", 33, "2024-12-06"],
    ];

    // Add first table data
    firstTableData.forEach((row) => worksheet.addRow(row));

    // Add blank row
    worksheet.addRow([]);

    // Add second table header and data
    worksheet.addRow(secondTableHeader);
    secondTableData.forEach((row) => worksheet.addRow(row));

    // Style First Table Header
    const firstTableHeaderRow = worksheet.getRow(1);
    firstTableHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // White text
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4CAF50" }, // Green background
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Blank row (Row 3)
    const blankRow = worksheet.getRow(3);
    blankRow.eachCell((cell) => {
        cell.value = null; // Ensure it is blank
    });

    // Style Second Table Header
    const secondTableHeaderRow = worksheet.getRow(4);
    secondTableHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // White text
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFA726" }, // Orange background
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Style Second Table Body
    for (let i = 5; i <= worksheet.lastRow?.number!; i++) {
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

    // Save the workbook to a file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Trigger download (Browser environment)
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SampleData.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
}

export default generateExcelFile;
