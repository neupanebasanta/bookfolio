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


// ====================== Api ======================

//Fetch book cover from open library api
async function getCoverUrl(title, author) {
    try {
        const response = await axios.get(
            'https://openlibrary.org/search.json',
            {
                params: {
                    title,
                    author,
                    fields: 'title,author_name,cover_i',
                    limit: 10,
                },
                timeout: 5000,
            }
        );

        const books = response.data.docs || [];

        const matchingBook = books.find(book =>
            book.cover_i != null &&
            book.title?.trim().toLowerCase() === title.toLowerCase() &&
            book.author_name?.some(name => name.trim().toLowerCase() === author.toLowerCase())
        );

        const bookWithCover =
            matchingBook || books.find(book => book.cover_i != null);

        if (!bookWithCover) {
            return null;
        }

        return `https://covers.openlibrary.org/b/id/${bookWithCover.cover_i}-L.jpg`;

    } catch (error) {
        console.error('Open library cover lookup failed:', error.message);
        return null;
    }
}


// ====================== ROUTES ======================

// Redirect the root URL to books page
app.get('/', (req, res) => {
    res.redirect('/books');
});

// Books page
app.get('/books', async (req, res) => {

    // Search
    const searchQuery = req.query.search_query?.trim() || '';



    // Sort
    const sortQuery = req.query.sort_query || 'recent';

    const sortOptions = {
        recent: 'created_at DESC',
        rating: 'rating DESC NULLS LAST',
        'a-z': 'title ASC',
    }

    const sortBy = sortOptions[sortQuery];

    try {

        const result = await db.query(`SELECT * 
                                       FROM books
                                       WHERE title ILIKE $1
                                       ORDER BY ${sortBy}`,
            [`%${searchQuery}%`]
        );

        res.render('index.ejs', {
            currentPage: '/books',
            books: result.rows,
            sortQuery: sortQuery,
            searchQuery: searchQuery
        });
    } catch (error) {
        console.error('Error finding books', error);
        res.status(500).send('Unable to fetch data from database. Please try again.');
    }
});

// Add new page
app.get('/books/new', (req, res) => {
    res.render('books/new.ejs', {
        currentPage: '/books/new',
    });
});

//Add book details to database
app.post('/books', async (req, res) => {

    const title = req.body.title.trim();
    const author = req.body.author.trim();
    const rating = req.body.rating || null;
    const status = req.body.status;
    const start_date = req.body.start_date || null;
    const completion_date = req.body.completion_date || null;
    const note = req.body.note?.trim() || null;
    const cover_url = await getCoverUrl(title, author);

    try {
        await db.query(`INSERT INTO books (title, author, rating, status, start_date, completion_date, note, cover_url)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                title,
                author,
                rating,
                status,
                start_date,
                completion_date,
                note,
                cover_url
            ]
        );
        res.redirect('/books');
    } catch (error) {
        console.error('Error adding book:', error)
        res.status(500).send('Failed to add book. Reload and try again');
    }
});

// About page
app.get('/about', (req, res) => {
    res.render('about.ejs', {
        currentPage: '/about',
    });
});

//Book details page
app.get('/books/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await db.query(`SELECT * FROM books WHERE id = $1`, [id]);
        res.render('books/show.ejs', {
            book: result.rows[0],
            currentPage: '/books/id',
        });
    } catch (error) {
        console.error('Error finding book by id:', error);
        res.status(500).send('Failed to fetch book. Reload and try again please');
    }
});

//Edit page
app.get('/books/:id/edit', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query(`SELECT * FROM books WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Book not found.');
        }
        res.render('books/edit.ejs', {
            book: result.rows[0],
            currentPage: '/books/id/edit',
        });
    } catch (error) {
        console.error('Error finding book by id:', error);
        res.status(500).send('Unable to load the edit page.');
    }
});

//Edit book details to database
app.post('/books/:id', async (req, res) => {
    const id = req.params.id;
    const title = req.body.title.trim();
    const author = req.body.author.trim();
    const rating = req.body.rating || null;
    const status = req.body.status;
    const start_date = req.body.start_date || null;
    const completion_date = req.body.completion_date || null;
    const note = req.body.note?.trim() || null;
    const cover_url = await getCoverUrl(title, author);

    try {
        await db.query(`UPDATE books 
                        SET title = $1, author = $2, rating = $3, status = $4, start_date = $5, completion_date = $6, note = $7, cover_url = $8 
                        WHERE id = $9`,
            [
                title,
                author,
                rating,
                status,
                start_date,
                completion_date,
                note,
                cover_url,
                id
            ]);
        res.redirect('/books');

    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send('Unable to update book.');
    }
});

//Delete book from database
app.post('/books/:id/delete', async (req, res) => {
    const id = req.params.id;
    try {
        await db.query('DELETE FROM books WHERE id = $1', [id]);
        res.redirect('/books');
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('Unable to delete bokk.');
    }
});


// ====================== SERVER ======================

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});