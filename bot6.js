const axios = require("axios");

const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc5KKhQ3vW9_DwzVFUtFBYnMke-1BWHoa2XxzrL08VaFpE1Eg/formResponse"; // Replace with your actual form URL

// URL-encoded form data (as you provided), but removed the `submissionTimestamp`
const formData = `entry.584998451=5&entry.574204818=4&entry.1032728229=3&entry.250849258=3&entry.1937539249=4&entry.1960238416=3&entry.563862666=4&entry.1930474306=5&entry.415183602=5&entry.818703358=4&entry.835058184=4&entry.1616721085=4&entry.348126939=3&entry.583260658=3&entry.1750795049=4&entry.2076068182=5&entry.824431802=5&entry.567180712=5&entry.960416865=5&entry.658440418=5&entry.340440474=5&entry.261472545=5&entry.74310040=5&entry.2112110540=5&entry.784075233=5&entry.1402204766=5&entry.584998451_sentinel=&entry.574204818_sentinel=&entry.1032728229_sentinel=&entry.250849258_sentinel=&entry.1937539249_sentinel=&entry.1960238416_sentinel=&entry.563862666_sentinel=&entry.1930474306_sentinel=&entry.415183602_sentinel=&entry.818703358_sentinel=&entry.835058184_sentinel=&entry.1616721085_sentinel=&entry.348126939_sentinel=&entry.583260658_sentinel=&entry.1750795049_sentinel=&entry.2076068182_sentinel=&entry.824431802_sentinel=&entry.567180712_sentinel=&entry.960416865_sentinel=&entry.658440418_sentinel=&entry.340440474_sentinel=&entry.261472545_sentinel=&entry.74310040_sentinel=&entry.2112110540_sentinel=&entry.784075233_sentinel=&entry.1402204766_sentinel=&fvv=1&partialResponse=%5B%5B%5Bnull%2C265156136%2C%5B%22Laki-laki%22%5D%2C0%5D%2C%5Bnull%2C2047850542%2C%5B%2225-30+Tahun%22%5D%2C0%5D%2C%5Bnull%2C1725548402%2C%5B%22S1%22%5D%2C0%5D%2C%5Bnull%2C700088067%2C%5B%22Rumah+Tangga%22%5D%2C0%5D%2C%5Bnull%2C39052993%2C%5B%22%5Cu003e5jt%22%5D%2C0%5D%5D%2Cnull%2C%22905041527242801811%22%5D&pageHistory=0%2C1&fbzx=905041527242801811`; // Removed `submissionTimestamp`

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
