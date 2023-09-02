const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const db = require('../database.js');

router.get('/', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    
    res.json({ users: rows });
  });
});

// Define your database connection here (assuming 'db' is your SQLite database)

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Retrieve the user from the database by username
  db.get('SELECT * FROM users WHERE name = ?', [username], (err, user) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Compare the provided password with the hashed password in the database using the stored salt
    bcrypt.compare(password, user.hashed_password, (err, isMatch) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (isMatch) {
        // Passwords match, login successful
        res.json({ username: user.name });
      } else {
        // Passwords don't match, login failed
        res.status(401).json({ error: 'Invalid username or password.' });
      }
    });
  });
});

module.exports = router;


// Export the router to use in your main Express app
module.exports = router;
