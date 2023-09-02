const express = require('express');
const router = express.Router();

const db = require('../database.js');
const {convertRowToBoolean, convertBooleanToRow, convertSingleFromRowToBoolean} = require('../functions');

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

router.get('/:year/:week', (req, res) => {
  const { week, year } = req.params;

  db.all(
    'SELECT log.*, users.name AS user FROM log INNER JOIN users ON log.user = users.id WHERE log.year = ? AND log.week = ?',
    [year, week],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

    res.json(convertRowToBoolean(rows));
  });
});

router.post('/', (req, res) => {
  const newBody = convertBooleanToRow(req.body.value);
  const { year, week, day, user, office, lunch, swim, aw } = newBody;

  db.get(
    'SELECT id FROM users WHERE name = ?',
    [user],
    (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const userId = row.id;

      db.run(
        'INSERT INTO log (year, week, day, user, office, lunch, swim, aw) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [year, week, day, userId, office, lunch, swim, aw],
        (err) => {
          if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          db.get(
            'SELECT * FROM log WHERE id = LAST_INSERT_ROWID()',
            (err, insertedRow) => {
              if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
              }

              res.status(201).json({
                message: 'Log entry added successfully',
                data: convertSingleFromRowToBoolean(insertedRow),
              });
            }
          );
        }
      );
    }
  );
});


router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { office, lunch, swim, aw } = convertBooleanToRow(req.body.value);

  db.run(
    'UPDATE log SET office = ?, lunch = ?, swim = ?, aw = ? WHERE id = ?',
    [office, lunch, swim, aw, id],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (this.changes === 0) {
        res.status(404).json({ error: 'Log entry not found' });
      } else {
        res.json({ message: 'Log entry updated successfully' });
      }
    }
  );
});

module.exports = router;
