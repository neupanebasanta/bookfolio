import express from 'express';
import axios from 'axios';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

//Get working directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Connect database
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

//Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Setup middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup static files
app.use(express.static(path.join(__dirname, 'public')));

//Home route
app.get('/', (req, res) => {
    res.render('index.ejs');
});

//About route
app.get('/about', (req, res) => {
    res.render('about.ejs');
});

//Add New route
app.get('/add-new', (req, res) => {
    res.render('add-new.ejs');
});

//Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});