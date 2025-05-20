import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import detectPort from 'detect-port';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

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

// Promisified query function
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

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
        SELECT 
            item_id, 
            name, 
            quantity, 
            IFNULL(DATE_FORMAT(last_received_date, '%Y-%m-%d'), NULL) as lastreceiveddate,
            unit_price 
        FROM items 
        WHERE category = ? 
        ORDER BY name
    `;
    
    db.query(query, [category_name], (err, results) => {
        if (err) {
            console.error('Database error:', err);
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

// Update item
app.put('/api/items/:item_id', authenticateToken, (req, res) => {
    const { item_id } = req.params;
    const { quantity, lastreceiveddate, unit_price } = req.body;

    if (!quantity && !unit_price) {
        return res.status(400).json({ 
            success: false, 
            message: 'At least one field (quantity or unit_price) is required for update' 
        });
    }

    // Build the update query dynamically based on provided fields
    let updateFields = [];
    let updateValues = [];

    if (quantity !== undefined) {
        updateFields.push('quantity = ?');
        updateValues.push(quantity);
    }

    if (lastreceiveddate !== undefined) {
        updateFields.push('last_received_date = ?');
        updateValues.push(lastreceiveddate === '' ? null : lastreceiveddate);
    }

    if (unit_price !== undefined) {
        updateFields.push('unit_price = ?');
        updateValues.push(unit_price);
    }

    updateValues.push(item_id);

    const query = `UPDATE items SET ${updateFields.join(', ')} WHERE item_id = ?`;

    db.query(query, updateValues, (err, result) => {
        if (err) {
            console.error('Error updating item:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to update item',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Item updated successfully' 
        });
    });
});

// Delete item
app.delete('/api/items/:item_id', authenticateToken, (req, res) => {
    const { item_id } = req.params;

    const query = 'DELETE FROM items WHERE item_id = ?';
    
    db.query(query, [item_id], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to delete item',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Item deleted successfully' 
        });
    });
});

// OFFICERS ENDPOINTS
// Get all officers
app.get('/api/officer-details', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM officers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching officers:', err);
      return res.status(500).json({ error: 'Failed to fetch officers' });
    }
    res.json(results);
  });
});

app.get('/api/officer-details/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM officers WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching officer:', err);
      return res.status(500).json({ error: 'Failed to fetch officer' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Officer not found' });
    }
    
    res.json(results[0]);
  });
});

app.post('/api/officer-details', authenticateToken, (req, res) => {
  const {
    id,
    officer_name,
    designation,
    gender,
    started_date,
    end_date,
    nic,
    contact_no,
    email,
    city
  } = req.body;

  console.log('Received data:', req.body); // Add this for debugging

  // Validate required fields
  if (!id || !officer_name || !designation || !gender || !started_date || !nic || !contact_no || !city) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate NIC format
  if (!/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(nic)) {
    return res.status(400).json({ 
      error: 'Invalid NIC format. Must be either 9 digits with V/X or 12 digits' 
    });
  }

  // Validate contact number
  if (!/^[0-9]{10}$/.test(contact_no)) {
    return res.status(400).json({ error: 'Contact number must be 10 digits' });
  }

  const query = `
    INSERT INTO officers 
    (id, officer_name, designation, gender, started_date, end_date, nic, contact_no, email, city)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id,
    officer_name,
    designation,
    gender,
    started_date,
    end_date || null,
    nic,
    contact_no,
    email || null,
    city
  ];

  console.log('Executing query:', query, 'with values:', values); // Add this for debugging

  db.query(query, values, (err) => {
    if (err) {
      console.error('Detailed SQL Error:', err); // More detailed error logging
      
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Officer ID already exists' });
      }
      
      return res.status(500).json({ 
        error: 'Failed to add officer',
        details: err.message, // Include the actual SQL error message
        sqlMessage: err.sqlMessage 
      });
    }
    
    res.status(201).json({ message: 'Officer added successfully', id });
  });
});

