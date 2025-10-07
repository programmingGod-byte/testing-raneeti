const QRCode = require('qrcode');

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

// Example usage with a unique ID
const myUniqueId = 'your_unique_id_here_12345';
// https://www.rann-neeti.co.in/api/verify/mess/
arr = ["pro_1","pro_2","pro_3","pro_4"]; 
arr.forEach(element => {
    generateQRCode(element)
  .then(({ dataUrl, filePath }) => {
    // You can now use dataUrl in a web application or serve the filePath
  })
  .catch(error => {
    // Handle the error
  });
});