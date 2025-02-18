const { uploadToIPFS } = require('../config/ipfs');
const { saveSubmission, getStudentRequests, getStudentApprovedCertificates } = require('../models/submissionModel');

/**
 * 📥 Student Submits a Request
 */
async function submitRequest(req, res) {
  try {
    const { studentName, studentId, course } = req.body;
    const certificateFile = req.files?.certificate;

    if (!studentName || !studentId || !course || !certificateFile) {
      return res.status(400).json({ error: "Missing required fields or file" });
    }

    // Upload PDF to IPFS
    const certificateCID = await uploadToIPFS(certificateFile.data, certificateFile.name);

    // Save student submission in PostgreSQL
    const submission = await saveSubmission(studentName, studentId, course, certificateCID);

     // Set a success flash message
     req.flash('success', 'Submission successful! Your request has been submitted.');
     res.redirect('/student/dashboard');

  } catch (error) {
    console.error("Submission Error:", error.message);
    req.flash('error', 'Internal Server Error: Submission failed');
    res.redirect('/student/submit');
  }
}

/**
 * 📄 Get Request Status
 * Renders the `status.ejs` page with the student's requests.
 */
async function getRequestStatus(req, res) {
  try {
    const { studentId } = req.params;

    // Fetch student requests from the database model
    const requests = await getStudentRequests(studentId);

    // ✅ Render the EJS page, passing the requests data
    res.render('student/status', { requests });
  } catch (error) {
    console.error("Request Status Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * 🎓 View Approved Certificates
 * Renders the `approved.ejs` page with the student's approved certificates.
 */
async function getApprovedCertificates(req, res) {
  try {
    const { studentId } = req.params;

    // Fetch approved certificates from the database model
    const certificates = await getStudentApprovedCertificates(studentId);

    // ✅ Render the EJS page, passing the certificates data
    res.render('student/approved', { certificates });
  } catch (error) {
    console.error("Approved Certificates Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
}
module.exports = { submitRequest, getRequestStatus, getApprovedCertificates };