app.delete('/api/officer-details/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  // First check if officer exists
  const checkQuery = 'SELECT id, officer_name, designation, gender, started_date, end_date, nic, contact_no, email, city FROM officers WHERE id = ?';
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('Error checking officer:', err);
      return res.status(500).json({ error: 'Error checking officer' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Officer not found' });
    }
    
    // If officer exists, proceed with deletion
    const deleteQuery = 'DELETE FROM officers WHERE id = ?';
    db.query(deleteQuery, [id], (err) => {
      if (err) {
        console.error('Error deleting officer:', err);
        return res.status(500).json({ error: 'Failed to delete officer' });
      }
      
      res.json({ message: 'Officer deleted successfully' });
    });
  });
});

// Get officer details
app.get('/api/officer-details/:id', authenticateToken, (req, res) => {
  const officerId = req.params.id;
  const sql = 'SELECT id, officer_name, designation, gender, started_date, end_date, nic, contact_no, email, city FROM officers WHERE id = ?';
  
  db.query(sql, [officerId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching officer details' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Officer not found' });
    }
    
    // Return the officer data directly (not wrapped in success object)
    res.json(result[0]);
  });
});

// Update officer details
app.put('/api/officer-details/:id', authenticateToken, (req, res) => {
  const officerId = req.params.id;
  const { designation, end_date, contact_no } = req.body;
  
  const sql = 'UPDATE officers SET designation = ?, end_date = ?, contact_no = ? WHERE id = ?';
  
  db.query(sql, [designation, end_date, contact_no, officerId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error updating officer details' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    
    res.json({ message: 'Officer updated successfully' });
  });
});

// Get items issued to an officer
app.get('/api/officer-items/:officer_id', authenticateToken, (req, res) => {
  const officerId = req.params.officer_id;
  
  const sql = `
    SELECT i.*, oi.issue_id, oi.quantity, oi.issued_date 
    FROM issued_items oi
    JOIN items i ON oi.item_id = i.item_id
    WHERE oi.officer_id = ?
  `;
  
  db.query(sql, [officerId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching issued items' });
    }
    
    res.json(results);
  });
});

// Issue new item to officer
app.post('/api/officer-items', authenticateToken, (req, res) => {
  const { officer_id, item_id, quantity, issued_date } = req.body;
  
  // First check if item has sufficient quantity
  db.query('SELECT quantity FROM items WHERE item_id = ?', [item_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error checking item quantity' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    const availableQuantity = results[0].quantity;
    
    if (availableQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }
    
    // Start transaction
    db.beginTransaction(err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error starting transaction' });
      }
      
      // 1. Reduce item quantity in inventory
      db.query(
        'UPDATE items SET quantity = quantity - ? WHERE item_id = ?',
        [quantity, item_id],
        (err) => {
          if (err) {
            return db.rollback(() => {
              console.error(err);
              res.status(500).json({ message: 'Error updating item quantity' });
            });
          }
          
          // 2. Create issued item record
          db.query(
            'INSERT INTO issued_items (officer_id, item_id, quantity, issued_date) VALUES (?, ?, ?, ?)',
            [officer_id, item_id, quantity, issued_date],
            (err, result) => {
              if (err) {
                return db.rollback(() => {
                  console.error(err);
                  res.status(500).json({ message: 'Error issuing item' });
                });
              }
              
              // Commit transaction
              db.commit(err => {
                if (err) {
                  return db.rollback(() => {
                    console.error(err);
                    res.status(500).json({ message: 'Error committing transaction' });
                  });
                }
                
                res.json({ 
                  message: 'Item issued successfully',
                  issue_id: result.insertId 
                });
              });
            }
          );
        }
      );
    });
  });
});

