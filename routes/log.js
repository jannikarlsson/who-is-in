const express = require('express');
const router = express.Router();

const db = require('../database.js');
const convertRowToBoolean = require('../functions');

router.get('/', (req, res) => {
  db.all('SELECT * FROM log', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    
    res.json({ log: convertRowToBoolean(rows) });
  });
});

router.get('/:week', (req, res) => {
  const week = req.params.week;

  db.all('SELECT * FROM log WHERE week = ?', [week], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ log: convertRowToBoolean(rows) });
  });
});

router.post('/', (req, res) => {
  const { week, day, user, office, lunch, swim, aw } = req.body;

  db.run(
    'INSERT INTO log (week, day, user, office, lunch, swim, aw) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [week, day, user, office, lunch, swim, aw],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Respond with a success message
      res.json({ message: 'Log entry added successfully' });
    }
  );
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { office, lunch, swim, aw } = req.body;

  db.run(
    'UPDATE log SET office = ?, lunch = ?, swim = ?, aw = ? WHERE id = ?',
    [office, lunch, swim, aw, id],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Check if any rows were affected by the update
      if (this.changes === 0) {
        res.status(404).json({ error: 'Log entry not found' });
      } else {
        res.json({ message: 'Log entry updated successfully' });
      }
    }
  );
});

// Export the router to use in your main Express app
module.exports = router;
