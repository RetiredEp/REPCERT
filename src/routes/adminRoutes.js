const express = require('express');
const router = express.Router();
const { getPendingApprovalsPage, approveSubmission, rejectSubmission, getRejectedCertificatesPage, getApprovedCertificatesPage } = require('../controllers/adminController');

// Render admin dashboard placeholder
router.get('/dashboard', (req, res) => {
    const email = req.session.adminEmail;
    res.render('admin/dashboard', { email });
});

// Render pending approvals placeholder
router.get('/pending-approvals', getPendingApprovalsPage);

// approve certificate API
router.post('/approve-request/:id', approveSubmission);

// reject certificate API
router.post('/reject-request/:id', rejectSubmission);

// Render approved certificates placeholder
router.get('/approved-certificates', getApprovedCertificatesPage);

// Render rejected certificates placeholder
router.get('/rejected-certificates', getRejectedCertificatesPage);

module.exports = router;