// Update issued item
app.put('/api/officer-items/:issue_id', authenticateToken, (req, res) => {
  const issueId = req.params.issue_id;
  const { quantity, issued_date } = req.body;
  
  // First get the current issued item details
  db.query(
    'SELECT item_id, quantity FROM issued_items WHERE issue_id = ?',
    [issueId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching issued item' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Issued item not found' });
      }
      
      const currentQuantity = results[0].quantity;
      const itemId = results[0].item_id;
      const quantityDifference = currentQuantity - quantity;
      
      // Start transaction
      db.beginTransaction(err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error starting transaction' });
        }
        
        // 1. Update the item quantity in inventory
        if (quantityDifference !== 0) {
          db.query(
            'UPDATE items SET quantity = quantity + ? WHERE item_id = ?',
            [quantityDifference, itemId],
            (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error(err);
                  res.status(500).json({ message: 'Error updating item quantity' });
                });
              }
              
              // 2. Update the issued item record
              db.query(
                'UPDATE issued_items SET quantity = ?, issued_date = ? WHERE issue_id = ?',
                [quantity, issued_date, issueId],
                (err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error(err);
                      res.status(500).json({ message: 'Error updating issued item' });
                    });
                  }
                  
                  // Commit transaction
                  db.commit(err => {
                    if (err) {
                      return db.rollback(() => {
                        console.error(err);
                        res.status(500).json({ message: 'Error committing transaction' });
                      });
                    }
                    
                    res.json({ message: 'Issued item updated successfully' });
                  });
                }
              );
            }
          );
        } else {
          // Only update the issued date if quantity didn't change
          db.query(
            'UPDATE issued_items SET issued_date = ? WHERE issue_id = ?',
            [issued_date, issueId],
            (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error(err);
                  res.status(500).json({ message: 'Error updating issued item' });
                });
              }
              
              db.commit(err => {
                if (err) {
                  return db.rollback(() => {
                    console.error(err);
                    res.status(500).json({ message: 'Error committing transaction' });
                  });
                }
                
                res.json({ message: 'Issued item updated successfully' });
              });
            }
          );
        }
      });
    }
  );
});

// Delete issued item
app.delete('/api/officer-items/:issue_id', authenticateToken, (req, res) => {
  const issueId = req.params.issue_id;
  
  // First get the issued item details
  db.query(
    'SELECT item_id, quantity FROM issued_items WHERE issue_id = ?',
    [issueId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching issued item' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Issued item not found' });
      }
      
      const itemId = results[0].item_id;
      const quantity = results[0].quantity;
      
      // Start transaction
      db.beginTransaction(err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error starting transaction' });
        }
        
        // 1. Return the quantity to inventory
        db.query(
          'UPDATE items SET quantity = quantity + ? WHERE item_id = ?',
          [quantity, itemId],
          (err) => {
            if (err) {
              return db.rollback(() => {
                console.error(err);
                res.status(500).json({ message: 'Error updating item quantity' });
              });
            }
            
            // 2. Delete the issued item record
            db.query(
              'DELETE FROM issued_items WHERE issue_id = ?',
              [issueId],
              (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error(err);
                    res.status(500).json({ message: 'Error returning item' });
                  });
                }
                
                // Commit transaction
                db.commit(err => {
                  if (err) {
                    return db.rollback(() => {
                      console.error(err);
                      res.status(500).json({ message: 'Error committing transaction' });
                    });
                  }
                  
                  res.json({ message: 'Item returned successfully' });
                });
              }
            );
          }
        );
      });
    }
  );
});

// Get available items (with quantity > 0)
app.get('/api/available-items', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM items WHERE quantity > 0';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching available items' });
    }
    
    res.json(results);
  });
});

// FILLING STATIONS ENDPOINTS
// Get all filling stations
app.get('/api/filling-stations', authenticateToken, (req, res) => {
  const query = 'SELECT FS_ID as fs_id, Station_Name as station_name, Address as address FROM filling_stations ORDER BY station_name';
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
  console.log('Received request to create station:', req.body);
  const { fs_id, station_name, address } = req.body;
  
  if (!fs_id || !station_name || !address) {
    console.log('Validation failed - missing fields'); 
    return res.status(400).json({ 
      success: false, 
      message: 'Station ID, name and address are required' 
    });
  }

  // Check if station ID already exists
  const checkQuery = 'SELECT FS_ID as fs_id, Station_Name as station_name, Address as address FROM filling_stations WHERE FS_ID = ?';
  console.log('Executing check query:', checkQuery, 'with ID:', fs_id); 
  
  db.query(checkQuery, [fs_id], (err, results) => {
    if (err) {
      console.error('Error checking station:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error',
        error: err.message
      });
    }

    if (results.length > 0) {
      console.log('Station ID already exists'); 
      return res.status(409).json({ 
        success: false, 
        message: 'Station with this ID already exists' 
      });
    }

    // Insert new station
    const insertQuery = 'INSERT INTO filling_stations (FS_ID, Station_Name, Address) VALUES (?, ?, ?)';
    console.log('Executing insert query:', insertQuery, 'with values:', [fs_id, station_name.trim(), address.trim()]); 
    
    db.query(insertQuery, [fs_id, station_name.trim(), address.trim()], (err) => {
      if (err) {
        console.error('Detailed SQL error:', err); 
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
          fs_id,
          station_name: station_name.trim(),
          address: address.trim()
        }
      });
    });
  });
});

