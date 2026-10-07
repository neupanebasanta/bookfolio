import express from 'express';
import axios from 'axios';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;


// ====================== DATABASE ======================

// Connect to PostgreSQL
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();


// ====================== PATH SETUP ======================

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ====================== EJS SETUP ======================

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ====================== MIDDLEWARE ======================

// Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


// ====================== ROUTES ======================

// Redirect the root URL to the books page
app.get('/', (req, res) => {
    res.redirect('/books');
});

// Books page
app.get('/books', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM books');

        res.render('books.ejs', {
            currentPage: '/books',
            books: result.rows,
        });
    } catch (error) {
        res.status(500).send('Unable to fetch data from database. Please try again.');
    }
});

//Add a new book to database
app.post('/books', async (req, res) => {

    console.log(req.body);
    const {
        title,
        author,
        rating,
        status,
        start_date,
        completion_date,
        note,
    } = req.body;

    try {
        await db.query(`INSERT INTO books (title, author, rating, status, start_date, completion_date, note) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                title,
                author,
                rating || null,
                status,
                start_date || null,
                completion_date || null,
                note || null
            ]
        );
        res.redirect('/books');
    } catch (error) {
        console.error('Error adding book:', error)
        res.status(500).send('Failed to add book. Reload and try again');
    }
});

// Add new page
app.get('/books/new', (req, res) => {
    res.render('books/new.ejs', {
        currentPage: '/books/new',
    });
});

// About page
app.get('/about', (req, res) => {
    res.render('about.ejs', {
        currentPage: '/about',
    });
});


// ====================== SERVER ======================

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});