const {Web3} = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: __dirname + '/../../.env' });

console.log('🔄 Initializing Web3 with RPC URL:', process.env.BLOCKCHAIN_RPC_URL);
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC_URL));

// Declare variables at module scope
let contractInstance;
let contractAddress;

try {
    console.log('📄 Loading contract JSON file...');
    const contractJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'UniversityCertificateManagement.json'), 'utf8'));
    const contractABI = contractJson.abi;
    contractAddress = process.env.CONTRACT_ADDRESS; // Now accessible throughout the module
    console.log('✅ Contract Address:', contractAddress);

    console.log('🔄 Creating contract instance...');
    contractInstance = new web3.eth.Contract(contractABI, contractAddress);
    console.log('✅ Contract instance created successfully');
} catch (error) {
    console.error('❌ Error during initialization:', error);
    throw error;
}

async function issueCertificateOnBlockchain(certificateCID) {
    if (!contractInstance || !contractAddress) {
        throw new Error('Contract not properly initialized');
    }
    
    console.log('🔄 Starting certificate issuance for CID:', certificateCID);
    try {
        // Get the admin account and private key from .env
        const adminAccount = process.env.ADMIN_ACCOUNT;
        console.log('👤 Using admin account:', adminAccount);

        // Prepare the transaction
        console.log('🔄 Preparing transaction...');
        const tx = contractInstance.methods.issueCertificate(certificateCID);
        
        console.log('⛽ Estimating gas...');
        const gas = await tx.estimateGas({ from: adminAccount });
        console.log('✅ Estimated gas:', gas);

        console.log('💰 Getting gas price...');
        const gasPrice = await web3.eth.getGasPrice();
        console.log('✅ Current gas price:', gasPrice);

        const data = tx.encodeABI();
        
        console.log('🔢 Getting nonce...');
        const nonce = await web3.eth.getTransactionCount(adminAccount);
        console.log('✅ Current nonce:', nonce);

        const txData = {
            from: adminAccount,
            to: contractAddress,
            data,
            gas,
            gasPrice,
            nonce,
        };
        console.log('📝 Transaction data prepared:', txData);

        // Sign and send transaction
        console.log('✍️ Signing transaction...');
        const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.ADMIN_PRIVATE_KEY);
        console.log('✅ Transaction signed');

        console.log('🚀 Sending transaction...');
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('✅ Transaction confirmed! Receipt:', receipt.transactionHash);

        // Extract certificateId - with proper error handling
        const getEventData = (receipt) => {
            try {
                // Get raw logs
                const logs = receipt.logs;
                if (!logs || logs.length === 0) {
                    console.log('⚠️ No logs found in receipt');
                    return null;
                }

                // Get the first log (our event should be the only one)
                const log = logs[0];
                
                // Decode the log data
                const decodedData = web3.eth.abi.decodeLog(
                    [
                        { type: 'uint256', name: 'certificateId', indexed: true },
                        { type: 'string', name: 'certificateCID' }
                    ],
                    log.data,
                    // First topic is event signature, second topic is the indexed parameter
                    [log.topics[1]] 
                );

                console.log('🔍 Decoded event data:', decodedData);
                return decodedData.certificateId;
            } catch (error) {
                console.warn('⚠️ Error extracting event data:', error);
                return null;
            }
        };

        // Update the event extraction code
        const certificateId = getEventData(receipt);
        if (!certificateId) {
            console.warn('⚠️ Could not extract certificate ID from transaction');
        }
        
        console.log('📜 Certificate ID:', certificateId);
        
        return { certificateId, txReceipt: receipt };
    } catch (error) {
        console.error('❌ Blockchain issuance error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        throw error;
    }
}

module.exports = { issueCertificateOnBlockchain };
