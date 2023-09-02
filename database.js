const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

const users = ['Janni', 'Ella', 'Calle'];
const logData = [
    { year: 2023, week: 35, day: 1, user: 1, office: true, lunch: false, swim: true, aw: true },
    { year: 2023, week: 35, day: 2, user: 2, office: false, lunch: true, swim: false, aw: true },
    { year: 2023, week: 2, day: 3, user: 1, office: true, lunch: true, swim: false, aw: false },
    { year: 2023, week: 2, day: 3, user: 1, office: true, lunch: true, swim: false, aw: false },
  ];

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT UNIQUE)');
    db.run(`
    CREATE TABLE IF NOT EXISTS log (
      id INTEGER PRIMARY KEY,
      year INTEGER NOT NULL,
      week INTEGER NOT NULL CHECK(week >= 1 AND week <= 53),
      day INTEGER NOT NULL CHECK(day >= 1 AND day <= 7),
      user INTEGER NOT NULL,
      office BOOLEAN DEFAULT 0,
      lunch BOOLEAN DEFAULT 0,
      swim BOOLEAN DEFAULT 0,
      aw BOOLEAN DEFAULT 0,
      UNIQUE(year, week, day, user),
      FOREIGN KEY (user) REFERENCES users(id)
    )
  `);
  
    const stmt = db.prepare('INSERT OR IGNORE INTO users (name) VALUES (?)');
    users.forEach(user => stmt.run(user))  
    stmt.finalize();

    const stmt2 = db.prepare(`
        INSERT OR IGNORE INTO log (year, week, day, user, office, lunch, swim, aw)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    logData.forEach(logEntry => {
        stmt2.run(
        logEntry.year,
        logEntry.week,
        logEntry.day,
        logEntry.user,
        logEntry.office,
        logEntry.lunch,
        logEntry.swim,
        logEntry.aw
        );
    });
    
    stmt2.finalize();
      
});

// Export the database connection object
module.exports = db;

