const express = require('express');
const router = express.Router();

// Render admin dashboard placeholder
router.get('/pending-approvals', (req, res) => {
    res.send("<h2>University Admin - Pending Approvals</h2><p>Admin functionality coming soon!</p>");
});

module.exports = router;
