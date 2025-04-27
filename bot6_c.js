const axios = require("axios");

const formUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdzi7MH6-fkIihkMkPwFLU0tbzN6tV8BEEnpVmicbYVDlI9tw/formResponse"; // Replace with your actual form URL

// URL-encoded form data (as you provided), but removed the `submissionTimestamp`
const formData = `entry.276016609=1&entry.947261862=2&entry.1189456562=3&entry.465084638=4&entry.1371286681=5&entry.231017609=1&entry.2102731181=2&entry.485873307=3&entry.94585940=4&entry.1834980939=5&entry.1339787925=1&entry.831713182=2&entry.1787360908=3&entry.1686021562=4&entry.565375366=5&entry.648562985=1&entry.404477622=2&entry.1854138603=3&entry.793462805=4&entry.790809698=5&entry.239635700=1&dlut=1745755306356&entry.276016609_sentinel=&entry.947261862_sentinel=&entry.1189456562_sentinel=&entry.465084638_sentinel=&entry.1371286681_sentinel=&entry.231017609_sentinel=&entry.2102731181_sentinel=&entry.485873307_sentinel=&entry.94585940_sentinel=&entry.1834980939_sentinel=&entry.1339787925_sentinel=&entry.831713182_sentinel=&entry.1787360908_sentinel=&entry.1686021562_sentinel=&entry.565375366_sentinel=&entry.648562985_sentinel=&entry.404477622_sentinel=&entry.1854138603_sentinel=&entry.793462805_sentinel=&entry.790809698_sentinel=&entry.239635700_sentinel=&fvv=1&partialResponse=%5B%5B%5Bnull%2C226490929%2C%5B%22Ya%22%5D%2C0%5D%2C%5Bnull%2C89834772%2C%5B%22Ya%22%5D%2C0%5D%2C%5Bnull%2C1851134817%2C%5B%22DKI+Jakarta%22%5D%2C0%5D%2C%5Bnull%2C1896334216%2C%5B%22Perempuan%22%5D%2C0%5D%2C%5Bnull%2C131402200%2C%5B%2226+-+30+Tahun%22%5D%2C0%5D%2C%5Bnull%2C2134411759%2C%5B%22Pegawai+Swasta%22%5D%2C0%5D%2C%5Bnull%2C769345580%2C%5B%22S2%22%5D%2C0%5D%2C%5Bnull%2C1879679850%2C%5B%22%5Cu003e+Rp+5.000.001%22%5D%2C0%5D%5D%2Cnull%2C%222110616949949523644%22%2Cnull%2Cnull%2Cnull%2C%22hello%40test.com%22%2C1%5D&pageHistory=0%2C1%2C2%2C3%2C4&fbzx=2110616949949523644&submissionTimestamp=1745755302982`; // Removed `submissionTimestamp`

// Function to generate a random delay between 30 seconds (30000ms) and 5 minutes (300000ms)
function getRandomDelay() {
  return Math.floor(Math.random() * (300000 - 30000 + 1)) + 30000; // Random delay between 30 seconds and 5 minutes
}

// Read the responses from the Excel file
function readExcelData(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Get the first sheet
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON

  return data;  // Return array of responses
}

// Function to get a readable timestamp in the format "YYYY-MM-DD HH:mm:ss"
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

// Send POST request to Google Form
async function submitForm(userId, submissionId) {
  try {
    const response = await axios.post(formUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded" // Set correct content type
      }
    });
    console.log(`[${getTimestamp()}] User ${userId} - Submission ${submissionId} completed successfully!`);
  } catch (error) {
    console.error(`[${getTimestamp()}] User ${userId} - Submission ${submissionId} error:`, error);
  }
}

// Function to simulate a user submitting the form multiple times
async function userSubmitForm(userId, numSubmissions) {
  for (let i = 0; i < numSubmissions; i++) {
    const delay = getRandomDelay(); // Get random delay between 30 seconds and 5 minutes

    // Wait for the random delay before making the request
    await new Promise((resolve) => setTimeout(resolve, delay));

    await submitForm(userId, i + 1); // Submit the form for this user and this submission
  }
}

// Function to simulate 10 users submitting 30 forms each concurrently
async function simulateUsers(concurrentUsers, numSubmissionsPerUser) {
  const userPromises = [];

  for (let i = 1; i <= concurrentUsers; i++) {
    const promise = userSubmitForm(i, numSubmissionsPerUser);
    userPromises.push(promise);
  }

  // Wait for all user submissions to complete
  await Promise.all(userPromises);
  console.log(`[${getTimestamp()}] All ${concurrentUsers} users have completed their submissions!`);
}

// Start the simulation with 10 users, each submitting 30 times
simulateUsers(10, 30)
  .then(() => {
    console.log(`[${getTimestamp()}] Simulation complete!`);
  })
  .catch((error) => {
    console.error(`[${getTimestamp()}] An error occurred during the simulation:`, error);
  });
