const express = require('express');
const router = express.Router();

// Render verifier page placeholder
router.get('/verify', (req, res) => {
    res.send("<h2>Verifier - Verify Certificates</h2><p>Verifier functionality coming soon!</p>");
});

module.exports = router;
