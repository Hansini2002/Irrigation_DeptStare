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
        { expiresIn: '24h' }
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
        { expiresIn: '24h' }
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

//endpoint to get low stock count
// This endpoint returns the count of items in the inventory where quantity is below the minimum level
app.get('/api/low-stock-count', authenticateToken, (req, res) => {
  // Query to count items where quantity is below minimum level
  const query = `
  SELECT SUM(count) as total_count FROM (
    SELECT COUNT(*) as count FROM tools WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM materials WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM blasting_materials WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM spare_parts WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM stationary WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM fuel_and_lubricants WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM vehicle_and_machines WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM office_equipments WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM used_tools WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM local_purchasing WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM counterfoil_register WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM publications WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM office_furniture WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM survey_and_drawinginstruments WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM salvage_items WHERE quantity < minimum_level
    UNION ALL
    SELECT COUNT(*) as count FROM welfare_articles WHERE quantity < minimum_level
  ) as combined_counts
`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    res.json({ 
      success: true, 
      count: results[0].count 
    });
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('Token received:', token); // Debug log
  
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401);
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.sendStatus(403);
    }
    console.log('Token verified for user:', user);
    req.user = user;
    next();
  });
}

// Get all tools
app.get('/api/tools', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM tools';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    res.json(results);
  });
});

// Add a new tool
app.post('/api/tools', authenticateToken, (req, res) => {
  const { name, quantity, minimum_level, lastrecieveddate } = req.body;
  
  if (!name || !quantity) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name and quantity are required' 
    });
  }

  const query = 'INSERT INTO tools (name, quantity, minimum_level, lastrecieveddate) VALUES (?, ?, ?, ?)';
  db.query(query, [name, quantity, minimum_level || 5, lastrecieveddate || new Date()], (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Tool added successfully',
      toolId: result.insertId 
    });
  });
});

// Update a tool
app.put('/api/tools/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, quantity, minimum_level, lastrecieveddate } = req.body;

  const query = 'UPDATE tools SET name = ?, quantity = ?, minimum_level = ?, lastrecieveddate = ? WHERE toolId = ?';
  db.query(query, [name, quantity, minimum_level, lastrecieveddate, id], (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tool not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Tool updated successfully' 
    });
  });
});

// Delete a tool
app.delete('/api/tools/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM tools WHERE toolId = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tool not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Tool deleted successfully' 
    });
  });
});

// Get all materials
app.get('/api/materials', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM materials';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    res.json(results);
  });
});

// Add a new material
app.post('/api/materials', authenticateToken, (req, res) => {
  const { name, quantity, minimum_level, lastrecieveddate } = req.body;
  
  if (!name || !quantity) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name and quantity are required' 
    });
  }

  const query = 'INSERT INTO materials (name, quantity, minimum_level, lastrecieveddate) VALUES (?, ?, ?, ?)';
  db.query(query, [name, quantity, minimum_level || 1, lastrecieveddate || new Date()], (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Material added successfully',
      materialID: result.insertId 
    });
  });
});

// Update a material
app.put('/api/materials/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, quantity, minimum_level, lastrecieveddate } = req.body;

  const query = 'UPDATE materials SET name = ?, quantity = ?, minimum_level = ?, lastrecieveddate = ? WHERE materialId = ?';
  db.query(query, [name, quantity, minimum_level, lastrecieveddate, id], (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Material not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Material updated successfully' 
    });
  });
});

// Delete a material
app.delete('/api/materials/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM materials WHERE materialId = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Material not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Material deleted successfully' 
    });
  });
});

(async () => {
  const PORT = await detectPort(5000);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();