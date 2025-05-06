const axios = require("axios");
const XLSX = require("xlsx");

loopFormSubmissions()

// Loop Function
async function loopFormSubmissions() {
    var excelName = "";
    var formURL = "";

    const {data, columnNames} = readExcelData(excelName);
    var count = 0;
  
    for (const row of data) {
      count++;
      const formData = buildFormData(row, columnNames);  
      await submitForm(formURL, formData, count, getTimestamp());
  
      const delay = getRandomDelay();
      console.log(`Waiting ${delay / 1000} seconds before next submission...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Build Data Function

function buildFormData(row, columnNames) {
    return `entry.584998451=${row[columnNames[]] || ""}` +
      `&entry.574204818=${row[columnNames[]] || ""}` +
      `&entry.1032728229=${row[columnNames[]] || ""}` +
      `&entry.250849258=${row[columnNames[]] || ""}` +
      `&entry.1937539249=${row[columnNames[]] || ""}` +
      `&entry.1960238416=${row[columnNames[]] || ""}` +
      `&entry.563862666=${row[columnNames[]] || ""}` +
      `&entry.1930474306=${row[columnNames[]] || ""}` +
      `&entry.415183602=${row[columnNames[]] || ""}` +
      `&entry.818703358=${row[columnNames[]] || ""}` +
      `&entry.835058184=${row[columnNames[]] || ""}` +
      `&entry.1616721085=${row[columnNames[]] || ""}` +
      `&entry.348126939=${row[columnNames[]] || ""}` +
      `&entry.583260658=${row[columnNames[]] || ""}` +
      `&entry.1750795049=${row[columnNames[]] || ""}` +
      `&entry.2076068182=${row[columnNames[]] || ""}` +
      `&entry.824431802=${row[columnNames] || ""}` +
      `&entry.567180712=${row[columnNames[]] || ""}` +
      `&entry.960416865=${row[columnNames[]] || ""}` +
      `&entry.658440418=${row[columnNames[]] || ""}` +
      `&entry.340440474=${row[columnNames[]] || ""}` +
      `&entry.261472545=${row[columnNames[]] || ""}` +
      `&entry.74310040=${row[columnNames[]] || ""}` +
      `&entry.2112110540=${row[columnNames[]] || ""}` +
      `&entry.784075233=${row[columnNames[]] || ""}` +
      `&entry.1402204766=${row[columnNames[]] || ""}` +
  
      // sentinel fields (empty values)
      `&entry.584998451_sentinel=&entry.574204818_sentinel=&entry.1032728229_sentinel=&entry.250849258_sentinel=` +
      `&entry.1937539249_sentinel=&entry.1960238416_sentinel=&entry.563862666_sentinel=&entry.1930474306_sentinel=` +
      `&entry.415183602_sentinel=&entry.818703358_sentinel=&entry.835058184_sentinel=&entry.1616721085_sentinel=` +
      `&entry.348126939_sentinel=&entry.583260658_sentinel=&entry.1750795049_sentinel=&entry.2076068182_sentinel=` +
      `&entry.824431802_sentinel=&entry.567180712_sentinel=&entry.960416865_sentinel=&entry.658440418_sentinel=` +
      `&entry.340440474_sentinel=&entry.261472545_sentinel=&entry.74310040_sentinel=&entry.2112110540_sentinel=` +
      `&entry.784075233_sentinel=&entry.1402204766_sentinel=` +
  
      // static fields
      `&fvv=1` +
      `&partialResponse=%5B%5B%5Bnull%2C265156136%2C%5B%22${row[columnNames[]] || ''}%22%5D%2C0%5D%2C%5Bnull%2C2047850542%2C%5B%22${row[columnNames[]] || ''}%22%5D%2C0%5D%2C%5Bnull%2C1725548402%2C%5B%22${row[columnNames] || ''}%22%5D%2C0%5D%2C%5Bnull%2C700088067%2C%5B%22${row[columnNames] || ''}%22%5D%2C0%5D%2C%5Bnull%2C39052993%2C%5B%22%5Cu003e5jt%22%5D%2C0%5D%5D%2Cnull%2C%22905041527242801811%22%5D` +
      `&pageHistory=0%2C1` +
      `&fbzx=905041527242801811`;
}
  

// Submit Function
async function submitForm(formUrl, formData, count, timestamp) {
  try {
    const response = await axios.post(formUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    console.log(`${timestamp} Form ${count} submitted successfully!`);
  } catch (error) {
    console.error("Error submitting form:", error.response?.status, error.response?.statusText);
  }
}

// Excel Function
function readExcelData(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`Read ${data.length} rows from Excel.`);
    const columnNames = data.length > 0 ? Object.keys(data[0]) : [];
    return {data, columnNames};
}

// Timestamp Function
function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Get month in 2-digit format
    const day = String(now.getDate()).padStart(2, '0'); // Get day in 2-digit format
    const hours = String(now.getHours()).padStart(2, '0'); // Get hours in 2-digit format
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes in 2-digit format
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Get seconds in 2-digit format
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Random Function
function getRandomDelay() {
    return Math.floor(Math.random() * (300000 - 30000 + 1)) + 30000;
}
  