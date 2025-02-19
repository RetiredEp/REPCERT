require('dotenv').config({ path: __dirname + '/../../.env' });
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true // to access the request
  },
  (req, accessToken, refreshToken, profile, done) => {
    const role = req.query.role; // assuming this is set by the route
    const email = profile.emails[0].value;

    // Domain check
    if (role === 'student' && !email.endsWith('@vitapstudent.ac.in')) {
      return done(new Error('Not a valid student email.'));
    }
    // For admin, add an override for development:
    if (role === 'admin') {
      // If in development and the email is your override email, bypass domain check.
      if (process.env.NODE_ENV === 'development' && email === process.env.ADMIN_OVERRIDE_EMAIL) {
        // Allow login as admin even if the email isn't from @vitap.ac.in
      } else if (!email.endsWith('@vitap.ac.in')) {
        return done(new Error('Not a valid admin email.'));
      }
    }

    // If student, extract the studentId from the email
    if (role === 'student') {
      // Example: "studentGoodName.studentId@vitapstudent.ac.in"
      const emailParts = email.split('.');
      // Assuming the part after the first period and before '@' is the studentId:
      const studentId = emailParts[1] ? emailParts[1].split('@')[0] : null;
      // Attach studentId to the user profile for later use
      profile.studentId = studentId;
    }

    // Return the profile with additional data
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
