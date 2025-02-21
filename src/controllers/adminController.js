const {uploadToIPFS} = require('../config/ipfs');
const {getPendingApprovals, getPendingApproval, approveRequest, rejectRequest, insertCertificateDetails} = require('../models/adminModels');
const {issueCertificateOnBlockchain} = require('../blockchain/contractHelper');
const pool = require('../config/db');

async function getPendingApprovalsPage(req, res) {
    console.log('📋 Fetching pending approvals...');
    try {
        const pendingApprovals = await getPendingApprovals();
        console.log(`✅ Found ${pendingApprovals.length} pending approvals`);
        res.render('admin/pending-approvals', {pendingApprovals});
    } catch (error) {
        console.error("❌ Error fetching pending approvals:", {
            error: error.message,
            stack: error.stack
        });
        res.status(500).send("Internal Server Error");
    }
}

async function approveSubmission(req, res) {
    const submissionId = req.params.id;
    
    try {
        // Start a transaction
        await pool.query('BEGIN');

        const submissionResult = await getPendingApproval(submissionId);
        if (submissionResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).send("Submission not found");
        }
        
        const submission = submissionResult.rows[0];
        
        // Issue certificate on blockchain
        const { certificateId, txReceipt } = await issueCertificateOnBlockchain(submission.certificate_cid);

        // First insert the certificate record
        console.log('📝 Storing certificate details...');
        await insertCertificateDetails(certificateId, submission.certificate_cid, txReceipt.transactionHash);
        console.log('✅ Certificate details stored');

        // Then update the submission
        console.log('💾 Updating submission record...');
        await approveRequest(certificateId, submissionId);
        console.log('✅ Submission status updated');

        // Commit the transaction
        await pool.query('COMMIT');

        res.redirect('/admin/pending-approvals');
    } catch (error) {
        // Rollback on error
        await pool.query('ROLLBACK');
        console.error('❌ Error in approval process:', {
            error: error.message,
            stack: error.stack,
            submissionId
        });
        res.status(500).send("Internal Server Error");
    }
}

async function rejectSubmission(req, res) {
    const submissionId = req.params.id;
    console.log(`🔄 Processing rejection for submission ID: ${submissionId}`);
    
    try {
        await rejectRequest(submissionId);
        console.log('✅ Submission rejected successfully');
        res.redirect('/admin/pending-approvals');
    } catch (error) {
        console.error('❌ Error rejecting submission:', {
            error: error.message,
            stack: error.stack,
            submissionId
        });
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {getPendingApprovalsPage, approveSubmission, rejectSubmission};