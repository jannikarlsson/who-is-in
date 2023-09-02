const bcrypt = require('bcrypt');

const db = require('../database.js');

const { handleServerError } = require('./errorHandler.js')

function getAllUsers(req, res) {
    return db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          return handleServerError(res, err);
        }
        
        res.json({ users: rows });
      });
}

function loginUser(req, res) {
    const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  return db.get('SELECT * FROM users WHERE name = ?', [username], (err, user) => {
    if (err) {
      return handleServerError(res, err);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    bcrypt.compare(password, user.hashed_password, (err, isMatch) => {
      if (err) {
        return handleServerError(res, err);
      }

      if (isMatch) {
        res.json({ username: user.name });
      } else {
        res.status(401).json({ error: 'Invalid username or password.' });
      }
    });
  });
}

module.exports = { getAllUsers, loginUser };