app.get('/api/filling-stations/total-remaining-balances', authenticateToken, (req, res) => {
  // First get all stations with their advance amounts
  const stationsQuery = 'SELECT FS_ID as fs_id, advance_amount FROM filling_stations';
  
  db.query(stationsQuery, (err, stationsResults) => {
    if (err) {
      console.error('Error fetching stations:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch stations',
        error: err.message
      });
    }

    if (stationsResults.length === 0) {
      return res.json({ 
        success: true,
        totalRemaining: 0
      });
    }

    let totalRemaining = 0;
    let processedStations = 0;

    // For each station, get its bills and calculate remaining balance
    stationsResults.forEach(station => {
      const billsQuery = 'SELECT SUM(amount) as totalBills FROM fuel_bills WHERE FS_ID = ?';
      
      db.query(billsQuery, [station.fs_id], (err, billsResults) => {
        if (err) {
          console.error(`Error fetching bills for station ${station.fs_id}:`, err);
          // Continue with next station even if there's an error
        } else {
          const stationBills = billsResults[0].totalBills || 0;
          const stationRemaining = (station.advance_amount || 0) - stationBills;
          totalRemaining += stationRemaining;
        }

        processedStations++;
        
        // When all stations have been processed, send the response
        if (processedStations === stationsResults.length) {
          res.json({ 
            success: true,
            totalRemaining: totalRemaining
          });
        }
      });
    });
  });
});

// Get total advances across all filling stations
app.get('/api/filling-stations/total-advances', authenticateToken, (req, res) => {
  const query = 'SELECT COALESCE(SUM(advance_amount), 0) as totalAdvances FROM filling_stations';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching total advances:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch total advances',
        error: err.message
      });
    }
    
    res.json({ 
      success: true,
      totalAdvances: results[0].totalAdvances
    });
  });
});


