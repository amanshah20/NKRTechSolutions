const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'nkr_tech.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
const createTables = () => {
  // Admin table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Demo Requests table
  db.run(`
    CREATE TABLE IF NOT EXISTS demo_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT NOT NULL,
      service TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT,
      service TEXT NOT NULL,
      budget TEXT NOT NULL,
      timeline TEXT NOT NULL,
      requirements TEXT,
      status TEXT DEFAULT 'pending',
      progress INTEGER DEFAULT 0,
      admin_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contacts table
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Feedback table
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      message TEXT NOT NULL,
      is_approved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Users table for client authentication
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zipCode TEXT,
      country TEXT,
      company TEXT,
      website TEXT,
      profile_picture TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  console.log('✅ Database tables created successfully');
};

// Initialize admin user
const initAdmin = () => {
  db.get('SELECT * FROM admin WHERE email = ?', ['admin@nkrtech.com'], (err, row) => {
    if (err) {
      console.error('Error checking admin:', err);
      return;
    }
    
    if (!row) {
      const hashedPassword = bcrypt.hashSync('Admin@123', 10);
      db.run('INSERT INTO admin (email, password) VALUES (?, ?)', ['admin@nkrtech.com', hashedPassword], (err) => {
        if (err) {
          console.error('Error creating admin:', err);
        } else {
          console.log('✅ Default admin created: admin@nkrtech.com / Admin@123');
        }
      });
    } else {
      console.log('✅ Admin user already exists');
    }
  });
};

// Initialize sample feedback
const initSampleFeedback = () => {
  db.get('SELECT COUNT(*) as count FROM feedback', (err, row) => {
    if (err) {
      console.error('Error checking feedback:', err);
      return;
    }
    
    if (row.count === 0) {
      const sampleFeedback = [
        {
          name: 'Kiara Jewellery Pvt Ltd',
          email: 'info@kiarajewellery.com',
          company: 'Jewellery Manufacturing & Retail',
          rating: 5,
          message: 'NKR Tech Solutions delivered an outstanding ERP system for our company. Their AI-powered features have significantly improved our operational efficiency. Highly recommended!',
          is_approved: 1
        },
        {
          name: 'Chandra Jewellery',
          email: 'contact@chandrajewellery.com',
          company: 'Jewellery & Ornaments',
          rating: 5,
          message: 'Working with NKR Tech Solutions was a great experience. They understood our requirements perfectly and delivered a custom solution that exceeded our expectations. Professional and reliable!',
          is_approved: 1
        },
        {
          name: 'Amit Patel',
          email: 'amit.patel@manufacturing.com',
          company: 'Manufacturing Solutions Inc',
          rating: 4,
          message: 'The industrial automation software developed by NKR Tech Solutions has streamlined our manufacturing processes. Great team, excellent support, and timely delivery!',
          is_approved: 1
        }
      ];

      sampleFeedback.forEach(feedback => {
        db.run(
          'INSERT INTO feedback (name, email, company, rating, message, is_approved) VALUES (?, ?, ?, ?, ?, ?)',
          [feedback.name, feedback.email, feedback.company, feedback.rating, feedback.message, feedback.is_approved],
          (err) => {
            if (err) {
              console.error('Error inserting sample feedback:', err);
            }
          }
        );
      });
      console.log('✅ Sample feedback initialized');
    }
  });
};

// Add progress column to orders table if it doesn't exist
const migrateOrdersTable = () => {
  db.all("PRAGMA table_info(orders)", (err, columns) => {
    if (err) {
      console.error('Error checking orders table:', err);
      return;
    }
    
    const hasProgress = columns.some(col => col.name === 'progress');
    if (!hasProgress) {
      db.run('ALTER TABLE orders ADD COLUMN progress INTEGER DEFAULT 0', (err) => {
        if (err) {
          console.error('Error adding progress column:', err);
        } else {
          console.log('✅ Progress column added to orders table');
        }
      });
    }
  });
};

// Initialize database
db.serialize(() => {
  createTables();
  initAdmin();
  migrateOrdersTable();
  setTimeout(initSampleFeedback, 1000);
});

module.exports = db;
