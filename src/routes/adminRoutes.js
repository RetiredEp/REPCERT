const express = require('express');
const router = express.Router();
const { getPendingApprovalsPage, approveSubmission, rejectSubmission } = require('../controllers/adminController');

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
router.get('/approved-certificates', (req, res) => {
    res.render('admin/approved-certificates');
});

// Render rejected certificates placeholder
router.get('/rejected-certificates', (req, res) => {
    res.render('admin/rejected-certificates');
});

module.exports = router;