// Get single filling station
app.get('/api/filling-stations/:fs_id', authenticateToken, (req, res) => {
  const { fs_id } = req.params;
  const query = 'SELECT FS_ID as fs_id, Station_Name as station_name, Address as address FROM filling_stations WHERE FS_ID = ?';
  
  db.query(query, [fs_id], (err, results) => {
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
app.delete('/api/filling-stations/:fs_id', authenticateToken, (req, res) => {
  const { fs_id } = req.params;
  console.log(`Attempting to delete station with ID: ${fs_id}`); 

  // First check if station exists
  const checkQuery = 'SELECT FS_ID as fs_id, Station_Name as station_name, Address as address FROM filling_stations WHERE FS_ID = ?';
  console.log(`Executing check query: ${checkQuery} with ID: ${fs_id}`); 
  
  db.query(checkQuery, [fs_id], (err, results) => {
    if (err) {
      console.error('Error checking station:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error',
        error: err.message
      });
    }

    console.log(`Check query results:`, results);
    
    if (results.length === 0) {
      console.log(`Station ${fs_id} not found in database`);
      return res.status(404).json({ 
        success: false, 
        message: 'Station not found' 
      });
    }

    // Delete station (bills will be deleted automatically due to CASCADE)
    const deleteQuery = 'DELETE FROM filling_stations WHERE FS_ID = ?';
    console.log(`Executing delete query: ${deleteQuery} with ID: ${fs_id}`);
    
    db.query(deleteQuery, [fs_id], (err, result) => {
      if (err) {
        console.error('Error deleting station:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to delete station',
          error: err.message
        });
      }
      
      console.log(`Delete result:`, result);
      
      if (result.affectedRows === 0) {
        console.log(`No rows affected - station ${fs_id} not deleted`);
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

// ADVANCE PAYMENT ENDPOINTS
// Get current advance amount for a station
app.get('/api/filling-stations/:fs_id/advance', authenticateToken, (req, res) => {
  const { fs_id } = req.params;
  const query = 'SELECT advance_amount FROM filling_stations WHERE FS_ID = ?';
  
  db.query(query, [fs_id], (err, results) => {
    if (err) {
      console.error('Error fetching advance amount:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch advance amount',
        error: err.message
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Station not found' 
      });
    }
    
    res.json({ 
      success: true,
      amount: results[0].advance_amount || 0
    });
  });
});

// Add to advance amount
app.post('/api/filling-stations/:fs_id/advance', authenticateToken, (req, res) => {
  const { fs_id } = req.params;
  const { amount } = req.body;
  
  // Validate input
  if (amount === undefined || amount === null || isNaN(amount)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Amount is required and must be a number' 
    });
  }
  
  const numericAmount = Number(amount);
  if (numericAmount <= 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Amount must be positive' 
    });
  }
  
  // First check if station exists
  const checkStationQuery = 'SELECT * FROM filling_stations WHERE FS_ID = ?';
  db.query(checkStationQuery, [fs_id], (err, results) => {
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
    
    // Update advance amount
    const updateQuery = `
      UPDATE filling_stations 
      SET advance_amount = IFNULL(advance_amount, 0) + ?
      WHERE FS_ID = ?
    `;
    
    db.query(
      updateQuery, 
      [numericAmount, fs_id], 
      (err) => {
        if (err) {
          console.error('Error updating advance amount:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to update advance amount',
            error: err.message
          });
        }
        
        // Get updated advance amount and calculate new remaining balance
        db.query(
          'SELECT advance_amount FROM filling_stations WHERE FS_ID = ?', 
          [fs_id], 
          (err, advanceResults) => {
            if (err) {
              console.error('Error fetching updated advance:', err);
              return res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch updated advance',
                error: err.message
              });
            }
            
            const newAdvance = Number(advanceResults[0].advance_amount) || 0;
            
            // Get current bills total
            db.query(
              'SELECT SUM(amount) as total FROM fuel_bills WHERE FS_ID = ?',
              [fs_id],
              (err, billsResults) => {
                if (err) {
                  console.error('Error fetching bills total:', err);
                  return res.status(500).json({ 
                    success: false, 
                    message: 'Failed to calculate remaining balance',
                    error: err.message
                  });
                }
                
                const billsTotal = Number(billsResults[0].total) || 0;
                const remainingBalance = newAdvance - billsTotal;
                
                res.json({ 
                  success: true, 
                  message: 'Advance amount updated successfully',
                  amount: newAdvance,
                  remainingBalance
                });
              }
            );
          }
        );
      }
    );
  });
});

// FUEL BILLS ENDPOINTS
// Get all bills for a station with remaining balance
app.get('/api/filling-stations/:fs_id/bills', authenticateToken, (req, res) => {
  const { fs_id } = req.params;
  
  // First get the advance amount
  const advanceQuery = 'SELECT advance_amount FROM filling_stations WHERE FS_ID = ?';
  
  db.query(advanceQuery, [fs_id], (err, advanceResults) => {
    if (err) {
      console.error('Error fetching advance amount:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch advance amount',
        error: err.message
      });
    }
    
    if (advanceResults.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Station not found' 
      });
    }
    
    const advanceAmount = Number(advanceResults[0].advance_amount) || 0;
    
    // Then get all bills
    const billsQuery = 'SELECT * FROM fuel_bills WHERE FS_ID = ? ORDER BY date DESC';
    
    db.query(billsQuery, [fs_id], (err, billsResults) => {
      if (err) {
        console.error('Error fetching fuel bills:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch fuel bills',
          error: err.message
        });
      }
      
      // Convert numeric fields to proper numbers
      const processedBills = billsResults.map(bill => ({
        ...bill,
        quantity: Number(bill.quantity),
        rate: Number(bill.rate),
        amount: Number(bill.amount)
      }));
      
      // Calculate total bills and remaining balance
      const totalBills = processedBills.reduce((sum, bill) => sum + bill.amount, 0);
      const remainingBalance = advanceAmount - totalBills;
      
      res.json({
        bills: processedBills,
        advanceAmount,
        totalBills,
        remainingBalance
      });
    });
  });
});

