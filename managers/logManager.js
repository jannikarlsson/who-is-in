const db = require('../database.js');
const { handleServerError } = require('./errorHandler.js')

const {convertRowToBoolean, convertBooleanToRow, convertSingleFromRowToBoolean} = require('../functions');

function getAllLogs(req, res) {
    return db.all('SELECT * FROM log', (err, rows) => {
        if (err) {
            return handleServerError(res, err);
        }
        
        res.json({ log: convertRowToBoolean(rows) });
      });
}

function getLogForWeek(req, res) {
    const { week, year } = req.params;

    return db.all(
        'SELECT log.*, users.name AS user FROM log INNER JOIN users ON log.user = users.id WHERE log.year = ? AND log.week = ?',
        [year, week],
        (err, rows) => {
        if (err) {
            return handleServerError(res, err);
        }

        res.json(convertRowToBoolean(rows));
    });
}

function createLog(req, res) {
    const newBody = convertBooleanToRow(req.body.value);
    const { year, week, day, user, office, lunch, swim, aw } = newBody;

    return db.get(
        'SELECT id FROM users WHERE name = ?',
        [user],
        (err, row) => {
        if (err) {
            return handleServerError(res, err);
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
            return handleServerError(res, err);
          }

          db.get(
            'SELECT * FROM log WHERE id = LAST_INSERT_ROWID()',
            (err, insertedRow) => {
              if (err) {
                return handleServerError(res, err);
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
}

function updateRow(req, res) {
    const { id } = req.params;
    const { office, lunch, swim, aw } = convertBooleanToRow(req.body.value);
  
    return db.run(
      'UPDATE log SET office = ?, lunch = ?, swim = ?, aw = ? WHERE id = ?',
      [office, lunch, swim, aw, id],
      function (err) {
        if (err) {
            return handleServerError(res, err);
        }
  
        if (this.changes === 0) {
          res.status(404).json({ error: 'Log entry not found' });
        } else {
          res.json({ message: 'Log entry updated successfully' });
        }
      }
    );
}

module.exports = { getAllLogs, getLogForWeek, createLog, updateRow };