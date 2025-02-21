const pool = require('../config/db');

// get pending-approvals from db
async function getPendingApprovals() {
    const query = `
        SELECT s.id, s.student_name, s.student_id, s.course, s.certificate_cid, s.status 
        FROM submissions s
        WHERE s.status = 'pending';
    `;
    const result = await pool.query(query);
    return result.rows;
}

// get specific pending-approval from db
async function getPendingApproval(requestId) {
    const query = `
        SELECT s.id, s.student_name, s.student_id, s.course, s.certificate_cid, s.status 
        FROM submissions s
        WHERE s.id = $1;
    `;
    const result = await pool.query(query, [requestId]);
    return result;
}

// change status to approved in db
async function approveRequest(certificateId,requestId) {
    const query = `
        UPDATE submissions SET status = 'approved', certificate_id = $1 WHERE id = $2;
    `;
    await pool.query(query, [certificateId,requestId]);
}

// change status to rejected in db
async function rejectRequest(requestId) {
    const query = `
        UPDATE submissions SET status = 'rejected' WHERE id = $1;
    `;
    await pool.query(query, [requestId]);
}

// insert details into certificates table
async function insertCertificateDetails(certificateId, certificateCID, txHash) {
    const query = `
        INSERT INTO certificates (certificate_id, certificate_cid, tx_hash, issued_at, is_valid)
        VALUES ($1, $2, $3, NOW(), true);
    `;
    await pool.query(query, [certificateId, certificateCID, txHash]);
}

module.exports = { getPendingApprovals, getPendingApproval, approveRequest, rejectRequest , insertCertificateDetails };