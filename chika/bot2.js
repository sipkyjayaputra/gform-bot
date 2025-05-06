const axios = require("axios");
const XLSX = require("xlsx");
const cheerio = require('cheerio');

loopFormSubmissions()

// Loop Function
async function loopFormSubmissions() {
  var formURL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeGzs90WUYT923VKxjIz245g4bW8HuJSEE02OQB_NDe2Lr66g/formResponse";

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
    var data = `entry.1330969893=${row[columnNames[10]] || ""}` +
    `&entry.762263665=${row[columnNames[11]] || ""}`+
    `&entry.1143520546=${row[columnNames[12]] || ""}` +
    `&entry.1052828741=${row[columnNames[13]] || ""}` + 
    `&entry.1805263321=${row[columnNames[14]] || ""}` +
    `&entry.499552228=${row[columnNames[15]] || ""}` + 
    `&entry.1338496176=${row[columnNames[16]] || ""}` +
    `&entry.1342145460=${row[columnNames[17]] || ""}` +
    `&entry.1058386029=${row[columnNames[18]] || ""}` +
    `&entry.1063459728=${row[columnNames[19]] || ""}` +
    `&entry.2019132450=${row[columnNames[20]] || ""}` +
    `&entry.274394858=${row[columnNames[21]] || ""}` +
    `&entry.330578141=${row[columnNames[22]] || ""}` +
    `&entry.286607930=${row[columnNames[23]] || ""}` +
    `&entry.1690443224=${row[columnNames[24]] || ""}` +
    `&entry.1404426672=${row[columnNames[25]] || ""}` +
    `&entry.2077269165=${row[columnNames[26]] || ""}` + 
    `&entry.1445324083=${row[columnNames[27]] || ""}` +
    `&entry.1892699019=${row[columnNames[28]] || ""}` +
    `&entry.4340516=${row[columnNames[29]] || ""}` +
    `&entry.1615859929=${row[columnNames[30]] || ""}` + 
    `&entry.1330969893_sentinel=&entry.762263665_sentinel=&entry.1143520546_sentinel=&entry.1052828741_sentinel=&entry.1805263321_sentinel=&entry.499552228_sentinel=&entry.1338496176_sentinel=&entry.1342145460_sentinel=&entry.1058386029_sentinel=&entry.1063459728_sentinel=&entry.2019132450_sentinel=&entry.274394858_sentinel=&entry.330578141_sentinel=&entry.286607930_sentinel=&entry.1690443224_sentinel=&entry.1404426672_sentinel=&entry.2077269165_sentinel=&entry.1445324083_sentinel=&entry.1892699019_sentinel=&entry.4340516_sentinel=&entry.1615859929_sentinel=&` + 
    `fvv=1&partialResponse=%5B%5B%5Bnull%2C1226172030%2C%5B%22${row[columnNames[2]] || ""}%22%5D%2C0%5D%2C%5Bnull%2C2120588047%2C%5B%22${row[columnNames[3]] || ""}%22%5D%2C0%5D%2C%5Bnull%2C502503121%2C%5B%22${row[columnNames[4]] || ""}%22%5D%2C0%5D%2C%5Bnull%2C1951920989%2C%5B%22${row[columnNames[5]] || ""}%22%5D%2C0%5D%2C%5Bnull%2C1418442523%2C%5B%22${row[columnNames[6]] || ""}%22%5D%2C0%5D%2C%5Bnull%2C196586118%2C%5B%22${row[columnNames[7]] || ""}%22%5D%2C0%5D%2C%5Bnull%2C1260162817%2C%5B%22${row[columnNames[8]] || ""}%22%5D%2C0%5D%2C%5Bnull%2C1130254635%2C%5B%22${row[columnNames[9]] || ""}%22%5D%2C0%5D%5D%2Cnull%2C%22-1619037878034807490%22%2Cnull%2Cnull%2Cnull%2C%22${row[columnNames[1]] || ""}%22%2C1%5D&pageHistory=0%2C1%2C2%2C3%2C4&fbzx=6263490929356187660&submissionTimestamp=${Date.now()}`
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

    console.log(`${timestamp} Excel ${excel} Form ${count} - status ${response.status} - statusText ${response.statusText}!`);
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
  return Math.floor(Math.random() * 180001); // 0 to 180000 ms (3 minutes)
}
