const express = require('express');
const fileUpload = require('express-fileupload');
const { submitRequest, getRequestStatus, getApprovedCertificates } = require('../controllers/studentController');

const router = express.Router();
router.use(fileUpload()); // Enable file upload middleware

// Student Dashboard Route
router.get('/dashboard', (req, res) => {
    res.render('student/dashboard');
});

// Render student pages
router.get('/submit', (req, res) => res.render('student/submit'));
router.get('/request-status/:studentId', getRequestStatus);
router.get('/approved-certificates/:studentId', getApprovedCertificates);

// Handle form submission API
router.post('/submit-request', submitRequest);

module.exports = router;
