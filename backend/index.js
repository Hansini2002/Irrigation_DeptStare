import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
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

// JWT Secret Key
const JWT_SECRET = 'your_jwt_secret_key';

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password are required' 
    });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    if (results.length > 0) {
      const user = results[0];
      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return res.json({ 
        success: true, 
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.Name,
          email: user.email,
          username: user.username
        }
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  });
});

// Register Endpoint
app.post('/register', (req, res) => {
  const { Name, email, username, password } = req.body;

  // Basic validation
  if (!Name || !email || !username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  // Check if the username or email already exists
  const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(checkQuery, [username, email], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }

    if (results.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }

    // Insert new user into the database
    const insertQuery = 'INSERT INTO users (Name, email, username, password) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [Name, email, username, password], (err, result) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }
      
      // Create JWT token for the new user
      const token = jwt.sign(
        { userId: result.insertId, username: username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      res.json({ 
        success: true, 
        message: 'Registration successful',
        token,
        user: {
          id: result.insertId,
          name: Name,
          email: email,
          username: username
        }
      });
    });
  });
});

(async () => {
  const PORT = await detectPort(5000);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();