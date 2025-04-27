const axios = require("axios");

const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc5KKhQ3vW9_DwzVFUtFBYnMke-1BWHoa2XxzrL08VaFpE1Eg/formResponse"; // Replace with your actual form URL

// Form data (replace with your actual entry IDs and form values)
const formData = {
  "entry.584998451": "5",
  "entry.574204818": "4",
  "entry.1032728229": "3",
  "entry.250849258": "3",
  "entry.1937539249": "4",
  "entry.1960238416": "3",
  "entry.563862666": "4",
  "entry.1930474306": "5",
  "entry.415183602": "5",
  "entry.818703358": "4",
  "entry.835058184": "4",
  "entry.1616721085": "4",
  "entry.348126939": "3",
  "entry.583260658": "3",
  "entry.1750795049": "4",
  "entry.2076068182": "5",
  "entry.824431802": "5",
  "entry.567180712": "5",
  "entry.960416865": "5",
  "entry.658440418": "5",
  "entry.340440474": "5",
  "entry.261472545": "5",
  "entry.74310040": "5",
  "entry.2112110540": "5",
  "entry.784075233": "5",
  "entry.1402204766": "5",
  "fvv": "1",
  "partialResponse": "[[[null,265156136,[\"Laki-laki\"],0],[null,2047850542,[\"25-30 Tahun\"],0],[null,1725548402,[\"S1\"],0],[null,700088067,[\"Rumah Tangga\"],0],[null,39052993,[\">5jt\"],0]],null,\"90504152724242801811\"]",
  "pageHistory": "0,1",
  "fbzx": "905041527242801811",
  "submissionTimestamp": "1745578867000"
};

// Send POST request to Google Form
async function submitForm() {
  try {
    const response = await axios.post(formUrl, new URLSearchParams(formData), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    console.log("Form submitted successfully:", response.data);
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

// Call the function to submit the form
submitForm();
