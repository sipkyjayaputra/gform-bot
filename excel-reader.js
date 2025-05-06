const XLSX = require("xlsx");

// Read Excel data
function readExcelData(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`Read ${data.length} rows from Excel.`);
    const columnNames = data.length > 0 ? Object.keys(data[0]) : [];
    return {data, columnNames};
}

const {data, columnNames} = readExcelData('data chika - sherly.xlsx');
var count = 0;

for (const row of data) {
  count++;
  console.log(row[columnNames[1]]);
  break;
}
