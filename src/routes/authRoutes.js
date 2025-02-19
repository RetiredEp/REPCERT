// In src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get('/google/student', (req, res, next) => {
  req.session.authRole = 'student'; // store the role in session
  passport.authenticate('google', { scope: ['profile', 'email'], query: { role: 'student' } })(req, res, next);
});

router.get('/google/admin', (req, res, next) => {
  req.session.authRole = 'admin'; // store the role in session
  passport.authenticate('google', { scope: ['profile', 'email'], query: { role: 'admin' } })(req, res, next);
});

// Common callback route
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const email = req.user.emails[0].value;
    if (email.endsWith('@vitapstudent.ac.in')) {
      // For students, the studentId was extracted and attached to req.user in our strategy
      const localPart = email.split('@')[0];
      const parts = localPart.split('.');
      const studentId = parts[parts.length - 1]; // "21bce9241"
      req.session.studentId = studentId; // store in session for later use
      req.session.studentName = req.user.displayName; // optional, if you need the name
      res.redirect('/student/dashboard');

    } else if (email.endsWith('@vitap.ac.in')) {
      req.session.adminEmail = email;
      res.redirect(`/admin/pending-approvals`);
    } else {
      res.redirect('/');
    }
  }
);

module.exports = router;
