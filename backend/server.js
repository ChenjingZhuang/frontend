// Import required libraries
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Check for required environment variables
const requiredEnvVars = ['PG_USER', 'PG_HOST', 'PG_DATABASE', 'PG_PASSWORD', 'PG_PORT'];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} is not set`);
        process.exit(1);
    }
});

// Initialize Express
const app = express();
const port = process.env.PORT || 3001;  // Dynamic port for Azure

// Middleware
const allowedOrigins = ['http://localhost:3000', 'https://dogfacts-2025.azurewebsites.net']; // Update with your Azure frontend URL
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests, please try again later.'
}));

// PostgreSQL connection
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((err) => {
        console.error('Failed to connect to PostgreSQL:', err.stack);
        process.exit(1);
    });

// 🐶 Dog facts route
app.get('/dog-facts', async (req, res) => {
    try {
        const response = await axios.get('https://dog-api.kinduff.com/api/facts');
        res.json({ facts: response.data.facts });
    } catch (error) {
        console.error('Error fetching dog facts:', error);
        res.status(500).json({ error: 'Failed to fetch dog facts' });
    }
});

// 📝 Register route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Add basic password validation (for example, at least 6 characters)
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        // Check if the email already exists in the database
        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        // Check if user was successfully inserted
        if (result.rowCount === 0) {
            return res.status(500).json({ error: 'Error registering user' });
        }

        res.status(200).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// 🔐 Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

// 🌐 Serve frontend static files
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Catch-all route for SPA
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
    } else {
        next();
    }
});

// 🚀 Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1); // Exit with failure
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit with failure
});
