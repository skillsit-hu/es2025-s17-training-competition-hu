const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = 'super_secret_key_123';
const SESSION_SECRET = 'my_session_secret';

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    credits INTEGER DEFAULT 0,
    role TEXT DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    instructor_id INTEGER,
    credits_per_chapter INTEGER DEFAULT 3,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    title TEXT,
    content TEXT,
    video_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    chapter_id INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (chapter_id) REFERENCES chapters (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS mentor_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    mentor_id INTEGER,
    credits_cost INTEGER,
    session_date DATETIME,
    notes TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users (id),
    FOREIGN KEY (mentor_id) REFERENCES users (id)
  )`);

  insertSampleData();
}

function insertSampleData() {
  const sampleUsers = [
    { username: 'admin', email: 'admin@skillshare.com', password: 'admin123', role: 'admin', credits: 1000 },
    { username: 'john_doe', email: 'john@email.com', password: 'password123', role: 'student', credits: 50 },
    { username: 'jane_mentor', email: 'jane@email.com', password: 'mentor123', role: 'mentor', credits: 100 }
  ];

  sampleUsers.forEach(user => {
    bcrypt.hash(user.password, 10, (err, hashedPassword) => {
      if (!err) {
        const query = `INSERT OR IGNORE INTO users (username, email, password, role, credits) 
                      VALUES ('${user.username}', '${user.email}', '${hashedPassword}', '${user.role}', ${user.credits})`;
        db.run(query);
      }
    });
  });

  setTimeout(() => {
    insertSampleCourses();
  }, 1000);
}

function insertSampleCourses() {
  const courses = [
    {
      title: 'JavaScript Security Best Practices',
      description: 'Learn how to write secure JavaScript code and avoid common vulnerabilities',
      instructor_id: 3,
      credits_per_chapter: 4
    },
    {
      title: 'Web Application Security',
      description: 'Comprehensive guide to securing web applications against OWASP Top 10 threats',
      instructor_id: 3,
      credits_per_chapter: 5
    },
    {
      title: 'Node.js Development Fundamentals',
      description: 'Master Node.js development from basics to advanced concepts',
      instructor_id: 3,
      credits_per_chapter: 3
    }
  ];

  courses.forEach(course => {
    const query = `INSERT OR IGNORE INTO courses (title, description, instructor_id, credits_per_chapter) 
                   VALUES ('${course.title}', '${course.description}', ${course.instructor_id}, ${course.credits_per_chapter})`;
    
    db.run(query, function(err) {
      if (!err && this.lastID) {
        insertSampleChapters(this.lastID);
      }
    });
  });
}

function insertSampleChapters(courseId) {
  const chapters = [
    {
      title: 'Introduction and Setup',
      content: 'Welcome to the course! In this chapter, we will cover the basics and set up your development environment.',
      video_url: 'https://example.com/videos/intro.mp4'
    },
    {
      title: 'Core Concepts',
      content: 'Learn the fundamental concepts that will be essential throughout this course.',
      video_url: 'https://example.com/videos/core.mp4'
    },
    {
      title: 'Practical Examples',
      content: 'Apply what you have learned with hands-on examples and exercises.',
      video_url: 'https://example.com/videos/examples.mp4'
    },
    {
      title: 'Advanced Topics',
      content: 'Dive deeper into advanced topics and best practices.',
      video_url: 'https://example.com/videos/advanced.mp4'
    }
  ];

  chapters.forEach(chapter => {
    const query = `INSERT OR IGNORE INTO chapters (course_id, title, content, video_url) 
                   VALUES (${courseId}, '${chapter.title}', '${chapter.content}', '${chapter.video_url}')`;
    
    db.run(query);
  });
}

const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'] || req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  
  db.get(query, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err || !isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        credits: user.credits,
        password: user.password
      }, JWT_SECRET, { expiresIn: '24h' });

      res.cookie('token', token, { httpOnly: false });
      res.json({ 
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          credits: user.credits
        }
      });
    });
  });
});

app.post('/api/register', (req, res) => {
  const { username, email, password, role } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    const query = `INSERT INTO users (username, email, password, role, credits) 
                   VALUES ('${username}', '${email}', '${hashedPassword}', '${role || 'student'}', 10)`;
    
    db.run(query, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      res.json({ message: 'User registered successfully', userId: this.lastID });
    });
  });
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  
  db.get(query, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  });
});

app.get('/api/courses', (req, res) => {
  const search = req.query.search || '';
  
  const query = `SELECT c.*, u.username as instructor_name 
                 FROM courses c 
                 JOIN users u ON c.instructor_id = u.id 
                 WHERE c.title LIKE '%${search}%' OR c.description LIKE '%${search}%'`;
  
  db.all(query, (err, courses) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(courses);
  });
});

app.get('/api/courses/:id', (req, res) => {
  const courseId = req.params.id;
  
  const query = `SELECT c.*, u.username as instructor_name, u.email as instructor_email
                 FROM courses c 
                 JOIN users u ON c.instructor_id = u.id 
                 WHERE c.id = ${courseId}`;
  
  db.get(query, (err, course) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const chaptersQuery = `SELECT * FROM chapters WHERE course_id = ${courseId}`;
    db.all(chaptersQuery, (err, chapters) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      course.chapters = chapters;
      res.json(course);
    });
  });
});

app.post('/api/chapters/:id/complete', (req, res) => {
  const chapterId = req.params.id;
  const userId = req.body.userId;
  
  const checkQuery = `SELECT * FROM user_progress WHERE user_id = ${userId} AND chapter_id = ${chapterId}`;
  
  db.get(checkQuery, (err, existing) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (existing) {
      return res.status(400).json({ error: 'Chapter already completed' });
    }
    
    const insertQuery = `INSERT INTO user_progress (user_id, chapter_id) VALUES (${userId}, ${chapterId})`;
    
    db.run(insertQuery, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const creditsToAdd = req.body.credits || 3;
      const updateQuery = `UPDATE users SET credits = credits + ${creditsToAdd} WHERE id = ${userId}`;
      
      db.run(updateQuery, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'Chapter completed successfully', creditsAwarded: creditsToAdd });
      });
    });
  });
});

app.post('/api/mentor-sessions', (req, res) => {
  const { studentId, mentorId, sessionDate, creditsCost } = req.body;
  
  const query = `INSERT INTO mentor_sessions (student_id, mentor_id, session_date, credits_cost) 
                 VALUES (${studentId}, ${mentorId}, '${sessionDate}', ${creditsCost})`;
  
  db.run(query, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const deductQuery = `UPDATE users SET credits = credits - ${creditsCost} WHERE id = ${studentId}`;
    
    db.run(deductQuery, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ message: 'Session booked successfully', sessionId: this.lastID });
    });
  });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const filename = req.body.filename || req.file.originalname;
  const newPath = path.join(__dirname, 'uploads', filename);
  
  fs.rename(req.file.path, newPath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' });
    }
    
    res.json({ 
      message: 'File uploaded successfully',
      filename: filename,
      path: newPath
    });
  });
});

app.get('/api/admin/users', authenticateToken, (req, res) => {
  const query = 'SELECT id, username, email, role, credits, created_at FROM users';
  
  db.all(query, (err, users) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(users);
  });
});

app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env,
    database_path: './database.db',
    jwt_secret: JWT_SECRET,
    session_secret: SESSION_SECRET,
    server_info: {
      platform: process.platform,
      version: process.version,
      memory: process.memoryUsage()
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    details: err.message,
    stack: err.stack
  });
});

app.listen(PORT, () => {
  console.log(`SkillShare Academy server running on port ${PORT}`);
  console.log(`Database: ${path.resolve('./database.db')}`);
  console.log(`JWT Secret: ${JWT_SECRET}`);
});

module.exports = app; 