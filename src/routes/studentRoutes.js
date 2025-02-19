const express = require('express');
const fileUpload = require('express-fileupload');
const { submitRequest, getRequestStatus, getApprovedCertificates } = require('../controllers/studentController');

const router = express.Router();
router.use(fileUpload()); // Enable file upload middleware

// Student Dashboard (using studentId from session or query)
router.get('/dashboard', (req, res) => {
    // You can fetch student details from session if available
    const studentId = req.session.studentId || req.query.studentId;
    const studentName = req.session.studentName || 'Student';
    res.render('student/dashboard', { studentId, studentName });
  });

// Render student pages
router.get('/submit', (req, res) => res.render('student/submit'));
router.get('/request-status/:studentId', getRequestStatus);
router.get('/approved-certificates/:studentId', getApprovedCertificates);

// Handle form submission API
router.post('/submit-request', submitRequest);

module.exports = router;
