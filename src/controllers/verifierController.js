const {Web3} = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Web3 using your blockchain RPC URL
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC_URL));

// Load the contract ABI from your compiled contract JSON file.
const contractJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../blockchain/UniversityCertificateManagement.json'), 'utf8'));
const contractABI = contractJson.abi;
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

/**
 * Verify Certificate Controller
 * Expects a query parameter "certificateId".
 * Retrieves certificate details from the blockchain and renders the verifier view with the details.
 */
async function verifyCertificate(req, res) {
  try {
    const { certificateId } = req.query;
    if (!certificateId) {
      return res.render('verifier/index', { 
        result: "Please provide a certificate ID to verify.",
        certificateDetails: null 
      });
    }

    // Retrieve certificate details from the contract
    const certificate = await contractInstance.methods.certificates(certificateId).call();
    
    // Convert BigInt values to regular numbers
    const formattedCertificate = {
      ...certificate,
      issueDate: Number(certificate.issueDate), // Convert to regular number
      id: Number(certificateId)
    };

    const isValid = await contractInstance.methods.verifyCertificate(certificateId).call();

    let resultMessage = isValid 
      ? `Certificate ID ${certificateId} is valid.`
      : `Certificate ID ${certificateId} is invalid or revoked.`;

    res.render('verifier/index', { 
      result: resultMessage,
      certificateDetails: formattedCertificate
    });
  } catch (error) {
    console.error("Error in verifying certificate:", error);
    res.render('verifier/index', { 
      result: "An error occurred during verification. Please try again.",
      certificateDetails: null
    });
  }
}

module.exports = { verifyCertificate };
