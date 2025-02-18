const express = require('express');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const verifierRoutes = require('./routes/verifierRoutes');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure express-session
app.use(session({
    secret: 'your_secret_key', // use a strong secret in production
    resave: false,
    saveUninitialized: true
  }));

// Enable flash messages
app.use(flash());

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve the main landing page
app.get('/', (req, res) => {
    res.render('index'); // Renders index.ejs
});

// Use the routes
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);
app.use('/verifier', verifierRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
