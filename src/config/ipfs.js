const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config({ path: __dirname + '/../../.env' });

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

/**
 * Upload file to IPFS via Pinata
 * @param {Buffer} fileBuffer - The file data
 * @param {string} fileName - The name of the file
 * @returns {Promise<string>} - Returns IPFS CID
 */
async function uploadToIPFS(fileBuffer, fileName) {
  try {
    const formData = new FormData();

    // Convert Buffer to a Blob using a Stream
    formData.append("file", fileBuffer, {
      filename: fileName,
      contentType: "application/pdf",
    });

    // Pinata metadata
    const metadata = JSON.stringify({ name: fileName });
    formData.append("pinataMetadata", metadata);

    // Pinata options
    const options = JSON.stringify({ cidVersion: 1 });
    formData.append("pinataOptions", options);

    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        ...formData.getHeaders(),
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
      },
    });

    return response.data.IpfsHash; // Return IPFS CID
  } catch (error) {
    console.error("IPFS Upload Error:", error.response?.data || error.message);
    throw new Error("Failed to upload file to IPFS");
  }
}

module.exports = { uploadToIPFS };