// Create new fuel bill with balance check
app.post('/api/filling-stations/:fs_id/bills', authenticateToken, (req, res) => {
  const { fs_id } = req.params;
  const { date, officer, fuelType, quantity, rate } = req.body;
  
  // Validate input
  if (!date || !officer || !fuelType || !quantity || !rate) {
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
  
  // First check if station exists and get current advance
  const checkStationQuery = 'SELECT advance_amount FROM filling_stations WHERE FS_ID = ?';
  db.query(checkStationQuery, [fs_id], (err, results) => {
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
    
    const advanceAmount = results[0].advance_amount || 0;
    
    // Get total existing bills to calculate remaining balance
    const getBillsQuery = 'SELECT SUM(amount) as total FROM fuel_bills WHERE FS_ID = ?';
    db.query(getBillsQuery, [fs_id], (err, billResults) => {
      if (err) {
        console.error('Error fetching existing bills:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Database error',
          error: err.message
        });
      }
      
      const existingTotal = billResults[0].total || 0;
      const newRemaining = advanceAmount - (existingTotal + amount);
    
    // Insert new bill
    const insertQuery = `
      INSERT INTO fuel_bills 
      (FS_ID, date, officer, fuelType, quantity, rate, amount) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      insertQuery, 
      [fs_id, date, officer, fuelType, quantity, rate, amount], 
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
              fs_id: fs_id,
              date,
              officer,
              fuelType,
              quantity,
              rate,
              amount
            },
            remainingBalance: newRemaining
          });
        }
      );
    });
  });
});

// Low stock items count endpoint - returns only the count of items where quantity < minimum_level
app.get('/api/items/low-stock-count', authenticateToken, (req, res) => {
  const query = `
    SELECT COUNT(*) as low_stock_count
    FROM items
    WHERE quantity < minimum_level
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching low stock count:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch low stock count',
        error: err.message
      });
    }
    
    res.json({ 
      success: true,
      count: Number(results[0].low_stock_count) || 0
    });
  });
});

