const axios = require('axios');
const xlsx = require('xlsx');
const qs = require('qs');
const fs = require('fs');

// ======== CONFIGURATION ========

const filePath = "./data chika - sherli.xlsx"; // adjust path if needed
const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc5KKhQ3vW9_DwzVFUtFBYnMke-1BWHoa2XxzrL08VaFpE1Eg/formResponse";

// ======== FUNCTIONS ========

// Random delay between 30s - 5min
function getRandomDelay() {
  return Math.floor(Math.random() * (300000 - 30000 + 1)) + 30000;
}

// Get readable timestamp
function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// Submit the form
async function submitForm(formData, userId, submissionId) {
  try {
    const response = await axios.post(formUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    console.log(`[${getTimestamp()}] User ${userId} - Submission ${submissionId} completed successfully!`);
  } catch (error) {
    console.error(`[${getTimestamp()}] User ${userId} - Submission ${submissionId} error:`, error.message);
  }
}

// Load Excel file
function loadData() {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  console.log(data);

  return data;
}

// Build formData from Excel row
function buildFormData(row) {
  const payload = {};

  for (const [column, entryId] of Object.entries(columnToEntry)) {
    if (row[column] !== undefined) {
      payload[entryId] = row[column];
      payload[`${entryId}_sentinel`] = ''; // Add _sentinel field too
    }
  }

  // Static fields you always send
  payload['fvv'] = '1';
  payload['fbzx'] = '905041527242801811'; // You can randomize or fix
  payload['pageHistory'] = '0,1';
  payload['partialResponse'] = encodeURIComponent(`[[[null,265156136,["Laki-laki"],0],[null,2047850542,["25-30 Tahun"],0],[null,1725548402,["S1"],0],[null,700088067,["Rumah Tangga"],0],[null,39052993,[">5jt"],0]],null,"905041527242801811"]`);

  return qs.stringify(payload);
}

// Submit multiple rows
async function simulateUsers(concurrentUsers, numSubmissionsPerUser, excelData) {
  const userPromises = [];

  for (let i = 0; i < concurrentUsers; i++) {
    const promise = userSubmitForm(i + 1, numSubmissionsPerUser, excelData);
    userPromises.push(promise);
  }

  await Promise.all(userPromises);
  console.log(`[${getTimestamp()}] All ${concurrentUsers} users completed.`);
}

// A user submits multiple times
async function userSubmitForm(userId, numSubmissions, excelData) {
  for (let i = 0; i < numSubmissions; i++) {
    const randomRow = excelData[Math.floor(Math.random() * excelData.length)];
    const formData = buildFormData(randomRow);

    const delay = getRandomDelay();
    console.log(`[${getTimestamp()}] User ${userId} - Submission ${i + 1} will start after ${delay / 1000} seconds...`);

    await new Promise(resolve => setTimeout(resolve, delay));
    await submitForm(formData, userId, i + 1);
  }
}

// ======== START ========

(async () => {
  try {
    const excelData = loadData();

    console.log(`[${getTimestamp()}] Loaded ${excelData.length} rows from Excel.`);

    await simulateUsers(10, 30, excelData); // 10 users, 30 submissions each

    console.log(`[${getTimestamp()}] Simulation complete!`);
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
