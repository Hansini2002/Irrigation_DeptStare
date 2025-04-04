import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import detectPort from 'detect-port';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'HnrAcrJcr2002@',
  database: 'store_management',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send({ success: true, message: 'Login successful' });
    } else {
      res.send({ success: false, message: 'Invalid credentials' });
    }
  });
});

//Register Endpoint
app.post('/register', (req, res) => {
  const { Name, email, username, password } = req.body;

  // Check if the username or email already exists
  const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(checkQuery, [Name, username, email], (err, results) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      return res.send({ success: false, message: 'Username or Email already exists' });
    }

    // Insert new user into the database
    const insertQuery = 'INSERT INTO users (Name, username, password, Email) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [Name, username, password, email], (err) => {
      if (err) {
        return res.status(500).send({ success: false, message: 'Database error' });
      }
      res.send({ success: true, message: 'Registration successful' });
    });
  });
});

(async () => {
  const PORT = await detectPort(5000); // Use 5000 or the next available port
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