// Get all suppliers
app.get('/api/suppliers', authenticateToken, async (req, res) => {
  try {
    const results = await query('SELECT * FROM suppliers');
    res.json(results);
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Get single supplier by ID
app.get('/api/suppliers/:sup_id', authenticateToken, async (req, res) => {
  try {
    const { sup_id } = req.params;
    const results = await query('SELECT * FROM suppliers WHERE sup_id = ?', [sup_id]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching supplier:', err);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// Add new supplier
app.post('/api/suppliers', authenticateToken, async (req, res) => {
  try {
    const { sup_id, supplier_name, contact_no, city } = req.body;
    
    // Validate required fields
    if (!sup_id || !supplier_name || !contact_no || !city) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if supplier ID already exists
    const existingSupplier = await query('SELECT * FROM suppliers WHERE sup_id = ?', [sup_id]);
    if (existingSupplier.length > 0) {
      return res.status(400).json({ error: 'Supplier ID already exists' });
    }
    
    await query(
      'INSERT INTO suppliers (sup_id, supplier_name, contact_no, city) VALUES (?, ?, ?, ?)',
      [sup_id, supplier_name, contact_no, city]
    );
    
    res.json({ message: 'Supplier added successfully' });
  } catch (err) {
    console.error('Error adding supplier:', err);
    res.status(500).json({ 
      error: 'Failed to add supplier',
      details: err.message,
      sqlMessage: err.sqlMessage 
    });
  }
});

  // Update supplier
app.put('/api/suppliers/:sup_id', authenticateToken, async (req, res) => {
  try {
    const { sup_id } = req.params;
    const { contact_no } = req.body;
    
    if (!contact_no) {
      return res.status(400).json({ error: 'Contact number is required' });
    }
    
    await query(
      'UPDATE suppliers SET contact_no = ? WHERE sup_id = ?',
      [contact_no, sup_id]
    );
    
    res.json({ message: 'Supplier updated successfully' });
  } catch (err) {
    console.error('Error updating supplier:', err);
    res.status(500).json({ 
      error: 'Failed to update supplier',
      details: err.message 
    });
  }
});

// Delete supplier
app.delete('/api/suppliers/:sup_id', authenticateToken, async (req, res) => {
  try {
    const { sup_id } = req.params;
    
    // Check if supplier exists
    const existingSupplier = await query('SELECT * FROM suppliers WHERE sup_id = ?', [sup_id]);
    if (existingSupplier.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    await query('DELETE FROM suppliers WHERE sup_id = ?', [sup_id]);
    
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    console.error('Error deleting supplier:', err);
    res.status(500).json({ 
      error: 'Failed to delete supplier',
      details: err.message 
    });
  }
});

// REPORTS ENDPOINTS
// Get all report categories
app.get('/api/report-categories', authenticateToken, async (req, res) => {
  try {
    const results = await query('SELECT * FROM report_categories ORDER BY name');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Add new report category
app.post('/api/report-categories', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const result = await query(
      'INSERT INTO report_categories (name) VALUES (?)',
      [name]
    );
    const newCategory = await query(
      'SELECT * FROM report_categories WHERE id = ?',
      [result.insertId]
    );
    res.json(newCategory[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add report category' });
  }
});

// Delete report category
app.delete('/api/report-categories/:id', authenticateToken, async (req, res) => {
  try {
    await query('DELETE FROM report_categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete report category' });
  }
});

// REPORT DEFINITIONS ENDPOINTS
// Get report definition (fields)
app.get('/api/report-definitions', authenticateToken, async (req, res) => {
  try {
    const categoryId = req.query.category_id;
    
    const category = await query(
      'SELECT * FROM report_categories WHERE id = ?',
      [categoryId]
    );
    
    if (category.length === 0) {
      return res.status(404).json({ error: 'Report category not found' });
    }
    
    const fields = await query(
      'SELECT * FROM report_definitions WHERE report_category_id = ? ORDER BY id',
      [categoryId]
    );
    
    res.json({
      category: category[0],
      fields: fields
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load report definition' });
  }
});

// REPORTS ENDPOINTS
// Get all report categories
app.get('/api/report-categories', authenticateToken, async (req, res) => {
  try {
    const results = await query('SELECT * FROM report_categories ORDER BY name');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Add new report category
app.post('/api/report-categories', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Report category name is required' });
    }
    const result = await query(
      'INSERT INTO report_categories (name) VALUES (?)',
      [name]
    );
    const newCategory = await query(
      'SELECT * FROM report_categories WHERE id = ?',
      [result.insertId]
    );
    res.json(newCategory[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add report category' });
  }
});

// Delete report category
app.delete('/api/report-categories/:id', authenticateToken, async (req, res) => {
  try {
    await query('DELETE FROM report_categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete report category' });
  }
});

// REPORT DEFINITIONS ENDPOINTS
// Get report definitions (fields) for a category
app.get('/api/report-definitions', authenticateToken, async (req, res) => {
  try {
    const { category_id } = req.query;
    if (!category_id) {
      return res.status(400).json({ error: 'category_id is required' });
    }
    // Get category info
    const [category] = await query(
      'SELECT id, name FROM report_categories WHERE id = ?',
      [category_id]
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    // Get fields
    const fields = await query(
      'SELECT field_name, field_type, required, data_source FROM report_definitions WHERE report_category_id = ?',
      [category_id]
    );
    res.json({ category, fields });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch report definitions' });
  }
});

app.post('/api/report-definitions', authenticateToken, async (req, res) => {
  try {
    const { report_category_id, fields } = req.body;
    
    // First delete existing definitions for this category
    await query(
      'DELETE FROM report_definitions WHERE report_category_id = ?',
      [report_category_id]
    );
    
    // Insert new definitions
    for (const field of fields) {
      await query(
        'INSERT INTO report_definitions (report_category_id, field_name, field_type, required, data_source) VALUES (?, ?, ?, ?, ?)',
        [
          report_category_id,
          field.field_name,
          field.field_type,
          field.required || false,
          field.data_source || null
        ]
      );
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save report definition' });
  }
});

// Get available field types
app.get('/api/field-types', authenticateToken, async (req, res) => {
  res.json([
    'text',
    'textarea',
    'number',
    'date',
    'select',
    'checkbox',
    'radio'
  ]);
});

// Get available data sources
app.get('/api/data-sources', authenticateToken, async (req, res) => {
  try {
    // Get all tables that can be used as data sources
    const tables = await query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = DATABASE() 
       AND table_name NOT LIKE 'auth_%' 
       AND table_name NOT LIKE 'report_%'`
    );
    res.json(tables.map(t => t.table_name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data sources' });
}
});


// Start server
(async () => {
  const PORT = await detectPort(5000);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
)();