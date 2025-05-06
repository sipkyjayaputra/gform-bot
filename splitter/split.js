const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Read Excel data
function readExcelData(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`Read ${data.length} rows from Excel.`);
    const columnNames = data.length > 0 ? Object.keys(data[0]) : [];
    return { data, columnNames };
}

// Write data to new Excel file
function writeExcelData(filePath, data, columnNames) {
    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(data, { header: columnNames });
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
    XLSX.writeFile(newWorkbook, filePath);
}

// Split the data into chunks of 10 rows
function splitDataIntoChunks(data, chunkSize) {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
}

// Main logic
const { data, columnNames } = readExcelData('sherly.xlsx');

// Split data into chunks of 10 rows each
const chunks = splitDataIntoChunks(data, 10);

// Save each chunk into a new Excel file
chunks.forEach((chunk, index) => {
    const fileName = path.join(__dirname, `output_${index + 1}.xlsx`);
    writeExcelData(fileName, chunk, columnNames);
    console.log(`Created file: ${fileName}`);
});
