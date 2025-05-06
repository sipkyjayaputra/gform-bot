const axios = require("axios");
const XLSX = require("xlsx");

const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc5KKhQ3vW9_DwzVFUtFBYnMke-1BWHoa2XxzrL08VaFpE1Eg/formResponse";

// Random delay function
function getRandomDelay() {
  return Math.floor(Math.random() * (300000 - 30000 + 1)) + 30000;
}

// Read Excel data
function readExcelData(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  console.log(`Read ${data.length} rows from Excel.`);
  return data;
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

function buildFormData(row) {
  return `entry.584998451=${row['P1. Saya memiliki pengetahuan yang tinggi tentang produk - produk yang ramah lingkungan (Royco)'] || ""}` +
    `&entry.574204818=${row['P2. Saya memiliki harapan yang tinggi terhadap manfaat yang besar dari produk-produk ramah lingkungan (Royco)'] || ""}` +
    `&entry.1032728229=${row['P3. Saya memiliki pengetahuan bahwa produk yang ramah lingkungan (Royco) adalah produk yang berkualitas'] || ""}` +
    `&entry.250849258=${row['K1. Saya memiliki kesadaran yang tinggi terhadap produk - produk yang ramah lingkungan (Royco)'] || ""}` +
    `&entry.1937539249=${row['K2. Saya sangat peduli terhadap kebijakan pemerintah yang mewajibkan FMCG (Fast Moving Consumer Goods) untuk menghasilkan produk - produk yang ramah lingkungan (Royco)'] || ""}` +
    `&entry.1960238416=${row['K3. Perilaku masyarakat Indonesia mayoritas sangat peduli terhadap produk - produk yang ramah lingkungan (Royco)'] || ""}` +
    `&entry.563862666=${row['K4. Penerapan Kebijakan pemerintah yang terkait dengan limbah industri (Polusi air, udara dan tanah) sudah sangat baik'] || ""}` +
    `&entry.1930474306=${row['N1. Konsumen yang membeli produk-produk ramah lingkungan (Royco) adalah keputusan yang tepat'] || ""}` +
    `&entry.415183602=${row['N2. Konsumen yang membeli produk - produk ramah lingkungan (Royco) adalah pilihan yang benar'] || ""}` +
    `&entry.818703358=${row['N3. Sangat perlu bagi konsumen untuk membeli produk - produk yang ramah lingkungan (Royco)'] || ""}` +
    `&entry.835058184=${row['N4. Konsumen yang membeli produk - produk ramah lingkungan (Packaging yang mudah di daur ulang) maka konsumen tersebut sudah memberikan manfaat terhadap pengolahan limbah'] || ""}` +
    `&entry.1616721085=${row['KP1. Saya selalu mengontrol dalam membuat keputusan pembelian produk - produk yang ramah lingkungan (Royco)'] || ""}` +
    `&entry.348126939=${row['KP2. Saya selalu memberikan masukan positif kepada kerabat atau teman dalam memutuskan pembelian produk - produk yang ramah lingkungan (Royco)'] || ""}` +
    `&entry.583260658=${row['KP3. Saya memiliki inisiatif yang tinggi setiap pembelian produk - produk yang ramah lingkungan (Royco)'] || ""}` +
    `&entry.1750795049=${row['KP4. Saya tidak harus meminta saran orang lain setiap melakukan pembelian produk - produk ramah lingkungan (Royco)'] || ""}` +
    `&entry.2076068182=${row['KP5. Keputusan saya dalam membeli produk - produk ramah lingkungan (Royco) tidak ada campur tangan dari orang lain (baik dalam hal saran, tekanan dari pemerintah setempat)'] || ""}` +
    `&entry.824431802=${row['ML1. Saya sangat bersedia jika diminta membayar lebih mahal untuk produk - produk yang ramah lingkungan (Konsumen diminta membeli packaging yang tidak berbahan plastik karena tidak ramah lingkungan)'] || ""}` +
    `&entry.567180712=${row['ML2. Saya sangat bersedia membeli produk Royco yang lebih mahal bila di bandingkan dengan produk Masako atau Ajinomoto '] || ""}` +
    `&entry.960416865=${row['ML3. Saya sangat bersedia membayar produk - produk ramah lingkungan (Royco) dengan harga lebih tinggi dari produk pesaing lainnya karena produk Royco memiliki packaging yang tidak merusak lingkungan'] || ""}` +
    `&entry.658440418=${row['S1. Saya meyakini bahwa pembelian produk ramah lingkungan (Royco) adalah tindakan yang benar'] || ""}` +
    `&entry.340440474=${row['S2. Saya meyakini bahwa pembelian produk ramah lingkungan (Royco) berdampak positif terhadap kelestarian lingkungan'] || ""}` +
    `&entry.261472545=${row['S3. Pembelian produk - produk yang ramah lingkungan (Royco) adalah tindakan yang menyenangkan '] || ""}` +
    `&entry.74310040=${row['S4.  Pembelian produk - produk yang ramah lingkungan (Royco) adalah tindakan yang bijaksana'] || ""}` +
    `&entry.2112110540=${row['NB1. Saya memiliki niat yang tinggi terhadap pembelian produk ramah lingkungan (Royco) karena memberikan manfaat bagi kelestarian lingkungan  '] || ""}` +
    `&entry.784075233=${row['NB2. Saya memiliki niat yang tinggi untuk membeli produk ramah lingkungan (Royco) karena memiliki packaging yang tidak menyebabkan pencemaran lingkungan'] || ""}` +
    `&entry.1402204766=${row['NB3. Saya memiliki niat yang tinggi untuk membeli produk ramah lingkungan (Royco) karena memiliki perhatian yang lebih terhadap lingkungan'] || ""}` +

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
    `&partialResponse=%5B%5B%5Bnull%2C265156136%2C%5B%22${row['Jenis Kelamin'] || ''}%22%5D%2C0%5D%2C%5Bnull%2C2047850542%2C%5B%22${row['Usia'] || ''}%22%5D%2C0%5D%2C%5Bnull%2C1725548402%2C%5B%22${row['Pendidikan Terakhir'] || ''}%22%5D%2C0%5D%2C%5Bnull%2C700088067%2C%5B%22${row['Pekerjaan'] || ''}%22%5D%2C0%5D%2C%5Bnull%2C39052993%2C%5B%22%5Cu003e5jt%22%5D%2C0%5D%5D%2Cnull%2C%22905041527242801811%22%5D` +
    `&pageHistory=0%2C1` +
    `&fbzx=905041527242801811`;
}


// Submit form
async function submitForm(formData, count) {
  try {
    const response = await axios.post(formUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    console.log(response.data)
    console.log(`${getTimestamp()} Form ${count} submitted successfully!`);
  } catch (error) {
    console.error("Error submitting form:", error.response?.status, error.response?.statusText);
  }
}

// Loop through Excel data and submit
async function loopFormSubmissions() {
  const data = readExcelData("./response-21.xlsx"); // <-- Update your file path here

  var count = 0;

  for (const row of data) {
    count++;
    const formData = buildFormData(row);
    // console.log("Submitting with data:", formData);

    await submitForm(formData, count);
    // break;

    // const delay = getRandomDelay();
    // console.log(`Waiting ${delay / 1000} seconds before next submission...`);
    // await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Start
loopFormSubmissions();
