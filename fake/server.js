const QRCode = require('qrcode');

// import crypto from "crypto";
const crypto = require("crypto");
// IMPORTANT: Ensure you have this script tag in your root layout file (e.g., app/layout.tsx)


function decrypt(encryptedData) {
    const key = Buffer.from("1234567890abcdef1234567890abcdef", "utf8"); 
    const algorithm = "aes-256-gcm";

  const [ivB64, tagB64, dataB64] = encryptedData.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const encryptedText = Buffer.from(dataB64, "base64");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

const key = Buffer.from("1234567890abcdef1234567890abcdef", "utf8"); 
const algorithm = "aes-256-gcm";

function encrypt(text) {
  const iv = crypto.randomBytes(12); // GCM recommends 12-byte IVs
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Return base64-encoded combined string
  return (
    iv.toString("base64") +
    ":" +
    authTag.toString("base64") +
    ":" +
    encrypted.toString("base64")
  );
}



async function generateQRCode(uniqueId) {
  try {
    // The data to encode in the QR code (your unique ID)
    const dataToEncode = uniqueId; 

    // Generate the QR code as a data URL (e.g., for displaying in HTML)
    const dataUrl = await QRCode.toDataURL(dataToEncode);
    console.log('QR Code Data URL:', dataUrl);

    // Or, generate the QR code and save it to a file
    const filePath = `qr_code_${uniqueId}.png`; // Customize the filename
    await QRCode.toFile(filePath, dataToEncode, {
      errorCorrectionLevel: 'H' // Optional: Set error correction level (L, M, Q, H)
    });
    console.log(`QR Code saved to: ${filePath}`);

    return { dataUrl, filePath };

  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
}

// https://www.rann-neeti.co.in/api/verify/mess/
const saltRounds = 12;

async function registerUser() {
  let password = "qwertyabcde";
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hashed:", hash);
  return hash;
}

async function loginUser(hash) {
  let password = "qwertyabcde";
  const match = await bcrypt.compare(password, hash);
  console.log(match ? "✅ Match" : "❌ No match");
}

arr = ["mess_oak_9311039309"]; 
// const encoded = 

arr.forEach(element => {
    generateQRCode(Buffer.from(element, "utf8").toString("base64"))
  .then(({ dataUrl, filePath }) => {
    // You can now use dataUrl in a web application or serve the filePath
  })
  .catch(error => {
    // Handle the error
  });
});