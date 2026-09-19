import express from 'express';
import axios from 'axios';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

//Get working directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000;

//Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Setup middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup static files
app.set(express.static(path.join(__dirname, 'public')));

//Home route
app.get('/', (req, res) => {
    res.render('index.ejs');
});

//Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});