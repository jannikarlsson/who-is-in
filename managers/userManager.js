const bcrypt = require('bcrypt');

const { db, createUser } = require('../database.js');

const { handleServerError } = require('./errorHandler.js')

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

function createNewUser(req, res) {
  return createUser(db, req.body);
}

module.exports = { loginUser, createNewUser };
