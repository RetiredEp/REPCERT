const express = require('express');
const router = express.Router();
const {verifyCertificate} = require('../controllers/verifierController');

router.get('/verify', verifyCertificate);

module.exports = router;

