const axios = require("axios");
const XLSX = require("xlsx");
const path = require('path');

loopFormSubmissions()

// Loop Function
async function loopFormSubmissions() {
  var formURL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSc9PxvgBLiV3CAVa9KxiIcSL2EL-S1lwpAZbytkyhEfmCYM-g/formResponse";

  // excel 6 from 1
  for (let i = 9; i <= 11; i++) {
    var excelName = `./output_${i}.xlsx`;
    console.log(`Processing ${excelName}`);

    const { data, columnNames } = readExcelData(excelName);
    var count = 0;

    for (const row of data) {
      count++;
      const formData = buildFormData(row, columnNames);
      await submitForm(formURL, formData, i, count, getTimestamp());


      const delay = getRandomDelay();
      console.log(`Waiting ${delay / 1000} seconds before next submission...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Build Data Function
function buildFormData(row, columnNames) {
  var data = `entry.1458294612=${row[columnNames[6]] || ''}` +
    `&entry.617459596=${row[columnNames[7]] || ''}` +
    `&entry.1277250765=${row[columnNames[8]] || ''}` +
    `&entry.423136957=${row[columnNames[9]] || ''}` +
    `&entry.141171058=${row[columnNames[10]] || ''}` +
    `&entry.496570298=${row[columnNames[11]] || ''}` +
    `&entry.1865618183=${row[columnNames[12]] || ''}` +
    `&entry.2115436759=${row[columnNames[13]] || ''}` +
    `&entry.1536640852=${row[columnNames[14]] || ''}` +
    `&entry.269742986=${row[columnNames[15]] || ''}` +
    `&entry.93013301=${row[columnNames[16]] || ''}` +
    `&entry.1590515293=${row[columnNames[17]] || ''}` +
    `&entry.1878983245=${row[columnNames[18]] || ''}` +
    `&entry.935054594=${row[columnNames[19]] || ''}` +
    `&entry.582939008=${row[columnNames[20]] || ''}` +
    `&entry.67657837=${row[columnNames[21]] || ''}` +
    `&entry.508716087=${row[columnNames[22]] || ''}` +
    `&entry.637553909=${row[columnNames[23]] || ''}` +
    `&entry.1409587875=${row[columnNames[24]] || ''}` +
    `&entry.2023580568=${row[columnNames[25]] || ''}` +
    `&entry.1762725288=${row[columnNames[26]] || ''}` +
    `&entry.1812627372=${row[columnNames[27]] || ''}` +
    `&entry.1834677226=${row[columnNames[28]] || ''}` +
    `&entry.619937212=${row[columnNames[29]] || ''}` +
    `&entry.1320261628=${row[columnNames[30]] || ''}` +
    `&entry.352663712=${row[columnNames[31]] || ''}` +
    `&entry.1458294612_sentinel=&entry.617459596_sentinel=&entry.1277250765_sentinel=&entry.423136957_sentinel=&entry.141171058_sentinel=&entry.496570298_sentinel=&entry.1865618183_sentinel=&entry.2115436759_sentinel=&entry.1536640852_sentinel=&entry.269742986_sentinel=&entry.93013301_sentinel=&entry.1590515293_sentinel=&entry.1878983245_sentinel=&entry.935054594_sentinel=&entry.582939008_sentinel=&entry.67657837_sentinel=&entry.508716087_sentinel=&entry.637553909_sentinel=&entry.1409587875_sentinel=&entry.2023580568_sentinel=&entry.1762725288_sentinel=&entry.1812627372_sentinel=&entry.1834677226_sentinel=&entry.619937212_sentinel=&entry.1320261628_sentinel=&entry.352663712_sentinel=&` +
    `fvv=1&partialResponse=%5B%5B%5Bnull%2C442730078%2C%5B%22${row[columnNames[1]]}%22%5D%2C0%5D%2C%5Bnull%2C1155007559%2C%5B%22${row[columnNames[2]]}%22%5D%2C0%5D%2C%5Bnull%2C465983938%2C%5B%22${row[columnNames[3]]}%22%5D%2C0%5D%2C%5Bnull%2C595856659%2C%5B%22${row[columnNames[4]]}%22%5D%2C0%5D%2C%5Bnull%2C2060385640%2C%5B%22${row[columnNames[5]]}%22%5D%2C0%5D%5D%2Cnull%2C%225270718724465680299%22%5D&pageHistory=0%2C1&fbzx=5270718724465680299&submissionTimestamp=${Date.now()}`
  console.log(row[columnNames[1]])


  return data;
}

// Submit Function
async function submitForm(formUrl, formData, excel, count, timestamp) {
  try {
    const response = await axios.post(formUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const successMessage = `${timestamp} Excel ${excel} Form ${count} - status ${response.status} - statusText ${response.statusText}!`;
    console.log(successMessage);
    writeLog(successMessage);
  } catch (error) {
    console.error("Error submitting form:", error.response?.status, error.response?.statusText);
  }
}

const logFilePath = path.join(__dirname, 'log.txt');

function writeLog(message) {
  fs.appendFile(logFilePath, message + '\n', err => {
    if (err) console.error("Failed to write log:", err);
  });
}


// Excel Function
function readExcelData(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  console.log(`Read ${data.length} rows from Excel.`);
  const columnNames = data.length > 0 ? Object.keys(data[0]) : [];

  return { data, columnNames };
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
  return Math.floor(Math.random() * 180001); // 0 to 180000 ms (3 minutes)
}
