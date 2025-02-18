const pool = require('../config/db');

/**
 * 📝 Save student submission to PostgreSQL
 */
async function saveSubmission(studentName, studentId, course, certificateCID) {
  const query = `
    INSERT INTO submissions (student_name, student_id, course, certificate_cid, status)
    VALUES ($1, $2, $3, $4, 'pending') RETURNING *;
  `;
  const values = [studentName, studentId, course, certificateCID];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * 🔍 Fetch student requests from PostgreSQL
 */
async function getStudentRequests(studentId) {
  const query = `
    SELECT id, student_name, student_id, course, certificate_cid, status 
    FROM submissions 
    WHERE student_id = $1;
  `;
  const result = await pool.query(query, [studentId]);
  return result.rows;
}

/**
 * ✅ Fetch student-approved certificates from PostgreSQL
 */
async function getStudentApprovedCertificates(studentId) {
  const query = `
    SELECT s.student_id, c.certificate_id, c.certificate_cid, c.tx_hash, c.issued_at 
    FROM certificates c
    JOIN submissions s ON c.certificate_id = s.certificate_id
    WHERE s.student_id = $1 AND s.status = 'approved';
  `;
  const result = await pool.query(query, [studentId]);
  return result.rows;
}

module.exports = { saveSubmission, getStudentRequests, getStudentApprovedCertificates };
