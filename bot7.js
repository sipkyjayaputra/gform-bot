const axios = require("axios");
const XLSX = require("xlsx");  // Library to read Excel files

const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc5KKhQ3vW9_DwzVFUtFBYnMke-1BWHoa2XxzrL08VaFpE1Eg/formResponse"; // Replace with your actual form URL

// Function to generate a random delay between 30 seconds (30000ms) and 5 minutes (300000ms)
function getRandomDelay() {
  return Math.floor(Math.random() * (300000 - 30000 + 1)) + 30000; // Random delay between 30 seconds and 5 minutes
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

// Read the responses from the Excel file
function readExcelData(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Get the first sheet
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON

  return data;  // Return array of responses
}

// Send POST request to Google Form
async function submitForm(userId, submissionId, formData) {
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
async function userSubmitForm(userId, data, numSubmissions) {
  for (let i = 0; i < numSubmissions; i++) {
    const delay = getRandomDelay(); // Get random delay between 30 seconds and 5 minutes

    // Wait for the random delay before making the request
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Fill the form data with the values from Excel
    const formData = createFormDataFromExcelData(data[i]);

    await submitForm(userId, i + 1, formData); // Submit the form for this user and this submission
  }
}

// Create URL-encoded form data based on Excel row data
function createFormDataFromExcelData(rowData) {
  let formData = "";
  Object.keys(rowData).forEach((key) => {
    formData += `entry.${key}=${encodeURIComponent(rowData[key])}&`;
  });
  // Remove the trailing '&'
  return formData.slice(0, -1);
}

// Function to simulate users submitting forms
async function simulateUsers(concurrentUsers, numSubmissionsPerUser, data) {
  const userPromises = [];

  for (let i = 0; i < concurrentUsers; i++) {
    const promise = userSubmitForm(i + 1, data, numSubmissionsPerUser);
    userPromises.push(promise);
  }

  // Wait for all user submissions to complete
  await Promise.all(userPromises);
  console.log(`[${getTimestamp()}] All ${concurrentUsers} users have completed their submissions!`);
}

// Start the simulation
const excelFilePath = 'responses.xlsx'; // Path to your Excel file
const data = readExcelData(excelFilePath); // Read data from Excel file

// Number of submissions each user will make
const concurrentUsers = 10;
const numSubmissionsPerUser = 30;

// Start the simulation with the data from Excel
simulateUsers(concurrentUsers, numSubmissionsPerUser, data)
  .then(() => {
    console.log(`[${getTimestamp()}] Simulation complete!`);
  })
  .catch((error) => {
    console.error(`[${getTimestamp()}] An error occurred during the simulation:`, error);
  });
