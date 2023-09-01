const express = require('express');
const router = express.Router();

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

// Export the router to use in your main Express app
module.exports = router;
