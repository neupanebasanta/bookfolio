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
app.get('/books', (req, res) => {
    res.render('books.ejs',{
        currentPage: '/books',
    });
});

// Add new book page
app.get('/books/new', (req, res) => {
    res.render('books/new.ejs',{
        currentPage: '/books/new',
    });
});

// About page
app.get('/about', (req, res) => {
    res.render('about.ejs');
});


// ====================== SERVER ======================

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});