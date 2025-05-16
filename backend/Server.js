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
  database: 'smdb',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// JWT Secret Key
const JWT_SECRET = 'your_jwt_secret_key';

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
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

  if (!Name || !email || !username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

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

    const insertQuery = 'INSERT INTO users (Name, email, username, password) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [Name, email, username, password], (err, result) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }
      
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

// CATEGORIES ENDPOINTS
// Get all categories
app.get('/api/categories', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM categories ORDER BY category_name';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    res.json(results); // Return array directly for compatibility with frontend
  });
});

// Get single category by ID
app.get('/api/categories/:category_id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM categories WHERE category_id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.json({ 
      success: true, 
      category: results[0] 
    });
  });
});

// Create new category
app.post('/api/categories', authenticateToken, (req, res) => {
  const { category_name } = req.body;
  
  if (!category_name) {
    return res.status(400).json({ 
      success: false, 
      message: 'Category name is required' 
    });
  }

  // Check if category already exists
  const checkQuery = 'SELECT * FROM categories WHERE category_name = ?';
  db.query(checkQuery, [category_name], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }

    if (results.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Category already exists' 
      });
    }

    // Insert new category
    const insertQuery = 'INSERT INTO categories (category_name) VALUES (?)';
    db.query(insertQuery, [category_name], (err, result) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Category created successfully',
        category: {
          category_id: result.insertId,
          category_name
        }
      });
    });
  });
});

// Update category
app.put('/api/categories/:category_id', authenticateToken, (req, res) => {
  const { category_id } = req.params;
  const { category_name } = req.body;
  
  if (!category_name) {
    return res.status(400).json({ 
      success: false, 
      message: 'Category name is required' 
    });
  }

  // Check if category exists
  const checkQuery = 'SELECT * FROM categories WHERE category_id = ?';
  db.query(checkQuery, [category_id], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    // Check if new name already exists
    const nameCheckQuery = 'SELECT * FROM categories WHERE category_id = ? AND category_name != ?';
    db.query(nameCheckQuery, [category_id, category_name], (err, nameResults) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }

      if (nameResults.length > 0) {
        return res.status(409).json({ 
          success: false, 
          message: 'Category name already exists' 
        });
      }

      // Update category
      const updateQuery = 'UPDATE categories SET category_name = ? WHERE category_id = ?';
      db.query(updateQuery, [category_name, category_id], (err) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Database error' 
          });
        }
        
        res.json({ 
          success: true, 
          message: 'Category updated successfully',
          category: {
            category_id: category_id,
            category_name
          }
        });
      });
    });
  });
});

// Delete category
app.delete('/api/categories/:category_name', authenticateToken, (req, res) => {
  const { category_name } = req.params;

  // First check if category exists
  const checkQuery = 'SELECT * FROM categories WHERE category_name = ?';
  db.query(checkQuery, [category_name], (err, results) => {
    if (err) {
      console.error('Error checking category:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error',
        error: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    // Check if category is being used by any items
    const itemsCheckQuery = 'SELECT * FROM items WHERE category = ? LIMIT 1';
    db.query(itemsCheckQuery, [category_name], (err, itemsResults) => {
      if (err) {
        console.error('Error checking items:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Database error',
          error: err.message
        });
      }

      if (itemsResults.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot delete category - it is being used by items' 
        });
      }

      // Delete category
      const deleteQuery = 'DELETE FROM categories WHERE category_name = ?';
      db.query(deleteQuery, [category_name], (err, result) => {
        if (err) {
          console.error('Error deleting category:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Database error',
            error: err.message
          });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: 'Category not found or already deleted'
          });
        }
        
        res.json({ 
          success: true, 
          message: 'Category deleted successfully' 
        });
      });
    });
  });
});

// Get items by category
app.get('/api/items/category/:category_name', authenticateToken, (req, res) => {
    const { category_name } = req.params;
    const query = `
        SELECT item_id, name, quantity, minimum_level, last_received_date 
        FROM items 
        WHERE category = ? 
        ORDER BY name
    `;
    
    db.query(query, [category_name], (err, results) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        res.json(results); // Return array of items
    });
});

// ITEMS ENDPOINTS (existing ones remain unchanged)
app.get('/api/items', authenticateToken, (req, res) => {
  const query = 'SELECT item_id, name, category, quantity, minimum_level, last_received_date as lastreceiveddate, unit_price FROM items';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    res.json({ 
      success: true, 
      items: results 
    });
  });
});

