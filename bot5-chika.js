const axios = require("axios");

const formUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdzi7MH6-fkIihkMkPwFLU0tbzN6tV8BEEnpVmicbYVDlI9tw/formResponse"; // Replace with your actual form URL

// URL-encoded form data (as you provided), but removed the `submissionTimestamp`
const formData = `entry.276016609=1&entry.947261862=2&entry.1189456562=3&entry.465084638=4&entry.1371286681=5&entry.231017609=1&entry.2102731181=2&entry.485873307=3&entry.94585940=4&entry.1834980939=5&entry.1339787925=1&entry.831713182=2&entry.1787360908=3&entry.1686021562=4&entry.565375366=5&entry.648562985=1&entry.404477622=2&entry.1854138603=3&entry.793462805=4&entry.790809698=5&entry.239635700=1&entry.276016609_sentinel=&entry.947261862_sentinel=&entry.1189456562_sentinel=&entry.465084638_sentinel=&entry.1371286681_sentinel=&entry.231017609_sentinel=&entry.2102731181_sentinel=&entry.485873307_sentinel=&entry.94585940_sentinel=&entry.1834980939_sentinel=&entry.1339787925_sentinel=&entry.831713182_sentinel=&entry.1787360908_sentinel=&entry.1686021562_sentinel=&entry.565375366_sentinel=&entry.648562985_sentinel=&entry.404477622_sentinel=&entry.1854138603_sentinel=&entry.793462805_sentinel=&entry.790809698_sentinel=&entry.239635700_sentinel=&fvv=1&partialResponse=%5B%5B%5Bnull%2C226490929%2C%5B%22Ya%22%5D%2C0%5D%2C%5Bnull%2C89834772%2C%5B%22Ya%22%5D%2C0%5D%2C%5Bnull%2C1851134817%2C%5B%22DKI+Jakarta%22%5D%2C0%5D%2C%5Bnull%2C1896334216%2C%5B%22Laki+-+Laki%22%5D%2C0%5D%2C%5Bnull%2C131402200%2C%5B%2226+-+30+Tahun%22%5D%2C0%5D%2C%5Bnull%2C2134411759%2C%5B%22Pegawai+Negeri%22%5D%2C0%5D%2C%5Bnull%2C769345580%2C%5B%22S1%22%5D%2C0%5D%2C%5Bnull%2C1879679850%2C%5B%22Rp.+1.000.001+-+3.000.000%22%5D%2C0%5D%5D%2Cnull%2C%221627156813134709677%22%2Cnull%2Cnull%2Cnull%2C%22test%40mail.com%22%2C1%5D&pageHistory=0%2C1%2C2%2C3%2C4&fbzx=1627156813134709677&submissionTimestamp=1745760140697`; 

// Function to generate a random delay between 30 seconds (30000ms) and 5 minutes (300000ms)
function getRandomDelay() {
  return Math.floor(Math.random() * (300000 - 30000 + 1)) + 30000; // Random delay between 30 seconds and 5 minutes
}

// Send POST request to Google Form
async function submitForm(count) {
  try {
    const response = await axios.post(formUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded" // Set correct content type
      }
    });

    console.log(response.statusText);

    console.log(`Form ${1} submitted successfully!`);
    console.log(response.data); // Optional: log the response data for debugging
    // console.log(response.data); // Optional: log the response data for debugging
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

// Function to continuously submit the form with random delays
async function loopFormSubmissions() {
  var count = 0;
  while (true) {
    count++;
    await submitForm(count);  // Submit the form
    break;

    // const delay = getRandomDelay();  // Get random delay between 30 seconds to 5 minutes
    // console.log(`Next submission will happen in ${delay / 1000} seconds...`);

    // // Wait for the random delay before the next submission
    // await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Start the form submission loop
loopFormSubmissions();