app.post('/api/items', authenticateToken, (req, res) => {
  const { item_id, name, category, quantity, minimum_level, lastreceiveddate, unit_price } = req.body;

  if (!item_id || !name || !category || !quantity || !unit_price) {
    return res.status(400).json({ 
      success: false, 
      message: 'Item ID, Name, Category, Quantity and Unit Price are required fields' 
    });
  }

  // Convert empty date string to null
  const receivedDate = lastreceiveddate === '' ? null : lastreceiveddate;

  const checkQuery = 'SELECT * FROM items WHERE item_id = ?';
  db.query(checkQuery, [item_id], (err, results) => {
    if (err) {
      console.error('Database error:', err); // Log the actual error
      return res.status(500).json({ 
        success: false, 
        message: 'Database error',
        error: err.message // Include the actual error message
      });
    }

    if (results.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Item ID already exists' 
      });
    }

    const insertQuery = `
      INSERT INTO items 
      (item_id, name, category, quantity, minimum_level, last_received_date, unit_price) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      insertQuery, 
      [
        item_id, 
        name, 
        category, 
        quantity, 
        minimum_level || 1, 
        receivedDate,
        unit_price
      ], 
      (err) => {
        if (err) {
          console.error('Insert error:', err); // Log the actual error
          return res.status(500).json({ 
            success: false, 
            message: 'Database error',
            error: err.message // Include the actual error message
          });
        }
        
        res.json({ 
          success: true, 
          message: 'Item added successfully',
          item: {
            item_id,
            name,
            category,
            quantity,
            minimum_level: minimum_level || 1,
            lastreceiveddate: receivedDate,
            unit_price
          }
        });
      }
    );
  });
});

// FILLING STATIONS ENDPOINTS
// Get all filling stations
app.get('/api/filling-stations', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM filling_stations ORDER BY station_name';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching filling stations:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch filling stations',
        error: err.message
      });
    }
    res.json(results);
  });
});

// Create new filling station
app.post('/api/filling-stations', authenticateToken, (req, res) => {
  const { station_name } = req.body;
  
  if (!station_name || !station_name.trim()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Station name is required' 
    });
  }

  // Check if station already exists
  const checkQuery = 'SELECT * FROM filling_stations WHERE station_name = ?';
  db.query(checkQuery, [station_name.trim()], (err, results) => {
    if (err) {
      console.error('Error checking station:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error',
        error: err.message
      });
    }

    if (results.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Station with this name already exists' 
      });
    }

    // Insert new station
    const insertQuery = 'INSERT INTO filling_stations (station_name) VALUES (?)';
    db.query(insertQuery, [station_name.trim()], (err, result) => {
      if (err) {
        console.error('Error creating station:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to create station',
          error: err.message
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Station created successfully',
        station: {
          fs_id: result.insertId,
          station_name: station_name.trim()
        }
      });
    });
  });
});

// Get single filling station
app.get('/api/filling-stations/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM filling_stations WHERE fs_id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching station:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch station',
        error: err.message
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Station not found' 
      });
    }
    
    res.json(results[0]);
  });
});

// Delete filling station
app.delete('/api/filling-stations/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // First check if station exists
  const checkQuery = 'SELECT * FROM filling_stations WHERE fs_id = ?';
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('Error checking station:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error',
        error: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Station not found' 
      });
    }

    // Delete station (bills will be deleted automatically due to CASCADE)
    const deleteQuery = 'DELETE FROM filling_stations WHERE fs_id = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Error deleting station:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to delete station',
          error: err.message
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Station not found or already deleted'
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Station deleted successfully' 
      });
    });
  });
});

// FUEL BILLS ENDPOINTS
// Get all bills for a station
app.get('/api/filling-stations/:id/bills', authenticateToken, (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM fuel_bills WHERE fs_id = ? ORDER BY date DESC';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching fuel bills:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch fuel bills',
        error: err.message
      });
    }
    
    res.json(results);
  });
});

// Create new fuel bill
app.post('/api/filling-stations/:id/bills', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { date, customer, fuelType, quantity, rate } = req.body;
  
  // Validate input
  if (!date || !customer || !fuelType || !quantity || !rate) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }
  
  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Quantity must be a positive number' 
    });
  }
  
  if (isNaN(rate) || rate <= 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Rate must be a positive number' 
    });
  }
  
  const amount = quantity * rate;
  
  // First check if station exists
  const checkStationQuery = 'SELECT * FROM filling_stations WHERE fs_id = ?';
  db.query(checkStationQuery, [id], (err, results) => {
    if (err) {
      console.error('Error checking station:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error',
        error: err.message
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Station not found' 
      });
    }
    
    // Insert new bill
    const insertQuery = `
      INSERT INTO fuel_bills 
      (fs_id, date, customer, fuelType, quantity, rate, amount) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      insertQuery, 
      [id, date, customer, fuelType, quantity, rate, amount], 
      (err, result) => {
        if (err) {
          console.error('Error creating fuel bill:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to create fuel bill',
            error: err.message
          });
        }
        
        res.json({ 
          success: true, 
          message: 'Fuel bill created successfully',
          bill: {
            bill_id: result.insertId,
            fs_id: id,
            date,
            customer,
            fuelType,
            quantity,
            rate,
            amount
          }
        });
      }
    );
  });
});

// Start server
(async () => {
  const PORT = await detectPort(5000);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();